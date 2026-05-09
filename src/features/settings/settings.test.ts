import { describe, expect, it } from "vitest";
import {
  defaultEditorSettings,
  loadSettings,
  resetSettings,
  saveSettings,
} from "./settings";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("editor settings", () => {
  it("persists and resets settings", () => {
    const storage = new MemoryStorage();

    saveSettings(
      { ...defaultEditorSettings, zoom: 1.2, showHelp: false },
      storage,
    );
    expect(loadSettings(storage).zoom).toBe(1.2);
    expect(loadSettings(storage).showHelp).toBe(false);

    resetSettings(storage);
    expect(loadSettings(storage)).toEqual(defaultEditorSettings);
  });
});
