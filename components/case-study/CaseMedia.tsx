import Image from "next/image";
import type { MediaBlock, MediaSlot, MediaTone } from "@/lib/case-studies";

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
}: {
  slot: MediaSlot;
  /** aspect-* utility that sets the frame's proportion (from Figma). */
  aspect: string;
  sizes?: string;
}) {
  const tone = slot.tone ?? "faint";

  if (!slot.media) {
    return <div className={`w-full ${aspect} ${toneClass[tone]}`} />;
  }

  return (
    <div className={`relative w-full overflow-hidden ${aspect} ${toneClass[tone]}`}>
      {slot.media.type === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={slot.media.src}
          poster={slot.media.poster}
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
 * A media row between sections: full-bleed single frame (1160×696 in Figma)
 * or a side-by-side pair (576×548 each) that stacks on mobile.
 */
export function CaseMediaBlock({ block }: { block: MediaBlock }) {
  if (block.kind === "full") {
    return (
      <div className="px-6 desk:px-0">
        <CaseMediaSlot slot={block.slot} aspect="aspect-[1160/696]" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 px-6 desk:flex-row desk:px-0">
      {block.slots.map((slot, i) => (
        <div key={i} className="min-w-0 flex-1">
          <CaseMediaSlot
            slot={slot}
            aspect="aspect-[576/548]"
            sizes="(min-width: 1200px) 40vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}
