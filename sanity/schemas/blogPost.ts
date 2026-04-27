import { defineField, defineType } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titulo', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Guias Empresariais', value: 'guias' },
          { title: 'Notícias e Reajustes', value: 'noticias' },
          { title: 'Comparativos', value: 'comparativos' },
          { title: 'Dicas de Saúde', value: 'dicas-saude' },
          { title: 'Legislação ANS', value: 'legislacao-ans' },
          { title: 'Benefícios Corporativos', value: 'beneficios-corporativos' },
          { title: 'FAQ Long-tail', value: 'faq' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'conteudo', title: 'Conteúdo', type: 'blockContent' }),
    defineField({ name: 'excerpt', title: 'Resumo', type: 'text', rows: 3, validation: (rule) => rule.max(200) }),
    defineField({ name: 'imagem_destaque', title: 'Imagem Destaque', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'meta_title', title: 'Meta Title (SEO)', type: 'string', validation: (rule) => rule.max(60) }),
    defineField({ name: 'meta_description', title: 'Meta Description (SEO)', type: 'string', validation: (rule) => rule.max(160) }),
    defineField({
      name: 'faqs',
      title: 'FAQ do Post',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
    }),
    defineField({
      name: 'published_at',
      title: 'Data de Publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    { title: 'Data (recente)', name: 'publishedDesc', by: [{ field: 'published_at', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'categoria', media: 'imagem_destaque' },
  },
});
