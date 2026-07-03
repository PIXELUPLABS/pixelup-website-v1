import Image from "next/image";
import strip from "@/public/media/trusted-strip.png";

// Individual logos appended after the baked strip image. Heights are tuned
// per mark so they sit optically level with the strip's wordmarks (~16px).
const extraLogos = [
  { src: "/media/logos/pogo.svg", alt: "Pogo", height: "h-[18px]" },
  { src: "/media/logos/streamline.svg", alt: "Streamline", height: "h-4" },
  { src: "/media/logos/bland.svg", alt: "Bland", height: "h-[15px]" },
  { src: "/media/logos/sainapse.svg", alt: "Sainapse", height: "h-4" },
];

export function TrustedStrip() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] text-label-grey">Trusted by top YC companies</p>
      {/* Horizontal marquee — the repeat block (strip + extra logos) is
          duplicated for a seamless loop. */}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* Each copy carries its own trailing gap so translateX(-50%) equals
            exactly one repeat period. gap/margin match the strip's internal
            logo spacing so the seams read like just another gap. */}
        <div className="flex w-max animate-[marquee_30s_linear_infinite]">
          {[0, 1].map((i) => (
            <div
              key={i}
              aria-hidden={i === 1}
              className="mr-3 flex items-center gap-3"
            >
              <Image
                src={strip}
                alt={i === 0 ? "Logos of YC companies PixelUp Labs has worked with" : ""}
                className="h-6 w-auto opacity-70"
                priority
              />
              {extraLogos.map((logo) => (
                <img
                  key={logo.src}
                  src={logo.src}
                  alt={i === 0 ? logo.alt : ""}
                  className={`${logo.height} w-auto opacity-70`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
