// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import 'server-only'
import { defineLive } from "next-sanity/live";
import { client } from './client'

const token = process.env.SANITY_API_READ_TOKEN

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token || false,
  browserToken: false,
});

/**
 * Pass as `tags` on every sanityFetch() call so the publish webhook
 * (app/api/revalidate) can expire all cached Sanity reads at once.
 * sanityFetch caches with no expiry and otherwise tags results only with
 * Sanity sync tags, which only <SanityLive /> revalidates — and
 * app/blog/layout.tsx mounts it in draft mode only.
 */
export const SANITY_CACHE_TAG = 'sanity'
