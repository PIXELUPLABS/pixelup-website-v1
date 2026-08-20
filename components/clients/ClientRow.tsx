import Image from "next/image";
import type { Client } from "@/lib/clients";

const placeholderLogos = [
  "/media/logos/pogo.svg",
  "/media/logos/streamline.svg",
  "/media/logos/sainapse.svg",
  "/media/logos/bland.svg",
] as const;

/**
 * Every logo frame shares the same h-7 (28px) height so the roster reads as
 * one even row. Width is still each logo's own natural aspect ratio at that
 * height (recalculated from the original per-logo bounding boxes) so nothing
 * gets stretched or squished — only the box height was ever unequal.
 */
const logoFrameClassBySlug: Record<string, string> = {
  "autumn-pricing": "h-7 w-[113.7817px]",
  bland: "h-7 w-[96.7273px]",
  ctgt: "h-7 w-[102.5682px]",
  conigma: "h-7 w-[114.3333px]",
  "conscious-engines": "h-7 w-[172.032px]",
  dayflow: "h-7 w-[98.702px]",
  greptile: "h-7 w-[115.612px]",
  henrylabs: "h-7 w-[180.32px]",
  "lasting-learn": "h-7 w-[191.1392px]",
  "my-wonder": "h-7 w-[109.4667px]",
  nfa: "h-7 w-[74px]",
  pogo: "h-7 w-[57.9312px]",
  reducto: "h-7 w-[137.984px]",
  revyl: "h-7 w-[102.6667px]",
  sainapse: "h-7 w-[155.0004px]",
  streamline: "h-7 w-[136.3928px]",
  sully: "h-7 w-[104.5333px]",
  "synthio-labs": "h-7 w-[160.734px]",
  umbra: "h-7 w-[104.5333px]",
  "vertera-health": "h-7 w-[108.404px]",
  zenact: "h-7 w-[125.44px]",
  jumbo: "h-7 w-[125.44px]",
};

function splitForBalancedLastLine(text: string) {
  const words = text.trim().split(/\s+/);
  const trailingWords = words.splice(-3).join(" ");

  return {
    leadingWords: words.join(" "),
    trailingWords,
  };
}

function ClientIdentity({ client, index }: { client: Client; index: number }) {
  const isPlaceholderLogo = !client.logo;
  const preservesSourceColors = ["conigma", "vertera-health"].includes(client.slug);
  const logo = client.logo ?? placeholderLogos[index % placeholderLogos.length];
  const logoFrameClass =
    logoFrameClassBySlug[client.slug] ?? "h-7 w-[156.8px]";

  return (
    <div className="flex min-w-0 flex-col items-start gap-2">
      <div className={`relative max-w-full shrink-0 ${logoFrameClass}`}>
        <Image
          src={logo}
          alt={isPlaceholderLogo ? "" : client.name}
          fill
          sizes="202px"
          className={`object-contain object-left ${
            preservesSourceColors ? "" : "brightness-0 invert"
          }`}
        />
        {isPlaceholderLogo && <span className="sr-only">{client.name} logo placeholder</span>}
      </div>
      {client.fundingNote && (
        <p className="text-[14px] leading-[1.3] text-label-grey">{client.fundingNote}</p>
      )}
    </div>
  );
}

export function ClientRow({ client, index }: { client: Client; index: number }) {
  const entranceDelay = `${Math.min(100 + index * 70, 600)}ms`;
  const balancedEngagement = splitForBalancedLastLine(client.engagement);

  return (
    <li
      className="fade-up grid grid-cols-1 gap-0 border-t-[0.5px] border-hairline pb-10 pt-6.25 desk:grid-cols-[45%_0.6fr_0.8fr] desk:items-start desk:gap-5"
      style={{ animationDelay: entranceDelay }}
    >
      <ClientIdentity client={client} index={index} />

      <div className="mt-2.5 flex min-w-0 flex-col gap-2 desk:mt-0 desk:gap-0">
        <p className="font-mono text-[12px] font-medium uppercase leading-[1.3] tracking-[0.04em] text-label-grey desk:hidden">
          Niche
        </p>
        <p className="text-[14px] leading-5 tracking-[-0.02em] text-white/60">
          {client.niche}
        </p>
      </div>

      <div className="mt-6 flex min-w-0 flex-col gap-3 desk:mt-0">
        <p className="font-mono text-[12px] font-medium uppercase leading-[1.3] tracking-[0.04em] text-label-grey desk:hidden">
          What we did
        </p>
        <p className="text-[14px] leading-5 tracking-[-0.02em] text-white/60 desk:max-w-[363px]">
          {balancedEngagement.leadingWords && (
            <>{balancedEngagement.leadingWords}{" "}</>
          )}
          <span className="whitespace-nowrap">{balancedEngagement.trailingWords}</span>
        </p>
      </div>
    </li>
  );
}
