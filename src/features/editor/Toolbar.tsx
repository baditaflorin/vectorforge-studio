import {
  Circle,
  Download,
  FileInput,
  Image,
  MousePointer2,
  PenTool,
  Redo2,
  Save,
  Square,
  Trash2,
  Undo2,
  Waypoints,
} from "lucide-react";
import type { Tool } from "./types";

type Props = {
  tool: Tool;
  canUndo: boolean;
  canRedo: boolean;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  onImportSvg: () => void;
  onImportPalette: () => void;
  onDelete: () => void;
};

const tools: Array<{ id: Tool; label: string; icon: typeof MousePointer2 }> = [
  { id: "select", label: "Select and move", icon: MousePointer2 },
  { id: "node", label: "Edit nodes and handles", icon: Waypoints },
  { id: "pen", label: "Pen path", icon: PenTool },
  { id: "rect", label: "Rectangle", icon: Square },
  { id: "ellipse", label: "Ellipse", icon: Circle },
];

export function Toolbar({
  tool,
  canUndo,
  canRedo,
  onToolChange,
  onUndo,
  onRedo,
  onSave,
  onExport,
  onImportSvg,
  onImportPalette,
  onDelete,
}: Props) {
  return (
    <aside className="toolbar" aria-label="Editor tools">
      <div className="tool-group">
        {tools.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="tool-button"
              aria-label={item.label}
              aria-pressed={tool === item.id}
              title={item.label}
              onClick={() => onToolChange(item.id)}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      <div className="tool-group">
        <button
          type="button"
          className="tool-button"
          aria-label="Undo"
          title="Undo"
          disabled={!canUndo}
          onClick={onUndo}
        >
          <Undo2 size={19} />
        </button>
        <button
          type="button"
          className="tool-button"
          aria-label="Redo"
          title="Redo"
          disabled={!canRedo}
          onClick={onRedo}
        >
          <Redo2 size={19} />
        </button>
      </div>

      <div className="tool-group">
        <button
          type="button"
          className="tool-button"
          aria-label="Save"
          title="Save"
          onClick={onSave}
        >
          <Save size={19} />
        </button>
        <button
          type="button"
          className="tool-button"
          aria-label="Export SVG"
          title="Export SVG"
          onClick={onExport}
        >
          <Download size={19} />
        </button>
        <button
          type="button"
          className="tool-button"
          aria-label="Import SVG"
          title="Import SVG"
          onClick={onImportSvg}
        >
          <FileInput size={19} />
        </button>
        <button
          type="button"
          className="tool-button"
          aria-label="Extract palette from image"
          title="Extract palette from image"
          onClick={onImportPalette}
        >
          <Image size={19} />
        </button>
      </div>

      <div className="tool-group">
        <button
          type="button"
          className="tool-button"
          aria-label="Delete selected"
          title="Delete selected"
          onClick={onDelete}
        >
          <Trash2 size={19} />
        </button>
      </div>
    </aside>
  );
}
