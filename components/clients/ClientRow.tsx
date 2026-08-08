import Image from "next/image";
import Link from "next/link";
import type { Client } from "@/lib/clients";

function ClientIdentity({ client }: { client: Client }) {
  const words = client.name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const initials = (words.length === 1
    ? words[0].slice(0, 2)
    : words.map((word) => word[0]).join("").slice(0, 2)
  ).toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex h-10 w-28 shrink-0 items-center">
        {client.logo ? (
          <Image
            src={client.logo}
            alt=""
            width={160}
            height={40}
            className="max-h-8 w-auto max-w-full object-contain object-left opacity-80"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center border-[0.5px] border-hairline font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-white/70"
          >
            {initials}
          </span>
        )}
      </div>
      <h3 className="min-w-0 text-[20px] font-medium leading-[1.2] tracking-[-0.02em] text-white">
        {client.name}
      </h3>
    </div>
  );
}

export function ClientRow({ client, index }: { client: Client; index: number }) {
  const entranceDelay = `${Math.min(100 + index * 70, 600)}ms`;

  return (
    <li
      className="fade-up grid grid-cols-1 gap-6 border-t-[0.5px] border-hairline py-6 desk:grid-cols-[1.1fr_0.75fr_1.55fr] desk:items-start"
      style={{ animationDelay: entranceDelay }}
    >
      <ClientIdentity client={client} />

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
              className="w-fit text-white underline decoration-white/30 underline-offset-4 transition-colors hover:bg-accent hover:no-underline"
            >
              View case study
            </Link>
          )}
          {client.placeholder && (
            <span className="text-label-grey">Details to confirm</span>
          )}
        </div>
      </div>
    </li>
  );
}
