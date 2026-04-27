import { defineField, defineType } from 'sanity';

export const cidade = defineType({
  name: 'cidade',
  title: 'Cidade',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nome', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'estado', title: 'Estado', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'uf',
      title: 'UF',
      type: 'string',
      validation: (rule) => rule.required().length(2),
    }),
    defineField({ name: 'populacao', title: 'População', type: 'number' }),
    defineField({
      name: 'hospitais_amil',
      title: 'Hospitais Amil',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'nome', title: 'Nome', type: 'string' }),
            defineField({ name: 'endereco', title: 'Endereço', type: 'string' }),
            defineField({
              name: 'tipo',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'Hospital', value: 'hospital' },
                  { title: 'Laboratório', value: 'laboratorio' },
                  { title: 'Clínica', value: 'clinica' },
                ],
              },
            }),
          ],
        },
      ],
    }),
    defineField({ name: 'tem_espaco_saude', title: 'Tem Espaço Saúde?', type: 'boolean', initialValue: false }),
    defineField({ name: 'espaco_saude_endereco', title: 'Endereço Espaço Saúde', type: 'string', hidden: ({ parent }) => !parent?.tem_espaco_saude }),
    defineField({
      name: 'planos_disponiveis',
      title: 'Planos Disponíveis',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'plano' }] }],
    }),
    defineField({ name: 'telefone_regional', title: 'Telefone Regional', type: 'string' }),
    defineField({ name: 'conteudo_local', title: 'Conteúdo Local', type: 'blockContent' }),
    defineField({ name: 'meta_title', title: 'Meta Title (SEO)', type: 'string', validation: (rule) => rule.max(60) }),
    defineField({ name: 'meta_description', title: 'Meta Description (SEO)', type: 'string', validation: (rule) => rule.max(160) }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'uf' },
  },
});
