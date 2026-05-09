import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  copyTextToClipboard,
  createProjectShareUrl,
  downloadBlob,
  downloadText,
  parseProjectShareHash,
  pngFilename,
  projectFilename,
  renderDocumentToPng,
  svgFilename,
} from "../export/exporters";
import { useGeometryStats } from "../geometry/useGeometryStats";
import {
  importClipboardItems,
  importFiles,
  readClipboard,
  type ImportResult,
} from "../import/importRouter";
import {
  parseProjectFile,
  serializeProjectFile,
  type ProjectState,
} from "../project/projectFile";
import {
  defaultEditorSettings,
  loadSettings,
  saveSettings,
  type EditorSettings,
} from "../settings/settings";
import {
  clearStoredDocuments,
  deleteStoredDocument,
  listDocuments,
  loadDocument,
  saveDocument,
  supportsDocumentStorage,
} from "../storage/documents";
import {
  clearLastDocumentId,
  getLastDocumentId,
  setLastDocumentId,
} from "../storage/session";
import type { ElementStyle, VectorDocument } from "../vector/model";
import { createDefaultDocument, touchDocument } from "../vector/model";
import {
  deleteElement,
  duplicateElement,
  insertPathNodeAfter,
  removePathNode,
  reorderElement,
  togglePathClosed,
  updateElement,
  updateStyle,
} from "../vector/path";
import { exportDocumentToSvg } from "../vector/svg";
import { EditorCanvas } from "./EditorCanvas";
import { Inspector } from "./Inspector";
import { LayersPanel } from "./LayersPanel";
import { ProjectPanel } from "./ProjectPanel";
import { StatusBar } from "./StatusBar";
import { Toolbar } from "./Toolbar";
import { TopBar } from "./TopBar";
import type { Notice, SelectedNode, ShapeDraft, Tool } from "./types";
import type { VectorPath } from "../vector/model";

const defaultPalette = ["#2563eb", "#f59e0b", "#16a34a", "#ef4444"];

