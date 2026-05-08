import type {
  BezierNode,
  ElementStyle,
  Point,
  VectorDocument,
  VectorElement,
  VectorPath,
} from "./model";
import { createId } from "../../shared/id";
import {
  createDefaultDocument,
  defaultStyle,
  nowIso,
  vectorDocumentSchema,
} from "./model";
import { createPath, pathToD } from "./path";

const commandPattern = /[a-zA-Z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi;

export function exportDocumentToSvg(document: VectorDocument) {
  const elements = document.elements.map(elementToSvg).join("\n  ");
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${document.width}" height="${document.height}" viewBox="0 0 ${document.width} ${document.height}" role="img">`,
    `  <title>${escapeXml(document.title)}</title>`,
    `  <rect width="100%" height="100%" fill="${escapeXml(document.background)}" />`,
    `  ${elements}`,
    "</svg>",
  ].join("\n");
}

export function elementToSvg(element: VectorElement) {
  const style = styleAttributes(element.style);
  if (element.type === "rect") {
    return `<rect id="${element.id}" x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="${element.radius}" ${style} />`;
  }
  if (element.type === "ellipse") {
    return `<ellipse id="${element.id}" cx="${element.cx}" cy="${element.cy}" rx="${element.rx}" ry="${element.ry}" ${style} />`;
  }
  return `<path id="${element.id}" d="${pathToD(element)}" ${style} />`;
}

export function styleAttributes(style: ElementStyle) {
  return `fill="${escapeXml(style.fill)}" stroke="${escapeXml(style.stroke)}" stroke-width="${style.strokeWidth}" opacity="${style.opacity}"`;
}

export function parseSvgDocument(svgText: string): VectorDocument {
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const parseError = parsed.querySelector("parsererror");
  if (parseError) {
    throw new Error("The selected file is not valid SVG.");
  }

  const svg = parsed.querySelector("svg");
  if (!svg) {
    throw new Error("The selected SVG does not contain an <svg> root.");
  }

  const width =
    parseDimension(svg.getAttribute("width")) ??
    parseViewBox(svg)?.width ??
    1280;
  const height =
    parseDimension(svg.getAttribute("height")) ??
    parseViewBox(svg)?.height ??
    820;
  const createdAt = nowIso();
  const elements: VectorElement[] = [];

  Array.from(svg.querySelectorAll("*"))
    .filter((node) =>
      ["path", "rect", "ellipse", "circle"].includes(
        node.tagName.toLowerCase(),
      ),
    )
    .forEach((node, index) => {
      const element = parseSvgElement(node, index);
      if (element) {
        elements.push(element);
      }
    });

  const document = {
    schemaVersion: 1 as const,
    id: createId("doc"),
    title: svg.querySelector("title")?.textContent?.trim() || "Imported SVG",
    width,
    height,
    background: "#ffffff",
    createdAt,
    updatedAt: createdAt,
    elements,
  };

  return vectorDocumentSchema.parse(document);
}

function parseSvgElement(node: Element, index: number): VectorElement | null {
  const style = readStyle(node);
  const name = node.getAttribute("id") || `Imported ${index + 1}`;

  if (node.tagName.toLowerCase() === "path") {
    const d = node.getAttribute("d");
    if (!d) {
      return null;
    }
    return { ...parsePathData(d, style), name };
  }

  if (node.tagName.toLowerCase() === "rect") {
    const x = numberAttr(node, "x");
    const y = numberAttr(node, "y");
    return {
      id: createId("rect"),
      type: "rect",
      name,
      x,
      y,
      width: numberAttr(node, "width", 120),
      height: numberAttr(node, "height", 80),
      radius: numberAttr(node, "rx"),
      style,
    };
  }

  const cx = numberAttr(node, "cx", 160);
  const cy = numberAttr(node, "cy", 120);
  const radius = numberAttr(node, "r", 60);
  return {
    id: createId("ellipse"),
    type: "ellipse",
    name,
    cx,
    cy,
    rx: numberAttr(node, "rx", radius),
    ry: numberAttr(node, "ry", radius),
    style,
  };
}

