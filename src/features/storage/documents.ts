import { openDB, type DBSchema } from "idb";
import type { VectorDocument } from "../vector/model";
import { vectorDocumentSchema } from "../vector/model";

const databaseName = "vectorforge-studio";
const documentStore = "documents";

interface VectorForgeDatabase extends DBSchema {
  documents: {
    key: string;
    value: VectorDocument;
    indexes: {
      "by-updated": string;
    };
  };
}

async function getDatabase() {
  return openDB<VectorForgeDatabase>(databaseName, 1, {
    upgrade(database) {
      const store = database.createObjectStore(documentStore, {
        keyPath: "id",
      });
      store.createIndex("by-updated", "updatedAt");
    },
  });
}

export async function saveDocument(document: VectorDocument) {
  const database = await getDatabase();
  const parsed = vectorDocumentSchema.parse(document);
  await database.put(documentStore, parsed);
}

export async function listDocuments() {
  const database = await getDatabase();
  const documents = await database.getAllFromIndex(documentStore, "by-updated");
  return documents.reverse();
}

export async function loadDocument(id: string) {
  const database = await getDatabase();
  const document = await database.get(documentStore, id);
  return document ? vectorDocumentSchema.parse(document) : null;
}

export async function deleteStoredDocument(id: string) {
  const database = await getDatabase();
  await database.delete(documentStore, id);
}

export function supportsDocumentStorage() {
  return typeof indexedDB !== "undefined";
}
