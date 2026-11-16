import {revalidatePath, revalidateTag} from 'next/cache'
import {NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'
import {SANITY_CACHE_TAG} from '@/sanity/lib/live'
import {submitToIndexNow} from '@/lib/indexnow'

type BlogWebhookPayload = {
  operation?: 'create' | 'update' | 'delete'
  documentType?: 'blogPost' | 'author' | 'category'
  beforeSlug?: string | null
  afterSlug?: string | null
}

const DOCUMENT_TYPES = new Set(['blogPost', 'author', 'category'])
const OPERATIONS = new Set(['create', 'update', 'delete'])

function validSlug(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= 96 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  )
}

/**
 * Tells Bing about the post right after its cache is expired, so the recrawl
 * sees the new version. `slugs` includes the old slug, so a renamed or
 * deleted post's dead URL gets dropped too. Authors and categories have no
 * URLs of their own. Only the production deployment submits, and the result
 * goes in the response body. A failed ping never fails the webhook, since a
 * retry would only re-submit.
 */
async function pingIndexNow(documentType: string, slugs: string[]) {
  if (documentType !== 'blogPost' || slugs.length === 0) return 'skipped: no blog post URL'
  if (process.env.VERCEL_ENV !== 'production') return 'skipped: not the production deployment'

  try {
    return await submitToIndexNow(['/blog', ...slugs.map((slug) => `/blog/${slug}`)])
  } catch (error) {
    return {error: error instanceof Error ? error.message : 'IndexNow request failed.'}
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return new Response('Missing SANITY_REVALIDATE_SECRET.', {status: 503})
  }

  try {
    const {isValidSignature, body} = await parseBody<BlogWebhookPayload>(
      request,
      secret,
      true,
    )

    if (!isValidSignature) {
      return new Response('Invalid signature.', {status: 401})
    }

    if (
      !body ||
      !body.documentType ||
      !DOCUMENT_TYPES.has(body.documentType) ||
      !body.operation ||
      !OPERATIONS.has(body.operation)
    ) {
      return new Response('Invalid webhook payload.', {status: 400})
    }

    const expectedProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const expectedDataset = process.env.NEXT_PUBLIC_SANITY_DATASET
    const sourceProjectId = request.headers.get('sanity-project-id')
    const sourceDataset = request.headers.get('sanity-dataset')

    if (
      !expectedProjectId ||
      !expectedDataset ||
      sourceProjectId !== expectedProjectId ||
      sourceDataset !== expectedDataset
    ) {
      return new Response('Webhook source does not match this site.', {status: 403})
    }

    // Expire every cached sanityFetch() read, not just the ones the paths below
    // happen to reach: path revalidation alone left the sitemap's copy stale
    // for days. `expire: 0` is Next 16's immediate expiry for webhooks; 'max'
    // would serve one more stale render first.
    revalidateTag(SANITY_CACHE_TAG, {expire: 0})

    revalidatePath('/blog')
    revalidatePath('/sitemap.xml')
    revalidatePath('/blog/[slug]', 'page')

    const slugs = [...new Set([body.beforeSlug, body.afterSlug].filter(validSlug))]
    for (const slug of slugs) revalidatePath(`/blog/${slug}`)

    return NextResponse.json({
      revalidated: true,
      operation: body.operation,
      documentType: body.documentType,
      tags: [SANITY_CACHE_TAG],
      paths: ['/blog', '/blog/[slug]', '/sitemap.xml', ...slugs.map((slug) => `/blog/${slug}`)],
      indexNow: await pingIndexNow(body.documentType, slugs),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown revalidation error.'
    return new Response(message, {status: 500})
  }
}
