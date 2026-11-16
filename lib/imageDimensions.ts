import { readFileSync } from "node:fs";
import path from "node:path";

export type ImageDimensions = { width: number; height: number };

// Reads intrinsic width/height straight from a PNG or WebP header in /public,
// so pages can reserve each image's exact space without a dependency. Runs at
// build time only (server components). Returns null for unknown formats.
export function readPublicImageDimensions(src: string): ImageDimensions | null {
  let buf: Buffer;
  try {
    buf = readFileSync(path.join(process.cwd(), "public", src));
  } catch {
    return null;
  }

  // PNG: IHDR width/height are big-endian at bytes 16 and 20.
  if (buf.length >= 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  if (buf.length >= 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    }
    if (chunk === "VP8 ") {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }

  return null;
}
