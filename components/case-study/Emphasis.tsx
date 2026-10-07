// No `g` flag: a global regex keeps `lastIndex` between `.test()` calls.
const emphasisPattern = /\*\*(.+?)\*\*/;

export function hasEmphasis(text: string) {
  return emphasisPattern.test(text);
}

/**
 * Renders `**phrase**` in case study copy as a white highlight. The parent
 * sets the muted base color (`text-muted-65`), so readers can skim the white
 * phrases alone — the same pattern as the homepage hero subheading (LeftNav).
 */
export function Emphasis({ text }: { text: string }) {
  return text.split(emphasisPattern).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-white">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
