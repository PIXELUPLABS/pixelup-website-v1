import type {PortableTextBlock} from '@portabletext/types'
import type {BlogContentBlock} from '@/lib/blog'

type PortableTextSpan = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

type LinkMark = {
  _type: 'link'
  _key: string
  href: string
  openInNewTab: boolean
}

export function stableKey(value: string): string {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash >>> 0).toString(36)
}

function richTextChildren(text: string, keyPrefix: string) {
  const children: PortableTextSpan[] = []
  const markDefs: LinkMark[] = []
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      const plain = text.slice(cursor, match.index)
      children.push({
        _type: 'span',
        _key: stableKey(`${keyPrefix}:plain:${match.index}:${plain}`),
        text: plain,
        marks: [],
      })
    }

    const segment = match[0]
    if (segment.startsWith('**')) {
      const strongText = segment.slice(2, -2)
      children.push({
        _type: 'span',
        _key: stableKey(`${keyPrefix}:strong:${match.index}:${strongText}`),
        text: strongText,
        marks: ['strong'],
      })
    } else {
      const linkMatch = segment.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        const markKey = stableKey(`${keyPrefix}:link:${match.index}:${linkMatch[2]}`)
        markDefs.push({
          _type: 'link',
          _key: markKey,
          href: linkMatch[2],
          openInNewTab: true,
        })
        children.push({
          _type: 'span',
          _key: stableKey(`${keyPrefix}:linkText:${match.index}:${linkMatch[1]}`),
          text: linkMatch[1],
          marks: [markKey],
        })
      }
    }
    cursor = match.index + segment.length
  }

  if (cursor < text.length || children.length === 0) {
    const plain = text.slice(cursor)
    children.push({
      _type: 'span',
      _key: stableKey(`${keyPrefix}:plain:end:${plain}`),
      text: plain,
      marks: [],
    })
  }

  return {children, markDefs}
}

function textBlock(
  text: string,
  key: string,
  style: 'normal' | 'h2' | 'h3' = 'normal',
  listItem?: 'bullet' | 'number',
): PortableTextBlock {
  const {children, markDefs} = richTextChildren(text, key)
  return {
    _type: 'block',
    _key: key,
    style,
    ...(listItem ? {listItem, level: 1} : {}),
    markDefs,
    children,
  } as PortableTextBlock
}

export function legacyContentToPortableText(
  content: BlogContentBlock[],
  slug: string,
): PortableTextBlock[] {
  return content.flatMap((block, blockIndex) => {
    const baseKey = stableKey(`${slug}:${blockIndex}:${block.type}`)
    switch (block.type) {
      case 'heading':
        return [textBlock(block.text, baseKey, 'h2')]
      case 'subheading':
        return [textBlock(block.text, baseKey, 'h3')]
      case 'paragraph':
        return [textBlock(block.text, baseKey)]
      case 'list':
        return block.items.map((item, itemIndex) =>
          textBlock(item, stableKey(`${baseKey}:${itemIndex}:${item}`), 'normal', 'bullet'),
        )
      case 'table':
        return [
          {
            _type: 'comparisonTable',
            _key: baseKey,
            headers: block.headers,
            rows: block.rows.map((cells, rowIndex) => ({
              _type: 'tableRow',
              _key: stableKey(`${baseKey}:row:${rowIndex}:${cells.join('|')}`),
              cells,
            })),
          } as unknown as PortableTextBlock,
        ]
    }
  })
}
