# PixelUp Labs blog migration

This migration ports only the four existing published articles from `lib/blog.ts` into the Sanity `production` dataset. Public URLs remain `https://www.pixeluplabs.com/blog/<slug>`; Sanity is the editing backend, not a public blog host.

## Content mapping

| Legacy field | Sanity field | Transform |
| --- | --- | --- |
| `slug` | `blogPost.slug.current` | Preserved exactly |
| `title` | `blogPost.title` and `seo.title` | Preserved |
| `description` | `description` and `seo.description` | Preserved |
| `author` | `author` reference | Split once at the first comma into name and role |
| `categories` | `category` references | Deduplicated shared documents |
| `image` | `mainImage.asset` | Local file uploaded to Sanity; empty alt remains decorative |
| dates | `publishedDate`, `updatedDate` | Preserved as ISO dates |
| headings/paragraphs/lists | `body` Portable Text | Converted with stable keys |
| tables | `comparisonTable` blocks | Headers and cell values preserved |

Migration document IDs and `sourceId` values are deterministic, so rerunning the import replaces the same records instead of creating duplicates. Sanity image upload deduplicates identical binaries.

## Workflow

1. `npm run content:prepare` creates an ignored snapshot and validation report in `migration/output/` without contacting Sanity.
2. Review `migration/output/prepare-report.json` and approve the migration checkpoint.
3. `npm run content:import` is a no-write dry run.
4. `npm run content:import:execute` uploads assets and creates/replaces documents in the configured dataset. This is the first remote write.
5. `npm run content:validate` checks remote counts, slugs, dates, references, asset presence, and body block counts.
6. Switch `SANITY_BLOG_SOURCE=sanity` only after remote validation and route parity pass.

Rollback is a single environment-variable change: remove `SANITY_BLOG_SOURCE` or set it to `legacy`, then redeploy. The TypeScript source remains intact during the testing window.
