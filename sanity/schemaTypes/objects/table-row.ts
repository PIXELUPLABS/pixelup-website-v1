import {defineArrayMember, defineField, defineType} from 'sanity'

export const tableRow = defineType({
  name: 'tableRow',
  title: 'Table row',
  type: 'object',
  fields: [
    defineField({
      name: 'cells',
      title: 'Cells',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {cells: 'cells'},
    prepare: ({cells}) => ({title: Array.isArray(cells) ? cells.join(' · ') : 'Empty row'}),
  },
})
