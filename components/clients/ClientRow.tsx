import Image from "next/image";
import type { Client } from "@/lib/clients";

const placeholderLogos = [
  "/media/logos/pogo.svg",
  "/media/logos/streamline.svg",
  "/media/logos/sainapse.svg",
  "/media/logos/bland.svg",
] as const;

const logoFrameClassBySlug: Record<string, string> = {
  "autumn-pricing": "h-[27.324px] w-[111.0348px]",
  bland: "h-[21.6px] w-[74.6182px]",
  ctgt: "h-[26.4px] w-[96.7074px]",
  conigma: "h-[30px] w-[122.5px]",
  "conscious-engines": "h-[18.5521px] w-[201.6px]",
  dayflow: "h-[30px] w-[105.7522px]",
  greptile: "h-[26.4px] w-[109.0065px]",
  henrylabs: "h-6 w-[154.56px]",
  "lasting-learn": "h-[23.6262px] w-[161.28px]",
  "my-wonder": "h-[28.8px] w-[112.6286px]",
  nfa: "h-[21.6px] w-[57.0857px]",
  pogo: "h-[30.36px] w-[62.8138px]",
  reducto: "h-6 w-[118.272px]",
  revyl: "h-[26.4px] w-[96.8px]",
  sainapse: "h-[25.8px] w-[142.8214px]",
  streamline: "h-[29.04px] w-[141.4529px]",
  sully: "h-6 w-[89.6px]",
  "synthio-labs": "h-[26.9242px] w-[154.56px]",
  umbra: "h-6 w-[89.6px]",
  "vertera-health": "h-[26.4px] w-[102.2092px]",
  zenact: "h-6 w-[107.52px]",
  jumbo: "h-6 w-[107.52px]",
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
    logoFrameClassBySlug[client.slug] ?? "h-6 w-[134.4px]";

  return (
    <div className="flex min-w-0 items-center">
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
    </div>
  );
}

export function ClientRow({ client, index }: { client: Client; index: number }) {
  const entranceDelay = `${Math.min(100 + index * 70, 600)}ms`;
  const balancedEngagement = splitForBalancedLastLine(client.engagement);

  return (
    <li
      className="fade-up grid grid-cols-1 gap-0 border-t-[0.5px] border-hairline pb-10 pt-6.25 desk:grid-cols-[1.6fr_0.6fr_0.8fr] desk:items-start desk:gap-6"
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
