import { expose } from "comlink";
import type { VectorDocument } from "../vector/model";
import { analyzeDocumentGeometry } from "../vector/geometry";

export const geometryWorkerApi = {
  analyze(document: VectorDocument) {
    return analyzeDocumentGeometry(document);
  },
};

export type GeometryWorkerApi = typeof geometryWorkerApi;

expose(geometryWorkerApi);
