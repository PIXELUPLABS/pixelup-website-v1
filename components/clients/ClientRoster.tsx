import type { Client } from "@/lib/clients";
import { ClientRow } from "./ClientRow";

/** The LeftNav shell's divider gap (mx-4) and outer padding (p-5), padded
    back inside a parent that carries SectionRows' bleedMargin. */
const bleedPadding = "desk:pl-4 desk:pr-5";

export function ClientRoster({
  clients,
  bleed = false,
}: {
  clients: Client[];
  /** /yc: the parent section is pulled out with SectionRows' bleedMargin, so
      every row's hairline runs from the LeftNav divider to the viewport
      edge. The labels and rows pad that distance back, which keeps the
      three columns where they sit on /clients. */
  bleed?: boolean;
}) {
  return (
    <section aria-label="Client roster" className="flex flex-col desk:pb-7">
      <div
        aria-hidden="true"
        className={`hidden grid-cols-[1.6fr_0.6fr_0.8fr] gap-6 pb-6 font-display text-[12px] font-medium uppercase leading-none tracking-[0.04em] text-white/60 desk:grid ${bleed ? bleedPadding : ""}`}
      >
        <p>Client</p>
        <p>Niche</p>
        <p>What we did</p>
      </div>

      <ol>
        {clients.map((client, index) => (
          <ClientRow
            key={client.slug}
            client={client}
            index={index}
            className={bleed ? bleedPadding : undefined}
          />
        ))}
      </ol>
    </section>
  );
}
