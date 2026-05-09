import {
  BringToFront,
  Copy,
  FolderDown,
  FolderUp,
  Minus,
  Plus,
  SendToBack,
  Spline,
  Trash2,
} from "lucide-react";
import type { ElementStyle, VectorElement } from "../vector/model";
import type { SelectedNode, Tool } from "./types";

type Props = {
  selectedElement: VectorElement | null;
  activeTool: Tool;
  selectedNode: SelectedNode | null;
  palette: string[];
  zoom: number;
  onStyleChange: (style: Partial<ElementStyle>) => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onInsertNode: () => void;
  onDeleteNode: () => void;
  onToggleClosed: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onZoomChange: (zoom: number) => void;
  onApplySwatch: (color: string) => void;
};

export function Inspector({
  selectedElement,
  activeTool,
  selectedNode,
  palette,
  zoom,
  onStyleChange,
  onRename,
  onDuplicate,
  onInsertNode,
  onDeleteNode,
  onToggleClosed,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onZoomChange,
  onApplySwatch,
}: Props) {
  return (
    <>
      <section className="panel-section">
        <h2 className="panel-title">Selection</h2>
        {selectedElement ? (
          <div className="field-grid">
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="element-name">Name</label>
              <input
                id="element-name"
                value={selectedElement.name}
                onChange={(event) => onRename(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="fill-color">Fill</label>
              <input
                id="fill-color"
                type="color"
                value={normalizeColor(selectedElement.style.fill)}
                onChange={(event) =>
                  onStyleChange({ fill: event.target.value })
                }
              />
            </div>
            <div className="field">
              <label htmlFor="stroke-color">Stroke</label>
              <input
                id="stroke-color"
                type="color"
                value={normalizeColor(selectedElement.style.stroke)}
                onChange={(event) =>
                  onStyleChange({ stroke: event.target.value })
                }
              />
            </div>
            <div className="field">
              <label htmlFor="stroke-width">Stroke</label>
              <input
                id="stroke-width"
                type="number"
                min="0"
                max="64"
                value={selectedElement.style.strokeWidth}
                onChange={(event) =>
                  onStyleChange({ strokeWidth: Number(event.target.value) })
                }
              />
            </div>
            <div className="field">
              <label htmlFor="opacity">Opacity</label>
              <input
                id="opacity"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={selectedElement.style.opacity}
                onChange={(event) =>
                  onStyleChange({ opacity: Number(event.target.value) })
                }
              />
            </div>
            <button type="button" className="text-button" onClick={onDuplicate}>
              <Copy size={15} /> Duplicate
            </button>
          </div>
        ) : (
          <div className="empty-state">Select artwork to edit appearance.</div>
        )}
      </section>

      {selectedElement ? (
        <section className="panel-section">
          <h2 className="panel-title">Arrange</h2>
          <div className="inline-actions wrap">
            <button
              type="button"
              className="text-button"
              onClick={onBringForward}
            >
              <FolderUp size={15} /> Forward
            </button>
            <button
              type="button"
              className="text-button"
              onClick={onSendBackward}
            >
              <FolderDown size={15} /> Backward
            </button>
            <button
              type="button"
              className="text-button"
              onClick={onBringToFront}
            >
              <BringToFront size={15} /> Front
            </button>
            <button
              type="button"
              className="text-button"
              onClick={onSendToBack}
            >
              <SendToBack size={15} /> Back
            </button>
          </div>
        </section>
      ) : null}

      {selectedElement?.type === "path" ? (
        <section className="panel-section">
          <h2 className="panel-title">Path</h2>
          <div className="inline-actions wrap">
            <button
              type="button"
              className="text-button"
              onClick={onInsertNode}
            >
              <Plus size={15} /> Add node
            </button>
            <button
              type="button"
              className="text-button danger"
              disabled={!selectedNode || selectedElement.nodes.length <= 2}
              onClick={onDeleteNode}
            >
              <Trash2 size={15} /> Delete node
            </button>
            <button
              type="button"
              className="text-button"
              onClick={onToggleClosed}
            >
              <Spline size={15} />{" "}
              {selectedElement.closed ? "Open path" : "Close path"}
            </button>
          </div>
          <p className="fine-print">
            {selectedElement.nodes.length} anchors.{" "}
            {selectedNode
              ? `Node ${selectedNode.nodeIndex + 1} selected.`
              : "Select a node to delete it."}
          </p>
        </section>
      ) : null}

      <section className="panel-section">
        <h2 className="panel-title">Viewport</h2>
        <div className="field-row">
          <button
            type="button"
            className="icon-button"
            aria-label="Zoom out"
            onClick={() => onZoomChange(Math.max(0.35, zoom - 0.1))}
          >
            <Minus size={16} />
          </button>
          <input
            aria-label="Zoom level"
            type="range"
            min="0.35"
            max="1.5"
            step="0.05"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
          />
          <button
            type="button"
            className="icon-button"
            aria-label="Zoom in"
            onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="fine-print">
          Active tool: {activeTool}. Use node mode to drag anchors and handles.
        </p>
      </section>

      <section className="panel-section">
        <h2 className="panel-title">Palette</h2>
        {palette.length ? (
          <div className="swatch-row">
            {palette.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Apply ${color}`}
                className="swatch"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => onApplySwatch(color)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">Import an image to extract colors.</div>
        )}
      </section>
    </>
  );
}

function normalizeColor(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color) ? color : "#ffffff";
}
