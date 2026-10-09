"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ExplorationImageData = { src: string; width: number; height: number };

/* ------------------------------------------------------------------------ */
/* Infinite canvas                                                           */
/* ------------------------------------------------------------------------ */

// Motion tuning, ported from the "Infinite Canvas" component on the reference
// site (scrollSpeed 0.4, dragSpeed 0.5, snappy 0.2, parallax general 1). The
// reference tunes these per 60fps frame; we scale them by real frame time so
// the feel is identical on 120Hz screens.
const WHEEL_SPEED = 0.73;
const DRAG_SPEED = 0.94;
const PAN_EASE = 0.048; // how fast the canvas catches up to its target
const SOFT_EASE = 0.04; // velocity + pointer smoothing (the trailing "lag")
const VELOCITY_LAG = 5; // how far fast-moving cards trail behind
const POINTER_PARALLAX = 0.6; // fraction of a card's size it drifts with the pointer
const DRAG_CLICK_THRESHOLD = 6; // px — movement past this is a drag, not a click

// Effect 2: an old CRT tube. The board bulges like curved glass (barrel
// distortion): cards are pinched toward the middle and shrink as they near the
// screen edges, and the screen gets a vignette and rounded corners.
const CRT_BARREL = 0.16; // how hard positions are pulled in toward the centre
const CRT_SCALE = 0.38; // how much smaller a card is at the screen corner
const CRT_EASE = 0.07; // how fast the board morphs between effects

// Effect 3: a ribbon of images on the rim of a giant wheel that turns toward
// you. Scrolling spins the wheel: images rise small and far off from the
// bottom left, sweep up large through the middle of the screen, and recede
// to the top left.
const STREAM_MIN_SLOTS = 40; // images on the rim (the list repeats to fill it)
const STREAM_WHEEL_SPEED = 0.0011; // radians per px of wheel
const STREAM_DRAG_SPEED = 0.004; // radians per px dragged
const STREAM_EASE = 0.06; // how fast the wheel catches up to its target
const STREAM_LAG = 4; // how far fast-moving cards trail behind
const STREAM_RADIUS = 0.95; // wheel radius, as a fraction of the screen height
const STREAM_SWING = 0.32; // how far the ends of the ribbon bend left, × screen width
const STREAM_SPREAD = 0.9; // sideways scatter of the ribbon, × card width

// Effect 4: a fly-through. Rounded cards float at every depth in front of the
// camera; scrolling moves the camera forward, so far-off cards grow, rush
// past the screen edges, and new ones fade in from the distance.
const FIELD_PERSPECTIVE = 800; // px — must match the container's perspective-midrange
const FIELD_NEAR = FIELD_PERSPECTIVE * 0.6; // closest z before a card wraps to the back
const FIELD_MIN_SLOTS = 36; // cards in the field (the list repeats to fill it)
const FIELD_SPACING = 140; // px of depth between consecutive cards
const FIELD_WHEEL_SPEED = 2.2; // px of depth per px of wheel
const FIELD_DRAG_SPEED = 5; // px of depth per px dragged
const FIELD_EASE = 0.06; // how fast the camera catches up to its target
const FIELD_TILT = 10; // max deg each card is turned off-axis
const FIELD_POINTER_SHIFT = 0.06; // camera drift with the pointer, × screen size
// Depth of field: cards are sharp near the camera and soften with distance.
const FIELD_FOCUS_DEPTH = FIELD_SPACING * 3; // px behind the true-size plane that stays sharp
const FIELD_BLUR = 3; // px of on-screen blur on the farthest cards
// Motion blur: each card stretches along the direction it's moving on screen
// and softens with speed. Both are GPU-only (a transform and a CSS blur), so
// nothing is repainted per frame.
const FIELD_STRETCH = 0.006; // stretch per px/frame of card speed
const FIELD_STRETCH_MAX = 0.14; // cap — 14% longer along the direction of travel
const FIELD_MOTION_BLUR = 0.25; // on-screen blur per px/frame of card speed
const FIELD_MOTION_BLUR_MAX = 6; // px — cap, so a hard flick doesn't smear cards away
const FIELD_MOTION_EASE = 0.3; // how quickly the streak follows speed changes
const FIELD_BLUR_STEP = 1.2; // blur changes in 20% steps, so filters update rarely

// Effect 5: a fisheye lens. The same endless board as Effect 1, drawn in
// WebGL and wrapped onto a sphere: cards bend into curves, are magnified in
// the middle, squeezed and shaded toward the rim, and nothing shows past it.
const LENS_RADIUS = 0.82; // sphere rim, as a fraction of half the screen diagonal
const LENS_ZOOM = 1.35; // magnification at the centre of the lens
const LENS_SHADE = 0.45; // how much darker cards get at the rim
const LENS_GRID = 24; // mesh subdivisions per card side — more = smoother curves
const LENS_TEXTURE_WIDTH = 640; // px width requested from the image optimizer

export type CanvasEffect = "flat" | "crt" | "stream" | "field" | "lens";

/** The page opens on the CRT board. */
const DEFAULT_EFFECT: CanvasEffect = "crt";

/** Effect switches shown next to the hint. The flat, stream and lens effects
    are still built in but hidden — add them back here to show them again. */
const EFFECT_OPTIONS: readonly (readonly [CanvasEffect, string])[] = [["field", "Effect 2"]];

type CardLayout = {
  /** Which image this card shows (the board may repeat a few to fill up). */
  image: number;
  x: number;
  y: number;
  width: number;
  height: number;
  /** 0.5–1: per-card weight for the velocity lag, so cards move at slightly
      different speeds and the canvas feels layered rather than rigid. */
  depth: number;
  /** Stacking order (1–9), taken from the reference slot. */
  z: number;
};

type CanvasLayout = { tileWidth: number; tileHeight: number; cards: CardLayout[] };

/** Small seeded PRNG so the scatter is stable between renders and resizes. */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The reference board's exact pattern: 9 cards per screen-sized block, each
    centred at a fixed % of the block, at a fixed px width, in a fixed
    stacking order. `aspect` is the reference image's width / height — used to
    give each slot the same visual weight whatever shape our image is. */
const REFERENCE_SLOTS = [
  { left: 0.58, top: 0.43, width: 209, aspect: 0.691, z: 1 },
  { left: 0.5, top: 0.02, width: 212, aspect: 0.621, z: 2 },
  { left: 0.73, top: 0.73, width: 303, aspect: 0.896, z: 3 },
  { left: 0.91, top: 0.52, width: 238, aspect: 1.448, z: 4 },
  { left: 0.21, top: 0.12, width: 162, aspect: 0.906, z: 5 },
  { left: 0.32, top: 0.65, width: 180, aspect: 1.585, z: 6 },
  { left: 0.19, top: 0.81, width: 256, aspect: 1.312, z: 7 },
  { left: 0.04, top: 0.46, width: 223, aspect: 0.632, z: 8 },
  { left: 0.84, top: 0.24, width: 155, aspect: 0.727, z: 9 },
];

// Below this the reference crams all 9 cards into a phone screen; we keep
// the block at least this big so cards don't pile up (it pans anyway).
const MIN_BLOCK_WIDTH = 960;
const MIN_BLOCK_HEIGHT = 720;

/** Builds the board by repeating the reference's 9-card block. Images fill
    the blocks in order; inside each block, portrait images go to the
    reference's portrait slots and landscape to its landscape ones, and each
    image is sized to the same area as the reference card it replaces. The
    tile is at least 2×2 blocks (as on the reference), so it's always larger
    than the viewport plus a card and each card only needs a single DOM node
    — it wraps to the opposite edge once it has fully left the screen. If the
    last block isn't full, it's topped up from the start of the list. */
