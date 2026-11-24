import type { NextFetchEvent, NextRequest } from "next/server";

// Our own record of AI traffic, kept in the PIXELUP LABS Search Dashboard (its
// AI traffic page), so the data stays ours whatever analytics tool we use.
// It logs two things:
//   - bots: any request whose user agent names a bot, crawler or AI fetcher
//     (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Googlebot…). The
//     dashboard keeps the AI and search crawlers it knows and drops the rest.
//   - visits: a full page load that came from an AI assistant, by referrer or
//     utm_source (ChatGPT tags its links with utm_source=chatgpt.com).
//
// Switched off until BOT_LOG_SECRET is set on this Vercel project (same value
// as on the dashboard's). The post runs in the background via waitUntil and
// every error is swallowed, so it can never slow down or break a page.

const ENDPOINT = "https://pixelup-search-dashboard-olive.vercel.app/api/ingest/hits";

// Names a bot, a crawler or an AI fetcher ("ChatGPT-User/1.0", "Claude-User",
// "meta-externalfetcher"). Normal browsers match none of these.
const BOT_UA = /bot\b|bot\/|crawl|spider|-User\/|externalagent|externalfetcher|anthropic|Claude|Gemini|Google-|GoogleOther|Diffbot|cohere-ai/i;

const AI_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "gemini.google.com",
  "bard.google.com",
  "claude.ai",
  "copilot.microsoft.com",
  "copilot.cloud.microsoft",
  "copilot.com",
  "deepseek.com",
  "grok.com",
  "meta.ai",
  "chat.mistral.ai",
  "you.com",
  "phind.com",
];
const AI_UTM = /^(chatgpt(\.com)?|openai|perplexity(\.ai)?|gemini(\.google\.com)?|claude(\.ai)?|copilot(\.com)?|deepseek|grok(\.com)?|meta\.ai|mistral|chat\.mistral\.ai|you\.com|phind)$/i;

// Images, fonts, scripts and media aren't pages; crawler files (robots.txt,
// llms.txt, sitemaps, .md) are kept on purpose.
const ASSET = /\.(png|jpe?g|gif|webp|avif|svg|ico|css|js|mjs|map|json|woff2?|ttf|otf|eot|mp4|webm|mov|mp3|wav|pdf|zip)$/i;

function fromAiHost(referrer: string): boolean {
  if (!referrer) return false;
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    return AI_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function logAiTraffic(request: NextRequest, event: NextFetchEvent): void {
  try {
    const secret = process.env.BOT_LOG_SECRET;
    if (!secret) return;
    if (request.method !== "GET" && request.method !== "HEAD") return;
    const url = request.nextUrl;
    if (ASSET.test(url.pathname)) return;

    const headers = request.headers;
    const ua = headers.get("user-agent") ?? "";
    const referrer = headers.get("referer") ?? "";
    let kind: "bot" | "visit" | null = null;
    if (BOT_UA.test(ua)) {
      kind = "bot";
    } else {
      // Only full page loads: not prefetches or client-side navigations.
      const prefetch =
        headers.has("rsc") ||
        headers.has("next-router-prefetch") ||
        headers.get("purpose") === "prefetch" ||
        (headers.get("sec-purpose") ?? "").includes("prefetch");
      if (prefetch) return;
      if (fromAiHost(referrer) || AI_UTM.test(url.searchParams.get("utm_source") ?? "")) kind = "visit";
    }
    if (!kind) return;

    const ip = (headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || headers.get("x-real-ip") || "";
    const body = JSON.stringify({
      kind,
      host: url.hostname,
      path: url.pathname,
      query: kind === "visit" ? url.search : "",
      ua: ua.slice(0, 1000),
      referrer: kind === "visit" ? referrer.slice(0, 2000) : "",
      ip,
      country: headers.get("x-vercel-ip-country") ?? "",
    });
    event.waitUntil(
      fetch(ENDPOINT, {
        method: "POST",
        headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
        body,
        signal: AbortSignal.timeout(5000),
      }).then(
        () => undefined,
        () => undefined,
      ),
    );
  } catch {
    // Logging must never affect the response.
  }
}
