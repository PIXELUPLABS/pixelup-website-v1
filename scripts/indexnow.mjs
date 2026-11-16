// Submits live www.pixeluplabs.com URLs to IndexNow (Bing and partners).
//
//   npm run indexnow                        site routes with <lastmod> in the last 2 days
//   npm run indexnow -- --days 7            widen that window
//   npm run indexnow -- --all               every sitemap URL, blog posts included (backfill)
//   npm run indexnow -- /call /blog/foo     specific paths or URLs
//   add --dry-run to print the list without submitting
//
// .github/workflows/indexnow.yml runs the default form after every production
// deploy. It reads the live sitemap, whose <lastmod> values come from
// lib/site-dates.ts, so a deploy that bumps a route's date submits that route
// and a CSS-only deploy submits nothing. Blog posts are left out of that
// window: app/api/revalidate already submitted them when they were published.
//
// The npm script passes --disable-warning=MODULE_TYPELESS_PACKAGE_JSON: Node
// loads lib/indexnow.ts as ESM fine, but warns because package.json has no
// "type" field.
import { INDEXNOW_KEY, INDEXNOW_KEY_URL, SITE_ORIGIN, submitToIndexNow } from "../lib/indexnow.ts";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const daysIndex = args.indexOf("--days");
const days = daysIndex === -1 ? 2 : Number(args[daysIndex + 1]);
// Skip the value after --days only when --days is given; with daysIndex -1 the
// old `i !== daysIndex + 1` check dropped the first path.
const explicit = args.filter((arg, i) => !arg.startsWith("--") && (daysIndex === -1 || i !== daysIndex + 1));

const fail = (message, ...hints) => {
  console.error(`✗ ${message}`);
  hints.forEach((hint) => console.error(`  ${hint}`));
  process.exit(1);
};

if (!Number.isFinite(days) || days <= 0) fail(`--days needs a positive number`);

async function sitemapUrls() {
  const response = await fetch(`${SITE_ORIGIN}/sitemap.xml`, { cache: "no-store" });
  if (!response.ok) fail(`Sitemap returned ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => ({
    url: entry.match(/<loc>(.*?)<\/loc>/)?.[1],
    lastmod: entry.match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
  }));
}

let urls;
if (explicit.length) {
  urls = explicit;
} else {
  const entries = await sitemapUrls();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const isBlogPost = (url) => new URL(url).pathname.startsWith("/blog/");
  urls = entries
    .filter((entry) => entry.url)
    .filter((entry) => all || (!isBlogPost(entry.url) && Date.parse(entry.lastmod) >= cutoff))
    .map((entry) => entry.url);
}

if (!urls.length) {
  console.log(`Nothing to submit: no site route has a <lastmod> in the last ${days} days.`);
  process.exit(0);
}

console.log(`${dryRun ? "Would submit" : "Submitting"} ${urls.length} URL(s):`);
urls.forEach((url) => console.log(`  ${new URL(url, SITE_ORIGIN).href}`));
if (dryRun) process.exit(0);

// Engines reject every submission if the live key file is missing or wrong,
// so check it first and fail with a clear message instead of a bare 403.
const keyResponse = await fetch(INDEXNOW_KEY_URL, { cache: "no-store" });
const liveKey = keyResponse.ok ? (await keyResponse.text()).trim() : null;
if (liveKey !== INDEXNOW_KEY) {
  fail(
    `Key file ${INDEXNOW_KEY_URL} ${keyResponse.ok ? "doesn't match lib/indexnow.ts" : `returned ${keyResponse.status}`}`,
    "Deploy public/<key>.txt before submitting.",
  );
}

const result = await submitToIndexNow(urls);
if (!result.ok) fail(`IndexNow ${result.status}: ${result.meaning}`);
console.log(`✓ IndexNow ${result.status}: ${result.meaning}`);
