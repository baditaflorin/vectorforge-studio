import { useQuery } from "@tanstack/react-query";
import { buildInfo } from "../../config/build";
import { detectCapabilities } from "../../shared/capabilities";
import {
  fetchLatestCommit,
  fetchRepositoryInfo,
} from "../repository/repository";
import type { DocumentGeometry } from "../vector/geometry";
import type { VectorDocument } from "../vector/model";

type Props = {
  document: VectorDocument;
  zoom: number;
  geometry: DocumentGeometry | null;
};

const capabilities = detectCapabilities();

export function StatusBar({ document, zoom, geometry }: Props) {
  const repo = useQuery({
    queryKey: ["repository"],
    queryFn: fetchRepositoryInfo,
  });
  const commit = useQuery({
    queryKey: ["latest-commit"],
    queryFn: fetchLatestCommit,
  });
  const latestSha = commit.data?.sha.slice(0, 7) ?? buildInfo.commit;
  const commitUrl =
    commit.data?.html_url ??
    `${buildInfo.repositoryUrl}/commit/${buildInfo.commit}`;

  return (
    <footer className="statusbar">
      <div className="status-group">
        <span className="status-item">v{buildInfo.version}</span>
        <a
          className="status-item"
          href={commitUrl}
          target="_blank"
          rel="noreferrer"
        >
          commit {latestSha}
        </a>
        <span className="status-item">
          {repo.data
            ? `${repo.data.stargazers_count} stars`
            : "GitHub metadata pending"}
        </span>
        <span className="status-item">{Math.round(zoom * 100)}%</span>
        <span className="status-item">
          {geometry
            ? `${Math.round(geometry.totalLength)} px paths`
            : "geometry pending"}
        </span>
      </div>
      <div className="status-group">
        <span className="status-item">
          {geometry?.elementCount ?? document.elements.length} elements
        </span>
        <span className="status-item">{geometry?.nodeCount ?? 0} nodes</span>
        <span className="status-item">
          IndexedDB {capabilities.indexedDb ? "ready" : "off"}
        </span>
        <span className="status-item">
          WebGPU {capabilities.webGpu ? "available" : "unavailable"}
        </span>
        <span className="status-item">
          PWA {capabilities.serviceWorker ? "ready" : "off"}
        </span>
      </div>
    </footer>
  );
}
