import { useEffect, useState } from "react";
import { wrap, type Remote } from "comlink";
import type { DocumentGeometry } from "../vector/geometry";
import type { VectorDocument } from "../vector/model";
import type { GeometryWorkerApi } from "./geometryWorker";

export function useGeometryStats(document: VectorDocument) {
  const [stats, setStats] = useState<DocumentGeometry | null>(null);

  useEffect(() => {
    let active = true;
    const worker = new Worker(new URL("./geometryWorker.ts", import.meta.url), {
      type: "module",
    });
    const api = wrap<GeometryWorkerApi>(worker) as Remote<GeometryWorkerApi>;

    api
      .analyze(document)
      .then((nextStats) => {
        if (active) {
          setStats(nextStats);
        }
      })
      .catch(() => {
        if (active) {
          setStats(null);
        }
      });

    return () => {
      active = false;
      worker.terminate();
    };
  }, [document]);

  return stats;
}
