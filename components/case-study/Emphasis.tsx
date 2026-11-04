import { Fragment, type ReactNode } from "react";

// No `g` flag: a global regex keeps `lastIndex` between `.test()` calls.
const emphasisPattern = /\*\*(.+?)\*\*/;

export function hasEmphasis(text: string) {
  return emphasisPattern.test(text);
}

/**
 * Renders `**phrase**` in case study and ProcessSection copy as a white
 * highlight. The parent sets the muted base color (`text-muted-65`), so
 * readers can skim the white phrases alone — the same pattern as the
 * homepage hero subheading (LeftNav).
 */
export function Emphasis({
  text,
  format,
}: {
  text: string;
  /** Applied to every run of text, highlighted or not (noBreakHyphens). */
  format?: (part: string) => ReactNode;
}) {
  return text.split(emphasisPattern).map((part, index) => {
    const content = format ? format(part) : part;

    return index % 2 === 1 ? (
      <strong key={index} className="font-medium text-white">
        {content}
      </strong>
    ) : (
      <Fragment key={index}>{content}</Fragment>
    );
  });
}
