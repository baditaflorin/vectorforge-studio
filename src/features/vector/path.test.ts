import { describe, expect, it } from "vitest";
import { createDefaultDocument } from "./model";
import {
  addElement,
  createPath,
  createRectFromPoints,
  pathToD,
  updatePathNode,
} from "./path";

describe("vector path helpers", () => {
  it("serializes cubic Bezier nodes to SVG path data", () => {
    const path = createPath(
      [
        { point: { x: 0, y: 0 }, out: { x: 25, y: 0 } },
        { point: { x: 100, y: 100 }, in: { x: 75, y: 100 } },
      ],
      false,
    );

    expect(pathToD(path)).toBe("M 0 0 C 25 0 75 100 100 100");
  });

  it("moves handles with an anchor point", () => {
    const path = createPath(
      [
        {
          point: { x: 10, y: 10 },
          in: { x: 0, y: 10 },
          out: { x: 20, y: 10 },
        },
      ],
      false,
    );

    const moved = updatePathNode(path, 0, "point", { x: 15, y: 20 });

    expect(moved.nodes[0]).toEqual({
      point: { x: 15, y: 20 },
      in: { x: 5, y: 20 },
      out: { x: 25, y: 20 },
    });
  });

  it("adds new elements immutably", () => {
    const document = createDefaultDocument();
    const rectangle = createRectFromPoints({ x: 10, y: 10 }, { x: 50, y: 40 });
    const next = addElement(document, rectangle);

    expect(next.elements).toHaveLength(document.elements.length + 1);
    expect(document.elements).not.toContain(rectangle);
  });
});
