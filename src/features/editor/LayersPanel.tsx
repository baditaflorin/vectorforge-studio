import type { VectorDocument } from "../vector/model";
import { getElementLabel } from "../vector/model";

type Props = {
  document: VectorDocument;
  selectedElementId: string | null;
  onSelect: (elementId: string) => void;
};

export function LayersPanel({ document, selectedElementId, onSelect }: Props) {
  return (
    <section className="panel-section">
      <h2 className="panel-title">Layers</h2>
      <div className="layer-list">
        {[...document.elements].reverse().map((element) => (
          <button
            key={element.id}
            type="button"
            className="layer-row"
            aria-selected={selectedElementId === element.id}
            onClick={() => onSelect(element.id)}
          >
            <span
              className="layer-kind"
              style={{ backgroundColor: element.style.fill }}
            />
            <span className="layer-name">{element.name}</span>
            <span className="layer-meta">{getElementLabel(element)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
