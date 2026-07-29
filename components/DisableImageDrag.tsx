"use client";

import { useEffect } from "react";

/** Blocks the native drag-to-save ghost on every image/SVG, site-wide.
    globals.css's `-webkit-user-drag: none` covers Chrome/Safari/Edge;
    Firefox only respects the draggable HTML attribute or a dragstart
    listener, which is what this adds, once, for the whole document. */
export function DisableImageDrag() {
  useEffect(() => {
    const onDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || target.tagName === "SVG") {
        e.preventDefault();
      }
    };
    document.addEventListener("dragstart", onDragStart);
    return () => document.removeEventListener("dragstart", onDragStart);
  }, []);

  return null;
}
