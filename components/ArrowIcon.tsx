// The site's arrow glyph, shared by every CTA that needs it.
//
// Inlined rather than using /media/Container.svg because that asset hardcodes
// fill="white", which is invisible on a white button. currentColor lets it
// inherit text-black on the white colorway and text-white everywhere else.
//
// Lives in its own module so both server components (AuditCta) and client
// components (AuditNavCta) can import it without dragging the rest of either
// file's imports along with it.
export function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.2173 8.80431V7.19579H9.60876V8.80431H11.2173ZM9.60876 7.19579V5.58727H8.00024V7.19579H9.60876ZM9.60876 10.4128V8.80431H8.00024V10.4128H9.60876ZM8.00024 5.58727V3.97876H6.39172V5.58727H8.00024ZM8.00024 12.0213V10.4128H6.39172V12.0213H8.00024ZM6.39172 3.97876V2.37024H4.7832V3.97876H6.39172ZM6.39172 13.6299V12.0213H4.7832V13.6299H6.39172Z"
        fill="currentColor"
      />
    </svg>
  );
}
