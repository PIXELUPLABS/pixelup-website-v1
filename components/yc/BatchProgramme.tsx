import { ClientRow } from "@/components/clients/ClientRow";
import type { BatchGroup } from "@/lib/yc";

/** The page's outer gutter (SectionRows' "inset" cells, 24px at every
    width): /yc is full width, so the rules run to the column's edges and
    the text sits 24px inside them. */
const padLeft = "pl-6";
const padRight = "pr-6";

/**
 * The /yc index, set like a Swiss concert programme: the batch is the
 * "date" in large type on the left quarter, its companies listed beside it
 * as dense ClientRows (logo | niche | latest round, no engagement line:
 * Arjun, 2026-11-16, "too much copy"). One group per batch, newest first.
 * Every group's top rule runs the full bleed width; the quarter line is the
 * group's spine.
 */
export function BatchProgramme({ groups }: { groups: BatchGroup[] }) {
  let rowIndex = 0;

  return (
    <div className="flex flex-col">
      {/* Column labels, desk only (ClientRoster's header). */}
      <div
        aria-hidden="true"
        className="hidden border-t-[0.5px] border-hairline font-mono text-[12px] uppercase leading-none tracking-[0.06em] text-white/40 desk:grid desk:grid-cols-4"
      >
        {/* The page's four columns: each label starts on a quarter line,
            where its cells below start. */}
        <p className={`border-r-[0.5px] border-hairline py-4 ${padLeft} pr-6`}>
          Batch
        </p>
        <p className="py-4 pl-6">Company</p>
        <p className="py-4 pl-6">Niche</p>
        <p className={`py-4 pl-6 ${padRight}`}>Latest round</p>
      </div>

      {groups.map((group) => (
        <section
          key={group.batch}
          aria-label={`YC ${group.season}`}
          className="grid border-t-[0.5px] border-hairline desk:grid-cols-4"
        >
          <div
            className={`flex items-baseline gap-3 pt-6 desk:flex-col desk:items-start desk:gap-2 desk:border-r-[0.5px] desk:border-hairline desk:py-6 ${padLeft} desk:pr-6`}
          >
            <p className="text-[32px] font-medium leading-none tracking-display text-white desk:text-[48px]">
              {group.batch}
            </p>
            <p className="font-mono text-[12px] uppercase leading-none tracking-[0.06em] text-white/40">
              {group.season}
            </p>
          </div>
          <ol className="desk:col-span-3">
            {group.clients.map((client) => (
              <ClientRow
                key={client.slug}
                client={client}
                index={rowIndex++}
                dense
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
