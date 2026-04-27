import { defineField, defineType } from 'sanity';

export const plano = defineType({
  name: 'plano',
  title: 'Plano',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome do Plano',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nome', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linha',
      title: 'Linha',
      type: 'string',
      options: {
        list: [
          { title: 'Amil Fácil', value: 'amil-facil' },
          { title: 'Amil', value: 'amil' },
          { title: 'Amil One', value: 'amil-one' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tipo',
      title: 'Tipo de Contratação',
      type: 'string',
      options: {
        list: [
          { title: 'Empresarial', value: 'empresarial' },
          { title: 'Individual', value: 'individual' },
          { title: 'Familiar', value: 'familiar' },
        ],
      },
      initialValue: 'empresarial',
    }),
    defineField({
      name: 'cobertura',
      title: 'Cobertura',
      type: 'string',
      options: {
        list: [
          { title: 'Nacional', value: 'nacional' },
          { title: 'Regional', value: 'regional' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'coparticipacao', title: 'Coparticipação', type: 'boolean', initialValue: false }),
    defineField({ name: 'reembolso', title: 'Reembolso', type: 'boolean', initialValue: false }),
    defineField({ name: 'telemedicina', title: 'Telemedicina', type: 'boolean', initialValue: true }),
    defineField({
      name: 'features',
      title: 'Diferenciais',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'hospitais_destaque',
      title: 'Hospitais Destaque',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'preco_base',
      title: 'Preço Base (a partir de R$)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({ name: 'conteudo', title: 'Conteúdo', type: 'blockContent' }),
    defineField({ name: 'meta_title', title: 'Meta Title (SEO)', type: 'string', validation: (rule) => rule.max(60) }),
    defineField({ name: 'meta_description', title: 'Meta Description (SEO)', type: 'string', validation: (rule) => rule.max(160) }),
    defineField({
      name: 'faqs',
      title: 'Perguntas Frequentes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'linha' },
  },
});
