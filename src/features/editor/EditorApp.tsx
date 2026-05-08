import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildInfo } from "../../config/build";
import { extractPalette } from "../palette/extractPalette";
import {
  deleteStoredDocument,
  listDocuments,
  saveDocument,
  supportsDocumentStorage,
} from "../storage/documents";
import type { ElementStyle, VectorDocument } from "../vector/model";
import { createDefaultDocument, touchDocument } from "../vector/model";
import {
  deleteElement,
  duplicateElement,
  updateElement,
  updateStyle,
} from "../vector/path";
import { exportDocumentToSvg, parseSvgDocument } from "../vector/svg";
import { EditorCanvas } from "./EditorCanvas";
import { Inspector } from "./Inspector";
import { LayersPanel } from "./LayersPanel";
import { StatusBar } from "./StatusBar";
import { Toolbar } from "./Toolbar";
import { TopBar } from "./TopBar";
import type { Notice, SelectedNode, ShapeDraft, Tool } from "./types";
import type { VectorPath } from "../vector/model";

export function EditorApp() {
  const [document, setDocument] = useState(() => createDefaultDocument());
  const [storedDocuments, setStoredDocuments] = useState<VectorDocument[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    document.elements[0]?.id ?? null,
  );
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [zoom, setZoom] = useState(0.78);
  const [palette, setPalette] = useState([
    "#2563eb",
    "#f59e0b",
    "#16a34a",
    "#ef4444",
  ]);
  const [penDraft, setPenDraft] = useState<VectorPath | null>(null);
  const [shapeDraft, setShapeDraft] = useState<ShapeDraft | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const undoStack = useRef<VectorDocument[]>([]);
  const redoStack = useRef<VectorDocument[]>([]);
  const svgInputRef = useRef<HTMLInputElement | null>(null);
  const paletteInputRef = useRef<HTMLInputElement | null>(null);

  const selectedElement = useMemo(
    () =>
      document.elements.find((element) => element.id === selectedElementId) ??
      null,
    [document.elements, selectedElementId],
  );

  const refreshStoredDocuments = useCallback(async () => {
    if (!supportsDocumentStorage()) {
      return;
    }
    try {
      setStoredDocuments(await listDocuments());
    } catch {
      showNotice("error", "Could not read local documents.");
    }
  }, []);

  function showNotice(tone: Notice["tone"], message: string) {
    setNotice({ tone, message });
  }

  useEffect(() => {
    refreshStoredDocuments();
  }, [refreshStoredDocuments]);

  useEffect(() => {
    if (!supportsDocumentStorage()) {
      return;
    }
    const timeout = window.setTimeout(() => {
      saveDocument(document).catch(() =>
        showNotice("error", "Autosave failed in this browser."),
      );
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [document]);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timeout = window.setTimeout(() => setNotice(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function commitDocument(next: VectorDocument) {
    undoStack.current.push(document);
    redoStack.current = [];
    setDocument(touchDocument(next));
  }

  function commitSnapshot(snapshot: VectorDocument) {
    undoStack.current.push(snapshot);
    redoStack.current = [];
    setDocument((current) => touchDocument(current));
  }

  function handleUndo() {
    const previous = undoStack.current.pop();
    if (!previous) {
      return;
    }
    redoStack.current.push(document);
    setDocument(previous);
    setSelectedElementId(previous.elements[0]?.id ?? null);
    setSelectedNode(null);
  }

  function handleRedo() {
    const next = redoStack.current.pop();
    if (!next) {
      return;
    }
    undoStack.current.push(document);
    setDocument(next);
    setSelectedElementId(next.elements[0]?.id ?? null);
    setSelectedNode(null);
  }

  function handleNewDocument() {
    commitDocument(createDefaultDocument());
    setSelectedElementId(null);
    setSelectedNode(null);
    setPenDraft(null);
    showNotice("success", "New local document created.");
  }

  function handleLoadDemo() {
    const demo = createDefaultDocument();
    commitDocument({ ...demo, title: "VectorForge demo" });
    setSelectedElementId(demo.elements[0]?.id ?? null);
  }

  async function handleSave() {
    try {
      await saveDocument(document);
      await refreshStoredDocuments();
      showNotice("success", "Saved locally in IndexedDB.");
    } catch {
      showNotice("error", "Could not save the document locally.");
    }
  }

  function handleExport() {
    const svg = exportDocumentToSvg(document);
    const filename = `${document.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "vectorforge"}.svg`;
    downloadText(filename, svg, "image/svg+xml");
    showNotice("success", "SVG exported.");
  }

  async function handleSvgImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    try {
      const imported = parseSvgDocument(await file.text());
      commitDocument(imported);
      setSelectedElementId(imported.elements[0]?.id ?? null);
      showNotice(
        "success",
        `Imported ${imported.elements.length} SVG elements.`,
      );
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "SVG import failed.",
      );
    }
  }

  async function handlePaletteImport(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    try {
      const colors = await extractPalette(file);
      if (!colors.length) {
        showNotice("error", "No useful palette was found in that image.");
        return;
      }
      setPalette(colors);
      showNotice("success", "Palette extracted with ColorThief.");
    } catch {
      showNotice("error", "Palette extraction failed.");
    }
  }

  function handleDeleteSelected() {
    if (!selectedElementId) {
      return;
    }
    commitDocument(deleteElement(document, selectedElementId));
    setSelectedElementId(null);
    setSelectedNode(null);
  }

  function handleStyleChange(style: Partial<ElementStyle>) {
    if (!selectedElementId) {
      return;
    }
    commitDocument(
      updateElement(document, selectedElementId, (element) =>
        updateStyle(element, style),
      ),
    );
  }

  function handleRename(name: string) {
    if (!selectedElementId) {
      return;
    }
    setDocument(
      updateElement(document, selectedElementId, (element) => ({
        ...element,
        name,
      })),
    );
  }

  function handleDuplicate() {
    if (!selectedElementId) {
      return;
    }
    const next = duplicateElement(document, selectedElementId);
    commitDocument(next);
    setSelectedElementId(next.elements.at(-1)?.id ?? selectedElementId);
  }

  function handleApplySwatch(color: string) {
    if (!selectedElementId) {
      return;
    }
    handleStyleChange({ fill: color });
  }

  async function handleLoadStored(id: string) {
    const stored = storedDocuments.find((candidate) => candidate.id === id);
    if (!stored) {
      return;
    }
    commitDocument(stored);
    setSelectedElementId(stored.elements[0]?.id ?? null);
    showNotice("success", "Loaded local document.");
  }

  async function handleDeleteStored(id: string) {
    await deleteStoredDocument(id);
    await refreshStoredDocuments();
    showNotice("success", "Removed local save.");
  }

  return (
    <div className="app-shell">
      <TopBar onNewDocument={handleNewDocument} onLoadDemo={handleLoadDemo} />
      <main className="app-main">
        <Toolbar
          tool={tool}
          canUndo={undoStack.current.length > 0}
          canRedo={redoStack.current.length > 0}
          onToolChange={(nextTool) => {
            setTool(nextTool);
            setSelectedNode(null);
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          onExport={handleExport}
          onImportSvg={() => svgInputRef.current?.click()}
          onImportPalette={() => paletteInputRef.current?.click()}
          onDelete={handleDeleteSelected}
        />
        <EditorCanvas
          document={document}
          tool={tool}
          zoom={zoom}
          selectedElementId={selectedElementId}
          selectedNode={selectedNode}
          penDraft={penDraft}
          shapeDraft={shapeDraft}
          onPreviewDocument={setDocument}
          onCommitDocument={commitDocument}
          onCommitSnapshot={commitSnapshot}
          onSelectElement={setSelectedElementId}
          onSelectNode={setSelectedNode}
          onPenDraftChange={setPenDraft}
          onShapeDraftChange={setShapeDraft}
        />
        <aside className="side-panel" aria-label="Inspector and layers">
          <Inspector
            selectedElement={selectedElement}
            activeTool={tool}
            palette={palette}
            zoom={zoom}
            onStyleChange={handleStyleChange}
            onRename={handleRename}
            onDuplicate={handleDuplicate}
            onZoomChange={setZoom}
            onApplySwatch={handleApplySwatch}
          />
          <LocalDocuments
            documents={storedDocuments}
            currentId={document.id}
            onLoad={handleLoadStored}
            onDelete={handleDeleteStored}
          />
          <LayersPanel
            document={document}
            selectedElementId={selectedElementId}
            onSelect={setSelectedElementId}
          />
        </aside>
      </main>
      <StatusBar document={document} zoom={zoom} />
      {notice ? (
        <div
          className="toast"
          role={notice.tone === "error" ? "alert" : "status"}
        >
          {notice.message}
        </div>
      ) : null}
      <input
        ref={svgInputRef}
        className="hidden-input"
        type="file"
        accept=".svg,image/svg+xml"
        onChange={handleSvgImport}
      />
      <input
        ref={paletteInputRef}
        className="hidden-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePaletteImport}
      />
      <span className="fine-print" hidden>
        {buildInfo.pagesUrl}
      </span>
    </div>
  );
}

function LocalDocuments({
  documents,
  currentId,
  onLoad,
  onDelete,
}: {
  documents: VectorDocument[];
  currentId: string;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="panel-section">
      <h2 className="panel-title">Local saves</h2>
      {documents.length ? (
        <div className="layer-list">
          {documents.slice(0, 5).map((document) => (
            <div
              key={document.id}
              className="layer-row"
              aria-selected={currentId === document.id}
            >
              <span
                className="layer-kind"
                style={{ backgroundColor: document.background }}
              />
              <button
                type="button"
                className="layer-name text-left"
                onClick={() => onLoad(document.id)}
              >
                {document.title}
              </button>
              <button
                type="button"
                className="text-button danger"
                onClick={() => onDelete(document.id)}
                aria-label={`Delete ${document.title}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No local saves yet.</div>
      )}
    </section>
  );
}

function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
