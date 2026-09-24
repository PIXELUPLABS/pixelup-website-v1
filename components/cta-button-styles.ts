// Shared button geometry/type, deliberately free of any color, vertical
// padding, or flex-sizing class. AuditCta reuses this for the white variant —
// appending `text-black` to a base that already carries `text-white` would NOT
// reliably win (equal specificity, so stylesheet order decides, not
// class-attribute order), so the colorway is always the caller's job. Vertical
// padding is out for exactly the same reason: AuditNavCta runs a shorter button
// inside the 64px navbar, and an appended py-* couldn't reliably override a
// baked-in one. Every caller states its own py-*.
//
// Kept out of CtaButtons.tsx so the client-side BookCallForm can use it without
// importing the component that renders it.
export const ctaButtonBase =
  "flex items-center justify-between rounded-[2px] px-3 " +
  "font-display text-[12px] font-medium tracking-[-0.12px] transition-colors";

/** The standard full-size CTA height, used everywhere except the navbar. */
export const ctaButtonPadding = "py-[11.5px]";
