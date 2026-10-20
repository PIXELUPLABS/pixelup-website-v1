import type { CSSProperties } from "react";
import type { MediaBox } from "@/lib/case-studies";

/** Positions `box` inside `frame` in percentages, so a layer scales with its image. */
export function place(
  [x, y, w, h]: MediaBox,
  [fx, fy, fw, fh]: MediaBox,
): CSSProperties {
  return {
    left: `${((x - fx) / fw) * 100}%`,
    top: `${((y - fy) / fh) * 100}%`,
    width: `${(w / fw) * 100}%`,
    height: `${(h / fh) * 100}%`,
  };
}
