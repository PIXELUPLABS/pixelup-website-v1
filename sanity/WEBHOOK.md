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

The endpoint verifies the Sanity signature plus the project and dataset headers. It invalidates the blog index, every article page pattern, the old and new literal slug paths, and the sitemap. This covers publication, normal edits, unpublishing/deletion, slug changes, and author/category reference updates. Sanity retries server failures according to its webhook retry policy; repeated deliveries are safe because revalidation is idempotent.
