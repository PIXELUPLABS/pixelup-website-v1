"use client";

import { useEffect, useRef } from "react";

/**
 * A self-contained HTML animation (a page under /public) laid over its slot's
 * still. Like ScrollVideo, it plays from the start each time half of it is in
 * view and pauses when it leaves. This component tells the page when: an
 * observer inside the frame hears about the parent's scrolling late, so the
 * page waits for "play" / "pause" messages and asks for the current state
 * ("ready") once its first frame is drawn. The still carries the alt text, so
 * the frame is hidden from assistive tech and takes no pointer or focus.
 */
export function HtmlEmbed({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let visible = false;
    const send = () =>
      frame.contentWindow?.postMessage(
        { embed: visible ? "play" : "pause" },
        window.location.origin,
      );
    const onMessage = (event: MessageEvent) => {
      if (
        event.source === frame.contentWindow &&
        event.origin === window.location.origin &&
        event.data?.embed === "ready"
      ) {
        send();
      }
    };
    window.addEventListener("message", onMessage);
    // In view: half of the frame showing, or (for a frame taller than twice
    // the window, such as a stacked 4:5 poster in a short window) half the
    // window filled by it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const windowHeight = entry.rootBounds?.height ?? window.innerHeight;
        const next =
          entry.isIntersecting &&
          (entry.intersectionRatio >= 0.5 ||
            entry.intersectionRect.height >= windowHeight / 2);
        if (next === visible) return;
        visible = next;
        send();
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1] },
    );
    observer.observe(frame);
    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      aria-hidden="true"
      tabIndex={-1}
      loading="lazy"
      className="pointer-events-none absolute inset-0 h-full w-full border-0"
    />
  );
}
