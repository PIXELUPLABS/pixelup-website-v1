"use client";

import { useEffect, useRef } from "react";
import type { MediaBox, MediaLayers } from "@/lib/case-studies";
import { place } from "./mediaBox";

// A fast-out, long-settle curve (close to easeOutExpo), so layers arrive
// quickly and ease into place.
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Share of the move the fade takes, so layers are solid well before they land. */
const FADE_SHARE = 0.4;

/**
 * Draws `layers` over a slot image (`width` × `height` pixels) and slides the
 * moving ones into place once, when half of the image is in view. The settled
 * picture is the markup's resting state, so no-JS and prefers-reduced-motion
 * show it whole; otherwise each moving layer waits at its starting offset.
 */
export function LayerReveal({
  layers,
  width,
  height,
}: {
  layers: MediaLayers;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const animations: Animation[] = [];
    root.querySelectorAll("[data-moving]").forEach((el, index) => {
      const layer = layers.moving[index];
      if (!layer) return;
      const [, , w, h] = layer.box;
      const dx = (layers.from.x / w) * 100;
      const dy = ((layers.from.y ?? 0) / h) * 100;
      const timing = { delay: layer.at * 1000, easing: EASE_OUT, fill: "backwards" as const };
      animations.push(
        el.animate([{ translate: `${dx}% ${dy}%` }, { translate: "0 0" }], {
          ...timing,
          duration: layers.duration * 1000,
        }),
        el.animate([{ opacity: 0 }, { opacity: 1 }], {
          ...timing,
          duration: layers.duration * FADE_SHARE * 1000,
        }),
      );
    });

    animations.forEach((animation) => animation.pause());
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animations.forEach((animation) => animation.play());
      },
      { threshold: 0.5 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [layers]);

  const frame: MediaBox = [0, 0, width, height];

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute overflow-hidden" style={place(layers.clip, frame)}>
        {layers.moving.map((layer, index) => (
          <img
            key={layer.src}
            data-moving={index}
            src={layer.src}
            alt=""
            className="absolute max-w-none"
            style={place(layer.box, layers.clip)}
          />
        ))}
        {layers.overlay && (
          <img
            src={layers.overlay.src}
            alt=""
            className="absolute max-w-none"
            style={{
              ...place(layers.overlay.box, layers.clip),
              mixBlendMode: layers.overlay.blend,
            }}
          />
        )}
      </div>
      {layers.front && (
        <img
          src={layers.front.src}
          alt=""
          className="absolute max-w-none"
          style={place(layers.front.box, frame)}
        />
      )}
    </div>
  );
}
