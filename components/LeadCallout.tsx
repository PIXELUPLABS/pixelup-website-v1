// Accent-blue callout that sits directly above the trusted strip in the hero
// sidebar — the objection the trusted-by logos are there to answer.
//
// Geometry follows the Figma frame — 12px padding on all four sides inside a
// 3px accent rule — tightening to 10px of padding on mobile. Type stays 12px at
// every width: 14px pushed the line into a second row inside the sidebar
// column. No explicit height, so the box still grows rather than clipping where
// the copy does wrap.
//
// font-display is the site-wide body face (Inter Display, set on <body>) so
// this is inherited, not an override — stated explicitly because the 0.2px
// tracking below is positive, unlike every other tracking value on the site,
// and reads as a mistake without the typeface named next to it.
export function LeadCallout() {
  return (
    <p className="flex items-center border-l-[3px] border-accent bg-accent/20 p-2.5 font-display text-[12px] leading-[1.2] tracking-[0.2px] text-white desk:p-3">
      Don&apos;t want your leads to think - &quot;will these guys exist in 3 years?&quot;
    </p>
  );
}
