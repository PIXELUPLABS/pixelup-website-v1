import type { Client } from "@/lib/clients";
import { ClientRow } from "./ClientRow";

export function ClientRoster({ clients }: { clients: Client[] }) {
  return (
    <section aria-label="Client roster" className="flex flex-col desk:px-6 desk:py-7">
      <div
        aria-hidden="true"
        className="hidden grid-cols-2 gap-6 pb-6 font-display text-[12px] font-medium uppercase leading-none tracking-[0.04em] text-white/60 desk:grid"
      >
        <p>Client name</p>
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
