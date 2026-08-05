import { type SchemaTypeDefinition } from 'sanity'
import { blogPost } from './documents/blog-post'
import { author } from './documents/author'
import { category } from './documents/category'
import { blogBody } from './objects/blog-body'
import { comparisonTable } from './objects/comparison-table'
import { seo } from './objects/seo'
import { tableRow } from './objects/table-row'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, category, seo, tableRow, comparisonTable, blogBody, blogPost],
}
