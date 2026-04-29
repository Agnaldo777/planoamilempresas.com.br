/**
 * Slugs canônicos das 11 redes Amil ativas — ADR-006 §"Slug rules".
 *
 * Caminho B do ADR-006 (slugs canônicos preservando match exato em SEO):
 * URLs como `/rede/amil-s750-qp/sp` e `/rede/black/rj` mantêm o nome
 * canônico do produto Amil para máxima relevância em SERPs de busca
 * pre-purchase qualificada (Cluster E — Story 7.7).
 *
 * Story 7.1 AC2-bis (amendment O-1 do PO Pax 2026-04-28).
 * Story 7.7 (Cluster E) consome `redeSlug()`/`redeFromSlug()`.
 */

import type { RedeAmilNome } from '@/types/rede-credenciada-amil';
import { REDES_AMIL_ATIVAS } from '@/types/rede-credenciada-amil';

/**
 * Mapping canônico rede → slug. Os 11 slugs estão alinhados literalmente
 * com `docs/decisions/adr-006-url-as-trademark-policy.md` §"Slug rules".
 *
 * **Mudanças nesta constante exigem ADR amendment** — slug é parte do
 * contrato URL e mudar quebra backlinks externos + sitemap shards.
 */
export const REDE_SLUGS: Record<RedeAmilNome, string> = {
  'AMIL ONE S6500 BLACK QP': 'amil-one-s6500-black-qp',
  'AMIL S750 QP': 'amil-s750-qp',
  'AMIL S580 QP': 'amil-s580-qp',
  'AMIL S450 QP': 'amil-s450-qp',
  'AMIL S450 QC': 'amil-s450-qc',
  'AMIL S380 QP': 'amil-s380-qp',
  'AMIL S380 QC': 'amil-s380-qc',
  BLACK: 'black',
  'ADESÃO OURO MAIS': 'adesao-ouro-mais',
  'ADESÃO BRONZE RJ': 'adesao-bronze-rj',
  'ADESÃO BRONZE SP': 'adesao-bronze-sp',
} as const;

/**
 * Mapping inverso slug → rede, gerado a partir de `REDE_SLUGS` no boot
 * (frozen). Usado em `redeFromSlug()` para resolver URLs de Story 7.7.
 */
export const SLUG_TO_REDE: Readonly<Record<string, RedeAmilNome>> = Object.freeze(
  Object.fromEntries(
    (Object.entries(REDE_SLUGS) as [RedeAmilNome, string][]).map(([rede, slug]) => [slug, rede])
  ) as Record<string, RedeAmilNome>
);

/**
 * Acessor type-safe para o slug de uma rede.
 * Equivalente a `REDE_SLUGS[rede]` mas com tipagem explícita.
 */
export function redeSlug(rede: RedeAmilNome): string {
  return REDE_SLUGS[rede];
}

/**
 * Resolve slug → rede canônica. Retorna `null` se o slug não existir
 * (ex: rede inativa, slug inválido em URL externa) — usado em
 * Story 7.7 `generateStaticParams()` + fallback `notFound()`.
 */
export function redeFromSlug(slug: string): RedeAmilNome | null {
  return SLUG_TO_REDE[slug] ?? null;
}

/**
 * Validação invariante exposta para tests + boot do loader:
 * confirma que `REDE_SLUGS` cobre exatamente as 11 redes ativas
 * declaradas em `REDES_AMIL_ATIVAS`. Detecta drift entre o type
 * `RedeAmilNome` e o array runtime.
 */
export function validateRedeSlugsCoverage(): {
  ok: boolean;
  faltando: RedeAmilNome[];
  extras: string[];
} {
  const slugKeys = Object.keys(REDE_SLUGS) as RedeAmilNome[];
  const faltando = REDES_AMIL_ATIVAS.filter((rede) => !slugKeys.includes(rede));
  const extras = slugKeys.filter((rede) => !REDES_AMIL_ATIVAS.includes(rede));

  return {
    ok: faltando.length === 0 && extras.length === 0,
    faltando,
    extras,
  };
}
