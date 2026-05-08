import type { Point, VectorDocument, VectorElement } from "../vector/model";

export type Tool = "select" | "node" | "pen" | "rect" | "ellipse";

export type Notice = {
  tone: "info" | "error" | "success";
  message: string;
};

export type SelectedNode = {
  elementId: string;
  nodeIndex: number;
  part: "point" | "in" | "out";
};

export type ShapeDraft = {
  type: "rect" | "ellipse";
  start: Point;
  current: Point;
};

export type EditorSnapshot = {
  document: VectorDocument;
  selectedElementId: string | null;
};

export type DragState =
  | {
      kind: "element";
      elementId: string;
      start: Point;
      snapshot: VectorDocument;
    }
  | {
      kind: "node";
      selectedNode: SelectedNode;
      snapshot: VectorDocument;
    }
  | {
      kind: "shape";
      draft: ShapeDraft;
    };

export type ElementChange = (element: VectorElement) => VectorElement;
