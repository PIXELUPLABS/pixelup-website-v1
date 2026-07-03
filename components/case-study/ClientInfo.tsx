import type { CaseStudy } from "@/lib/case-studies";

function ArrowOutwardIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17 17 7M8 7h9v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex px-5 py-3 text-[14px] tracking-[-0.01em]">
      <p className="w-[104px] shrink-0 leading-[1.3] text-white/60">{label}</p>
      <div className="min-w-0 flex-1 leading-[1.25] text-white">{children}</div>
    </div>
  );
}

/**
 * Client / Year / Involvement / Link rows with hairline dividers.
 * Lives in the sidebar on desktop and under the title on mobile.
 */
export function ClientInfo({
  info,
  className = "",
}: {
  info: CaseStudy["info"];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col divide-y-[0.5px] divide-hairline border-y-[0.5px] border-hairline ${className}`}
    >
      <InfoRow label="Client">{info.client}</InfoRow>
      <InfoRow label="Year">{info.year}</InfoRow>
      <InfoRow label="Involvement">
        {info.involvement.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </InfoRow>
      <InfoRow label="Link">
        <a
          href={info.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:opacity-70"
        >
          {info.link.label}
          <ArrowOutwardIcon />
        </a>
      </InfoRow>
    </div>
  );
}
