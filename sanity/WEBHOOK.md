# Sanity publication webhook

Create one GROQ-powered webhook for the deployed website after its environment variables are configured.

- URL: `https://www.pixeluplabs.com/api/revalidate`
- Dataset: `production`
- HTTP method: `POST`
- Triggers: Create, Update, Delete
- Drafts and versions: disabled
- Filter:

```groq
_type in ["blogPost", "author", "category"]
```

- Projection:

```groq
{
  "operation": delta::operation(),
  "documentType": coalesce(after()._type, before()._type),
  "beforeSlug": before().slug.current,
  "afterSlug": after().slug.current
}
```

- Secret: the same value stored as `SANITY_REVALIDATE_SECRET` in the website host

The endpoint verifies the Sanity signature plus the project and dataset headers. It expires every cached `sanityFetch()` read (they all carry the `sanity` cache tag), then invalidates the blog index, every article page pattern, the old and new literal slug paths, and the sitemap. The sitemap also renders per request from an uncached query, so its `<lastmod>` values never wait on this webhook. This covers publication, normal edits, unpublishing/deletion, slug changes, and author/category reference updates. Sanity retries server failures according to its webhook retry policy; repeated deliveries are safe because revalidation is idempotent.

For blog post deliveries, the production deployment then submits `/blog` plus the old and new post URLs to IndexNow (`lib/indexnow.ts`), so Bing recrawls the change within minutes. The response body's `indexNow` field holds the result: the IndexNow status code, or why it was skipped (non-post documents, local and preview deployments). An IndexNow failure is reported there but never fails the webhook. Site routes outside Sanity are submitted after each production deploy by `.github/workflows/indexnow.yml`.
