import type { Client } from "@/lib/clients";
import { ClientRow } from "./ClientRow";

export function ClientRoster({ clients }: { clients: Client[] }) {
  return (
    <section aria-label="Client roster" className="flex flex-col">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[0.8fr_0.8fr_1.2fr] gap-6 py-4 font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey desk:grid"
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
