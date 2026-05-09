import {
  ClipboardCopy,
  ClipboardPaste,
  FileJson,
  Printer,
  RotateCcw,
  Share2,
  Trash2,
} from "lucide-react";
import type { EditorSettings } from "../settings/settings";

type Props = {
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
  onExportProject: () => void;
  onCopySvg: () => void;
  onCopyShareUrl: () => void;
  onPrint: () => void;
  onReadClipboard: () => void;
  onResetDocument: () => void;
  onClearAll: () => void;
};

export function ProjectPanel({
  settings,
  onSettingsChange,
  onExportProject,
  onCopySvg,
  onCopyShareUrl,
  onPrint,
  onReadClipboard,
  onResetDocument,
  onClearAll,
}: Props) {
  return (
    <>
      <section className="panel-section">
        <h2 className="panel-title">Outputs</h2>
        <div className="inline-actions wrap">
          <button
            type="button"
            className="text-button"
            onClick={onExportProject}
          >
            <FileJson size={15} /> Export project
          </button>
          <button type="button" className="text-button" onClick={onCopySvg}>
            <ClipboardCopy size={15} /> Copy SVG
          </button>
          <button
            type="button"
            className="text-button"
            onClick={onCopyShareUrl}
          >
            <Share2 size={15} /> Share URL
          </button>
          <button type="button" className="text-button" onClick={onPrint}>
            <Printer size={15} /> Print
          </button>
          <button
            type="button"
            className="text-button"
            onClick={onReadClipboard}
          >
            <ClipboardPaste size={15} /> Read clipboard
          </button>
        </div>
      </section>

      <section className="panel-section">
        <h2 className="panel-title">Settings</h2>
        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.autosave}
            onChange={(event) =>
              onSettingsChange({ ...settings, autosave: event.target.checked })
            }
          />
          Autosave local work
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.restoreLastSession}
            onChange={(event) =>
              onSettingsChange({
                ...settings,
                restoreLastSession: event.target.checked,
              })
            }
          />
          Restore last session
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.showHelp}
            onChange={(event) =>
              onSettingsChange({ ...settings, showHelp: event.target.checked })
            }
          />
          Show workflow help
        </label>
        <div className="inline-actions wrap">
          <button
            type="button"
            className="text-button"
            onClick={onResetDocument}
          >
            <RotateCcw size={15} /> Fresh document
          </button>
          <button
            type="button"
            className="text-button danger"
            onClick={onClearAll}
          >
            <Trash2 size={15} /> Clear local data
          </button>
        </div>
      </section>
    </>
  );
}
