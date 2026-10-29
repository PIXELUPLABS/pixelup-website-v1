"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Same-size images stacked on top of each other, fading from one to the
 * next every `interval` ms. The first image stays in flow and sets the
 * height. With prefers-reduced-motion it rests on the first image.
 */
export function CrossfadeImages({
  srcs,
  alt,
  width,
  height,
  sizes,
  interval = 1500,
}: {
  srcs: string[];
  alt: string;
  width: number;
  height: number;
  sizes: string;
  interval?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % srcs.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [srcs.length, interval]);

  return (
    <div className="relative">
      {srcs.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          aria-hidden={i === 0 ? undefined : true}
          width={width}
          height={height}
          sizes={sizes}
          className={`h-auto w-full transition-opacity duration-700 ease-in-out ${
            i === 0 ? "" : "absolute inset-0"
          } ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
