"use client";

import { useEffect, useRef } from "react";
import type { ProjectMedia } from "@/lib/projects";

const typeOf = (src: string) =>
  src.endsWith(".webm") ? "video/webm" : "video/mp4";

/**
 * A muted, silent video that plays once from the start every time it scrolls
 * into view and pauses when it leaves, so readers always see it from the
 * beginning. No loop. With prefers-reduced-motion it never plays and rests on
 * its last frame (the finished design) instead of the poster.
 */
export function ScrollVideo({
  media,
  label,
  className,
  width,
  height,
}: {
  media: Extract<ProjectMedia, { type: "video" }>;
  label?: string;
  className: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const rest = () => {
        video.currentTime = Math.max(0, video.duration - 0.05);
      };
      if (video.readyState >= 1) rest();
      else video.addEventListener("loadedmetadata", rest, { once: true });
      return () => video.removeEventListener("loadedmetadata", rest);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={media.poster}
      width={width}
      height={height}
      aria-label={label}
      muted
      playsInline
      preload="auto"
    >
      <source src={media.src} type={typeOf(media.src)} />
      {media.fallbackSrc && (
        <source src={media.fallbackSrc} type={typeOf(media.fallbackSrc)} />
      )}
    </video>
  );
}
