import Image from "next/image";
import type {
  MediaBlock,
  MediaComment,
  MediaSlot,
  MediaTone,
} from "@/lib/case-studies";
import { FloatingComment } from "./FloatingComment";
import { ScrollVideo } from "./ScrollVideo";

/** FloatingComment is a client component, so its props ship to the browser.
 * A blurred mention sends a same-length placeholder, never the real name. */
function forClient(comment: MediaComment): MediaComment {
  return comment.blurMention && comment.mention
    ? { ...comment, mention: "x".repeat(comment.mention.length) }
    : comment;
}

// Placeholder fills matching the Figma frames: solid white boxes, near-black
// empty frames, and the dark-green gradient panels.
const toneClass: Record<MediaTone, string> = {
  white: "bg-white",
  faint: "bg-white/[0.04]",
  green:
    "bg-[#06281b] [background-image:linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.65)_100%)]",
};

export function CaseMediaSlot({
  slot,
  aspect,
  sizes = "(min-width: 1200px) 80vw, 100vw",
  priority = false,
}: {
  slot: MediaSlot;
  /** aspect-* utility that sets the frame's proportion (from Figma). */
  aspect: string;
  sizes?: string;
  /** Eager-load the image for above-the-fold media (the case hero). */
  priority?: boolean;
}) {
  const tone = slot.tone ?? "faint";

  if (!slot.media) {
    return <div className={`w-full ${aspect} ${toneClass[tone]}`} />;
  }

  if (slot.media.type === "image" && slot.intrinsicSize) {
    return (
      <div className={`relative w-full overflow-hidden ${toneClass[tone]}`}>
        <Image
          src={slot.media.src}
          alt={slot.alt ?? ""}
          width={slot.intrinsicSize.width}
          height={slot.intrinsicSize.height}
          sizes={sizes}
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          className="h-auto w-full"
        />
        {slot.overlayLogo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src={slot.overlayLogo}
              alt=""
              aria-hidden="true"
              className="w-[18%]"
            />
          </div>
        )}
      </div>
    );
  }

  if (slot.media.type === "video" && slot.intrinsicSize) {
    return (
      <div className={`relative w-full overflow-hidden ${toneClass[tone]}`}>
        {slot.playOnView ? (
          <ScrollVideo
            media={slot.media}
            label={slot.alt}
            className="block h-auto w-full"
            width={slot.intrinsicSize.width}
            height={slot.intrinsicSize.height}
          />
        ) : (
          <video
            className="block h-auto w-full"
            src={slot.media.src}
            poster={slot.media.poster}
            width={slot.intrinsicSize.width}
            height={slot.intrinsicSize.height}
            aria-label={slot.alt}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${aspect} ${toneClass[tone]}`}
    >
      {slot.media.type === "video" && slot.playOnView ? (
        <ScrollVideo
          media={slot.media}
          label={slot.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : slot.media.type === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={slot.media.src}
          poster={slot.media.poster}
          aria-label={slot.alt}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <Image
          src={slot.media.src}
          alt={slot.alt ?? ""}
          fill
          sizes={sizes}
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover"
        />
      )}
      {slot.overlayLogo && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img
            src={slot.overlayLogo}
            alt=""
            aria-hidden="true"
            className="w-[18%]"
          />
        </div>
      )}
    </div>
  );
}

/**
 * A media row between sections: a single frame (1160×696 in Figma) or a
 * side-by-side pair (576×548 each) that stacks on mobile. On desktop each
 * block gets even 24px spacing on all sides (desk:p-6), same as the hero;
 * mobile keeps the original edge-to-edge px-6 treatment.
 */
export function CaseMediaBlock({
  block,
  priority = false,
}: {
  block: MediaBlock;
  priority?: boolean;
}) {
  if (block.kind === "full") {
    const slot = (
      <CaseMediaSlot
        slot={block.slot}
        aspect={block.aspect === "wide" ? "aspect-video" : "aspect-[1160/696]"}
        priority={priority}
      />
    );
    return (
      <div className="px-6 desk:p-6">
        {block.slot.comment ? (
          <div className="relative">
            {slot}
            <FloatingComment comment={forClient(block.slot.comment)} />
          </div>
        ) : (
          slot
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 px-6 desk:flex-row desk:gap-6 desk:p-6">
      {block.slots.map((slot, i) => (
        <div key={i} className="min-w-0 flex-1">
          <CaseMediaSlot
            slot={slot}
            aspect={
              block.aspect === "wide" ? "aspect-video" : "aspect-[576/548]"
            }
            sizes="(min-width: 1200px) 40vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}
