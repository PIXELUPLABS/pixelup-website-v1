/**
 * IndexNow: tells Bing that a URL was added, changed or removed, so it gets
 * recrawled within minutes instead of on Bing's own schedule. Submissions to
 * api.indexnow.org are shared with the other IndexNow engines (Yandex,
 * Seznam, Naver, Yep). Google does not use IndexNow.
 *
 * The key is public by design: engines verify a submission by fetching
 * https://www.pixeluplabs.com/<key>.txt (public/<key>.txt). To rotate it,
 * rename that file and change this constant in the same commit.
 *
 * Callers:
 * - app/api/revalidate/route.ts — blog posts, on every Sanity publish.
 * - scripts/indexnow.mjs — site routes, after every production deploy
 *   (.github/workflows/indexnow.yml), and manual runs.
 *
 * Plain erasable TypeScript with no imports, so scripts/indexnow.mjs can load
 * it directly with Node's built-in type stripping.
 */
export const INDEXNOW_KEY = "3369a38fd1c724ea855da126532d3d47";

// Must match metadataBase in app/layout.tsx — www, not the apex, which redirects.
export const SITE_ORIGIN = "https://www.pixeluplabs.com";

export const INDEXNOW_KEY_URL = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

const ENDPOINT = "https://api.indexnow.org/indexnow";

/** What each IndexNow response code means, per indexnow.org/documentation. */
export const INDEXNOW_STATUS: Record<number, string> = {
  200: "OK, URLs received",
  202: "Accepted, key validation pending",
  400: "Bad request",
  403: "Key not valid (key file missing or wrong)",
  422: "URLs don't belong to the host, or the key doesn't match",
  429: "Too many requests (submitting too often)",
};

export type IndexNowResult = {
  status: number;
  ok: boolean;
  meaning: string;
  urls: string[];
};

/**
 * Submits paths ("/blog/foo") or absolute www.pixeluplabs.com URLs in one
 * request. Throws on a network error or a URL on another host; a rejected
 * submission comes back with `ok: false` instead.
 */
export async function submitToIndexNow(paths: string[]): Promise<IndexNowResult> {
  const urls = [...new Set(paths.map((path) => new URL(path, SITE_ORIGIN).href))];
  const foreign = urls.filter((url) => new URL(url).origin !== SITE_ORIGIN);
  if (foreign.length) {
    throw new Error(`Not on ${SITE_ORIGIN}: ${foreign.join(", ")}`);
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_ORIGIN).host,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_URL,
      urlList: urls,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  return {
    status: response.status,
    ok: response.status === 200 || response.status === 202,
    meaning: INDEXNOW_STATUS[response.status] ?? "Unexpected response",
    urls,
  };
}
