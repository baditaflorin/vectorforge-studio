import { describe, expect, it } from "vitest";
import { defaultEditorSettings } from "../settings/settings";
import { createDefaultDocument } from "../vector/model";
import { parseProjectFile, serializeProjectFile } from "./projectFile";

describe("VectorForge project files", () => {
  it("round-trips document, palette, and settings", () => {
    const document = createDefaultDocument();
    const serialized = serializeProjectFile({
      document,
      palette: ["#111111", "#ffffff"],
      settings: { ...defaultEditorSettings, zoom: 1.1, showHelp: false },
    });

    const parsed = parseProjectFile(serialized);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.document.id).toBe(document.id);
      expect(parsed.value.palette).toEqual(["#111111", "#ffffff"]);
      expect(parsed.value.settings.zoom).toBe(1.1);
      expect(parsed.value.settings.showHelp).toBe(false);
    }
  });

  it("rejects unrelated JSON", () => {
    const parsed = parseProjectFile('{"hello":"world"}');

    expect(parsed.ok).toBe(false);
  });
});
