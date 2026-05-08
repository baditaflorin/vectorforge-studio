export async function extractPalette(file: File) {
  const image = await fileToImage(file);
  const { getPaletteSync } = await import("colorthief");
  const colors = getPaletteSync(image, {
    colorCount: 7,
    colorSpace: "oklch",
    quality: 6,
  });

  URL.revokeObjectURL(image.src);
  return (colors ?? []).map((color) => color.hex());
}

function fileToImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Could not read the selected image."));
    image.src = URL.createObjectURL(file);
  });
}
