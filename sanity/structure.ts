import {DocumentTextIcon, TagIcon, UserIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('PixelUp Blog')
    .items([
      S.documentTypeListItem('blogPost').title('Blog posts').icon(DocumentTextIcon),
      S.divider(),
      S.documentTypeListItem('author').title('Authors').icon(UserIcon),
      S.documentTypeListItem('category').title('Categories').icon(TagIcon),
    ])
