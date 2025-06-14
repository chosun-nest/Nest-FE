export async function getCroppedImage(
  imageSrc: string,
  crop: { width: number; height: number; x: number; y: number }
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("2D context not available");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  const mimeType = getMimeTypeFromSrc(imageSrc); // jpg/png 등 판별
  const fileExtension = mimeType.split("/")[1]; // png, jpeg 등

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Blob 생성 실패"));
          return;
        }

        const file = new File([blob], `cropped.${fileExtension}`, {
          type: mimeType,
        });
        resolve(file);
      },
      mimeType,
      1 // quality (1 = 100%)
    );
  });
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지 로딩 실패"));
  });
}

function getMimeTypeFromSrc(src: string): string {
  if (src.startsWith("data:image/")) {
    // Base64 data URI에서 MIME 추출
    const match = src.match(/^data:(image\/[a-zA-Z]+);/);
    return match?.[1] ?? "image/png";
  }

  if (src.endsWith(".jpg") || src.endsWith(".jpeg")) return "image/jpeg";
  if (src.endsWith(".webp")) return "image/webp";
  if (src.endsWith(".bmp")) return "image/bmp";
  return "image/png"; // default fallback
}
