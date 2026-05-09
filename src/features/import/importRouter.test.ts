import { describe, expect, it } from "vitest";
import { defaultEditorSettings } from "../settings/settings";
import { createDefaultDocument } from "../vector/model";
import { exportDocumentToSvg } from "../vector/svg";
import { serializeProjectFile } from "../project/projectFile";
import { importText } from "./importRouter";

describe("import router", () => {
  it("imports SVG text", () => {
    const imported = importText(
      exportDocumentToSvg(createDefaultDocument()),
      "fixture.svg",
      "svg",
    );

    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.value.documents).toHaveLength(1);
      expect(imported.value.documents[0].elements.length).toBeGreaterThan(0);
    }
  });

  it("imports project files", () => {
    const document = createDefaultDocument();
    const text = serializeProjectFile({
      document,
      palette: ["#123456"],
      settings: defaultEditorSettings,
    });

    const imported = importText(text, "fixture.vectorforge.json", "json");

    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.value.project?.document.id).toBe(document.id);
      expect(imported.value.project?.palette).toEqual(["#123456"]);
    }
  });

  it("reports unsupported input", () => {
    const imported = importText("plain words", "note.txt", "txt");

    expect(imported.ok).toBe(false);
  });
});