export function parsePathData(d: string, style = defaultStyle): VectorPath {
  const tokens = d.match(commandPattern) ?? [];
  const nodes: BezierNode[] = [];
  let index = 0;
  let command = "";
  let current: Point = { x: 0, y: 0 };
  let closed = false;

  while (index < tokens.length) {
    if (isCommand(tokens[index])) {
      command = tokens[index++];
    }
    const relative = command === command.toLowerCase();
    const op = command.toUpperCase();

    if (op === "M") {
      current = readPoint(tokens, index, current, relative);
      index += 2;
      nodes.push({ point: current });
      command = relative ? "l" : "L";
    } else if (op === "L") {
      const next = readPoint(tokens, index, current, relative);
      index += 2;
      nodes.push({ point: next });
      current = next;
    } else if (op === "H") {
      const x = readNumber(tokens[index++]);
      current = { x: relative ? current.x + x : x, y: current.y };
      nodes.push({ point: current });
    } else if (op === "V") {
      const y = readNumber(tokens[index++]);
      current = { x: current.x, y: relative ? current.y + y : y };
      nodes.push({ point: current });
    } else if (op === "C") {
      const c1 = readPoint(tokens, index, current, relative);
      const c2 = readPoint(tokens, index + 2, current, relative);
      const next = readPoint(tokens, index + 4, current, relative);
      index += 6;
      const previous = nodes.at(-1);
      if (previous) {
        previous.out = c1;
      }
      nodes.push({ point: next, in: c2 });
      current = next;
    } else if (op === "Q") {
      const control = readPoint(tokens, index, current, relative);
      const next = readPoint(tokens, index + 2, current, relative);
      index += 4;
      const previous = nodes.at(-1);
      if (previous) {
        previous.out = {
          x: current.x + (2 / 3) * (control.x - current.x),
          y: current.y + (2 / 3) * (control.y - current.y),
        };
      }
      nodes.push({
        point: next,
        in: {
          x: next.x + (2 / 3) * (control.x - next.x),
          y: next.y + (2 / 3) * (control.y - next.y),
        },
      });
      current = next;
    } else if (op === "Z") {
      closed = true;
    } else {
      index += 1;
    }
  }

  return createPath(
    nodes.length ? nodes : [{ point: { x: 120, y: 120 } }],
    closed,
    style,
  );
}

function readStyle(node: Element): ElementStyle {
  return {
    fill: node.getAttribute("fill") || defaultStyle.fill,
    stroke: node.getAttribute("stroke") || defaultStyle.stroke,
    strokeWidth: numberAttr(node, "stroke-width", defaultStyle.strokeWidth),
    opacity: numberAttr(node, "opacity", defaultStyle.opacity),
  };
}

function parseDimension(value: string | null) {
  if (!value) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseViewBox(svg: SVGSVGElement | Element) {
  const value = svg.getAttribute("viewBox");
  if (!value) {
    return null;
  }
  const [, , width, height] = value.split(/\s+/).map(Number);
  return Number.isFinite(width) && Number.isFinite(height)
    ? { width, height }
    : null;
}

function numberAttr(node: Element, name: string, fallback = 0) {
  const parsed = Number.parseFloat(node.getAttribute(name) || "");
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readPoint(
  tokens: string[],
  index: number,
  current: Point,
  relative: boolean,
): Point {
  const x = readNumber(tokens[index]);
  const y = readNumber(tokens[index + 1]);
  return relative ? { x: current.x + x, y: current.y + y } : { x, y };
}

function readNumber(value: string | undefined) {
  const parsed = Number.parseFloat(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

function isCommand(token: string | undefined) {
  return Boolean(token && /^[a-zA-Z]$/.test(token));
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function demoSvgText() {
  return exportDocumentToSvg(createDefaultDocument());
}
