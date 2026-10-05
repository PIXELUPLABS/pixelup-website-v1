"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export type ExplorationImageData = { src: string; width: number; height: number };

// Pinterest-style masonry: equal-width columns, natural aspect ratios, even
// gaps. 2 columns on mobile, 3 on desktop.
const MOBILE_COLUMNS = 2;
const DESKTOP_COLUMNS = 3;

const cardFrame = "relative w-full overflow-hidden bg-white/[0.03]";

function ExplorationImage({
  image,
  priority,
  sizes,
  onOpen,
}: {
  image: ExplorationImageData;
  priority: boolean;
  sizes: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Expand image"
      className={`${cardFrame} block cursor-pointer`}
    >
      <Image
        src={image.src}
        alt=""
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        className="block h-auto w-full"
      />
    </button>
  );
}

/** Greedy masonry: each image (in order) goes into the currently shortest
    column, measured in relative height (height / width), so reading order
    stays roughly left-to-right, top-to-bottom. */
function buildColumns(images: ExplorationImageData[], count: number) {
  const columns = Array.from({ length: count }, () => ({
    height: 0,
    items: [] as number[],
  }));
  images.forEach((image, index) => {
    const shortest = columns.reduce((min, column) => (column.height < min.height ? column : min));
    shortest.items.push(index);
    shortest.height += image.height / image.width;
  });
  return columns.map((column) => column.items);
}

/** One masonry layout. Mobile and desktop each render their own (toggled with
    CSS), since column assignment depends on the column count; images in the
    hidden layout are lazy and never load. */
function MasonryColumns({
  images,
  count,
  sizes,
  className,
  onOpen,
}: {
  images: ExplorationImageData[];
  count: number;
  sizes: string;
  className: string;
  onOpen: (index: number) => void;
}) {
  return (
    <div className={`${className} items-start gap-2`}>
      {buildColumns(images, count).map((indexes, columnIndex) => (
        <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-2">
          {indexes.map((index) => (
            <ExplorationImage
              // Index in the key so the list can repeat the same image.
              key={`${index}-${images[index].src}`}
              image={images[index]}
              // Only desktop's first row loads eagerly. Eager images load even
              // inside the hidden layout, so mobile stays lazy to avoid
              // fetching a second set (its top row is in view anyway).
              priority={count === DESKTOP_COLUMNS && index < DESKTOP_COLUMNS}
              sizes={sizes}
              onOpen={() => onOpen(index)}
            />
          ))}
        </div>
      ))}
    </div>
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

/** Renders the exploration images; clicking one opens it in an 80vw/80vh
    lightbox with the page blurred behind it, with prev/next arrows to
    step through every image on the page. */
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
      <MasonryColumns
        images={images}
        count={MOBILE_COLUMNS}
        sizes="50vw"
        className="flex desk:hidden"
        onOpen={setOpenIndex}
      />
      <MasonryColumns
        images={images}
        count={DESKTOP_COLUMNS}
        sizes="24vw"
        className="hidden desk:flex"
        onOpen={setOpenIndex}
      />

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
