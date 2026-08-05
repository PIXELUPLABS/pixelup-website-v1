import {ThListIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const comparisonTable = defineType({
  name: 'comparisonTable',
  title: 'Table',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'headers',
      title: 'Column headings',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [defineArrayMember({type: 'tableRow'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {headers: 'headers', rows: 'rows'},
    prepare: ({headers, rows}) => ({
      title: Array.isArray(headers) ? headers.join(' · ') : 'Table',
      subtitle: `${Array.isArray(rows) ? rows.length : 0} rows`,
    }),
  },
})
