import type { FundingEntry } from "@/lib/yc";

/** Top of the scale in $M: just above the largest total, so the tallest bar
    nearly fills the frame. Gridlines every $25M below it. */
const SCALE_M = 110;
const GRIDLINES_M = [25, 50, 75, 100];

/** "$108M", "$79M", "$7.2M": whole millions from $10M up, one decimal below.
    Rounded down, like the headline total, so no bar claims more than its
    source. */
function formatM(totalM: number) {
  return totalM >= 10
    ? `$${Math.floor(totalM)}M`
    : `$${Math.floor(totalM * 10) / 10}M`;
}

function heightPct(totalM: number) {
  return (totalM / SCALE_M) * 100;
}

/**
 * Fig. 01 on /yc: every YC client as one column, oldest batch first, its
 * public funding as a color.brand.accent bar. The data-as-blocks idea comes
 * from Swiss concert posters (Müller-Brockmann's Tonhalle series): plain
 * rectangles, a hairline baseline, names set vertically under it.
 *
 * Desk draws vertical columns; below desk the same data runs as horizontal
 * bars, since 13 columns don't fit a phone. Both are aria-hidden; the
 * sr-only list carries the figures for screen readers.
 */
export function FundingChart({ entries }: { entries: FundingEntry[] }) {
  const columns = { gridTemplateColumns: `repeat(${entries.length}, minmax(0, 1fr))` };

  return (
    <figure className="flex flex-col">
      <figcaption className="sr-only">
        Public funding raised by each YC company PIXELUP LABS designs for, by
        batch.
      </figcaption>
      <ol className="sr-only">
        {entries.map((e) => (
          <li key={e.slug}>
            {e.name}, YC {e.batch}:{" "}
            {e.totalM ? `${formatM(e.totalM)} raised` : "no public round"}
          </li>
        ))}
      </ol>

      {/* Desk: columns */}
      <div aria-hidden="true" className="hidden desk:block">
        <div className="relative h-[240px] border-b-[0.5px] border-white/40">
          {GRIDLINES_M.map((m) => (
            <div
              key={m}
              className="absolute inset-x-0 border-t-[0.5px] border-dashed border-hairline"
              style={{ bottom: `${heightPct(m)}%` }}
            >
              <span className="absolute right-0 -translate-y-full pb-1 font-mono text-[12px] leading-none text-white/30">
                ${m}M
              </span>
            </div>
          ))}
          <div className="absolute inset-0 grid" style={columns}>
            {entries.map((e, i) => (
              <div
                key={e.slug}
                className={`group flex h-full flex-col items-stretch justify-end px-1.5 ${i > 0 ? "border-l-[0.5px] border-hairline" : ""}`}
              >
                <span
                  className={`mb-2 text-center font-mono text-[12px] leading-none ${e.totalM ? "text-white" : "text-white/30"}`}
                >
                  {e.totalM ? formatM(e.totalM) : "—"}
                </span>
                {e.totalM ? (
                  <span
                    className="bar-rise block bg-accent transition-colors duration-300 group-hover:bg-white"
                    style={{
                      height: `${Math.max(heightPct(e.totalM), 1)}%`,
                      animationDelay: `${200 + i * 45}ms`,
                    }}
                  />
                ) : (
                  <span className="block h-px bg-white/30" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="grid" style={columns}>
          {entries.map((e, i) => (
            <div
              key={e.slug}
              className={`flex min-h-[132px] flex-col items-center gap-3 pt-3 ${i > 0 ? "border-l-[0.5px] border-hairline" : ""}`}
            >
              <span className="font-mono text-[12px] leading-none text-white/40">
                {e.batch}
              </span>
              <span className="rotate-180 whitespace-nowrap text-[14px] leading-none tracking-[-0.01em] text-white/80 [writing-mode:vertical-rl]">
                {e.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Below desk: horizontal bars */}
      <ol aria-hidden="true" className="flex flex-col desk:hidden">
        {entries.map((e) => (
          <li
            key={e.slug}
            className="grid grid-cols-[8.75rem_minmax(0,1fr)_3.5rem] items-center gap-3 border-t-[0.5px] border-hairline py-2.5"
          >
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="truncate text-[14px] leading-none text-white">
                {e.name}
              </span>
              <span className="shrink-0 font-mono text-[12px] leading-none text-white/40">
                {e.batch}
              </span>
            </span>
            <span className="block h-1.5 bg-white/10">
              {e.totalM ? (
                <span
                  className="block h-full bg-accent"
                  style={{ width: `${Math.max(heightPct(e.totalM), 1)}%` }}
                />
              ) : null}
            </span>
            <span
              className={`text-right font-mono text-[12px] leading-none ${e.totalM ? "text-white" : "text-white/30"}`}
            >
              {e.totalM ? formatM(e.totalM) : "—"}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
