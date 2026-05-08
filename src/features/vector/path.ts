import type {
  BezierNode,
  ElementStyle,
  Point,
  VectorDocument,
  VectorElement,
  VectorEllipse,
  VectorPath,
  VectorRect,
} from "./model";
import { createId } from "../../shared/id";
import { defaultStyle, touchDocument } from "./model";

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function formatNumber(value: number) {
  return Number(value.toFixed(2)).toString();
}

export function pathToD(path: VectorPath) {
  const [first, ...rest] = path.nodes;
  if (!first) {
    return "";
  }

  const segments = [`M ${formatPoint(first.point)}`];
  let previous = first;

  for (const node of rest) {
    segments.push(
      `C ${formatPoint(previous.out ?? previous.point)} ${formatPoint(node.in ?? node.point)} ${formatPoint(node.point)}`,
    );
    previous = node;
  }

  if (path.closed && path.nodes.length > 2) {
    segments.push(
      `C ${formatPoint(previous.out ?? previous.point)} ${formatPoint(first.in ?? first.point)} ${formatPoint(first.point)} Z`,
    );
  }

  return segments.join(" ");
}

export function formatPoint(point: Point) {
  return `${formatNumber(point.x)} ${formatNumber(point.y)}`;
}

export function createRectFromPoints(
  start: Point,
  end: Point,
  style = defaultStyle,
): VectorRect {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  return {
    id: createId("rect"),
    type: "rect",
    name: "Rectangle",
    x,
    y,
    width,
    height,
    radius: Math.min(16, width / 5, height / 5),
    style: { ...style },
  };
}

export function createEllipseFromPoints(
  start: Point,
  end: Point,
  style = defaultStyle,
): VectorEllipse {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  return {
    id: createId("ellipse"),
    type: "ellipse",
    name: "Ellipse",
    cx: x + width / 2,
    cy: y + height / 2,
    rx: width / 2,
    ry: height / 2,
    style: { ...style },
  };
}

export function createPath(
  nodes: BezierNode[],
  closed: boolean,
  style = defaultStyle,
): VectorPath {
  return {
    id: createId("path"),
    type: "path",
    name: "Path",
    nodes,
    closed,
    style: { ...style, fill: closed ? style.fill : "none" },
  };
}

export function addElement(document: VectorDocument, element: VectorElement) {
  return touchDocument({
    ...document,
    elements: [...document.elements, element],
  });
}

export function updateElement(
  document: VectorDocument,
  elementId: string,
  updater: (element: VectorElement) => VectorElement,
) {
  return touchDocument({
    ...document,
    elements: document.elements.map((element) =>
      element.id === elementId ? updater(element) : element,
    ),
  });
}

export function deleteElement(document: VectorDocument, elementId: string) {
  return touchDocument({
    ...document,
    elements: document.elements.filter((element) => element.id !== elementId),
  });
}

export function duplicateElement(document: VectorDocument, elementId: string) {
  const element = document.elements.find(
    (candidate) => candidate.id === elementId,
  );
  if (!element) {
    return document;
  }
  const copy = translateElement(
    { ...element, id: createId(element.type), name: `${element.name} copy` },
    { x: 28, y: 28 },
  );
  return addElement(document, copy);
}

export function translateElement(
  element: VectorElement,
  delta: Point,
): VectorElement {
  if (element.type === "rect") {
    return { ...element, x: element.x + delta.x, y: element.y + delta.y };
  }
  if (element.type === "ellipse") {
    return { ...element, cx: element.cx + delta.x, cy: element.cy + delta.y };
  }
  return {
    ...element,
    nodes: element.nodes.map((node) => ({
      point: addPoints(node.point, delta),
      in: node.in ? addPoints(node.in, delta) : undefined,
      out: node.out ? addPoints(node.out, delta) : undefined,
    })),
  };
}

export function updateStyle(
  element: VectorElement,
  style: Partial<ElementStyle>,
): VectorElement {
  return {
    ...element,
    style: {
      ...element.style,
      ...style,
    },
  };
}

export function updatePathNode(
  path: VectorPath,
  nodeIndex: number,
  part: "point" | "in" | "out",
  point: Point,
): VectorPath {
  return {
    ...path,
    nodes: path.nodes.map((node, index) => {
      if (index !== nodeIndex) {
        return node;
      }
      if (part === "point") {
        const delta = subtractPoints(point, node.point);
        return {
          point,
          in: node.in ? addPoints(node.in, delta) : undefined,
          out: node.out ? addPoints(node.out, delta) : undefined,
        };
      }
      return { ...node, [part]: point };
    }),
  };
}

export function elementBounds(element: VectorElement): Bounds {
  if (element.type === "rect") {
    return {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    };
  }
  if (element.type === "ellipse") {
    return {
      x: element.cx - element.rx,
      y: element.cy - element.ry,
      width: element.rx * 2,
      height: element.ry * 2,
    };
  }

  const points = element.nodes.flatMap((node) => [
    node.point,
    ...(node.in ? [node.in] : []),
    ...(node.out ? [node.out] : []),
  ]);
  return pointsToBounds(points);
}

export function pointsToBounds(points: Point[]): Bounds {
  if (points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function elementContainsPoint(element: VectorElement, point: Point) {
  const bounds = elementBounds(element);
  const padding = Math.max(8, element.style.strokeWidth + 4);
  return (
    point.x >= bounds.x - padding &&
    point.x <= bounds.x + bounds.width + padding &&
    point.y >= bounds.y - padding &&
    point.y <= bounds.y + bounds.height + padding
  );
}

export function addPoints(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtractPoints(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
