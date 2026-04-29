import { defineField, defineType } from 'sanity';

/**
 * Sanity schema — `blogPost` (Story 6.11.a)
 *
 * Estende v1 (Story 6.9 author/reviewer) com campos editoriais
 * completos: tags, updatedAt, ogImage, body Portable Text, enabled.
 *
 * Categorias alinhadas a `data/faqs/faq-amil-empresarial.ts` (Story 4.7)
 * + adições editoriais. Slugs de category são SSOT — usadas em rotas
 * `/blog/categoria/[categoria]/` e em `Article.articleSection`.
 *
 * NFR22 YMYL: campos `author` (obrigatório) e `reviewedBy` (obrigatório
 * em categorias regulatórias) habilitam pipeline E-E-A-T.
 */

/**
 * 8 categorias canônicas — espelho de `data/blog/categories.ts`.
 * Mantém sync manual: alterar aqui requer atualizar:
 *   1. `data/blog/categories.ts` (SSOT TypeScript)
 *   2. `data/faqs/faq-amil-empresarial.ts` (FAQCategory)
 *   3. `app/sitemap.ts` (geração de URLs `/blog/categoria/[slug]`)
 *   4. `docs/editorial/blog-roadmap.md`
 */
const BLOG_CATEGORIES = [
  { title: 'Carências e CPT', value: 'carencias' },
  { title: 'Coparticipação e Reajuste', value: 'coparticipacao' },
  { title: 'Reembolso', value: 'reembolso' },
  { title: 'Rede Credenciada', value: 'rede-credenciada' },
  { title: 'Adesão MEI / PME', value: 'adesao-mei-pme' },
  { title: 'ANS e Regulamentação', value: 'ans-regulamentacao' },
  { title: 'Cobertura', value: 'cobertura' },
  { title: 'Cancelamento', value: 'cancelamento' },
] as const;

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'body',
      title: 'Conteúdo',
      type: 'blockContent',
      description: 'Conteúdo Portable Text. Use blocos para H2/H3, listas e callouts.',
    }),
    defineField({
      name: 'author',
      title: 'Autor (YMYL)',
      type: 'string',
      description: 'Slug do autor em data/authors.ts.',
      options: {
        list: [
          { title: 'Agnaldo Silva (Corretor SUSEP)', value: 'agnaldo-silva' },
          { title: 'BeneficioRH (Organização)', value: 'beneficiorh' },
        ],
      },
      initialValue: 'agnaldo-silva',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Revisor (obrigatório em conteúdo YMYL regulatório)',
      type: 'string',
      description:
        'Obrigatório para categorias: carências, coparticipação, ANS, cobertura, cancelamento.',
      options: {
        list: [
          { title: '— Sem revisor —', value: '' },
          { title: 'Revisor Jurídico (OAB)', value: 'revisor-juridico' },
          { title: 'Revisor Médico (CRM)', value: 'revisor-medico' },
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: { list: [...BLOG_CATEGORIES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de Publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Data de Atualização',
      type: 'datetime',
      description:
        'Atualize quando reescrever o post (não tocar em correções triviais).',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagem OpenGraph (1200×630)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (max 70)',
      type: 'string',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (max 160)',
      type: 'string',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'enabled',
      title: 'Publicado',
      type: 'boolean',
      initialValue: true,
      description: 'Desmarque para esconder do listing/feed sem deletar.',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ do Post',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
    }),

    // ─────────────────────────────────────────────────────────────
    // Story 6.10 — Pipeline de Revisão Humana (NFR23)
    //
    // workflowStatus: enum estado-máquina do post (Draft → Review
    // Técnico → Review Jurídico → Approved → Published → Archived).
    // Em conteúdo YMYL (carências, coparticipação, ANS, cobertura,
    // cancelamento), `workflowStatus === 'published'` exige reviewTrack
    // com pelo menos 1 entry de `medico` E 1 de `advogado` aprovados.
    // Audit `scripts/audit-workflow-status.mjs` enforça em CI.
    //
    // reviewTrack: track-changes editorial (subdocs, não refs) — cada
    // entry registra reviewer, role, timestamp, comments, summary das
    // mudanças e decisão. Optamos por subdocs (não refs ao Author) por:
    //   1. Granularidade temporal: 1 reviewer pode revisar 2x; refs
    //      colapsariam histórico
    //   2. Auditoria forense: comments/changes são imutáveis no tempo
    //      do review, mesmo que o autor referenciado mude depois
    //   3. Independência: track-changes sobrevive a renomeação/exclusão
    //      do registro do autor
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'workflowStatus',
      title: 'Status Editorial (Pipeline NFR23)',
      type: 'string',
      description:
        'Estado no pipeline editorial. YMYL exige `published` apenas após review médico + jurídico aprovados.',
      options: {
        list: [
          { title: 'Draft (Atlas)', value: 'draft' },
          { title: 'Review Médico/Técnico', value: 'review_tecnico' },
          { title: 'Review Jurídico (Advogado)', value: 'review_juridico' },
          { title: 'Approved (Pax)', value: 'approved' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewTrack',
      title: 'Track-Changes de Revisão (NFR23)',
      type: 'array',
      description:
        'Histórico de revisões humanas. Em YMYL, exige ao menos 1 entry com role=medico e 1 com role=advogado aprovados antes de `workflowStatus = published`.',
      of: [
        {
          type: 'object',
          name: 'reviewEntry',
          title: 'Entrada de Revisão',
          fields: [
            defineField({
              name: 'reviewer',
              title: 'Revisor',
              type: 'reference',
              to: [{ type: 'author' }],
              description:
                'Referência ao Author (data/authors.ts) — Person com credencial verificável (SUSEP, OAB, CRM).',
            }),
            defineField({
              name: 'role',
              title: 'Papel no Pipeline',
              type: 'string',
              options: {
                list: [
                  { title: 'Redator', value: 'redator' },
                  { title: 'Corretor (Técnico)', value: 'corretor' },
                  { title: 'Médico', value: 'medico' },
                  { title: 'Advogado (Jurídico)', value: 'advogado' },
                  { title: 'PO (Pax)', value: 'po' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'reviewedAt',
              title: 'Data da Revisão',
              type: 'datetime',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'comments',
              title: 'Comentários',
              type: 'text',
              description: 'Observações qualitativas do reviewer.',
            }),
            defineField({
              name: 'changes',
              title: 'Track-Changes Summary',
              type: 'text',
              description:
                'Sumário das mudanças propostas/aprovadas (não substitui revision history nativo do Sanity, complementa).',
            }),
            defineField({
              name: 'decision',
              title: 'Decisão',
              type: 'string',
              options: {
                list: [
                  { title: 'Aprovado', value: 'approved' },
                  { title: 'Rejeitado', value: 'rejected' },
                  { title: 'Solicita mudanças', value: 'request_changes' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              role: 'role',
              decision: 'decision',
              reviewedAt: 'reviewedAt',
            },
            prepare({ role, decision, reviewedAt }) {
              return {
                title: `${role ?? '—'} → ${decision ?? '—'}`,
                subtitle: reviewedAt ?? '',
              };
            },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Data (recente)',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'ogImage' },
  },
});
