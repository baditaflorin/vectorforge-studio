import { z } from "zod";
import { createId } from "../../shared/id";

export type Point = {
  x: number;
  y: number;
};

export type ElementStyle = {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
};

export type BezierNode = {
  point: Point;
  in?: Point;
  out?: Point;
};

export type VectorPath = {
  id: string;
  type: "path";
  name: string;
  nodes: BezierNode[];
  closed: boolean;
  style: ElementStyle;
};

export type VectorRect = {
  id: string;
  type: "rect";
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  style: ElementStyle;
};

export type VectorEllipse = {
  id: string;
  type: "ellipse";
  name: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  style: ElementStyle;
};

export type VectorElement = VectorPath | VectorRect | VectorEllipse;

export type VectorDocument = {
  schemaVersion: 1;
  id: string;
  title: string;
  width: number;
  height: number;
  background: string;
  elements: VectorElement[];
  createdAt: string;
  updatedAt: string;
};

export const defaultStyle: ElementStyle = {
  fill: "#fef3c7",
  stroke: "#1d4ed8",
  strokeWidth: 3,
  opacity: 1,
};

export const pointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const styleSchema = z.object({
  fill: z.string(),
  stroke: z.string(),
  strokeWidth: z.number().min(0).max(64),
  opacity: z.number().min(0).max(1),
});

const pathSchema = z.object({
  id: z.string(),
  type: z.literal("path"),
  name: z.string(),
  nodes: z.array(
    z.object({
      point: pointSchema,
      in: pointSchema.optional(),
      out: pointSchema.optional(),
    }),
  ),
  closed: z.boolean(),
  style: styleSchema,
});

const rectSchema = z.object({
  id: z.string(),
  type: z.literal("rect"),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  radius: z.number().min(0),
  style: styleSchema,
});

const ellipseSchema = z.object({
  id: z.string(),
  type: z.literal("ellipse"),
  name: z.string(),
  cx: z.number(),
  cy: z.number(),
  rx: z.number(),
  ry: z.number(),
  style: styleSchema,
});

export const vectorDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string(),
  title: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  background: z.string(),
  elements: z.array(
    z.discriminatedUnion("type", [pathSchema, rectSchema, ellipseSchema]),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export function nowIso() {
  return new Date().toISOString();
}

export function createDefaultDocument(): VectorDocument {
  const createdAt = nowIso();
  return {
    schemaVersion: 1,
    id: createId("doc"),
    title: "Untitled vector",
    width: 1280,
    height: 820,
    background: "#ffffff",
    createdAt,
    updatedAt: createdAt,
    elements: [
      {
        id: createId("path"),
        type: "path",
        name: "Bezier ribbon",
        closed: false,
        style: {
          fill: "none",
          stroke: "#2563eb",
          strokeWidth: 8,
          opacity: 1,
        },
        nodes: [
          { point: { x: 250, y: 460 }, out: { x: 360, y: 250 } },
          {
            point: { x: 560, y: 360 },
            in: { x: 420, y: 520 },
            out: { x: 680, y: 210 },
          },
          {
            point: { x: 940, y: 430 },
            in: { x: 800, y: 520 },
          },
        ],
      },
      {
        id: createId("ellipse"),
        type: "ellipse",
        name: "Color study",
        cx: 775,
        cy: 545,
        rx: 150,
        ry: 92,
        style: {
          fill: "#dcfce7",
          stroke: "#16a34a",
          strokeWidth: 4,
          opacity: 0.95,
        },
      },
      {
        id: createId("rect"),
        type: "rect",
        name: "Artboard note",
        x: 300,
        y: 190,
        width: 250,
        height: 130,
        radius: 18,
        style: {
          fill: "#fee2e2",
          stroke: "#ef4444",
          strokeWidth: 3,
          opacity: 0.9,
        },
      },
    ],
  };
}

export function touchDocument(document: VectorDocument): VectorDocument {
  return { ...document, updatedAt: nowIso() };
}

export function getElementLabel(element: VectorElement) {
  if (element.type === "path") {
    return `${element.nodes.length} nodes`;
  }
  if (element.type === "rect") {
    return `${Math.round(element.width)} x ${Math.round(element.height)}`;
  }
  return `${Math.round(element.rx * 2)} x ${Math.round(element.ry * 2)}`;
}
