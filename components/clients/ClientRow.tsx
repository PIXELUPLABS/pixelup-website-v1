import Image from "next/image";
import Link from "next/link";
import type { Client } from "@/lib/clients";

const placeholderLogos = [
  "/media/logos/pogo.svg",
  "/media/logos/streamline.svg",
  "/media/logos/sainapse.svg",
  "/media/logos/bland.svg",
] as const;

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
  const actionClass =
    "w-fit text-white underline decoration-white/30 underline-offset-4 transition-colors hover:bg-accent hover:no-underline";

  return (
    <li
      className="fade-up grid grid-cols-1 gap-6 border-t-[0.5px] border-hairline py-6 desk:grid-cols-[0.8fr_0.8fr_1.2fr] desk:items-start"
      style={{ animationDelay: entranceDelay }}
    >
      <ClientIdentity client={client} index={index} />

      <div className="flex flex-col gap-2">
        <p className="font-mono text-[12px] font-medium uppercase leading-[1.3] tracking-[0.04em] text-label-grey desk:hidden">
          Niche
        </p>
        <p className="text-[14px] leading-[1.4] tracking-[-0.02em] text-white/60">
          {client.niche}
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <p className="font-mono text-[12px] font-medium uppercase leading-[1.3] tracking-[0.04em] text-label-grey desk:hidden">
          What we did
        </p>
        <p className="text-[16px] leading-[1.4] tracking-[-0.02em] text-white/80">
          {client.engagement}
        </p>
        <div className="flex min-h-4 items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.04em]">
          {client.caseStudySlug && (
            <Link
              href={`/case-studies/${client.caseStudySlug}`}
              className={actionClass}
            >
              View case study
            </Link>
          )}
          {!client.caseStudySlug && client.website && (
            <a
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className={actionClass}
            >
              View website
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
