const lastDocumentKey = "vectorforge-studio:last-document-id";

export function getLastDocumentId(storage: Storage = window.localStorage) {
  return storage.getItem(lastDocumentKey);
}

export function setLastDocumentId(
  documentId: string,
  storage: Storage = window.localStorage,
) {
  storage.setItem(lastDocumentKey, documentId);
}

export function clearLastDocumentId(storage: Storage = window.localStorage) {
  storage.removeItem(lastDocumentKey);
}
