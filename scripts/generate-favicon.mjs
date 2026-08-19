/**
 * Regenerates `app/favicon.ico` from `app/icon.svg`.
 *
 * Why a .ico exists at all when `app/icon.svg` already ships: Google's SERP
 * favicon has documented requirements the SVG alone did not meet.
 *
 *   - Google asks for a square favicon whose side is a multiple of 48px.
 *     `icon.svg` declared 32x32.
 *   - `/favicon.ico` returned 404, so the conventional root fallback Google
 *     checks when it cannot use the declared icon did not exist.
 *
 * Browsers still prefer the SVG (crisper, themeable); this file is the raster
 * fallback for crawlers. Keeping both means Next emits a <link> for each.
 *
 * The ICO wraps PNG payloads rather than BMP — supported by every current
 * browser and by Google's favicon crawler, and far smaller.
 *
 * Run after changing the logo:
 *   node scripts/generate-favicon.mjs
 */
import {Buffer} from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = path.join(process.cwd(), 'app', 'icon.svg')
const OUTPUT = path.join(process.cwd(), 'app', 'favicon.ico')

// 48 is the size Google wants; 16 and 32 keep browser tabs and bookmarks crisp.
const SIZES = [16, 32, 48]

const svg = await fs.readFile(SOURCE)

const images = await Promise.all(
  SIZES.map(async (size) => ({
    size,
    // density lifts the rasteriser above the SVG's declared box so the 48px
    // render is sampled from vector detail rather than upscaled from 32px.
    png: await sharp(svg, {density: 384}).resize(size, size).png({compressionLevel: 9}).toBuffer(),
  })),
)

const HEADER_BYTES = 6
const ENTRY_BYTES = 16

const header = Buffer.alloc(HEADER_BYTES)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // 1 = icon
header.writeUInt16LE(images.length, 4)

let offset = HEADER_BYTES + ENTRY_BYTES * images.length

const entries = images.map(({size, png}) => {
  const entry = Buffer.alloc(ENTRY_BYTES)
  entry.writeUInt8(size, 0) // width  (0 would mean 256)
  entry.writeUInt8(size, 1) // height
  entry.writeUInt8(0, 2) // palette size, 0 = no palette
  entry.writeUInt8(0, 3) // reserved
  entry.writeUInt16LE(1, 4) // colour planes
  entry.writeUInt16LE(32, 6) // bits per pixel
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(offset, 12)
  offset += png.length
  return entry
})

const ico = Buffer.concat([header, ...entries, ...images.map(({png}) => png)])
await fs.writeFile(OUTPUT, ico)

console.log(
  `Wrote ${path.relative(process.cwd(), OUTPUT)} — ${images.length} sizes (${SIZES.join(', ')}px), ${ico.length} bytes`,
)
