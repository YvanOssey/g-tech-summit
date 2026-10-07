import "server-only";

export interface ImageInfo {
  type: "image/png" | "image/jpeg" | "image/webp";
  ext: "png" | "jpg" | "webp";
  width: number;
  height: number;
}

/**
 * Identifies a PNG, JPEG or WebP from its bytes (never from the file name or
 * the browser's claim) and reads its size. Anything else — SVG included —
 * returns null.
 */
export function readImageInfo(bytes: Uint8Array): ImageInfo | null {
  const b = bytes;
  const u16be = (i: number) => (b[i] << 8) | b[i + 1];
  const u32be = (i: number) => ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
  const ascii = (i: number, n: number) => String.fromCharCode(...b.subarray(i, i + n));

  // PNG: signature, then IHDR width/height.
  if (b.length > 24 && b[0] === 0x89 && ascii(1, 3) === "PNG") {
    return { type: "image/png", ext: "png", width: u32be(16), height: u32be(20) };
  }

  // JPEG: walk the segments up to a Start Of Frame marker.
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { type: "image/jpeg", ext: "jpg", width: u16be(i + 7), height: u16be(i + 5) };
      }
      i += 2 + u16be(i + 2);
    }
    return null;
  }

  // WebP: RIFF container, lossy / lossless / extended.
  if (b.length > 30 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    const chunk = ascii(12, 4);
    if (chunk === "VP8 ") {
      return { type: "image/webp", ext: "webp", width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff };
    }
    if (chunk === "VP8L") {
      const [b1, b2, b3, b4] = [b[21], b[22], b[23], b[24]];
      return {
        type: "image/webp",
        ext: "webp",
        width: 1 + (((b2 & 0x3f) << 8) | b1),
        height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)),
      };
    }
    if (chunk === "VP8X") {
      return {
        type: "image/webp",
        ext: "webp",
        width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
        height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
      };
    }
  }

  return null;
}