export function EditorApp() {
  const [document, setDocument] = useState(() => createDefaultDocument());
  const [storedDocuments, setStoredDocuments] = useState<VectorDocument[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    document.elements[0]?.id ?? null,
  );
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [settings, setSettings] = useState<EditorSettings>(() =>
    loadSettings(),
  );
  const [palette, setPalette] = useState(defaultPalette);
  const [penDraft, setPenDraft] = useState<VectorPath | null>(null);
  const [shapeDraft, setShapeDraft] = useState<ShapeDraft | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const undoStack = useRef<VectorDocument[]>([]);
  const redoStack = useRef<VectorDocument[]>([]);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const geometry = useGeometryStats(document);

  const selectedElement = useMemo(
    () =>
      document.elements.find((element) => element.id === selectedElementId) ??
      null,
    [document.elements, selectedElementId],
  );

  const showNotice = useCallback((tone: Notice["tone"], message: string) => {
    setNotice({ tone, message });
  }, []);

  const refreshStoredDocuments = useCallback(async () => {
    if (!supportsDocumentStorage()) {
      return;
    }
    try {
      setStoredDocuments(await listDocuments());
    } catch {
      showNotice("error", "Could not read local documents.");
    }
  }, [showNotice]);

  const bumpHistoryVersion = useCallback(() => {
    setHistoryVersion((version) => version + 1);
  }, []);

  const resetHistory = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
    bumpHistoryVersion();
  }, [bumpHistoryVersion]);

  const selectFirstElement = useCallback((nextDocument: VectorDocument) => {
    setSelectedElementId(nextDocument.elements[0]?.id ?? null);
    setSelectedNode(null);
  }, []);

  const applySettings = useCallback((nextSettings: EditorSettings) => {
    const parsed = { ...defaultEditorSettings, ...nextSettings };
    setSettings(parsed);
    saveSettings(parsed);
  }, []);

  function currentProjectState(): ProjectState {
    return { document, palette, settings };
  }

  const applyProjectState = useCallback(
    (state: ProjectState, message: string) => {
      setDocument(touchDocument(state.document));
      setPalette(state.palette.length ? state.palette : defaultPalette);
      applySettings(state.settings);
      selectFirstElement(state.document);
      resetHistory();
      setLastDocumentId(state.document.id);
      showNotice("success", message);
    },
    [applySettings, resetHistory, selectFirstElement, showNotice],
  );

  useEffect(() => {
    if (initialLoadComplete) {
      return;
    }

    async function restoreInitialState() {
      const shared = parseProjectShareHash();
      if (!shared.ok) {
        showNotice("error", shared.message);
      } else if (shared.value) {
        const project = parseProjectFile(shared.value);
        if (project.ok) {
          applyProjectState(project.value, "Loaded project from share URL.");
          window.history.replaceState(null, "", window.location.pathname);
          setInitialLoadComplete(true);
          return;
        }
        showNotice("error", project.message);
      }

      if (settings.restoreLastSession) {
        const lastDocumentId = getLastDocumentId();
        if (lastDocumentId) {
          const lastDocument = await loadDocument(lastDocumentId);
          if (lastDocument) {
            setDocument(lastDocument);
            selectFirstElement(lastDocument);
            showNotice("success", "Restored your last local session.");
          }
        }
      }
      setInitialLoadComplete(true);
    }

    restoreInitialState();
  }, [
    applyProjectState,
    initialLoadComplete,
    selectFirstElement,
    settings.restoreLastSession,
    showNotice,
  ]);

  useEffect(() => {
    refreshStoredDocuments();
  }, [refreshStoredDocuments]);

  useEffect(() => {
    if (
      !initialLoadComplete ||
      !settings.autosave ||
      !supportsDocumentStorage()
    ) {
      return;
    }
    const timeout = window.setTimeout(() => {
      saveDocument(document)
        .then(() => {
          setLastDocumentId(document.id);
          refreshStoredDocuments();
        })
        .catch(() => showNotice("error", "Autosave failed in this browser."));
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [
    document,
    initialLoadComplete,
    refreshStoredDocuments,
    settings.autosave,
    showNotice,
  ]);

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
    bumpHistoryVersion();
  }

  function commitSnapshot(snapshot: VectorDocument) {
    undoStack.current.push(snapshot);
    redoStack.current = [];
    setDocument((current) => touchDocument(current));
    bumpHistoryVersion();
  }

  function handleUndo() {
    const previous = undoStack.current.pop();
    if (!previous) {
      return;
    }
    redoStack.current.push(document);
    setDocument(previous);
    selectFirstElement(previous);
    bumpHistoryVersion();
  }

  function handleRedo() {
    const next = redoStack.current.pop();
    if (!next) {
      return;
    }
    undoStack.current.push(document);
    setDocument(next);
    selectFirstElement(next);
    bumpHistoryVersion();
  }

  function handleNewDocument() {
    const next = createDefaultDocument();
    commitDocument(next);
    selectFirstElement(next);
    setPenDraft(null);
    showNotice("success", "New local document created.");
  }

  function handleLoadDemo() {
    const demo = { ...createDefaultDocument(), title: "VectorForge demo" };
    commitDocument(demo);
    selectFirstElement(demo);
  }

  async function handleSave() {
    try {
      await saveDocument(document);
      setLastDocumentId(document.id);
      await refreshStoredDocuments();
      showNotice("success", "Saved locally in IndexedDB.");
    } catch {
      showNotice("error", "Could not save the document locally.");
    }
  }

  function handleExport() {
    downloadText(
      svgFilename(document),
      exportDocumentToSvg(document),
      "image/svg+xml",
    );
    showNotice("success", "SVG exported.");
  }

  async function handleExportPng() {
    const png = await renderDocumentToPng(document);
    if (!png.ok) {
      showNotice("error", png.message);
      return;
    }
    downloadBlob(pngFilename(document), png.value);
    showNotice("success", "PNG exported.");
  }

  function handleExportProject() {
    downloadText(
      projectFilename(document),
      serializeProjectFile(currentProjectState()),
      "application/json",
    );
    showNotice("success", "Project file exported.");
  }

  async function handleCopySvg() {
    const copied = await copyTextToClipboard(exportDocumentToSvg(document));
    showNotice(
      copied.ok ? "success" : "error",
      copied.ok ? "SVG copied." : copied.message,
    );
  }

  async function handleCopyShareUrl() {
    const share = createProjectShareUrl(currentProjectState());
    if (!share.ok) {
      showNotice("error", share.message);
      return;
    }
    const copied = await copyTextToClipboard(share.value);
    showNotice(
      copied.ok ? "success" : "error",
      copied.ok ? "Share URL copied." : copied.message,
    );
  }

  function handlePrint() {
    window.print();
  }

  async function handleImportInput(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.currentTarget.value = "";
    if (!files.length) {
      return;
    }
    await applyImportResult(await importFiles(files));
  }

  async function applyImportResult(result: ImportResult) {
    if (result.project) {
      applyProjectState(result.project, "Imported VectorForge project.");
      result.messages.forEach((message) => showNotice("info", message));
      return;
    }

    if (result.documents.length) {
      const nextDocument = combineImportedDocuments(result.documents);
      commitDocument(nextDocument);
      selectFirstElement(nextDocument);
    }

    if (result.palette.length) {
      setPalette(mergePalette(palette, result.palette));
    }

    if (result.documents.length || result.palette.length) {
      showNotice("success", result.messages.join(" ") || "Import completed.");
    } else if (result.messages.length) {
      showNotice("error", result.messages.join(" "));
    }
  }

  async function handleReadClipboard() {
    const imported = await readClipboard();
    if (!imported.ok) {
      showNotice("error", imported.message);
      return;
    }
    await applyImportResult(imported.value);
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length) {
      await applyImportResult(await importFiles(event.dataTransfer.files));
      return;
    }
    if (event.dataTransfer.items.length) {
      await applyImportResult(
        await importClipboardItems(event.dataTransfer.items),
      );
    }
  }

  async function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (target?.matches("input, textarea, select, [contenteditable='true']")) {
      return;
    }
    const imported = await importClipboardItems(event.clipboardData.items);
    if (
      imported.documents.length ||
      imported.palette.length ||
      imported.project ||
      imported.messages.length
    ) {
      event.preventDefault();
      await applyImportResult(imported);
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
    commitDocument(
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

  function handleReorder(direction: "front" | "back" | "forward" | "backward") {
    if (!selectedElementId) {
      return;
    }
    commitDocument(reorderElement(document, selectedElementId, direction));
    setSelectedElementId(selectedElementId);
  }

  function handleInsertNode() {
    if (selectedElement?.type !== "path") {
      return;
    }
    const fallbackIndex = selectedElement.closed
      ? selectedElement.nodes.length - 1
      : Math.max(0, selectedElement.nodes.length - 2);
    const nodeIndex = selectedNode?.nodeIndex ?? fallbackIndex;
    const splitIndex =
      !selectedElement.closed && nodeIndex >= selectedElement.nodes.length - 1
        ? Math.max(0, nodeIndex - 1)
        : nodeIndex;
    const next = updateElement(document, selectedElement.id, (element) => {
      if (element.type !== "path") {
        return element;
      }
      return insertPathNodeAfter(element, splitIndex);
    });
    commitDocument(next);
    setSelectedNode({
      elementId: selectedElement.id,
      nodeIndex: splitIndex + 1,
      part: "point",
    });
  }

  function handleDeleteNode() {
    if (selectedElement?.type !== "path" || !selectedNode) {
      return;
    }
    const next = updateElement(document, selectedElement.id, (element) => {
      if (element.type !== "path") {
        return element;
      }
      return removePathNode(element, selectedNode.nodeIndex);
    });
    commitDocument(next);
    setSelectedNode(null);
  }

  function handleToggleClosed() {
    if (selectedElement?.type !== "path") {
      return;
    }
    const next = updateElement(document, selectedElement.id, (element) => {
      if (element.type !== "path") {
        return element;
      }
      return togglePathClosed(element);
    });
    commitDocument(next);
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
    setLastDocumentId(stored.id);
    selectFirstElement(stored);
    showNotice("success", "Loaded local document.");
  }

  async function handleDeleteStored(id: string) {
    await deleteStoredDocument(id);
    if (document.id === id) {
      clearLastDocumentId();
    }
    await refreshStoredDocuments();
    showNotice("success", "Removed local save.");
  }

  async function handleClearAll() {
    if (
      !window.confirm(
        "Clear all local saves, settings, and current unsaved work?",
      )
    ) {
      return;
    }
    await clearStoredDocuments();
    clearLastDocumentId();
    applySettings(defaultEditorSettings);
    const next = createDefaultDocument();
    setDocument(next);
    setPalette(defaultPalette);
    selectFirstElement(next);
    resetHistory();
    await refreshStoredDocuments();
    showNotice("success", "Local data cleared.");
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.matches("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const modifier = event.metaKey || event.ctrlKey;

      if (modifier && key === "z" && event.shiftKey) {
        event.preventDefault();
        handleRedo();
      } else if (modifier && key === "z") {
        event.preventDefault();
        handleUndo();
      } else if (modifier && key === "s") {
        event.preventDefault();
        handleSave();
      } else if (modifier && key === "d") {
        event.preventDefault();
        handleDuplicate();
      } else if (key === "delete" || key === "backspace") {
        event.preventDefault();
        if (selectedNode) {
          handleDeleteNode();
        } else {
          handleDeleteSelected();
        }
      } else if (key === "escape") {
        setPenDraft(null);
        setShapeDraft(null);
        setSelectedNode(null);
      } else if (!modifier && key === "v") {
        setTool("select");
      } else if (!modifier && key === "a") {
        setTool("node");
      } else if (!modifier && key === "p") {
        setTool("pen");
      } else if (!modifier && key === "r") {
        setTool("rect");
      } else if (!modifier && key === "e") {
        setTool("ellipse");
      } else if (!modifier && key === "]") {
        handleReorder("forward");
      } else if (!modifier && key === "[") {
        handleReorder("backward");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div
      className={`app-shell${isDragging ? " dragging" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <TopBar onNewDocument={handleNewDocument} onLoadDemo={handleLoadDemo} />
      <main className="app-main">
        <Toolbar
          key={historyVersion}
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
          onExportPng={handleExportPng}
          onImportSvg={() => importInputRef.current?.click()}
          onImportPalette={() => importInputRef.current?.click()}
          onReadClipboard={handleReadClipboard}
          onDelete={handleDeleteSelected}
        />
        <EditorCanvas
          document={document}
          tool={tool}
          zoom={settings.zoom}
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
          {settings.showHelp ? (
            <section className="panel-section">
              <h2 className="panel-title">Workflow help</h2>
              <p className="fine-print">
                Import with the file button, drag files onto the workspace,
                paste SVG/image content, or read the clipboard. Shortcuts: V
                select, A nodes, P pen, R rectangle, E ellipse, Cmd/Ctrl+S save,
                Cmd/Ctrl+D duplicate.
              </p>
            </section>
          ) : null}
          <Inspector
            selectedElement={selectedElement}
            activeTool={tool}
            selectedNode={selectedNode}
            palette={palette}
            zoom={settings.zoom}
            onStyleChange={handleStyleChange}
            onRename={handleRename}
            onDuplicate={handleDuplicate}
            onInsertNode={handleInsertNode}
            onDeleteNode={handleDeleteNode}
            onToggleClosed={handleToggleClosed}
            onBringForward={() => handleReorder("forward")}
            onSendBackward={() => handleReorder("backward")}
            onBringToFront={() => handleReorder("front")}
            onSendToBack={() => handleReorder("back")}
            onZoomChange={(zoom) => applySettings({ ...settings, zoom })}
            onApplySwatch={handleApplySwatch}
          />
          <ProjectPanel
            settings={settings}
            onSettingsChange={applySettings}
            onExportProject={handleExportProject}
            onCopySvg={handleCopySvg}
            onCopyShareUrl={handleCopyShareUrl}
            onPrint={handlePrint}
            onReadClipboard={handleReadClipboard}
            onResetDocument={handleNewDocument}
            onClearAll={handleClearAll}
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
      <StatusBar document={document} zoom={settings.zoom} geometry={geometry} />
      {notice ? (
        <div
          className="toast"
          role={notice.tone === "error" ? "alert" : "status"}
        >
          {notice.message}
        </div>
      ) : null}
      <input
        ref={importInputRef}
        className="hidden-input"
        type="file"
        multiple
        accept=".svg,.json,.vectorforge.json,image/svg+xml,image/png,image/jpeg,image/webp"
        onChange={handleImportInput}
      />
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

function combineImportedDocuments(documents: VectorDocument[]) {
  if (documents.length === 1) {
    return documents[0];
  }
  const [first, ...rest] = documents;
  return touchDocument({
    ...first,
    title: `Imported batch (${documents.length})`,
    elements: documents.flatMap((document, documentIndex) =>
      document.elements.map((element) => ({
        ...element,
        id: `${element.id}_${documentIndex}`,
        name: `${document.title}: ${element.name}`,
      })),
    ),
    width: Math.max(first.width, ...rest.map((document) => document.width)),
    height: Math.max(first.height, ...rest.map((document) => document.height)),
  });
}

function mergePalette(current: string[], imported: string[]) {
  return Array.from(new Set([...imported, ...current])).slice(0, 12);
}