function buildLayout(
  images: ExplorationImageData[],
  viewportWidth: number,
  viewportHeight: number,
): CanvasLayout {
  const random = createRandom(images.length * 7919 + 17);
  const blockWidth = Math.max(viewportWidth, MIN_BLOCK_WIDTH);
  const blockHeight = Math.max(viewportHeight, MIN_BLOCK_HEIGHT);
  const perBlock = REFERENCE_SLOTS.length;

  const neededBlocks = Math.max(1, Math.ceil(images.length / perBlock));
  const columns = Math.max(2, Math.ceil(Math.sqrt(neededBlocks)));
  const rows = Math.max(2, Math.ceil(neededBlocks / columns));
  const blockCount = columns * rows;

  // Reference slots ordered from most portrait to most landscape.
  const slotsByShape = REFERENCE_SLOTS.map((slot, index) => ({ ...slot, index })).sort(
    (a, b) => a.aspect - b.aspect,
  );

  const cards: CardLayout[] = [];
  for (let block = 0; block < blockCount; block++) {
    const offsetX = (block % columns) * blockWidth;
    const offsetY = Math.floor(block / columns) * blockHeight;
    const blockImages = Array.from(
      { length: perBlock },
      (_, slot) => (block * perBlock + slot) % images.length,
    ).sort((a, b) => images[a].width / images[a].height - images[b].width / images[b].height);

    blockImages.forEach((imageIndex, rank) => {
      const slot = slotsByShape[rank];
      const image = images[imageIndex];
      const ratio = image.height / image.width;
      // Same area as the reference card, within sensible width bounds.
      const area = (slot.width * slot.width) / slot.aspect;
      const width = Math.min(slot.width * 1.6, Math.max(slot.width * 0.75, Math.sqrt(area / ratio)));
      const height = width * ratio;
      cards.push({
        image: imageIndex,
        x: offsetX + slot.left * blockWidth - width / 2,
        y: offsetY + slot.top * blockHeight - height / 2,
        width,
        height,
        depth: 0.5 + random() * 0.5,
        z: slot.z,
      });
    });
  }

  return { tileWidth: columns * blockWidth, tileHeight: rows * blockHeight, cards };
}

/** Positive modulo, so negative offsets wrap the right way. */
function wrap(value: number, size: number) {
  return ((value % size) + size) % size;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function CanvasCard({
  image,
  index,
  card,
  intro,
  rounded = false,
  setRef,
  onOpen,
  onFocusCard,
}: {
  image: ExplorationImageData;
  index: number;
  card: CardLayout;
  intro: number;
  /** Rounded corners (Effect 4's floating cards). */
  rounded?: boolean;
  setRef: (node: HTMLDivElement | null) => void;
  onOpen: () => void;
  onFocusCard: () => void;
}) {
  return (
    <div
      ref={setRef}
      // A hovered card lifts above any neighbour it overlaps.
      className="absolute left-0 top-0 z-(--card-z) will-change-transform hover:z-20 has-focus-visible:z-20"
      // Position is written straight to style.transform by the animation loop.
      style={
        { width: card.width, height: card.height, "--card-z": card.z } as React.CSSProperties
      }
    >
      <button
        type="button"
        onClick={onOpen}
        // Only keyboard focus — a mouse click focuses the button too, and that
        // must not yank the canvas.
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) onFocusCard();
        }}
        aria-label="Expand image"
        // Staggered intro: each card fades and settles in, ordered outward
        // from the middle of the screen.
        className={`group block h-full w-full animate-[exploration-card-in_900ms_cubic-bezier(0.22,1,0.36,1)_both] cursor-pointer overflow-hidden bg-white/[0.03] outline-none focus-visible:ring-1 focus-visible:ring-white/60 motion-reduce:animate-none ${
          rounded ? "rounded-xl" : ""
        }`}
        style={{ animationDelay: `${intro}ms` }}
      >
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          sizes="(min-width: 1200px) 440px, (min-width: 810px) 380px, 280px"
          loading={index < 16 ? "eager" : "lazy"}
          draggable={false}
          // Hover: zoom in and dim with the reference's 0.6s soft spring.
          // Tailwind v4's scale-* sets the `scale` property (not
          // `transform`), so that's what has to be transitioned.
          className="pointer-events-none block h-full w-full select-none object-cover transition-[scale,filter] duration-[600ms] ease-spring will-change-[scale] group-hover:scale-110 group-hover:brightness-[0.7] motion-reduce:transition-none"
        />
      </button>
    </div>
  );
}

