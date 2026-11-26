// Remembers the last in-site navigation ("came to /case-studies/greptile from
// /"), so BackButton can return a visitor to the page they actually came from
// instead of always sending them to a fixed parent page.
//
// SiteFrame records each pathname change; BackButton reads it. sessionStorage
// rather than module state so it survives a reload of the page they're on.

const STORAGE_KEY = "pixelup:last-navigation";

interface LastNavigation {
  from: string;
  to: string;
}

export function recordNavigation(from: string, to: string) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ from, to }));
  } catch {
    // Storage blocked: BackButton just falls back to its href.
  }
}

/**
 * True when the visitor reached `current` from another page of this site in
 * this tab, so the browser's own Back leads there. history.length guards a
 * tab opened fresh on `current` (a new tab can inherit sessionStorage).
 */
export function cameFromWithinSite(current: string): boolean {
  if (window.history.length < 2) return false;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const last = JSON.parse(raw) as LastNavigation;
    return last.to === current && Boolean(last.from) && last.from !== current;
  } catch {
    return false;
  }
}
