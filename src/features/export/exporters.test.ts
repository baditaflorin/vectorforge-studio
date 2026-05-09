import { describe, expect, it } from "vitest";
import { createDefaultDocument } from "../vector/model";
import {
  createProjectShareUrl,
  fileSlug,
  parseProjectShareHash,
} from "./exporters";
import { defaultEditorSettings } from "../settings/settings";

describe("export helpers", () => {
  it("creates stable filenames", () => {
    expect(fileSlug("My Fancy Icon!")).toBe("my-fancy-icon");
    expect(fileSlug("!!!")).toBe("vectorforge");
  });

  it("encodes project state into share hash", () => {
    window.history.replaceState(null, "", "/vectorforge-studio/");
    const shared = createProjectShareUrl({
      document: createDefaultDocument(),
      palette: ["#123456"],
      settings: defaultEditorSettings,
    });

    expect(shared.ok).toBe(true);
    if (shared.ok) {
      const decoded = parseProjectShareHash(new URL(shared.value).hash);
      expect(decoded.ok).toBe(true);
      if (decoded.ok) {
        expect(decoded.value).toContain("vectorforge-studio-project");
      }
    }
  });
});
