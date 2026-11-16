import { ClientRow } from "@/components/clients/ClientRow";
import type { BatchGroup } from "@/lib/yc";

/** SectionRows' bleedMargin (the LeftNav shell's mx-4 and p-5), padded back
    so text sits on the column's edges while the rules run to the divider
    and the viewport edge. The parent section carries bleedMargin. */
const padLeft = "desk:pl-4";
const padRight = "desk:pr-5";

/** ClientRow's dense column template, repeated for the label row. */
const denseColumns =
  "desk:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)_minmax(0,1.5fr)]";

/**
 * The /yc index, set like a Swiss concert programme: the batch is the
 * "date" in large type on the left quarter, its companies listed beside it
 * as dense ClientRows. One group per batch, newest first. Every group's top
 * rule runs the full bleed width; the quarter line is the group's spine.
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
        <p className={`border-r-[0.5px] border-hairline py-4 ${padLeft} pr-6`}>
          Batch
        </p>
        <div
          className={`col-span-3 grid gap-6 py-4 pl-6 ${padRight} ${denseColumns}`}
        >
          <p>Company · latest round</p>
          <p>Niche</p>
          <p>What we did</p>
        </div>
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
                className={`desk:pl-6 ${padRight}`}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
