import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
import type {PreparedMigration} from './prepare'

type RemotePost = {
  _id: string
  slug?: string
  title?: string
  publishedDate?: string
  updatedDate?: string
  bodyCount: number
  categoryCount: number
  hasAuthor: boolean
  imageRef?: string
}

async function main() {
  const outputDirectory = path.join(process.cwd(), 'migration', 'output')
  const preparedPath = path.join(outputDirectory, 'prepared.json')
  if (!existsSync(preparedPath)) throw new Error('Run npm run content:prepare first.')

  const prepared = JSON.parse(readFileSync(preparedPath, 'utf8')) as PreparedMigration
  const client = getCliClient({apiVersion: '2026-08-05'})
  const remote = await client.fetch<RemotePost[]>(`*[_type == "blogPost" && sourceId match "legacy:blog:*"] | order(slug.current asc) {
  _id,
  "slug": slug.current,
  title,
  publishedDate,
  updatedDate,
  "bodyCount": count(body),
  "categoryCount": count(categories),
  "hasAuthor": defined(author->_id),
  "imageRef": mainImage.asset->_id
}`)

  const remoteById = new Map(remote.map((post) => [post._id, post]))
  const errors: string[] = []
  for (const local of prepared.posts) {
    const found = remoteById.get(local.document._id)
    if (!found) {
      errors.push(`Missing remote document ${local.document._id}.`)
      continue
    }
    const slug = (local.document.slug as {current: string}).current
    if (found.slug !== slug) errors.push(`${local.document._id}: slug mismatch.`)
    if (found.title !== local.document.title) errors.push(`${local.document._id}: title mismatch.`)
    if (found.publishedDate !== local.document.publishedDate) {
      errors.push(`${local.document._id}: published date mismatch.`)
    }
    if (found.updatedDate !== local.document.updatedDate) {
      errors.push(`${local.document._id}: updated date mismatch.`)
    }
    if (found.bodyCount !== local.portableTextBlockCount) {
      errors.push(`${local.document._id}: body block count mismatch.`)
    }
    if (found.categoryCount !== (local.document.categories as unknown[]).length) {
      errors.push(`${local.document._id}: category count mismatch.`)
    }
    if (!found.hasAuthor) errors.push(`${local.document._id}: author reference is unresolved.`)
    if (!found.imageRef) errors.push(`${local.document._id}: image asset is missing.`)
  }
  if (remote.length !== prepared.posts.length) {
    errors.push(`Remote legacy post count is ${remote.length}; expected ${prepared.posts.length}.`)
  }

  const report = {
    ok: errors.length === 0,
    errors,
    expectedPosts: prepared.posts.length,
    remotePosts: remote.length,
    checkedAt: new Date().toISOString(),
  }
  mkdirSync(outputDirectory, {recursive: true})
  writeFileSync(path.join(outputDirectory, 'remote-validation-report.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
  if (errors.length > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
