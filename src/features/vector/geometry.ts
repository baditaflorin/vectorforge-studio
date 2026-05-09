import type { Point, VectorDocument, VectorElement, VectorPath } from "./model";
import { elementBounds, type Bounds } from "./path";

export type DocumentGeometry = {
  elementCount: number;
  pathCount: number;
  nodeCount: number;
  totalLength: number;
  bounds: Bounds | null;
};

export function analyzeDocumentGeometry(
  document: VectorDocument,
): DocumentGeometry {
  const bounds = document.elements.map(elementBounds);
  return {
    elementCount: document.elements.length,
    pathCount: document.elements.filter((element) => element.type === "path")
      .length,
    nodeCount: document.elements.reduce(
      (total, element) => total + countNodes(element),
      0,
    ),
    totalLength: document.elements.reduce(
      (total, element) => total + estimateElementLength(element),
      0,
    ),
    bounds: mergeBounds(bounds),
  };
}

export function estimateElementLength(element: VectorElement) {
  if (element.type === "rect") {
    return Math.max(
      0,
      2 * Math.abs(element.width) + 2 * Math.abs(element.height),
    );
  }
  if (element.type === "ellipse") {
    const a = Math.abs(element.rx);
    const b = Math.abs(element.ry);
    return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  }
  return estimatePathLength(element);
}

export function estimatePathLength(path: VectorPath) {
  if (path.nodes.length < 2) {
    return 0;
  }

  let length = 0;
  for (let index = 0; index < path.nodes.length - 1; index += 1) {
    length += estimateSegmentLength(path, index, index + 1);
  }
  if (path.closed) {
    length += estimateSegmentLength(path, path.nodes.length - 1, 0);
  }
  return length;
}

export function cubicPointAt(
  a: Point,
  b: Point,
  c: Point,
  d: Point,
  t: number,
): Point {
  const oneMinus = 1 - t;
  const x =
    oneMinus ** 3 * a.x +
    3 * oneMinus ** 2 * t * b.x +
    3 * oneMinus * t ** 2 * c.x +
    t ** 3 * d.x;
  const y =
    oneMinus ** 3 * a.y +
    3 * oneMinus ** 2 * t * b.y +
    3 * oneMinus * t ** 2 * c.y +
    t ** 3 * d.y;
  return { x, y };
}

function estimateSegmentLength(
  path: VectorPath,
  fromIndex: number,
  toIndex: number,
) {
  const from = path.nodes[fromIndex];
  const to = path.nodes[toIndex];
  if (!from || !to) {
    return 0;
  }

  let length = 0;
  let previous = from.point;
  for (let step = 1; step <= 18; step += 1) {
    const point = cubicPointAt(
      from.point,
      from.out ?? from.point,
      to.in ?? to.point,
      to.point,
      step / 18,
    );
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
}

function countNodes(element: VectorElement) {
  return element.type === "path" ? element.nodes.length : 4;
}

function mergeBounds(bounds: Bounds[]) {
  if (!bounds.length) {
    return null;
  }
  const minX = Math.min(...bounds.map((bound) => bound.x));
  const minY = Math.min(...bounds.map((bound) => bound.y));
  const maxX = Math.max(...bounds.map((bound) => bound.x + bound.width));
  const maxY = Math.max(...bounds.map((bound) => bound.y + bound.height));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
