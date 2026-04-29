import { defineField, defineType } from 'sanity';

/**
 * Site Settings — Story 3.22 v2 hook (FR50).
 *
 * Singleton document que centraliza configurações globais do satélite.
 * v1 (atual): consumido SOMENTE via Sanity Studio para bookkeeping.
 * v2 (próxima): integração com lib/seo/title.ts via getCurrentYearFromSanity()
 *               com fallback para env var NEXT_PUBLIC_CURRENT_YEAR.
 *
 * IMPORTANTE: o build atual usa env var como SSOT (zero dep em runtime
 * Sanity). Editar este document NÃO altera title até v2 ser implementada.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings (Singleton)',
  type: 'document',
  fields: [
    defineField({
      name: 'currentYear',
      title: 'Ano Corrente (title pattern)',
      type: 'number',
      description:
        'Ano usado em titles "Plano Amil [ANO]". Fonte de verdade efetiva é env var NEXT_PUBLIC_CURRENT_YEAR — bookkeeping aqui.',
      validation: (rule) => rule.required().integer().min(2024).max(2100),
      initialValue: 2026,
    }),
    defineField({
      name: 'titlePatternPrefix',
      title: 'Title Pattern Prefix',
      type: 'string',
      description: 'Default tipo prefix. Ex: "Plano de Saúde".',
      initialValue: 'Plano de Saúde',
    }),
    defineField({
      name: 'titlePatternSuffix',
      title: 'Title Pattern Suffix',
      type: 'string',
      description: 'Default qualificador suffix. Ex: "Empresarial PJ".',
      initialValue: 'Empresarial PJ',
    }),
    defineField({
      name: 'nextYearTransitionDate',
      title: 'Próxima Transição Anual (ISO)',
      type: 'datetime',
      description:
        'Quando a próxima atualização de ano deve ocorrer. Bookkeeping; runbook em docs/devops/year-rollover.md.',
    }),
  ],
  preview: {
    select: { year: 'currentYear', prefix: 'titlePatternPrefix' },
    prepare({ year, prefix }) {
      return {
        title: `Site Settings — Ano ${year ?? '????'}`,
        subtitle: `Prefix: ${prefix ?? '(default)'}`,
      };
    },
  },
});
