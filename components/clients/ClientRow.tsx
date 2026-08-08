import Image from "next/image";
import type { Client } from "@/lib/clients";

const placeholderLogos = [
  "/media/logos/pogo.svg",
  "/media/logos/streamline.svg",
  "/media/logos/sainapse.svg",
  "/media/logos/bland.svg",
] as const;

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
  const logo = client.logo ?? placeholderLogos[index % placeholderLogos.length];

  return (
    <div className="flex min-w-0 items-center">
      <div className="flex h-10 w-28 shrink-0 items-center">
        <Image
          src={logo}
          alt={isPlaceholderLogo ? "" : client.name}
          width={160}
          height={40}
          className="max-h-8 w-auto max-w-full object-contain object-left opacity-80"
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
      className="fade-up grid grid-cols-1 gap-6 border-t-[0.5px] border-hairline py-6 desk:grid-cols-2 desk:items-center desk:gap-6 desk:py-4"
      style={{ animationDelay: entranceDelay }}
    >
      <div className="flex min-w-0 flex-col gap-4 desk:gap-0">
        <ClientIdentity client={client} index={index} />
        <div className="flex flex-col gap-2 desk:gap-0">
          <p className="font-mono text-[12px] font-medium uppercase leading-[1.3] tracking-[0.04em] text-label-grey desk:hidden">
            Niche
          </p>
          <p className="text-[14px] leading-5 tracking-[-0.02em] text-white/60">
            {client.niche}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
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
