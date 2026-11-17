import type { Client } from "@/lib/clients";
import { ClientRow } from "./ClientRow";

export function ClientRoster({
  clients,
  batches,
}: {
  clients: Client[];
  /** /yc's index: slug → YC batch line, shown in place of "What we did".
      The roster then sits on /yc's quarter grid (see ClientRow's batch)
      under its own top rule, since there it follows a heading row. */
  batches?: Record<string, string>;
}) {
  if (batches) {
    return (
      <div className="flex flex-col">
        <div
          aria-hidden="true"
          className="hidden grid-cols-4 border-t-[0.5px] border-hairline py-6 font-display text-[12px] font-medium uppercase leading-none tracking-[0.04em] text-white/60 desk:grid"
        >
          <p className="col-span-2 px-6">Client</p>
          <p className="px-6">Niche</p>
          <p className="px-6">Batch</p>
        </div>

        <ol>
          {clients.map((client, index) => (
            <ClientRow
              key={client.slug}
              client={client}
              index={index}
              batch={batches[client.slug] ?? ""}
            />
          ))}
        </ol>
      </div>
    );
  }

  return (
    <section aria-label="Client roster" className="flex flex-col desk:pb-7">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[45%_0.6fr_0.8fr] gap-5 pb-6 font-display text-[12px] font-medium uppercase leading-none tracking-[0.04em] text-white/60 desk:grid"
      >
        <p>Client</p>
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
