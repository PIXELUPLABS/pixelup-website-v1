import {createReadStream, existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
import type {PreparedMigration} from './prepare'

async function main() {
  const execute = process.argv.includes('--execute')
  const preparedPath = path.join(process.cwd(), 'migration', 'output', 'prepared.json')

  if (!existsSync(preparedPath)) {
    throw new Error('Run npm run content:prepare before importing.')
  }

  const prepared = JSON.parse(readFileSync(preparedPath, 'utf8')) as PreparedMigration
  const planned = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    posts: prepared.posts.length,
    categories: prepared.categories.length,
    authors: 1,
    images: prepared.posts.length,
  }

  if (!execute) {
    console.log(JSON.stringify({mode: 'dry-run', planned}, null, 2))
    console.log('No remote writes made. Add --execute only after the migration checkpoint is approved.')
    return
  }

  const client = getCliClient({apiVersion: '2026-08-05'})

  await client.createOrReplace(prepared.author)
  for (const category of prepared.categories) await client.createOrReplace(category)

  for (const post of prepared.posts) {
    const asset = await client.assets.upload('image', createReadStream(post.imagePath), {
      filename: post.imageFilename,
      source: {id: String(post.document.sourceId), name: 'PixelUp Labs legacy blog'},
    })
    await client.createOrReplace({
      ...post.document,
      mainImage: {
        _type: 'image',
        asset: {_type: 'reference', _ref: asset._id},
        alt: '',
      },
    })
    console.log(`Imported ${String(post.document.slug && (post.document.slug as {current: string}).current)}`)
  }

  console.log(JSON.stringify({mode: 'executed', imported: planned}, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
