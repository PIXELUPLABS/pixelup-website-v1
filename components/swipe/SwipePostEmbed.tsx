"use client";

import { useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";
import { ArrowIcon } from "@/components/ArrowIcon";
import type { SwipeCreator } from "@/lib/swipe/creators";
import { embedFor } from "@/lib/swipe/embeds";
import { compactNumber, platformLabel } from "@/lib/swipe/format";
import type { SwipePlatform, SwipePost } from "@/lib/swipe/posts";
import { PlatformIcon } from "./SwipeGlyphs";

type TwitterWidgets = {
  createTweet: (
    id: string,
    target: HTMLElement,
    options?: Record<string, unknown>,
  ) => Promise<HTMLElement | undefined>;
};

type TwttrGlobal = {
  widgets?: TwitterWidgets;
  ready?: (callback: (twttr: { widgets: TwitterWidgets }) => void) => void;
};

/** widgets.js hasn't loaded by then: treat X as blocked for this session. */
const SCRIPT_TIMEOUT_MS = 6_000;
/** A post that hasn't rendered by then shows the fallback (and still swaps in
    if it arrives later while the viewer is open). */
const RENDER_TIMEOUT_MS = 8_000;
/** LinkedIn never reports its embed height, so the frame is fixed and the
    well around it scrolls. */
const LINKEDIN_FRAME_HEIGHT = 600;

let widgetsPromise: Promise<TwitterWidgets> | null = null;
/** "error": the script failed outright (blocker), never retried.
    "stalled": slow so far; cleared if it does load. */
let xBlocked: "error" | "stalled" | null = null;
const warmed = new Set<SwipePlatform>();

/** Injects widgets.js once per session, on first intent, never on page load. */
function loadXWidgets(): Promise<TwitterWidgets> {
  if (widgetsPromise) return widgetsPromise;

  widgetsPromise = new Promise<TwitterWidgets>((resolve, reject) => {
    const global = window as unknown as { twttr?: TwttrGlobal };
    if (global.twttr?.widgets?.createTweet) {
      resolve(global.twttr.widgets);
      return;
    }
    const stall = window.setTimeout(() => {
      if (!xBlocked) xBlocked = "stalled";
    }, SCRIPT_TIMEOUT_MS);
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.onload = () => {
      window.clearTimeout(stall);
      const settle = (widgets: TwitterWidgets) => {
        if (xBlocked === "stalled") xBlocked = null;
        resolve(widgets);
      };
      const twttr = global.twttr;
      if (twttr?.widgets?.createTweet) settle(twttr.widgets);
      else if (twttr?.ready) twttr.ready((loaded) => settle(loaded.widgets));
      else {
        xBlocked = "error";
        reject(new Error("widgets.js loaded without twttr"));
      }
    };
    script.onerror = () => {
      window.clearTimeout(stall);
      xBlocked = "error";
      reject(new Error("widgets.js blocked"));
    };
    document.head.appendChild(script);
  });
  // Keep the promise: a blocked script stays blocked for the session, and a
  // stalled one can still resolve and swap its posts in.
  widgetsPromise.catch(() => {});
  return widgetsPromise;
}

/**
 * Called on mouse hover or keyboard focus of a card, and at the latest when
 * the viewer opens: preconnects to the platform and, for X, starts loading
 * widgets.js so the post is usually ready by the time the viewer is.
 * Never on touch, so scrolling a phone triggers nothing.
 */
export function warmEmbed(platform: SwipePlatform) {
  if (warmed.has(platform)) return;
  warmed.add(platform);
  if (platform === "x") {
    preconnect("https://platform.twitter.com");
    preconnect("https://cdn.syndication.twimg.com");
    preconnect("https://pbs.twimg.com");
    void loadXWidgets().catch(() => {});
  } else {
    preconnect("https://www.linkedin.com");
    preconnect("https://static.licdn.com");
  }
}

type EmbedState = "loading" | "ready" | "failed" | "unavailable";

function Placeholder({ platform }: { platform: SwipePlatform }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 pt-16">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-hairline text-white/60">
        <PlatformIcon platform={platform} size={14} />
      </span>
      <p className="font-mono text-[12px] uppercase leading-none tracking-[0.04em] text-label-grey">
        Loading the post from {platformLabel[platform]}
      </p>
    </div>
  );
}

