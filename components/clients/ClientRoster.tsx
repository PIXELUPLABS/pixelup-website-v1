import type { Client } from "@/lib/clients";
import { ClientRow } from "./ClientRow";

export function ClientRoster({ clients }: { clients: Client[] }) {
  return (
    <section aria-labelledby="client-roster-heading" className="flex flex-col">
      <div className="fade-up flex flex-col gap-5 pb-6 [animation-delay:100ms] desk:flex-row desk:items-end desk:justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
            Client roster
          </p>
          <h2
            id="client-roster-heading"
            className="tracking-display max-w-[18ch] text-[32px] font-medium leading-[1.05] text-white desk:text-[48px]"
          >
            Work that spans the whole company surface.
          </h2>
        </div>
        <p className="max-w-[42ch] text-[14px] leading-[1.4] tracking-[-0.02em] text-white/60">
          This working roster is built from the current PixelUp Labs site archive.
          More engagements will be added as the full client history is confirmed.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="hidden grid-cols-[1.1fr_0.75fr_1.55fr] gap-6 border-t-[0.5px] border-hairline py-4 font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey desk:grid"
      >
        <p>Client · {clients.length.toString().padStart(2, "0")}</p>
        <p>Niche</p>
        <p>What we did</p>
      </div>

      <ol className="border-b-[0.5px] border-hairline">
        {clients.map((client, index) => (
          <ClientRow key={client.slug} client={client} index={index} />
        ))}
      </ol>
    </section>
  );
}
