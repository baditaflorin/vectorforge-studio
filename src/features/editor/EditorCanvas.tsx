import { useRef } from "react";
import type {
  BezierNode,
  Point,
  VectorDocument,
  VectorElement,
  VectorPath,
} from "../vector/model";
import {
  addElement,
  createEllipseFromPoints,
  createPath,
  createRectFromPoints,
  distance,
  elementBounds,
  pathToD,
  translateElement,
  updateElement,
  updatePathNode,
} from "../vector/path";
import type { DragState, SelectedNode, ShapeDraft, Tool } from "./types";

type Props = {
  document: VectorDocument;
  tool: Tool;
  zoom: number;
  selectedElementId: string | null;
  selectedNode: SelectedNode | null;
  penDraft: VectorPath | null;
  shapeDraft: ShapeDraft | null;
  onPreviewDocument: (document: VectorDocument) => void;
  onCommitDocument: (document: VectorDocument) => void;
  onCommitSnapshot: (snapshot: VectorDocument) => void;
  onSelectElement: (elementId: string | null) => void;
  onSelectNode: (selection: SelectedNode | null) => void;
  onPenDraftChange: (draft: VectorPath | null) => void;
  onShapeDraftChange: (draft: ShapeDraft | null) => void;
};

export function EditorCanvas({
  document,
  tool,
  zoom,
  selectedElementId,
  selectedNode,
  penDraft,
  shapeDraft,
  onPreviewDocument,
  onCommitDocument,
  onCommitSnapshot,
  onSelectElement,
  onSelectNode,
  onPenDraftChange,
  onShapeDraftChange,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const selectedElement =
    document.elements.find((element) => element.id === selectedElementId) ??
    null;

  function handleBackgroundPointerDown(
    event: React.PointerEvent<SVGSVGElement>,
  ) {
    const target = event.target as Element;
    if (
      target !== event.currentTarget &&
      !target.hasAttribute("data-background")
    ) {
      return;
    }

    const point = toSvgPoint(event);
    if (!point) {
      return;
    }

    if (tool === "rect" || tool === "ellipse") {
      const draft = { type: tool, start: point, current: point };
      dragRef.current = { kind: "shape", draft };
      onShapeDraftChange(draft);
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }

    if (tool === "pen") {
      handlePenPoint(point);
      return;
    }

    onSelectElement(null);
    onSelectNode(null);
  }

  function handleElementPointerDown(
    event: React.PointerEvent<SVGElement>,
    element: VectorElement,
  ) {
    event.stopPropagation();
    const point = toSvgPoint(event);
    if (!point) {
      return;
    }

    onSelectElement(element.id);
    onSelectNode(null);

    if (tool === "select") {
      dragRef.current = {
        kind: "element",
        elementId: element.id,
        start: point,
        snapshot: document,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function handleNodePointerDown(
    event: React.PointerEvent<SVGCircleElement>,
    selection: SelectedNode,
  ) {
    event.stopPropagation();
    onSelectNode(selection);
    dragRef.current = {
      kind: "node",
      selectedNode: selection,
      snapshot: document,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    const point = toSvgPoint(event);
    if (!drag || !point) {
      return;
    }

    if (drag.kind === "shape") {
      const draft = { ...drag.draft, current: point };
      dragRef.current = { kind: "shape", draft };
      onShapeDraftChange(draft);
      return;
    }

    if (drag.kind === "element") {
      const delta = { x: point.x - drag.start.x, y: point.y - drag.start.y };
      const next = updateElement(drag.snapshot, drag.elementId, (element) =>
        translateElement(element, delta),
      );
      onPreviewDocument(next);
      return;
    }

    const next = updateElement(
      drag.snapshot,
      drag.selectedNode.elementId,
      (element) => {
        if (element.type !== "path") {
          return element;
        }
        return updatePathNode(
          element,
          drag.selectedNode.nodeIndex,
          drag.selectedNode.part,
          point,
        );
      },
    );
    onPreviewDocument(next);
  }

  function handlePointerUp() {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }

    dragRef.current = null;
    if (drag.kind === "shape") {
      const element =
        drag.draft.type === "rect"
          ? createRectFromPoints(
              drag.draft.start,
              shapeDraft?.current ?? drag.draft.current,
            )
          : createEllipseFromPoints(
              drag.draft.start,
              shapeDraft?.current ?? drag.draft.current,
            );

      onShapeDraftChange(null);
      if (
        elementBounds(element).width > 8 &&
        elementBounds(element).height > 8
      ) {
        onCommitDocument(addElement(document, element));
        onSelectElement(element.id);
      }
      return;
    }

    onCommitSnapshot(drag.snapshot);
  }

  function handleDoubleClick() {
    if (tool === "pen" && penDraft && penDraft.nodes.length > 1) {
      onCommitDocument(addElement(document, penDraft));
      onSelectElement(penDraft.id);
      onPenDraftChange(null);
    }
  }

  function handlePenPoint(point: Point) {
    if (!penDraft) {
      onPenDraftChange(createPath([{ point }], false));
      return;
    }

    const firstPoint = penDraft.nodes[0]?.point;
    if (
      firstPoint &&
      penDraft.nodes.length > 2 &&
      distance(firstPoint, point) < 18
    ) {
      const closed = { ...penDraft, closed: true };
      onCommitDocument(addElement(document, closed));
      onSelectElement(closed.id);
      onPenDraftChange(null);
      return;
    }

    const nodes = penDraft.nodes.map((node) => ({ ...node }));
    const previous = nodes.at(-1);
    const nextNode: BezierNode = { point };
    if (previous) {
      previous.out ??= interpolate(previous.point, point, 0.34);
      nextNode.in = interpolate(previous.point, point, 0.66);
    }
    onPenDraftChange({ ...penDraft, nodes: [...nodes, nextNode] });
  }

  function toSvgPoint(
    event: React.PointerEvent | React.MouseEvent,
  ): Point | null {
    const svg = svgRef.current;
    if (!svg) {
      return null;
    }
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM()?.inverse();
    if (!matrix) {
      return null;
    }
    const transformed = point.matrixTransform(matrix);
    return { x: transformed.x, y: transformed.y };
  }

  return (
    <section className="workspace" aria-label="Vector workspace">
      <div className="canvas-stage">
        <div className="artboard-wrap" style={{ transform: `scale(${zoom})` }}>
          <svg
            ref={svgRef}
            className="artboard"
            width={document.width}
            height={document.height}
            viewBox={`0 0 ${document.width} ${document.height}`}
            onPointerDown={handleBackgroundPointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            role="img"
            aria-label={`${document.title} artboard`}
          >
            <rect
              data-background="true"
              width="100%"
              height="100%"
              fill={document.background}
            />
            {document.elements.map((element) =>
              renderElement(
                element,
                selectedElementId,
                handleElementPointerDown,
              ),
            )}
            {shapeDraft ? renderShapeDraft(shapeDraft) : null}
            {penDraft ? (
              <path
                className="ghost"
                d={pathToD(penDraft)}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
            ) : null}
            {selectedElement ? renderSelection(selectedElement) : null}
            {selectedElement?.type === "path" && tool === "node"
              ? renderNodeHandles(
                  selectedElement,
                  selectedNode,
                  handleNodePointerDown,
                )
              : null}
          </svg>
        </div>
      </div>
    </section>
  );
}

function renderElement(
  element: VectorElement,
  selectedElementId: string | null,
  onPointerDown: (
    event: React.PointerEvent<SVGElement>,
    element: VectorElement,
  ) => void,
) {
  const common = {
    key: element.id,
    className: "element",
    opacity: element.style.opacity,
    fill: element.style.fill,
    stroke: element.style.stroke,
    strokeWidth: element.style.strokeWidth,
    "data-selected": selectedElementId === element.id,
    onPointerDown: (event: React.PointerEvent<SVGElement>) =>
      onPointerDown(event, element),
  };

  if (element.type === "rect") {
    return (
      <rect
        {...common}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rx={element.radius}
      />
    );
  }
  if (element.type === "ellipse") {
    return (
      <ellipse
        {...common}
        cx={element.cx}
        cy={element.cy}
        rx={element.rx}
        ry={element.ry}
      />
    );
  }
  return <path {...common} d={pathToD(element)} fill={element.style.fill} />;
}

function renderShapeDraft(draft: ShapeDraft) {
  const element =
    draft.type === "rect"
      ? createRectFromPoints(draft.start, draft.current)
      : createEllipseFromPoints(draft.start, draft.current);
  return renderElement({ ...element, id: "draft" }, null, () => undefined);
}

function renderSelection(element: VectorElement) {
  const bounds = elementBounds(element);
  return (
    <rect
      className="selection-outline"
      x={bounds.x - 8}
      y={bounds.y - 8}
      width={bounds.width + 16}
      height={bounds.height + 16}
      rx="8"
    />
  );
}

function renderNodeHandles(
  path: VectorPath,
  selectedNode: SelectedNode | null,
  onPointerDown: (
    event: React.PointerEvent<SVGCircleElement>,
    selection: SelectedNode,
  ) => void,
) {
  return (
    <g>
      {path.nodes.map((node, index) => (
        <g key={`${path.id}-${index}`}>
          {node.in ? (
            <>
              <line
                className="handle-line"
                x1={node.point.x}
                y1={node.point.y}
                x2={node.in.x}
                y2={node.in.y}
              />
              <circle
                className="curve-handle"
                cx={node.in.x}
                cy={node.in.y}
                r={
                  selectedNode?.nodeIndex === index &&
                  selectedNode.part === "in"
                    ? 7
                    : 5
                }
                onPointerDown={(event) =>
                  onPointerDown(event, {
                    elementId: path.id,
                    nodeIndex: index,
                    part: "in",
                  })
                }
              />
            </>
          ) : null}
          {node.out ? (
            <>
              <line
                className="handle-line"
                x1={node.point.x}
                y1={node.point.y}
                x2={node.out.x}
                y2={node.out.y}
              />
              <circle
                className="curve-handle"
                cx={node.out.x}
                cy={node.out.y}
                r={
                  selectedNode?.nodeIndex === index &&
                  selectedNode.part === "out"
                    ? 7
                    : 5
                }
                onPointerDown={(event) =>
                  onPointerDown(event, {
                    elementId: path.id,
                    nodeIndex: index,
                    part: "out",
                  })
                }
              />
            </>
          ) : null}
          <circle
            className="node-handle"
            cx={node.point.x}
            cy={node.point.y}
            r={
              selectedNode?.nodeIndex === index && selectedNode.part === "point"
                ? 8
                : 6
            }
            onPointerDown={(event) =>
              onPointerDown(event, {
                elementId: path.id,
                nodeIndex: index,
                part: "point",
              })
            }
          />
        </g>
      ))}
    </g>
  );
}

function interpolate(a: Point, b: Point, ratio: number): Point {
  return {
    x: a.x + (b.x - a.x) * ratio,
    y: a.y + (b.y - a.y) * ratio,
  };
}