function Fallback({ post, reason }: { post: SwipePost; reason: string }) {
  const platform = platformLabel[post.platform];
  return (
    <div className="flex flex-col items-center gap-4 px-6 pt-16 text-center">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-hairline text-white/60">
        <PlatformIcon platform={post.platform} size={14} />
      </span>
      <p className="max-w-[40ch] text-pretty text-[14px] leading-[1.45] text-white/60">{reason}</p>
      <p className="font-mono text-[12px] uppercase leading-none tracking-[0.04em] text-label-grey">
        {compactNumber(post.likes)} likes · {compactNumber(post.comments)} comments ·{" "}
        {compactNumber(post.reposts)} reposts when picked
      </p>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-button text-[12px] font-semibold uppercase tracking-[-0.02em] text-white hover:text-white/70"
      >
        Open on {platform}
        <ArrowIcon />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}

function reasonFor(post: SwipePost, state: "failed" | "unavailable" | "not-embeddable") {
  const platform = platformLabel[post.platform];
  if (state === "not-embeddable") {
    return `${platform} won't show this post on other sites. It's still live on ${platform}.`;
  }
  if (state === "unavailable") {
    return `${platform} won't show this post on other sites right now. It may still be live on ${platform}.`;
  }
  return `This post didn't load here. Content blockers often stop embeds from ${platform}.`;
}

/**
 * The real post, rendered by the platform's official embed. Nothing of the
 * creator's is stored in this repo: X and LinkedIn serve it at view time.
 *
 * - X: widgets.js createTweet, dark theme, Do Not Track on, no parent tweet.
 *   It sizes itself (up to X's 550px).
 * - LinkedIn: the official embed iframe at LinkedIn's 504px width on the black
 *   well. LinkedIn only ships a light theme and never reports its height.
 * - Blocked, removed or slow posts fall back to a link to the original.
 *
 * Render with key={post.id}: each post gets a fresh state machine.
 */
export function SwipePostEmbed({ post, creator }: { post: SwipePost; creator: SwipeCreator }) {
  const embed = embedFor(post);
  const targetRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<EmbedState>("loading");

  useEffect(() => {
    const current = embedFor(post);
    if (!current) return;
    // Per-run guard: callbacks from a cleaned-up run (StrictMode, unmount)
    // must never set state.
    let active = true;
    const alive = () => active;

    const timeout = window.setTimeout(() => {
      if (alive()) setState((s) => (s === "loading" ? "failed" : s));
    }, RENDER_TIMEOUT_MS);

    if (current.kind === "x") {
      // Each run renders into its own host node. createTweet is async, so a
      // run that was cleaned up (StrictMode, a fast prev/next) can still
      // insert its iframe later; removing the host on cleanup means that late
      // insert lands in a detached node and never shows.
      const host = document.createElement("div");
      // Full width: as an empty flex item it would shrink to 0px, and X sizes
      // the tweet to 100% of its container, so it would never render.
      host.style.width = "100%";
      targetRef.current?.appendChild(host);
      if (xBlocked === "error") {
        // Known blocked this session: skip straight to the fallback.
        window.setTimeout(() => alive() && setState("failed"), 0);
      } else {
        loadXWidgets()
          .then((widgets) =>
            widgets.createTweet(current.tweetId, host, {
              theme: "dark",
              dnt: true,
              conversation: "none",
              align: "center",
            }),
          )
          // A late render still swaps in over the fallback.
          .then((element) => alive() && setState(element ? "ready" : "unavailable"))
          .catch(() => alive() && setState("failed"));
      }
      return () => {
        active = false;
        window.clearTimeout(timeout);
        host.remove();
      };
    }

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [post]);

  if (!embed) return <Fallback post={post} reason={reasonFor(post, "not-embeddable")} />;

  const showFallback = state === "failed" || state === "unavailable";

  if (embed.kind === "linkedin") {
    return (
      <div className="relative">
        {state === "loading" && <Placeholder platform="linkedin" />}
        {showFallback && <Fallback post={post} reason={reasonFor(post, "failed")} />}
        {/* Stays mounted in every state: a slow frame that loads after the
            timeout still swaps in over the fallback. */}
        <iframe
          src={embed.src}
          title={`LinkedIn post by ${creator.name}`}
          onLoad={() => setState("ready")}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ height: LINKEDIN_FRAME_HEIGHT }}
          className={`mx-auto block w-full max-w-[504px] bg-white ${
            state === "ready" ? "fade-up [animation-duration:0.25s]" : "invisible absolute inset-x-0 top-0"
          }`}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {state === "loading" && <Placeholder platform="x" />}
      {showFallback && <Fallback post={post} reason={reasonFor(post, state === "unavailable" ? "unavailable" : "failed")} />}
      {/* createTweet renders into this node, which is always mounted and never
          display:none (widgets.js measures its width). Hidden until ready. */}
      <div
        ref={targetRef}
        className={`flex w-full justify-center [&_.twitter-tweet]:!my-0 ${
          state === "ready" ? "relative fade-up [animation-duration:0.25s]" : "pointer-events-none invisible absolute inset-x-0 top-0"
        }`}
      />
    </div>
  );
}
