"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ExplorationBlock } from "@/lib/explorations";

const cardFrame = "relative aspect-[1008/584] w-full overflow-hidden bg-white/[0.03]";

function ExplorationImage({
  src,
  priority,
  sizes,
  onOpen,
}: {
  src: string;
  priority: boolean;
  sizes: string;
  onOpen: (src: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(src)}
      aria-label="Expand image"
      className={`${cardFrame} block cursor-pointer`}
    >
      <Image
        src={src}
        alt=""
        fill
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        className="object-cover"
      />
    </button>
  );
}

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

const views = [
  { key: "grid", label: "Grid" },
  { key: "zoom", label: "Zoom" },
] as const;

/** Grid/Zoom toggle above the images. Zoom also opens the lightbox at the
    first image — lives here (not a separate component) because it needs
    to reach into the same open/close state as the lightbox itself. */
function ViewToggle({
  view,
  onSelect,
}: {
  view: "grid" | "zoom";
  onSelect: (view: "grid" | "zoom") => void;
}) {
  return (
    <div className="flex gap-2 pb-2">
      {views.map((item) => (
        <button
          key={item.key}
          type="button"
          aria-pressed={view === item.key}
          onClick={() => onSelect(item.key)}
          className={`flex h-6 cursor-pointer items-center justify-center px-2 text-[12px] font-medium uppercase leading-none transition-colors ${
            view === item.key ? "bg-[#0658FC] text-white" : "bg-white text-black"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/** Renders the exploration images; clicking one opens it in an 80vw/80vh
    lightbox with the page blurred behind it, with prev/next arrows to
    step through every image on the page. */
export function ExplorationGallery({ blocks }: { blocks: ExplorationBlock[] }) {
  const flatSrcs = blocks.flatMap((block) => (block.kind === "full" ? [block.src] : block.srcs));
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openSrc = openIndex === null ? null : flatSrcs[openIndex];
  // Derived, not separate state — so "which button is blue" can never drift
  // out of sync with whether the lightbox is actually open (Escape, backdrop
  // click, etc. all close it by setting openIndex back to null).
  const view: "grid" | "zoom" = openIndex === null ? "grid" : "zoom";

  const onSelectView = (next: "grid" | "zoom") => {
    setOpenIndex(next === "zoom" ? 0 : null);
  };

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

  const onOpen = (src: string) => setOpenIndex(flatSrcs.indexOf(src));

  return (
    <>
      <ViewToggle view={view} onSelect={onSelectView} />
      {blocks.map((block, index) =>
        block.kind === "full" ? (
          <ExplorationImage
            key={block.src}
            src={block.src}
            priority={index === 0}
            sizes="(min-width: 1200px) 70vw, 100vw"
            onOpen={onOpen}
          />
        ) : (
          <div key={block.srcs.join("-")} className="flex flex-col gap-2 desk:flex-row">
            {block.srcs.map((src) => (
              <div key={src} className="min-w-0 desk:flex-1">
                <ExplorationImage
                  src={src}
                  priority={false}
                  sizes="(min-width: 1200px) 35vw, 100vw"
                  onOpen={onOpen}
                />
              </div>
            ))}
          </div>
        )
      )}

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
