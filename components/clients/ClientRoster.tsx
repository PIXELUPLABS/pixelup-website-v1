import type { Client } from "@/lib/clients";
import { ClientRow } from "./ClientRow";

export function ClientRoster({ clients }: { clients: Client[] }) {
  return (
    <section aria-labelledby="client-roster-heading" className="flex flex-col">
      <div className="fade-up flex flex-col gap-3 pb-6 [animation-delay:100ms]">
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

      <div
        aria-hidden="true"
        className="hidden grid-cols-[0.8fr_0.8fr_1.2fr] gap-6 border-t-[0.5px] border-hairline py-4 font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey desk:grid"
      >
        <p>Client · {clients.length.toString().padStart(2, "0")}</p>
        <p>Niche</p>
        <p>What we did</p>
      </div>

      <ol>
        {clients.map((client, index) => (
          <ClientRow key={client.slug} client={client} index={index} />
        ))}
      </ol>
    </section>
  );
}
