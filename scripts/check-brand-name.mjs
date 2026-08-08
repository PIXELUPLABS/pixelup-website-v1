import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".sanity",
  "coverage",
  "dist",
  "node_modules",
]);
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mjs",
  ".mts",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);
const BRAND_PATTERN = /\bpixelups?\s+labs\b/giu;
const REQUIRED_NAME = "PIXELUP LABS";

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(entryPath)));
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
}

const violations = [];

for (const filePath of await collectTextFiles(ROOT)) {
  const content = await readFile(filePath, "utf8");
  for (const match of content.matchAll(BRAND_PATTERN)) {
    if (match[0] === REQUIRED_NAME) continue;

    const line = content.slice(0, match.index).split("\n").length;
    violations.push(`${path.relative(ROOT, filePath)}:${line}: ${match[0]}`);
  }
}

if (violations.length > 0) {
  console.error(`Brand-name check failed. Always write the brand as ${REQUIRED_NAME}:`);
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log(`Brand-name check passed: all readable mentions use ${REQUIRED_NAME}.`);
}
