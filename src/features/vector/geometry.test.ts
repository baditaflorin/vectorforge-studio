import { describe, expect, it } from "vitest";
import { analyzeDocumentGeometry } from "./geometry";
import { createDefaultDocument } from "./model";

describe("document geometry", () => {
  it("summarizes complexity and approximate length", () => {
    const stats = analyzeDocumentGeometry(createDefaultDocument());

    expect(stats.elementCount).toBe(3);
    expect(stats.pathCount).toBe(1);
    expect(stats.nodeCount).toBeGreaterThan(3);
    expect(stats.totalLength).toBeGreaterThan(1000);
    expect(stats.bounds?.width).toBeGreaterThan(600);
  });
});
