"use client";

import { useEffect, useRef } from "react";
import type { MediaBox, MediaChart } from "@/lib/case-studies";
import { place } from "./mediaBox";

// The Figma timeline's curve and fixed steps, in seconds. Each element's start
// time comes from the data; these are the parts every column and bar shares.
const EASE_OUT = "cubic-bezier(0, 0, 0.58, 1)"; // motion.dev "easeOut"
const COLUMN = { open: 0.5, closedHeight: 307.909 / 707.909, fadeAfter: 0.2154, fade: 0.2846 };
const BAR = { fade: 0.25, drop: 0.3, dropBy: 10 };
const LABEL = { fadeAfter: 0.103, fade: 0.3, slide: 0.403, slideBy: 5 };

/**
 * One dashed bracket down a column edge: "[" on the left, "]" on the right.
 * Three strokes (the upright and two short corners), each a repeating
 * gradient so the dash pattern matches Figma's. Square caps lengthen each dash
 * by a stroke width and shorten each gap by the same.
 */
function Bracket({
  side,
  spec,
  columnWidth,
  imageWidth,
}: {
  side: "left" | "right";
  spec: NonNullable<MediaChart["brackets"]>;
  columnWidth: number;
  imageWidth: number;
}) {
  const u = (px: number) => `${(px / imageWidth) * 100}cqw`;
  const dashes = (direction: string) =>
    `repeating-linear-gradient(to ${direction}, ${spec.color} 0 ${u(spec.dash + spec.stroke)}, transparent ${u(spec.dash + spec.stroke)} ${u(spec.dash * 2)})`;
  // Corners run from the upright inwards.
  const corner = dashes(side === "left" ? "right" : "left");

  return (
    <div
      data-bracket
      className="absolute top-0 h-full"
      style={{ [side]: 0, width: `${(spec.width / columnWidth) * 100}%` }}
    >
      <div
        className="absolute inset-y-0"
        style={{ [side]: 0, width: u(spec.stroke), backgroundImage: dashes("bottom") }}
      />
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: u(spec.stroke), backgroundImage: corner }}
      />
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: u(spec.stroke), backgroundImage: corner }}
      />
    </div>
  );
}

/**
 * Draws `chart` over a slot image (`width` × `height` pixels) and replays its
 * Figma motion once, when half of it is in view. The finished chart is the
 * markup's resting state, so no-JS and prefers-reduced-motion show it whole;
 * otherwise each layer is held at its first keyframe until the reveal starts.
 */
export function ChartReveal({
  chart,
  width,
  height,
}: {
  chart: MediaChart;
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
    const add = (
      el: Element | null | undefined,
      keyframes: Keyframe[],
      at: number,
      duration: number,
    ) => {
      if (!el) return;
      animations.push(
        el.animate(keyframes, {
          delay: at * 1000,
          duration: duration * 1000,
          easing: EASE_OUT,
          fill: "backwards",
        }),
      );
    };

    chart.columns.forEach((column, index) => {
      const el = root.querySelector(`[data-column="${index}"]`);
      if (!el) return;
      const closed = (1 - COLUMN.closedHeight) * 100;
      add(el, [{ clipPath: `inset(0 0 ${closed}% 0)` }, { clipPath: "inset(0 0 0% 0)" }], column.at, COLUMN.open);
      add(el, [{ opacity: 0 }, { opacity: 1 }], column.at + COLUMN.fadeAfter, COLUMN.fade);
      // The brackets fill the column's height in Figma, so they stretch with
      // it: the bottom corner rides the opening edge.
      el.querySelectorAll("[data-bracket]").forEach((bracket) => {
        add(bracket, [{ height: `${COLUMN.closedHeight * 100}%` }, { height: "100%" }], column.at, COLUMN.open);
      });

      const label = el.querySelector("[data-label]");
      const slide = (LABEL.slideBy / column.label.box[2]) * 100;
      add(label, [{ translate: `-${slide}% 0` }, { translate: "0 0" }], column.label.at, LABEL.slide);
      add(label, [{ opacity: 0 }, { opacity: 1 }], column.label.at + LABEL.fadeAfter, LABEL.fade);

      const drop = (BAR.dropBy / column.bar.height) * 100;
      el.querySelectorAll("[data-bar]").forEach((bar, b) => {
        const at = column.bars[b]?.at ?? column.at;
        add(bar, [{ translate: `0 -${drop}%` }, { translate: "0 0" }], at, BAR.drop);
        add(bar, [{ opacity: 0 }, { opacity: 1 }], at, BAR.fade);
      });
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
  }, [chart]);

  const frame: MediaBox = [0, 0, width, height];

  return (
    // A container, so bracket strokes and dashes can be sized in cqw: 100cqw
    // is the slot image's full width.
    <div ref={ref} aria-hidden="true" className="@container pointer-events-none absolute inset-0">
      {chart.columns.map((column, index) => (
        <div
          key={index}
          data-column={index}
          className="absolute overflow-hidden"
          style={place(column.box, frame)}
        >
          {chart.brackets &&
            (["left", "right"] as const).map((side) => (
              <Bracket
                key={side}
                side={side}
                spec={chart.brackets!}
                columnWidth={column.box[2]}
                imageWidth={width}
              />
            ))}
          <img
            data-label
            src={column.label.src}
            alt=""
            className="absolute max-w-none"
            style={place(column.label.box, column.box)}
          />
          {column.bars.map((bar) => (
            <img
              key={bar.y}
              data-bar
              src={column.bar.src}
              alt=""
              className="absolute max-w-none"
              style={place(
                [column.bar.x, bar.y, column.bar.width, column.bar.height],
                column.box,
              )}
            />
          ))}
          <img
            src={column.caption.src}
            alt=""
            className="absolute max-w-none"
            style={place(column.caption.box, column.box)}
          />
        </div>
      ))}
    </div>
  );
}
