import { defineField, defineType } from 'sanity';

/**
 * FAQ schema — Story 4.7 (FR36) campos para FAQPage JSON-LD.
 *
 * Cada document representa um Q&A. A página /perguntas-frequentes
 * agrega todos `enabled: true` e renderiza via <FAQAccordion>.
 */
export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'pergunta',
      title: 'Pergunta',
      type: 'string',
      validation: (rule) => rule.required().min(10).max(160),
    }),
    defineField({
      name: 'resposta',
      title: 'Resposta',
      type: 'blockContent',
      description:
        'Mínimo 80 palavras (FR36 AC3). Cite fonte regulatória ANS quando aplicável.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Carências e CPT', value: 'carencias' },
          { title: 'Coparticipação e Reajuste', value: 'coparticipacao' },
          { title: 'Reembolso', value: 'reembolso' },
          { title: 'Rede Credenciada', value: 'rede-credenciada' },
          { title: 'Adesão MEI / PME', value: 'adesao' },
          { title: 'ANS / Regulamentação', value: 'ans' },
          { title: 'Cobertura', value: 'cobertura' },
          { title: 'Cancelamento', value: 'cancelamento' },
          { title: 'Produtos Amil', value: 'produtos' },
          { title: 'Geral', value: 'geral' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'plano_ref',
      title: 'Plano Relacionado',
      type: 'reference',
      to: [{ type: 'plano' }],
    }),
    defineField({
      name: 'order',
      title: 'Ordem (asc)',
      type: 'number',
      description: 'Ordenação dentro da categoria (menor número aparece primeiro).',
      initialValue: 100,
    }),
    defineField({
      name: 'enabled',
      title: 'Publicado',
      type: 'boolean',
      description: 'Se false, não aparece na página /perguntas-frequentes nem no JSON-LD.',
      initialValue: true,
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Revisado por (advogado/médico)',
      type: 'string',
      description: 'NFR23 — revisão humana obrigatória em conteúdo regulatório/médico.',
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Data de revisão',
      type: 'datetime',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'pergunta', maxLength: 96 },
    }),
  ],
  preview: {
    select: { title: 'pergunta', subtitle: 'categoria', enabled: 'enabled' },
    prepare({ title, subtitle, enabled }) {
      return {
        title: enabled === false ? `[oculto] ${title}` : title,
        subtitle: subtitle ?? 'sem categoria',
      };
    },
  },
});
