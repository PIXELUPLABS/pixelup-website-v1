/**
 * Regenerates the app icons from a square master image of the PIXELUP LABS
 * mark:
 *
 *   - `app/favicon.ico`   16, 32 and 48px, the root fallback browsers and
 *                         Google's favicon crawler request at `/favicon.ico`.
 *   - `app/icon.png`      192px, the main `<link rel="icon">`. Google wants a
 *                         square favicon whose side is a multiple of 48px, and
 *                         192 is also the Android home-screen size.
 *   - `app/apple-icon.png` 180px, the iOS home-screen icon.
 *
 * The master is a raster (not an SVG), so every size is downsampled from it.
 * It lives outside the repo because it is large. Pass its path when running:
 *   node scripts/generate-favicon.mjs "../Misc/logo.png"
 *
 * The ICO wraps PNG payloads rather than BMP. Every current browser and
 * Google's favicon crawler support that, and the file is far smaller.
 */
import {Buffer} from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const [sourceArg] = process.argv.slice(2)
if (!sourceArg) {
  console.error('Usage: node scripts/generate-favicon.mjs <square-source-image>')
  process.exit(1)
}

const SOURCE = path.resolve(sourceArg)
const APP_DIR = path.join(process.cwd(), 'app')

// 48 is the size Google wants; 16 and 32 keep browser tabs and bookmarks crisp.
const ICO_SIZES = [16, 32, 48]
const PNG_OUTPUTS = [
  {file: 'icon.png', size: 192},
  {file: 'apple-icon.png', size: 180},
]

const source = await fs.readFile(SOURCE)
const {width, height} = await sharp(source).metadata()
if (width !== height) {
  console.error(`Source must be square; got ${width}x${height}`)
  process.exit(1)
}

const render = (size) =>
  sharp(source).resize(size, size).ensureAlpha().png({compressionLevel: 9}).toBuffer()

for (const {file, size} of PNG_OUTPUTS) {
  // The master's grain makes truecolour PNGs ~55KB at 192px. Palette
  // quantisation at quality 100 is visually identical and ~4x smaller. The
  // ICO frames stay truecolour RGBA below, which is what ICO readers expect.
  const png = await sharp(source)
    .resize(size, size)
    .png({palette: true, quality: 100, compressionLevel: 9, effort: 10})
    .toBuffer()
  await fs.writeFile(path.join(APP_DIR, file), png)
  console.log(`Wrote app/${file} — ${size}px, ${png.length} bytes`)
}

const images = await Promise.all(ICO_SIZES.map(async (size) => ({size, png: await render(size)})))

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
await fs.writeFile(path.join(APP_DIR, 'favicon.ico'), ico)

console.log(`Wrote app/favicon.ico — ${images.length} sizes (${ICO_SIZES.join(', ')}px), ${ico.length} bytes`)
