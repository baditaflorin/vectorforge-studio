import { err, messageFromError, ok, type Result } from "../../shared/result";
import type { ProjectState } from "../project/projectFile";
import { serializeProjectFile } from "../project/projectFile";
import type { VectorDocument } from "../vector/model";
import { exportDocumentToSvg } from "../vector/svg";

const sharePrefix = "#project=";
const shareLimit = 48_000;

export function fileSlug(title: string, fallback = "vectorforge") {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || fallback
  );
}

export function downloadText(filename: string, text: string, type: string) {
  downloadBlob(filename, new Blob([text], { type }));
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function copyTextToClipboard(text: string): Promise<Result<void>> {
  try {
    await navigator.clipboard.writeText(text);
    return ok(undefined);
  } catch (error) {
    return err(
      messageFromError(
        error,
        "Clipboard write failed. Select and copy manually.",
      ),
    );
  }
}

export async function renderDocumentToPng(
  document: VectorDocument,
): Promise<Result<Blob>> {
  try {
    const svg = exportDocumentToSvg(document);
    const svgBlob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();

    const canvas = window.document.createElement("canvas");
    canvas.width = document.width;
    canvas.height = document.height;
    const context = canvas.getContext("2d");
    if (!context) {
      URL.revokeObjectURL(url);
      return err("Canvas is unavailable in this browser.");
    }
    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
    return blob ? ok(blob) : err("PNG export failed.");
  } catch (error) {
    return err(messageFromError(error, "PNG export failed."));
  }
}

export function createProjectShareUrl(state: ProjectState): Result<string> {
  const json = serializeProjectFile(state);
  const encoded = base64UrlEncode(json);
  if (encoded.length > shareLimit) {
    return err(
      "This project is too large for a share URL. Export a project file instead.",
    );
  }
  return ok(
    `${window.location.origin}${window.location.pathname}${sharePrefix}${encoded}`,
  );
}

export function parseProjectShareHash(
  hash = window.location.hash,
): Result<string | null> {
  if (!hash.startsWith(sharePrefix)) {
    return ok(null);
  }
  try {
    return ok(base64UrlDecode(hash.slice(sharePrefix.length)));
  } catch {
    return err("The share URL could not be decoded.");
  }
}

export function projectFilename(document: VectorDocument) {
  return `${fileSlug(document.title)}.vectorforge.json`;
}

export function svgFilename(document: VectorDocument) {
  return `${fileSlug(document.title)}.svg`;
}

export function pngFilename(document: VectorDocument) {
  return `${fileSlug(document.title)}.png`;
}

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const padded = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
