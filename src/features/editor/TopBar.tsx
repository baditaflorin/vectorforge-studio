import { ExternalLink, Heart, Plus, Star, Stars } from "lucide-react";
import { buildInfo } from "../../config/build";

type Props = {
  onNewDocument: () => void;
  onLoadDemo: () => void;
};

export function TopBar({ onNewDocument, onLoadDemo }: Props) {
  return (
    <header className="topbar">
      <div className="brand" aria-label="VectorForge Studio">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <div className="brand-title">VectorForge Studio</div>
          <div className="brand-subtitle">
            Local-first SVG and Bezier editor
          </div>
        </div>
      </div>
      <div className="topbar-actions">
        <button type="button" className="text-button" onClick={onNewDocument}>
          <Plus size={16} /> New
        </button>
        <button type="button" className="text-button" onClick={onLoadDemo}>
          <Stars size={16} /> Demo
        </button>
        <a
          className="link-button"
          href={buildInfo.repositoryUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Star size={16} /> Star on GitHub <ExternalLink size={14} />
        </a>
        <a
          className="link-button"
          href={buildInfo.paypalUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Heart size={16} /> PayPal <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
}
