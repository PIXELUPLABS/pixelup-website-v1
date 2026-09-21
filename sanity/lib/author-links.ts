/**
 * Public profile URLs for post authors, keyed by the author's first name as it
 * appears before the comma in the "Written by" string ("Daksh, Founder at
 * PIXELUP LABS" -> "Daksh"). Kept local so the blog detail page can link the
 * byline without a Sanity schema change.
 */
const AUTHOR_PROFILE_URLS: Record<string, string> = {
  Daksh: 'https://www.linkedin.com/in/dakshpixelup/',
}

export function authorName(author: string): string {
  const commaIndex = author.indexOf(',')
  return commaIndex === -1 ? author.trim() : author.slice(0, commaIndex).trim()
}

export function authorProfileUrl(author: string): string | undefined {
  return AUTHOR_PROFILE_URLS[authorName(author)]
}
