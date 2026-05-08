import { describe, expect, it } from "vitest";
import { createDefaultDocument } from "./model";
import { exportDocumentToSvg, parsePathData, parseSvgDocument } from "./svg";

describe("SVG import and export", () => {
  it("exports a document as SVG text", () => {
    const svg = exportDocumentToSvg(createDefaultDocument());

    expect(svg).toContain("<svg");
    expect(svg).toContain("<path");
    expect(svg).toContain('viewBox="0 0 1280 820"');
  });

  it("imports rect, ellipse, and path elements", () => {
    const imported = parseSvgDocument(`
      <svg width="320" height="240" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="40" height="50" fill="#ff0000" />
        <ellipse cx="100" cy="90" rx="30" ry="20" />
        <path d="M 0 0 C 10 0 10 20 20 20" />
      </svg>
    `);

    expect(imported.width).toBe(320);
    expect(imported.height).toBe(240);
    expect(imported.elements.map((element) => element.type)).toEqual([
      "rect",
      "ellipse",
      "path",
    ]);
  });

  it("parses quadratic path commands into cubic handles", () => {
    const path = parsePathData("M 0 0 Q 50 100 100 0");

    expect(path.nodes).toHaveLength(2);
    expect(path.nodes[0].out?.x).toBeCloseTo(33.33, 1);
    expect(path.nodes[1].in?.y).toBeCloseTo(66.66, 1);
  });
});
