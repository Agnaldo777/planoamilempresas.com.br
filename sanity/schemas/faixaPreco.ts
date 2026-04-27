import { defineField, defineType } from 'sanity';

export const faixaPreco = defineType({
  name: 'faixaPreco',
  title: 'Faixa de Preço',
  type: 'document',
  fields: [
    defineField({
      name: 'plano',
      title: 'Plano',
      type: 'reference',
      to: [{ type: 'plano' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'faixa_etaria',
      title: 'Faixa Etária',
      type: 'string',
      options: {
        list: [
          { title: '00-18 anos', value: '00-18' },
          { title: '19-23 anos', value: '19-23' },
          { title: '24-28 anos', value: '24-28' },
          { title: '29-33 anos', value: '29-33' },
          { title: '34-38 anos', value: '34-38' },
          { title: '39-43 anos', value: '39-43' },
          { title: '44-48 anos', value: '44-48' },
          { title: '49-53 anos', value: '49-53' },
          { title: '54-58 anos', value: '54-58' },
          { title: '59+ anos', value: '59+' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'preco',
      title: 'Preço (R$)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'vigencia',
      title: 'Vigência',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'faixa_etaria', plano: 'plano.nome', preco: 'preco' },
    prepare({ title, plano, preco }) {
      return {
        title: `${plano || '?'} — ${title}`,
        subtitle: preco ? `R$ ${preco}` : '',
      };
    },
  },
});