function InfiniteCanvas({
  images,
  paused,
  effect,
  onOpen,
}: {
  images: ExplorationImageData[];
  paused: boolean;
  effect: CanvasEffect;
  onOpen: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [layout, setLayout] = useState<CanvasLayout | null>(null);
  const [intro, setIntro] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useReducedMotion();

  // All per-frame state lives in a ref so the animation loop never re-renders.
  const motionState = useRef({
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    pointer: { x: 0.5, y: 0.5 }, // smoothed, 0–1 across the canvas
    pointerTarget: { x: 0.5, y: 0.5 },
    drag: { active: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: 0 },
    crt: 0, // 0 = flat, 1 = full CRT bulge; eased toward the chosen effect
  });
  const layoutRef = useRef<CanvasLayout | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const effectRef = useRef(effect);
  effectRef.current = effect;

  // Measure the canvas and (re)build the scatter. Rebuilds are debounced so a
  // window drag-resize doesn't reshuffle the board on every pixel.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const rebuild = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      const isFirst = layoutRef.current === null;
      const previous = sizeRef.current;
      sizeRef.current = { width, height };
      if (!isFirst && Math.abs(previous.width - width) < 1 && Math.abs(previous.height - height) < 1) {
        return;
      }

      const next = buildLayout(images, width, height);
      layoutRef.current = next;
      setLayout(next);

      if (isFirst) {
        // Open on the first block, lined up with the screen like the
        // reference (centred instead if the block is bigger than the screen).
        const state = motionState.current;
        const blockWidth = Math.max(width, MIN_BLOCK_WIDTH);
        const blockHeight = Math.max(height, MIN_BLOCK_HEIGHT);
        const start = { x: (width - blockWidth) / 2, y: (height - blockHeight) / 2 };
        state.current = { ...start };
        state.target = { ...start };
        state.last = { ...start };

        // Intro order: closest to the screen center first.
        const distances = next.cards.map((card) => {
          const cx = wrap(card.x + start.x + card.width, next.tileWidth) - card.width / 2 - width / 2;
          const cy = wrap(card.y + start.y + card.height, next.tileHeight) - card.height / 2 - height / 2;
          return Math.hypot(cx, cy);
        });
        const order = distances
          .map((distance, index) => ({ distance, index }))
          .sort((a, b) => a.distance - b.distance);
        const delays: number[] = [];
        order.forEach(({ index }, rank) => {
          delays[index] = Math.min(rank, 24) * 35;
        });
        setIntro(delays);
      }
    };

    rebuild();
    const observer = new ResizeObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(rebuild, 120);
    });
    observer.observe(container);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [images]);

  // Animation loop: ease toward the target, then place every card.
  useEffect(() => {
    let frame = 0;
    let previousTime = performance.now();

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const currentLayout = layoutRef.current;
      if (!currentLayout) return;

      // Normalise to 60fps frames so easing feels the same at any refresh rate.
      const frames = Math.min((time - previousTime) / (1000 / 60), 4);
      previousTime = time;
      const reduced = reducedRef.current;
      const panEase = 1 - Math.pow(1 - (reduced ? 0.25 : PAN_EASE), frames);
      const softEase = 1 - Math.pow(1 - SOFT_EASE, frames);

      const state = motionState.current;
      state.current.x += (state.target.x - state.current.x) * panEase;
      state.current.y += (state.target.y - state.current.y) * panEase;

      const stepX = (state.current.x - state.last.x) / Math.max(frames, 0.001);
      const stepY = (state.current.y - state.last.y) / Math.max(frames, 0.001);
      state.velocity.x += (stepX - state.velocity.x) * softEase;
      state.velocity.y += (stepY - state.velocity.y) * softEase;
      state.pointer.x += (state.pointerTarget.x - state.pointer.x) * softEase;
      state.pointer.y += (state.pointerTarget.y - state.pointer.y) * softEase;
      state.last.x = state.current.x;
      state.last.y = state.current.y;

      const crtTarget = effectRef.current === "crt" ? 1 : 0;
      state.crt += (crtTarget - state.crt) * (reduced ? 1 : 1 - Math.pow(1 - CRT_EASE, frames));
      const bulge = state.crt;
      const halfWidth = sizeRef.current.width / 2 || 1;
      const halfHeight = sizeRef.current.height / 2 || 1;

      const parallax = reduced ? 0 : 1;
      const { tileWidth, tileHeight, cards } = currentLayout;

      cards.forEach((card, index) => {
        const node = cardRefs.current[index];
        if (!node) return;
        const offsetX =
          (VELOCITY_LAG * state.velocity.x * card.depth +
            (state.pointer.x - 0.5) * card.width * POINTER_PARALLAX) *
          parallax;
        const offsetY =
          (VELOCITY_LAG * state.velocity.y * card.depth +
            (state.pointer.y - 0.5) * card.height * POINTER_PARALLAX) *
          parallax;
        // Wrap so a card re-enters on the far side once fully off-screen.
        const x = wrap(card.x + state.current.x + offsetX + card.width, tileWidth) - card.width;
        const y = wrap(card.y + state.current.y + offsetY + card.height, tileHeight) - card.height;
        let transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        if (bulge > 0.001) {
          // -1…1 from the screen centre to its edges (a little past, off-screen).
          const nx = Math.max(-1.5, Math.min(1.5, (x + card.width / 2 - halfWidth) / halfWidth));
          const ny = Math.max(-1.5, Math.min(1.5, (y + card.height / 2 - halfHeight) / halfHeight));
          const r2 = nx * nx + ny * ny;
          // Barrel distortion: pull the card's centre in toward the screen
          // centre, harder the further out it is, and shrink it to match.
          const pull = 1 / (1 + CRT_BARREL * r2 * bulge) - 1;
          const shiftX = nx * halfWidth * pull;
          const shiftY = ny * halfHeight * pull;
          const scale = 1 - CRT_SCALE * Math.min(1, r2 / 2) * bulge;
          transform = `translate3d(${(x + shiftX).toFixed(2)}px, ${(y + shiftY).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        }
        node.style.transform = transform;
      });
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Wheel / trackpad pans the canvas in both axes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || pausedRef.current) return; // leave pinch-zoom alone
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 100 / 6 : event.deltaMode === 2 ? window.innerHeight : 1;
      // Shift+wheel on a mouse scrolls sideways.
      const dx = (event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX) * unit;
      const dy = (event.shiftKey && !event.deltaX ? 0 : event.deltaY) * unit;
      const state = motionState.current;
      state.target.x -= dx * WHEEL_SPEED;
      state.target.y -= dy * WHEEL_SPEED;
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  // Pointer drag (mouse, pen and touch) plus pointer-follow parallax.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const state = motionState.current;

    const trackPointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      state.pointerTarget.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      state.pointerTarget.y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || pausedRef.current) return;
      state.drag = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        originX: state.target.x,
        originY: state.target.y,
        moved: 0,
      };
      trackPointer(event);
    };

    const onMove = (event: PointerEvent) => {
      trackPointer(event);
      if (!state.drag.active) return;
      const dx = event.clientX - state.drag.startX;
      const dy = event.clientY - state.drag.startY;
      state.drag.moved = Math.max(state.drag.moved, Math.hypot(dx, dy));
      if (state.drag.moved > DRAG_CLICK_THRESHOLD) setDragging(true);
      state.target.x = state.drag.originX + dx * DRAG_SPEED;
      state.target.y = state.drag.originY + dy * DRAG_SPEED;
    };

    const onUp = () => {
      if (!state.drag.active) return;
      state.drag.active = false;
      setDragging(false);
      // The click (if any) fires right after pointerup; clear the drag
      // distance once it has been handled so keyboard clicks still work.
      setTimeout(() => {
        state.drag.moved = 0;
      }, 0);
    };

    container.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      container.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // A drag that ends over a card must not open it.
  const swallowClickAfterDrag = useCallback((event: React.MouseEvent) => {
    if (motionState.current.drag.moved > DRAG_CLICK_THRESHOLD) {
      event.preventDefault();
      event.stopPropagation();
      motionState.current.drag.moved = 0;
    }
  }, []);

  // Keyboard users: tabbing to a card glides it to the center of the screen.
  const focusCard = useCallback((index: number) => {
    const currentLayout = layoutRef.current;
    if (!currentLayout) return;
    const card = currentLayout.cards[index];
    const state = motionState.current;
    const { width, height } = sizeRef.current;
    const x = wrap(card.x + state.target.x + card.width, currentLayout.tileWidth) - card.width;
    const y = wrap(card.y + state.target.y + card.height, currentLayout.tileHeight) - card.height;
    state.target.x += width / 2 - (x + card.width / 2);
    state.target.y += height / 2 - (y + card.height / 2);
  }, []);

  return (
    <div
      ref={containerRef}
      onClickCapture={swallowClickAfterDrag}
      className={`relative isolate h-full w-full touch-none select-none overflow-hidden overscroll-none bg-base ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {layout &&
        layout.cards.map((card, index) => (
          <CanvasCard
            key={index}
            image={images[card.image]}
            index={index}
            card={card}
            intro={intro[index] ?? 0}
            setRef={(node) => {
              cardRefs.current[index] = node;
            }}
            onOpen={() => onOpen(card.image)}
            onFocusCard={() => focusCard(index)}
          />
        ))}
      <CrtScreen visible={effect === "crt"} />
    </div>
  );
}

/** The glass of Effect 2's CRT tube, laid over the canvas: a soft refresh
    band rolling down, a dark vignette and rounded screen corners. It
    never takes the pointer, so drag, scroll and clicks pass straight through. */
function CrtScreen({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-30 overflow-hidden transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Rolling refresh band */}
      <div
        className="absolute inset-x-0 top-0 h-1/3 animate-[exploration-crt-roll_7s_linear_infinite] motion-reduce:hidden"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, rgb(255 255 255 / 0.05) 50%, transparent)",
        }}
      />
      {/* Vignette: the tube darkens toward its curved edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.55) 85%, rgb(0 0 0 / 0.85) 100%)",
        }}
      />
      {/* Rounded screen corners, masked out in the page background colour */}
      <div
        className="absolute inset-0 rounded-4xl"
        style={{
          boxShadow:
            "0 0 0 9999px var(--color-base), inset 0 0 80px rgb(0 0 0 / 0.6)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Effect 3: depth stream                                                    */
/* ------------------------------------------------------------------------ */

type StreamCard = {
  image: number;
  /** Where on the wheel's rim the card sits, in radians. */
  angle: number;
  /** -1…1 sideways scatter, so the ribbon reads as a loose cluster. */
  lane: number;
  /** 0.75–1.25 size variation. */
  size: number;
  /** 0.5–1: per-card weight for the velocity lag, as on the canvas. */
  depth: number;
};

/** Wraps an angle into -π…π. */
function wrapAngle(angle: number) {
  return angle - Math.PI * 2 * Math.round(angle / (Math.PI * 2));
}

function buildStream(images: ExplorationImageData[]): StreamCard[] {
  const random = createRandom(images.length * 104729 + 3);
  const slots = Math.max(images.length, STREAM_MIN_SLOTS);
  return Array.from({ length: slots }, (_, slot) => ({
    image: slot % images.length,
    angle: (slot / slots) * Math.PI * 2,
    lane: random() * 2 - 1,
    size: 0.75 + random() * 0.5,
    depth: 0.5 + random() * 0.5,
  }));
}

/** Base card width for a given screen: ~16% of its width, within bounds. */
function streamBaseWidth(viewportWidth: number) {
  return Math.min(300, Math.max(150, viewportWidth * 0.16));
}

function StreamCanvas({
  images,
  paused,
  onOpen,
}: {
  images: ExplorationImageData[];
  paused: boolean;
  onOpen: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useReducedMotion();
  const cards = useMemo(() => buildStream(images), [images]);

  const motionState = useRef({
    current: 0, // wheel rotation, radians
    target: 0,
    last: 0,
    velocity: 0,
    drag: { active: false, startY: 0, origin: 0, moved: 0 },
  });
  const sizeRef = useRef({ width: 0, height: 0 });
  const cardsRef = useRef(cards);
  cardsRef.current = cards;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  // Intro order: the card at the front of the wheel first, then outward.
  const intro = useMemo(() => {
    const delays: number[] = [];
    cards
      .map((card, index) => ({ index, distance: Math.abs(wrapAngle(card.angle)) }))
      .sort((a, b) => a.distance - b.distance)
      .forEach(({ index }, rank) => {
        delays[index] = Math.min(rank, 24) * 35;
      });
    return delays;
  }, [cards]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      sizeRef.current = { width, height };
      setSize({ width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Animation loop: ease the wheel toward its target, then place every card
  // on the rim in 3D. The container's perspective does the shrinking.
  useEffect(() => {
    let frame = 0;
    let previousTime = performance.now();

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const { width, height } = sizeRef.current;
      if (!width || !height) return;

      const frames = Math.min((time - previousTime) / (1000 / 60), 4);
      previousTime = time;
      const reduced = reducedRef.current;
      const ease = 1 - Math.pow(1 - (reduced ? 0.25 : STREAM_EASE), frames);
      const softEase = 1 - Math.pow(1 - SOFT_EASE, frames);

      const state = motionState.current;
      state.current += (state.target - state.current) * ease;
      const step = (state.current - state.last) / Math.max(frames, 0.001);
      state.velocity += (step - state.velocity) * softEase;
      state.last = state.current;

      const lag = reduced ? 0 : STREAM_LAG;
      const radius = height * STREAM_RADIUS;
      const swing = width * STREAM_SWING;
      const base = streamBaseWidth(width);

      cardsRef.current.forEach((card, index) => {
        const node = cardRefs.current[index];
        if (!node) return;
        const angle = wrapAngle(card.angle + state.current + state.velocity * lag * card.depth);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Hide the back half of the wheel, fading cards out as they go over
        // the top or under the bottom.
        const opacity = Math.min(1, Math.max(0, (cos + 0.1) / 0.45));
        if (opacity <= 0) {
          node.style.visibility = "hidden";
          return;
        }
        node.style.visibility = "visible";
        node.style.opacity = opacity.toFixed(3);
        node.style.zIndex = String(Math.round((cos + 1) * 1000));

        const cardWidth = parseFloat(node.style.width) || base;
        const cardHeight = parseFloat(node.style.height) || base;
        // The front of the wheel sits just right of centre at z = 0 (full
        // size); both ends of the ribbon bend left as they fall away.
        const x =
          width * 0.54 - (1 - cos) * swing + card.lane * base * STREAM_SPREAD - cardWidth / 2;
        const y = height / 2 + sin * radius - cardHeight / 2;
        const z = (cos - 1) * radius;
        node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)`;
      });
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Wheel / trackpad spins the wheel; either scroll axis works.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || pausedRef.current) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 100 / 6 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = (Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * unit;
      // Scrolling down carries the ribbon up, like scrolling a page.
      motionState.current.target -= delta * STREAM_WHEEL_SPEED;
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  // Vertical drag (mouse, pen and touch) spins it too.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const state = motionState.current;

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || pausedRef.current) return;
      state.drag = { active: true, startY: event.clientY, origin: state.target, moved: 0 };
    };
    const onMove = (event: PointerEvent) => {
      if (!state.drag.active) return;
      const dy = event.clientY - state.drag.startY;
      state.drag.moved = Math.max(state.drag.moved, Math.abs(dy));
      if (state.drag.moved > DRAG_CLICK_THRESHOLD) setDragging(true);
      state.target = state.drag.origin + dy * STREAM_DRAG_SPEED;
    };
    const onUp = () => {
      if (!state.drag.active) return;
      state.drag.active = false;
      setDragging(false);
      setTimeout(() => {
        state.drag.moved = 0;
      }, 0);
    };

    container.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      container.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const swallowClickAfterDrag = useCallback((event: React.MouseEvent) => {
    if (motionState.current.drag.moved > DRAG_CLICK_THRESHOLD) {
      event.preventDefault();
      event.stopPropagation();
      motionState.current.drag.moved = 0;
    }
  }, []);

  // Keyboard users: tabbing to a card turns the wheel to bring it to the front.
  const focusCard = useCallback((index: number) => {
    const state = motionState.current;
    state.target += wrapAngle(-(cardsRef.current[index].angle + state.target));
  }, []);

  const base = size ? streamBaseWidth(size.width) : 0;

  return (
    <div
      ref={containerRef}
      onClickCapture={swallowClickAfterDrag}
      className={`relative isolate h-full w-full touch-none select-none overflow-hidden overscroll-none bg-base perspective-midrange ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {size &&
        cards.map((card, index) => {
          const image = images[card.image];
          const ratio = image.height / image.width;
          // Keep tall portraits from towering over the ribbon.
          const height = Math.min(base * card.size * ratio, base * 1.4);
          const width = height / ratio;
          return (
            <CanvasCard
              key={index}
              image={image}
              index={index}
              card={{ image: card.image, x: 0, y: 0, width, height, depth: card.depth, z: 1 }}
              intro={intro[index] ?? 0}
              setRef={(node) => {
                cardRefs.current[index] = node;
              }}
              onOpen={() => onOpen(card.image)}
              onFocusCard={() => focusCard(index)}
            />
          );
        })}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Effect 4: depth field fly-through                                         */
/* ------------------------------------------------------------------------ */

type FieldCard = {
  image: number;
  /** -1…1 position across the screen (scaled by its half-size). */
  nx: number;
  ny: number;
  /** Depth along the field, 0…field length. */
  z: number;
  /** 0.7–1.3 size variation. */
  size: number;
  /** Off-axis turn, in degrees. */
  rotateX: number;
  rotateY: number;
};

function buildField(images: ExplorationImageData[]) {
  const random = createRandom(images.length * 15485863 + 11);
  const slots = Math.max(images.length, FIELD_MIN_SLOTS);
  const cards: FieldCard[] = Array.from({ length: slots }, (_, slot) => {
    // Golden-angle spiral, kept out of the very middle so the camera flies
    // between cards rather than straight into one.
    const angle = slot * 2.39996 + random() * 0.6;
    const radius = 0.32 + 0.68 * Math.sqrt(random());
    return {
      image: slot % images.length,
      nx: Math.cos(angle) * radius,
      ny: Math.sin(angle) * radius,
      z: slot * FIELD_SPACING,
      size: 0.7 + random() * 0.6,
      rotateX: (random() * 2 - 1) * FIELD_TILT,
      rotateY: (random() * 2 - 1) * FIELD_TILT,
    };
  });
  return { cards, length: slots * FIELD_SPACING };
}

/** Base card width when it is at z = 0 (true size): ~26% of the screen width. */
function fieldBaseWidth(viewportWidth: number) {
  return Math.min(420, Math.max(200, viewportWidth * 0.26));
}

function DepthField({
  images,
  paused,
  onOpen,
}: {
  images: ExplorationImageData[];
  paused: boolean;
  onOpen: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useReducedMotion();
  const field = useMemo(() => buildField(images), [images]);

  const motionState = useRef({
    current: 0, // camera position along the field, px
    target: 0,
    pointer: { x: 0.5, y: 0.5 },
    pointerTarget: { x: 0.5, y: 0.5 },
    drag: { active: false, startY: 0, origin: 0, moved: 0 },
  });
  const sizeRef = useRef({ width: 0, height: 0 });
  const fieldRef = useRef(field);
  fieldRef.current = field;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  // Intro order: nearest cards first, then back into the distance.
  const intro = useMemo(() => {
    const delays: number[] = [];
    field.cards
      .map((card, index) => ({ index, depth: card.z }))
      .sort((a, b) => a.depth - b.depth)
      .forEach(({ index }, rank) => {
        delays[index] = Math.min(rank, 24) * 35;
      });
    return delays;
  }, [field]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      sizeRef.current = { width, height };
      setSize({ width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Animation loop: ease the camera forward, then place every card in 3D.
  // The container's perspective does the growing as cards come closer.
  useEffect(() => {
    let frame = 0;
    let previousTime = performance.now();
    // Per card: last on-screen centre (x, y), last depth, and smoothed
    // on-screen speed (x, y) — for the motion blur.
    let previousScreen = new Float32Array(0);
    let previousAhead = new Float32Array(0);
    let motion = new Float32Array(0);
    const appliedFilters: string[] = [];

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const { width, height } = sizeRef.current;
      if (!width || !height) return;

      const frames = Math.min((time - previousTime) / (1000 / 60), 4);
      previousTime = time;
      const reduced = reducedRef.current;
      const ease = 1 - Math.pow(1 - (reduced ? 0.25 : FIELD_EASE), frames);
      const softEase = 1 - Math.pow(1 - SOFT_EASE, frames);
      const motionEase = 1 - Math.pow(1 - FIELD_MOTION_EASE, frames);

      const state = motionState.current;
      state.current += (state.target - state.current) * ease;
      state.pointer.x += (state.pointerTarget.x - state.pointer.x) * softEase;
      state.pointer.y += (state.pointerTarget.y - state.pointer.y) * softEase;

      const { cards, length } = fieldRef.current;
      if (previousAhead.length !== cards.length) {
        previousScreen = new Float32Array(cards.length * 2);
        previousAhead = new Float32Array(cards.length).fill(Number.NaN);
        motion = new Float32Array(cards.length * 2);
      }
      // The whole field drifts against the pointer; under perspective, near
      // cards move more than far ones, which sells the depth.
      const shift = reduced ? 0 : 1;
      const shiftX = -(state.pointer.x - 0.5) * width * FIELD_POINTER_SHIFT * 2 * shift;
      const shiftY = -(state.pointer.y - 0.5) * height * FIELD_POINTER_SHIFT * 2 * shift;

      cards.forEach((card, index) => {
        const node = cardRefs.current[index];
        if (!node) return;
        // Distance in front of the near plane; wraps so the field is endless.
        const ahead = wrap(card.z - state.current, length);
        const z = FIELD_NEAR - ahead;

        // Fade in from the far end, fade out as a card rushes past the camera.
        const fadeIn = Math.min(1, (length - ahead) / (length * 0.2));
        const fadeOut = Math.min(1, Math.max(0, (FIELD_NEAR - z) / (FIELD_NEAR * 0.5)));
        const opacity = Math.max(0, fadeIn * fadeOut);
        if (opacity <= 0.001) {
          node.style.visibility = "hidden";
          // Forget its motion, so it doesn't streak when it reappears.
          previousAhead[index] = Number.NaN;
          motion[index * 2] = 0;
          motion[index * 2 + 1] = 0;
          return;
        }
        node.style.visibility = "visible";
        node.style.opacity = opacity.toFixed(3);
        node.style.zIndex = String(Math.round(length - ahead));

        const cardWidth = parseFloat(node.style.width) || 0;
        const cardHeight = parseFloat(node.style.height) || 0;
        const x = width / 2 + card.nx * width * 0.55 + shiftX - cardWidth / 2;
        const y = height / 2 + card.ny * height * 0.55 + shiftY - cardHeight / 2;
        // Perspective shrinks a card (and its blur) by this much on screen,
        // so on-screen amounts are divided by it to look even at any depth.
        const screenScale = FIELD_PERSPECTIVE / (FIELD_PERSPECTIVE - z);

        // Depth of field: blur grows smoothly with distance past the focus zone.
        const focusEnd = FIELD_NEAR + FIELD_FOCUS_DEPTH;
        const blurAmount = Math.min(
          1,
          Math.max(0, (ahead - focusEnd) / (length * 0.85 - focusEnd)),
        );
        const depthBlur = FIELD_BLUR * blurAmount * blurAmount * (3 - 2 * blurAmount);

        // Motion: track where the card's centre lands on screen and how far
        // it moved since last frame. A card that just wrapped from the front
        // to the back has no real motion, so it starts fresh.
        const screenX = (x + cardWidth / 2 - width / 2) * screenScale;
        const screenY = (y + cardHeight / 2 - height / 2) * screenScale;
        const m = index * 2;
        let moveX = 0;
        let moveY = 0;
        if (!Number.isNaN(previousAhead[index]) && Math.abs(ahead - previousAhead[index]) < length / 2) {
          moveX = (screenX - previousScreen[m]) / Math.max(frames, 0.001);
          moveY = (screenY - previousScreen[m + 1]) / Math.max(frames, 0.001);
        }
        previousScreen[m] = screenX;
        previousScreen[m + 1] = screenY;
        previousAhead[index] = ahead;
        motion[m] += (moveX - motion[m]) * motionEase;
        motion[m + 1] += (moveY - motion[m + 1]) * motionEase;
        const speed = reduced ? 0 : Math.hypot(motion[m], motion[m + 1]);

        // Streak: stretch the card along its direction of travel with a
        // matrix (I + s·d·dᵀ). A transform runs on the GPU, so it's free.
        let streak = "";
        const stretch = Math.min(FIELD_STRETCH_MAX, speed * FIELD_STRETCH);
        if (stretch > 0.002) {
          const dx = motion[m] / speed;
          const dy = motion[m + 1] / speed;
          const a = 1 + stretch * dx * dx;
          const b = stretch * dx * dy;
          const d = 1 + stretch * dy * dy;
          streak = ` matrix(${a.toFixed(4)}, ${b.toFixed(4)}, ${b.toFixed(4)}, ${d.toFixed(4)}, 0, 0)`;
        }
        node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${card.rotateX}deg) rotateY(${card.rotateY}deg)${streak}`;

        // Blur: depth of field plus a little softness with speed, as one CSS
        // blur, which the GPU applies without repainting the card. Snapped to
        // 20% steps (and dropped below 0.3px) so it only changes now and then.
        const motionBlur = Math.min(FIELD_MOTION_BLUR_MAX, speed * FIELD_MOTION_BLUR);
        const rawBlur = Math.hypot(depthBlur, motionBlur) / screenScale;
        const blur =
          rawBlur < 0.3
            ? 0
            : Math.pow(FIELD_BLUR_STEP, Math.round(Math.log(rawBlur) / Math.log(FIELD_BLUR_STEP)));
        const filter = blur > 0 ? `blur(${blur.toFixed(2)}px)` : "";
        if (appliedFilters[index] !== filter) {
          appliedFilters[index] = filter;
          node.style.filter = filter;
        }
      });
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Wheel / trackpad flies the camera; scrolling down moves forward.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || pausedRef.current) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 100 / 6 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = (Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * unit;
      motionState.current.target += delta * FIELD_WHEEL_SPEED;
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  // Drag up to fly forward, down to fly back; the pointer also steers the drift.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const state = motionState.current;

    const trackPointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      state.pointerTarget.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      state.pointerTarget.y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || pausedRef.current) return;
      state.drag = { active: true, startY: event.clientY, origin: state.target, moved: 0 };
      trackPointer(event);
    };
    const onMove = (event: PointerEvent) => {
      trackPointer(event);
      if (!state.drag.active) return;
      const dy = event.clientY - state.drag.startY;
      state.drag.moved = Math.max(state.drag.moved, Math.abs(dy));
      if (state.drag.moved > DRAG_CLICK_THRESHOLD) setDragging(true);
      state.target = state.drag.origin - dy * FIELD_DRAG_SPEED;
    };
    const onUp = () => {
      if (!state.drag.active) return;
      state.drag.active = false;
      setDragging(false);
      setTimeout(() => {
        state.drag.moved = 0;
      }, 0);
    };

    container.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      container.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const swallowClickAfterDrag = useCallback((event: React.MouseEvent) => {
    if (motionState.current.drag.moved > DRAG_CLICK_THRESHOLD) {
      event.preventDefault();
      event.stopPropagation();
      motionState.current.drag.moved = 0;
    }
  }, []);

  // Keyboard users: tabbing to a card flies the camera up to it (true size).
  const focusCard = useCallback((index: number) => {
    const state = motionState.current;
    const { cards, length } = fieldRef.current;
    state.target += wrap(cards[index].z - state.target, length) - FIELD_NEAR;
  }, []);

  const base = size ? fieldBaseWidth(size.width) : 0;

  return (
    <div
      ref={containerRef}
      onClickCapture={swallowClickAfterDrag}
      className={`relative isolate h-full w-full touch-none select-none overflow-hidden overscroll-none bg-base perspective-midrange ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {size &&
        field.cards.map((card, index) => {
          const image = images[card.image];
          const ratio = image.height / image.width;
          const height = Math.min(base * card.size * ratio, base * 1.3);
          const width = height / ratio;
          return (
            <CanvasCard
              key={index}
              image={image}
              index={index}
              card={{ image: card.image, x: 0, y: 0, width, height, depth: 1, z: 1 }}
              intro={intro[index] ?? 0}
              rounded
              setRef={(node) => {
                cardRefs.current[index] = node;
              }}
              onOpen={() => onOpen(card.image)}
              onFocusCard={() => focusCard(index)}
            />
          );
        })}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Effect 5: fisheye lens (WebGL)                                            */
/* ------------------------------------------------------------------------ */

// Each card is a LENS_GRID × LENS_GRID mesh. The vertex shader treats the
// flat board as if it were wrapped around a sphere seen from the front: a
// point `d` px from the screen centre lands at `R·sin(d·zoom/R)`, so the
// middle is magnified and everything compresses toward the rim (R).
//
// Uniforms: u_rect = card left, top (px from the screen centre, y down),
// width, height; u_resolution = screen size and u_radius = sphere rim, both
// in css px. The shader sources stay comment-free and plain ASCII, since
// some browsers reject anything else in GLSL.
const LENS_VERTEX_SHADER = `
attribute vec2 a_uv;
uniform vec4 u_rect;
uniform vec2 u_resolution;
uniform float u_radius;
uniform float u_zoom;
varying vec2 v_uv;
varying float v_theta;
void main() {
  vec2 board = u_rect.xy + a_uv * u_rect.zw;
  float d = length(board);
  float theta = d * u_zoom / u_radius;
  float r = u_radius * sin(min(theta, 1.5707963));
  vec2 screen = d > 0.0001 ? board / d * r : vec2(0.0);
  v_uv = a_uv;
  v_theta = theta;
  gl_Position = vec4(screen.x / (u_resolution.x * 0.5), -screen.y / (u_resolution.y * 0.5), 0.0, 1.0);
}
`;

// Discards the back of the sphere; u_loaded fades the image in over the
// placeholder; u_hover (eased 0 to 1) zooms in 10% and dims to 70% like the
// flat canvas; and cards darken toward the rim so the board reads as curved.
const LENS_FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D u_texture;
uniform float u_loaded;
uniform float u_alpha;
uniform float u_hover;
uniform float u_shade;
varying vec2 v_uv;
varying float v_theta;
void main() {
  if (v_theta > 1.5707963) discard;
  vec2 uv = (v_uv - 0.5) / (1.0 + 0.1 * u_hover) + 0.5;
  vec3 color = mix(vec3(0.03), texture2D(u_texture, uv).rgb, u_loaded);
  color *=mix(1.0 - u_shade, 1.0, cos(v_theta)) * mix(1.0, 0.7, u_hover);
  gl_FragColor = vec4(color * u_alpha, u_alpha);
}
`;

/** URL for a smaller copy of an image from Next's optimizer (textures don't
    need the full-size PNG/WebP). */
function lensTextureUrl(src: string) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${LENS_TEXTURE_WIDTH}&q=75`;
}

function compileProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "Shader failed to compile");
    }
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, LENS_VERTEX_SHADER));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, LENS_FRAGMENT_SHADER));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Shader program failed to link");
  }
  return program;
}

/** Reads a computed `rgb(…)` colour as 0–1 floats, for the WebGL clear colour. */
function parseRgb(color: string): [number, number, number] {
  const [r = 0, g = 0, b = 0] = (color.match(/[\d.]+/g) ?? []).map(Number);
  return [r / 255, g / 255, b / 255];
}

function FisheyeLens({
  images,
  paused,
  onOpen,
  onUnsupported,
}: {
  images: ExplorationImageData[];
  paused: boolean;
  onOpen: (index: number) => void;
  /** Called if the browser has no WebGL, so the gallery can fall back. */
  onUnsupported: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = useReducedMotion();

  const motionState = useRef({
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    pointer: { x: 0.5, y: 0.5 },
    pointerTarget: { x: 0.5, y: 0.5 },
    /** Pointer position in css px from the screen centre, or null if outside. */
    hoverPoint: null as { x: number; y: number } | null,
    drag: { active: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: 0 },
  });
  const layoutRef = useRef<CanvasLayout | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  /** Each card's flat rect from the last frame (left, top, width, height,
      centre-relative), in draw order — used for hit testing. */
  const rectsRef = useRef<Float32Array>(new Float32Array(0));
  const drawOrderRef = useRef<number[]>([]);
  const hoveredRef = useRef(-1);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const onUnsupportedRef = useRef(onUnsupported);
  onUnsupportedRef.current = onUnsupported;
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  /** Screen point (css px from centre) → the card under it, or -1. Runs the
      lens mapping backwards, then tests the flat rects topmost-first. */
  const hitTest = useCallback((point: { x: number; y: number }) => {
    const { width, height } = sizeRef.current;
    const radius = (Math.hypot(width, height) / 2) * LENS_RADIUS;
    const r = Math.hypot(point.x, point.y);
    if (r >= radius) return -1;
    const d = (Math.asin(r / radius) * radius) / LENS_ZOOM;
    const fx = r > 0.0001 ? (point.x / r) * d : 0;
    const fy = r > 0.0001 ? (point.y / r) * d : 0;
    const rects = rectsRef.current;
    const order = drawOrderRef.current;
    for (let i = order.length - 1; i >= 0; i--) {
      const card = order[i];
      const o = card * 4;
      if (
        fx >= rects[o] &&
        fx <= rects[o] + rects[o + 2] &&
        fy >= rects[o + 1] &&
        fy <= rects[o + 1] + rects[o + 3]
      ) {
        return card;
      }
    }
    return -1;
  }, []);

  // WebGL setup + render loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl2 = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: true });
    const gl = (gl2 ??
      canvas.getContext("webgl", { premultipliedAlpha: true, antialias: true })) as
      | WebGLRenderingContext
      | null;
    if (!gl) {
      console.warn("Explorations Effect 5: WebGL is unavailable, showing the flat canvas.");
      onUnsupportedRef.current();
      return;
    }

    let program: WebGLProgram;
    try {
      program = compileProgram(gl);
    } catch (error) {
      console.warn("Explorations Effect 5: lens shader failed, showing the flat canvas.", error);
      onUnsupportedRef.current();
      return;
    }
    gl.useProgram(program);

    // Shared card mesh: a grid of uv points, indexed into triangles.
    const steps = LENS_GRID;
    const vertices = new Float32Array((steps + 1) * (steps + 1) * 2);
    for (let row = 0; row <= steps; row++) {
      for (let col = 0; col <= steps; col++) {
        const v = (row * (steps + 1) + col) * 2;
        vertices[v] = col / steps;
        vertices[v + 1] = row / steps;
      }
    }
    const indices = new Uint16Array(steps * steps * 6);
    let k = 0;
    for (let row = 0; row < steps; row++) {
      for (let col = 0; col < steps; col++) {
        const a = row * (steps + 1) + col;
        const b = a + 1;
        const c = a + steps + 1;
        const e = c + 1;
        indices.set([a, c, b, b, c, e], k);
        k += 6;
      }
    }
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    const uvLocation = gl.getAttribLocation(program, "a_uv");
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      rect: uniform("u_rect"),
      resolution: uniform("u_resolution"),
      radius: uniform("u_radius"),
      zoom: uniform("u_zoom"),
      texture: uniform("u_texture"),
      loaded: uniform("u_loaded"),
      alpha: uniform("u_alpha"),
      hover: uniform("u_hover"),
      shade: uniform("u_shade"),
    };
    gl.uniform1i(u.texture, 0);
    gl.uniform1f(u.zoom, LENS_ZOOM);
    gl.uniform1f(u.shade, LENS_SHADE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // The page background behind the lens (bg-base), so the rim blends in.
    const [clearR, clearG, clearB] = parseRgb(getComputedStyle(container).backgroundColor);
    gl.clearColor(clearR, clearG, clearB, 1);

    // One texture per image, filled in as each image arrives.
    let disposed = false;
    const textures = images.map(() => ({
      texture: gl.createTexture(),
      loadedAt: 0,
    }));
    images.forEach((image, index) => {
      const element = new window.Image();
      element.decoding = "async";
      element.onload = () => {
        if (disposed) return;
        const slot = textures[index];
        gl.bindTexture(gl.TEXTURE_2D, slot.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        if (gl2) {
          // WebGL2 can mipmap any size — keeps cards crisp, not shimmery,
          // where the rim squeezes them small.
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        slot.loadedAt = performance.now();
      };
      // Fall back to the original file if the optimizer can't serve it.
      element.onerror = () => {
        if (!disposed && element.src.includes("/_next/image")) element.src = image.src;
      };
      element.src = lensTextureUrl(image.src);
    });

    // Size the drawing buffer to the screen (capped at 2× for performance)
    // and (re)build the board.
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const previous = sizeRef.current;
      sizeRef.current = { width, height };
      const isFirst = layoutRef.current === null;
      if (!isFirst && Math.abs(previous.width - width) < 1 && Math.abs(previous.height - height) < 1) {
        return;
      }
      const next = buildLayout(images, width, height);
      layoutRef.current = next;
      rectsRef.current = new Float32Array(next.cards.length * 4);
      // Lower stacking order first, so higher cards paint on top.
      drawOrderRef.current = next.cards
        .map((card, index) => ({ z: card.z, index }))
        .sort((a, b) => a.z - b.z)
        .map(({ index }) => index);
      if (isFirst) {
        const state = motionState.current;
        const blockWidth = Math.max(width, MIN_BLOCK_WIDTH);
        const blockHeight = Math.max(height, MIN_BLOCK_HEIGHT);
        const start = { x: (width - blockWidth) / 2, y: (height - blockHeight) / 2 };
        state.current = { ...start };
        state.target = { ...start };
        state.last = { ...start };
      }
    };
    resize();
    const observer = new ResizeObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(resize, 120);
    });
    observer.observe(container);

    const hoverAmounts: number[] = [];
    const startTime = performance.now();
    let frame = 0;
    let previousTime = startTime;

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const layout = layoutRef.current;
      const { width, height } = sizeRef.current;
      if (!layout || !width || !height) return;

      const frames = Math.min((time - previousTime) / (1000 / 60), 4);
      previousTime = time;
      const reduced = reducedRef.current;
      const panEase = 1 - Math.pow(1 - (reduced ? 0.25 : PAN_EASE), frames);
      const softEase = 1 - Math.pow(1 - SOFT_EASE, frames);
      const hoverEase = 1 - Math.pow(1 - 0.12, frames);

      const state = motionState.current;
      state.current.x += (state.target.x - state.current.x) * panEase;
      state.current.y += (state.target.y - state.current.y) * panEase;
      const stepX = (state.current.x - state.last.x) / Math.max(frames, 0.001);
      const stepY = (state.current.y - state.last.y) / Math.max(frames, 0.001);
      state.velocity.x += (stepX - state.velocity.x) * softEase;
      state.velocity.y += (stepY - state.velocity.y) * softEase;
      state.pointer.x += (state.pointerTarget.x - state.pointer.x) * softEase;
      state.pointer.y += (state.pointerTarget.y - state.pointer.y) * softEase;
      state.last.x = state.current.x;
      state.last.y = state.current.y;

      const radius = (Math.hypot(width, height) / 2) * LENS_RADIUS;
      // Flat distance from the centre at which the board reaches the rim.
      const reach = ((Math.PI / 2) * radius) / LENS_ZOOM;
      const parallax = reduced ? 0 : 1;
      const { tileWidth, tileHeight, cards } = layout;
      // Wrap each card into a tile-sized window centred on the screen, so
      // the board extends equally in every direction under the lens.
      const originX = -tileWidth / 2;
      const originY = -tileHeight / 2;
      const rects = rectsRef.current;

      cards.forEach((card, index) => {
        const offsetX =
          (VELOCITY_LAG * state.velocity.x * card.depth +
            (state.pointer.x - 0.5) * card.width * POINTER_PARALLAX) *
          parallax;
        const offsetY =
          (VELOCITY_LAG * state.velocity.y * card.depth +
            (state.pointer.y - 0.5) * card.height * POINTER_PARALLAX) *
          parallax;
        const o = index * 4;
        rects[o] = wrap(card.x + state.current.x + offsetX - width / 2 - originX, tileWidth) + originX;
        rects[o + 1] =
          wrap(card.y + state.current.y + offsetY - height / 2 - originY, tileHeight) + originY;
        rects[o + 2] = card.width;
        rects[o + 3] = card.height;
      });

      // Hover follows the pointer even while the board glides under it.
      const hovered =
        state.hoverPoint && !state.drag.active && !pausedRef.current ? hitTest(state.hoverPoint) : -1;
      if (hovered !== hoveredRef.current) {
        hoveredRef.current = hovered;
        setHovering(hovered !== -1);
      }

      gl.uniform2f(u.resolution, width, height);
      gl.uniform1f(u.radius, radius);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // Whole lens fades up on entry.
      const sceneAlpha = reduced ? 1 : Math.min(1, (time - startTime) / 700);

      drawOrderRef.current.forEach((index) => {
        const o = index * 4;
        const left = rects[o];
        const top = rects[o + 1];
        const cardWidth = rects[o + 2];
        const cardHeight = rects[o + 3];
        // Skip cards entirely past the rim.
        const nearestX = Math.max(left, Math.min(0, left + cardWidth));
        const nearestY = Math.max(top, Math.min(0, top + cardHeight));
        if (Math.hypot(nearestX, nearestY) > reach) return;

        hoverAmounts[index] = (hoverAmounts[index] ?? 0) +
          ((index === hovered ? 1 : 0) - (hoverAmounts[index] ?? 0)) * (reduced ? 1 : hoverEase);

        const slot = textures[cards[index].image];
        const loaded = slot.loadedAt > 0;
        // Each image fades in as it arrives.
        const imageAlpha = loaded && !reduced ? Math.min(1, (time - slot.loadedAt) / 400) : 1;
        gl.bindTexture(gl.TEXTURE_2D, slot.texture);
        gl.uniform4f(u.rect, left, top, cardWidth, cardHeight);
        gl.uniform1f(u.loaded, loaded ? imageAlpha : 0);
        gl.uniform1f(u.alpha, sceneAlpha);
        gl.uniform1f(u.hover, hoverAmounts[index]);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      });
    };
    frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      observer.disconnect();
      textures.forEach(({ texture }) => gl.deleteTexture(texture));
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
      // Don't lose the context here: React (in dev) re-runs this effect on
      // the same canvas, and a lost context can't be brought back.
    };
  }, [images, hitTest]);

  // Wheel / trackpad pans the board, exactly like the flat canvas.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || pausedRef.current) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 100 / 6 : event.deltaMode === 2 ? window.innerHeight : 1;
      const dx = (event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX) * unit;
      const dy = (event.shiftKey && !event.deltaX ? 0 : event.deltaY) * unit;
      const state = motionState.current;
      state.target.x -= dx * WHEEL_SPEED;
      state.target.y -= dy * WHEEL_SPEED;
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  // Pointer drag, pointer parallax, hover and click.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const state = motionState.current;

    const trackPointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      state.pointerTarget.x = Math.min(1, Math.max(0, x / rect.width));
      state.pointerTarget.y = Math.min(1, Math.max(0, y / rect.height));
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      state.hoverPoint =
        inside && event.pointerType === "mouse"
          ? { x: x - rect.width / 2, y: y - rect.height / 2 }
          : null;
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || pausedRef.current) return;
      state.drag = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        originX: state.target.x,
        originY: state.target.y,
        moved: 0,
      };
      trackPointer(event);
    };
    const onMove = (event: PointerEvent) => {
      trackPointer(event);
      if (!state.drag.active) return;
      const dx = event.clientX - state.drag.startX;
      const dy = event.clientY - state.drag.startY;
      state.drag.moved = Math.max(state.drag.moved, Math.hypot(dx, dy));
      if (state.drag.moved > DRAG_CLICK_THRESHOLD) setDragging(true);
      state.target.x = state.drag.originX + dx * DRAG_SPEED;
      state.target.y = state.drag.originY + dy * DRAG_SPEED;
    };
    const onUp = (event: PointerEvent) => {
      if (!state.drag.active) return;
      state.drag.active = false;
      setDragging(false);
      // A press that didn't turn into a drag is a click on whatever card is
      // under it.
      if (event.type === "pointerup" && state.drag.moved <= DRAG_CLICK_THRESHOLD) {
        const rect = container.getBoundingClientRect();
        const card = hitTest({
          x: event.clientX - rect.left - rect.width / 2,
          y: event.clientY - rect.top - rect.height / 2,
        });
        const layout = layoutRef.current;
        if (card !== -1 && layout) onOpenRef.current(layout.cards[card].image);
      }
      state.drag.moved = 0;
    };
    const onLeave = () => {
      state.hoverPoint = null;
    };

    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [hitTest]);

  return (
    <div
      ref={containerRef}
      className={`relative isolate h-full w-full touch-none select-none overflow-hidden overscroll-none bg-base ${
        dragging ? "cursor-grabbing" : hovering ? "cursor-pointer" : "cursor-grab"
      }`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
      {/* The lens is drawn on a canvas, so keyboard and screen-reader users
          get a plain list of buttons to open each image instead. */}
      <ul className="sr-only">
        {images.map((image, index) => (
          <li key={image.src}>
            <button type="button" onClick={() => onOpen(index)}>
              Expand image {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Lightbox                                                                  */
/* ------------------------------------------------------------------------ */

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "prev" ? "M15 6 9 12l6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={direction === "prev" ? "Previous image" : "Next image"}
      className={`fixed top-1/2 z-[60] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 ${
        direction === "prev" ? "left-6" : "right-6"
      }`}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

/** Full-bleed infinite canvas of exploration images — drag or scroll in any
    direction and the board wraps forever. Clicking an image opens it in an
    80vw/80vh lightbox with the page blurred behind it, with prev/next arrows
    to step through every image. */
export function ExplorationGallery({ images }: { images: ExplorationImageData[] }) {
  const flatSrcs = images.map((image) => image.src);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [effect, setEffect] = useState<CanvasEffect>(DEFAULT_EFFECT);
  const [lensUnsupported, setLensUnsupported] = useState(false);
  const openSrc = openIndex === null ? null : flatSrcs[openIndex];

  const showPrev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + flatSrcs.length) % flatSrcs.length));
  const showNext = () => setOpenIndex((i) => (i === null ? null : (i + 1) % flatSrcs.length));

  // Lock page scroll and wire up keyboard nav while the lightbox is open.
  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex]);

  return (
    <>
      {/* Effects 3–5 are their own scenes; Effects 1 and 2 share the canvas.
          Without WebGL, Effect 5 falls back to the plain canvas. */}
      {effect === "stream" ? (
        <StreamCanvas images={images} paused={openIndex !== null} onOpen={setOpenIndex} />
      ) : effect === "field" ? (
        <DepthField images={images} paused={openIndex !== null} onOpen={setOpenIndex} />
      ) : effect === "lens" && !lensUnsupported ? (
        <FisheyeLens
          images={images}
          paused={openIndex !== null}
          onOpen={setOpenIndex}
          onUnsupported={() => setLensUnsupported(true)}
        />
      ) : (
        <InfiniteCanvas
          images={images}
          paused={openIndex !== null}
          effect={effect}
          onOpen={setOpenIndex}
        />
      )}

      {/* Hint + effect switch, pinned to the bottom of the canvas. Clicking
          the active effect again goes back to the default (the CRT). */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-3 gap-y-2 whitespace-nowrap font-mono text-[12px] font-medium uppercase leading-none tracking-[0.04em] text-label-grey mix-blend-difference">
        <p aria-hidden="true">Scroll/drag to move</p>
        {EFFECT_OPTIONS.map(([value, label]) => (
          <Fragment key={value}>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              aria-pressed={effect === value}
              onClick={() =>
                setEffect((current) => (current === value ? DEFAULT_EFFECT : value))
              }
              className="pointer-events-auto cursor-pointer uppercase underline-offset-4 transition-colors hover:text-white aria-pressed:text-white aria-pressed:underline"
            >
              {label}
            </button>
          </Fragment>
        ))}
      </div>

      <AnimatePresence>
        {openSrc && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={() => setOpenIndex(null)}
          >
            {flatSrcs.length > 1 && <NavButton direction="prev" onClick={showPrev} />}
            <motion.div
              key={openSrc}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative h-[80vh] w-[80vw]"
              onClick={(event) => event.stopPropagation()}
            >
              <Image src={openSrc} alt="" fill sizes="80vw" className="object-contain" />
            </motion.div>
            {flatSrcs.length > 1 && <NavButton direction="next" onClick={showNext} />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
