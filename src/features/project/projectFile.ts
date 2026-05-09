import { z } from "zod";
import { buildInfo } from "../../config/build";
import { err, messageFromError, ok, type Result } from "../../shared/result";
import {
  defaultEditorSettings,
  editorSettingsSchema,
  type EditorSettings,
} from "../settings/settings";
import type { VectorDocument } from "../vector/model";
import { vectorDocumentSchema } from "../vector/model";

export const projectFileSchema = z.object({
  format: z.literal("vectorforge-studio-project"),
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  appVersion: z.string(),
  document: vectorDocumentSchema,
  palette: z.array(z.string()).max(64),
  settings: editorSettingsSchema,
});

export type VectorForgeProjectFile = z.infer<typeof projectFileSchema>;

export type ProjectState = {
  document: VectorDocument;
  palette: string[];
  settings: EditorSettings;
};

export function createProjectFile(state: ProjectState): VectorForgeProjectFile {
  return projectFileSchema.parse({
    format: "vectorforge-studio-project",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    appVersion: buildInfo.version,
    document: state.document,
    palette: state.palette,
    settings: state.settings,
  });
}

export function serializeProjectFile(state: ProjectState) {
  return `${JSON.stringify(createProjectFile(state), null, 2)}\n`;
}

export function parseProjectFile(text: string): Result<ProjectState> {
  try {
    const parsed: unknown = JSON.parse(text);
    const project = projectFileSchema.parse(parsed);
    return ok({
      document: project.document,
      palette: project.palette,
      settings: {
        ...defaultEditorSettings,
        ...project.settings,
      },
    });
  } catch (error) {
    return err(
      messageFromError(
        error,
        "The project file is not valid VectorForge JSON.",
      ),
    );
  }
}

export function isLikelyProjectFile(text: string) {
  return (
    text.includes('"vectorforge-studio-project"') ||
    text.includes("'vectorforge-studio-project'")
  );
}
