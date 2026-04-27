import { defineField, defineType } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'pergunta', title: 'Pergunta', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'resposta', title: 'Resposta', type: 'blockContent' }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Geral', value: 'geral' },
          { title: 'Empresarial', value: 'empresarial' },
          { title: 'Dental', value: 'dental' },
          { title: 'Procedimentos', value: 'procedimentos' },
          { title: 'Financeiro', value: 'financeiro' },
          { title: 'Rede Credenciada', value: 'rede-credenciada' },
        ],
      },
    }),
    defineField({
      name: 'plano_ref',
      title: 'Plano Relacionado',
      type: 'reference',
      to: [{ type: 'plano' }],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'pergunta', maxLength: 96 },
    }),
  ],
  preview: {
    select: { title: 'pergunta', subtitle: 'categoria' },
  },
});
