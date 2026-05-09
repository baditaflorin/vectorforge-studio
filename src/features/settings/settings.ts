import { z } from "zod";

const settingsKey = "vectorforge-studio:settings";

export const editorSettingsSchema = z.object({
  zoom: z.number().min(0.35).max(1.5),
  autosave: z.boolean(),
  restoreLastSession: z.boolean(),
  showHelp: z.boolean(),
});

export type EditorSettings = z.infer<typeof editorSettingsSchema>;

export const defaultEditorSettings: EditorSettings = {
  zoom: 0.78,
  autosave: true,
  restoreLastSession: true,
  showHelp: true,
};

export function loadSettings(
  storage: Storage = window.localStorage,
): EditorSettings {
  try {
    const stored = storage.getItem(settingsKey);
    if (!stored) {
      return defaultEditorSettings;
    }
    return editorSettingsSchema.parse({
      ...defaultEditorSettings,
      ...JSON.parse(stored),
    });
  } catch {
    return defaultEditorSettings;
  }
}

export function saveSettings(
  settings: EditorSettings,
  storage: Storage = window.localStorage,
) {
  storage.setItem(
    settingsKey,
    JSON.stringify(editorSettingsSchema.parse(settings)),
  );
}

export function resetSettings(storage: Storage = window.localStorage) {
  storage.removeItem(settingsKey);
  return defaultEditorSettings;
}
