import { err, ok, type Result } from "../../shared/result";
import { extractPalette } from "../palette/extractPalette";
import type { ProjectState } from "../project/projectFile";
import { isLikelyProjectFile, parseProjectFile } from "../project/projectFile";
import type { VectorDocument } from "../vector/model";
import { parseSvgDocument } from "../vector/svg";

export type ImportResult = {
  documents: VectorDocument[];
  palette: string[];
  project: ProjectState | null;
  messages: string[];
};

export function emptyImportResult(): ImportResult {
  return {
    documents: [],
    palette: [],
    project: null,
    messages: [],
  };
}

export async function importFiles(
  files: FileList | File[],
): Promise<ImportResult> {
  const result = emptyImportResult();
  for (const file of Array.from(files)) {
    const imported = await importFile(file);
    mergeImportResult(result, imported);
  }
  return result;
}

export async function importFile(file: File): Promise<Result<ImportResult>> {
  const extension = file.name.toLowerCase().split(".").pop() ?? "";
  const isImage =
    file.type.startsWith("image/") && file.type !== "image/svg+xml";

  if (isImage) {
    const palette = await extractPalette(file);
    return ok({
      ...emptyImportResult(),
      palette,
      messages: [`Extracted ${palette.length} colors from ${file.name}.`],
    });
  }

  const text = await file.text();
  return importText(text, file.name, extension);
}

export function importText(
  text: string,
  label = "pasted content",
  extension = "",
): Result<ImportResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return err(`No importable content found in ${label}.`);
  }

  if (
    extension === "json" ||
    extension === "vectorforge" ||
    isLikelyProjectFile(trimmed)
  ) {
    const project = parseProjectFile(trimmed);
    if (!project.ok) {
      return err(project.message);
    }
    return ok({
      ...emptyImportResult(),
      project: project.value,
      messages: [`Imported VectorForge project from ${label}.`],
    });
  }

  const svgText = extractSvgText(trimmed);
  if (extension === "svg" || svgText) {
    try {
      const document = parseSvgDocument(svgText ?? trimmed);
      return ok({
        ...emptyImportResult(),
        documents: [document],
        messages: [`Imported SVG from ${label}.`],
      });
    } catch (error) {
      return err(
        error instanceof Error ? error.message : `Could not import ${label}.`,
      );
    }
  }

  return err(
    `Unsupported input: ${label}. Use SVG, raster image, or .vectorforge.json.`,
  );
}

export function importClipboardText(text: string) {
  return importText(text, "clipboard");
}

export async function importClipboardItems(
  items: DataTransferItemList,
): Promise<ImportResult> {
  const result = emptyImportResult();
  for (const item of Array.from(items)) {
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (file) {
        mergeImportResult(result, await importFile(file));
      }
    } else if (
      item.kind === "string" &&
      (item.type === "text/plain" || item.type === "text/html")
    ) {
      const text = await new Promise<string>((resolve) =>
        item.getAsString(resolve),
      );
      mergeImportResult(result, importText(text, item.type));
    }
  }
  return result;
}

export async function readClipboard(): Promise<Result<ImportResult>> {
  if (!navigator.clipboard?.read) {
    return err(
      "Clipboard read is unavailable. Use paste or file import instead.",
    );
  }

  const result = emptyImportResult();
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      for (const type of item.types) {
        const blob = await item.getType(type);
        if (type.startsWith("image/") && type !== "image/svg+xml") {
          mergeImportResult(
            result,
            await importFile(new File([blob], "clipboard-image.png", { type })),
          );
        } else if (
          type === "image/svg+xml" ||
          type === "text/plain" ||
          type === "text/html"
        ) {
          mergeImportResult(
            result,
            importText(await blob.text(), `clipboard ${type}`),
          );
        }
      }
    }
    return ok(result);
  } catch {
    return err(
      "Clipboard permission was denied or no supported content was found.",
    );
  }
}

export function mergeImportResult(
  target: ImportResult,
  source: Result<ImportResult> | ImportResult,
) {
  if ("ok" in source) {
    if (!source.ok) {
      target.messages.push(source.message);
      return target;
    }
    return mergeImportResult(target, source.value);
  }

  target.documents.push(...source.documents);
  target.palette.push(...source.palette);
  target.messages.push(...source.messages);
  if (source.project) {
    target.project = source.project;
  }
  return target;
}

function extractSvgText(text: string) {
  const match = text.match(/<svg[\s\S]*<\/svg>/i);
  return match?.[0] ?? null;
}
