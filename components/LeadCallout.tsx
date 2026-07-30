// Accent-blue callout that sits directly above the trusted strip in the hero
// sidebar — the objection the trusted-by logos are there to answer.
//
// Geometry is straight from the Figma frame: 12px padding on all four sides
// inside a 3px accent rule, stepping down to 12px type in 10px of padding on
// mobile. No explicit height — 14px/120% plus that padding comes to the spec'd
// 41px on one line, and lets the box grow to two rather than clipping in the
// narrower sidebar widths.
//
// font-display is the site-wide body face (Inter Display, set on <body>) so
// this is inherited, not an override — stated explicitly because the 0.2px
// tracking below is positive, unlike every other tracking value on the site,
// and reads as a mistake without the typeface named next to it.
export function LeadCallout() {
  return (
    <p className="flex items-center border-l-[3px] border-accent bg-accent/20 p-2.5 font-display text-[12px] leading-[1.2] tracking-[0.2px] text-white desk:p-3 desk:text-[14px]">
      Don&apos;t want your leads to think - &quot;will these guys exist in 3 years?&quot;
    </p>
  );
}
