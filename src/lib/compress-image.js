const canvasToBlob = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not process this image. Please use a JPG or PNG."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });

export async function compressImage(
  file,
  {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    maxBytes = 1.5 * 1024 * 1024,
  } = {}
) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Please select an image file (JPG, PNG, or WEBP).");
  }

  const alreadySmallJpeg =
    file.type === "image/jpeg" && file.size <= maxBytes;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      "This image format is not supported in the browser. Please upload a JPG or PNG."
    );
  }

  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);

  if (alreadySmallJpeg && scale === 1) {
    bitmap.close?.();
    return file;
  }

  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  let currentQuality = quality;
  let blob = await canvasToBlob(canvas, currentQuality);
  while (blob.size > maxBytes && currentQuality > 0.5) {
    currentQuality = Math.max(0.5, currentQuality - 0.08);
    blob = await canvasToBlob(canvas, currentQuality);
  }

  const fileName = file.name.replace(/\.[^.]+$/, "") || "jewellery-image";
  return new File([blob], `${fileName}.jpg`, { type: "image/jpeg" });
}
