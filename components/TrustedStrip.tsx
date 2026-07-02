import Image from "next/image";
import strip from "@/public/media/trusted-strip.png";

export function TrustedStrip() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] text-label-grey">Trusted by top YC companies</p>
      {/* Horizontal marquee — the source strip is duplicated for a seamless loop. */}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* Each copy carries its own trailing gap so translateX(-50%) equals
            exactly one repeat period. The margin is tuned to the strip's
            internal logo spacing (~9-12px at this scale) so the loop seam
            reads like just another gap between logos. */}
        <div className="flex w-max animate-[marquee_30s_linear_infinite]">
          {[0, 1].map((i) => (
            <Image
              key={i}
              src={strip}
              alt={i === 0 ? "Logos of YC companies PixelUp Labs has worked with" : ""}
              aria-hidden={i === 1}
              className="mr-2 h-5 w-auto opacity-70"
              priority
            />
          ))}
        </div>
      </div>
    </div>
  );
}
