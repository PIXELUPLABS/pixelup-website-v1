"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
  setRef,
  onOpen,
  onFocusCard,
}: {
  image: ExplorationImageData;
  index: number;
  card: CardLayout;
  intro: number;
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
        className="group block h-full w-full animate-[exploration-card-in_900ms_cubic-bezier(0.22,1,0.36,1)_both] cursor-pointer overflow-hidden bg-white/[0.03] outline-none focus-visible:ring-1 focus-visible:ring-white/60 motion-reduce:animate-none"
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
  onOpen,
}: {
  images: ExplorationImageData[];
  paused: boolean;
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
  });
  const layoutRef = useRef<CanvasLayout | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

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
        node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
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
      <InfiniteCanvas images={images} paused={openIndex !== null} onOpen={setOpenIndex} />

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
