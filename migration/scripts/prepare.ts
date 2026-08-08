import {createHash} from 'node:crypto'
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {blogPosts} from '../../lib/blog'
import {legacyContentToPortableText} from '../../sanity/lib/portable-text'

type PreparedDocument = Record<string, unknown> & {_id: string; _type: string}

type PreparedPost = {
  document: PreparedDocument
  imagePath: string
  imageFilename: string
  sourceBlockCount: number
  portableTextBlockCount: number
}

export type PreparedMigration = {
  version: 1
  generatedAt: string
  source: {kind: 'typescript'; file: 'lib/blog.ts'; count: number}
  author: PreparedDocument
  categories: PreparedDocument[]
  posts: PreparedPost[]
}

const workspace = process.cwd()
const outputDirectory = path.join(workspace, 'migration', 'output')
const preparedPath = path.join(outputDirectory, 'prepared.json')
const reportPath = path.join(outputDirectory, 'prepare-report.json')

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function splitAuthor(value: string) {
  const [name, ...roleParts] = value.split(',')
  return {name: name.trim(), role: roleParts.join(',').trim() || undefined}
}

function sha256(filePath: string) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

const errors: string[] = []
const slugs = blogPosts.map((post) => post.slug)
if (new Set(slugs).size !== slugs.length) errors.push('Source contains duplicate blog slugs.')

const authorValues = [...new Set(blogPosts.map((post) => post.author))]
if (authorValues.length !== 1) {
  errors.push(`Expected one shared legacy author, found ${authorValues.length}.`)
}
const authorValue = authorValues[0] || 'PIXELUP LABS'
const parsedAuthor = splitAuthor(authorValue)
const authorId = `author.${slugify(parsedAuthor.name)}`
const author: PreparedDocument = {
  _id: authorId,
  _type: 'author',
  name: parsedAuthor.name,
  ...(parsedAuthor.role ? {role: parsedAuthor.role} : {}),
  sourceId: `legacy:author:${authorValue}`,
}

const categoryTitles = [...new Set(blogPosts.flatMap((post) => post.categories))].sort()
const categories = categoryTitles.map((title) => ({
  _id: `category.${slugify(title)}`,
  _type: 'category',
  title,
  slug: {_type: 'slug', current: slugify(title)},
  sourceId: `legacy:category:${title}`,
}))

const posts: PreparedPost[] = blogPosts.map((post) => {
  const imagePath = path.join(workspace, 'public', post.image.replace(/^\//, ''))
  if (!existsSync(imagePath)) errors.push(`Missing image for ${post.slug}: ${imagePath}`)

  for (const [blockIndex, block] of post.content.entries()) {
    if (block.type === 'table') {
      block.rows.forEach((row, rowIndex) => {
        if (row.length !== block.headers.length) {
          errors.push(
            `${post.slug} table ${blockIndex}, row ${rowIndex} has ${row.length} cells; expected ${block.headers.length}.`,
          )
        }
      })
    }
  }

  const body = legacyContentToPortableText(post.content, post.slug)
  const document: PreparedDocument = {
    _id: `blogPost.${post.slug}`,
    _type: 'blogPost',
    title: post.title,
    slug: {_type: 'slug', current: post.slug},
    description: post.description,
    author: {_type: 'reference', _ref: authorId},
    categories: post.categories.map((title) => ({
      _type: 'reference',
      _key: slugify(title),
      _ref: `category.${slugify(title)}`,
    })),
    publishedDate: post.publishedDate,
    updatedDate: post.updatedDate,
    body,
    seo: {
      _type: 'seo',
      noIndex: false,
    },
    sourceId: `legacy:blog:${post.slug}`,
  }

  return {
    document,
    imagePath,
    imageFilename: path.basename(imagePath),
    sourceBlockCount: post.content.length,
    portableTextBlockCount: body.length,
  }
})

const prepared: PreparedMigration = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: {kind: 'typescript', file: 'lib/blog.ts', count: blogPosts.length},
  author,
  categories,
  posts,
}

mkdirSync(outputDirectory, {recursive: true})
const report = {
  ok: errors.length === 0,
  errors,
  counts: {
    posts: posts.length,
    authors: 1,
    categories: categories.length,
    images: posts.filter((post) => existsSync(post.imagePath)).length,
    sourceBlocks: posts.reduce((sum, post) => sum + post.sourceBlockCount, 0),
    portableTextBlocks: posts.reduce((sum, post) => sum + post.portableTextBlockCount, 0),
  },
  images: posts.flatMap((post) =>
    existsSync(post.imagePath)
      ? [
          {
            post: post.document._id,
            file: path.relative(workspace, post.imagePath),
            bytes: statSync(post.imagePath).size,
            sha256: sha256(post.imagePath),
          },
        ]
      : [],
  ),
}

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
if (errors.length > 0) {
  console.error(JSON.stringify(report, null, 2))
  process.exitCode = 1
} else {
  writeFileSync(preparedPath, `${JSON.stringify(prepared, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
}
