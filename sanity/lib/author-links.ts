/**
 * Public profile URLs for post authors, keyed by the author's name as it
 * appears before the comma in the "Written by" string ("Daksh Aswal, Founder at
 * PIXELUP LABS" -> "Daksh Aswal"). Kept local so the blog detail page can link
 * the byline without a Sanity schema change. Keep the old first-name key so a
 * rename in Sanity never drops the link.
 */
const AUTHOR_PROFILE_URLS: Record<string, string> = {
  'Daksh Aswal': 'https://www.linkedin.com/in/dakshpixelup/',
  Daksh: 'https://www.linkedin.com/in/dakshpixelup/',
}

export function authorName(author: string): string {
  const commaIndex = author.indexOf(',')
  return commaIndex === -1 ? author.trim() : author.slice(0, commaIndex).trim()
}

export function authorProfileUrl(author: string): string | undefined {
  return AUTHOR_PROFILE_URLS[authorName(author)]
}
