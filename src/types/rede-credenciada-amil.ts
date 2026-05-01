/**
 * Tipos canônicos da rede credenciada Amil.
 *
 * Schema do dataset 2026-04-26 (`src/data/operadoras/amil/rede-credenciada.json`):
 * 9.325 prestadores em 26 UFs, gerado via `scripts/scrape_powerbi_amil.js`.
 *
 * Story 7.1 — Foundation Epic 7. Bloqueia 7.2-7.10.
 */

/**
 * Tipo de atendimento inferido a partir do nome do prestador
 * via regex em `inferTipoAtendimento()` (loader). 9 categorias.
 */
export type TipoAtendimentoInferido =
  | 'Hospital'
  | 'Pronto-Socorro'
  | 'Maternidade'
  | 'Clínica'
  | 'Laboratório'
  | 'Diagnóstico por Imagem'
  | 'Centro/Instituto'
  | 'Odontologia'
  | 'Outro';

/**
 * Nomes canônicos das 11 redes Amil ativas no dataset 2026-04-26.
 *
 * Confirmado em Story 7.0a (preflight gap 11 vs 49 redes — as 38
 * restantes do header `dataset.redes[]` são metadados de dropdown
 * sem prestadores associados).
 *
 * Slugs canônicos para URL em `src/lib/operadoras/amil/slugs.ts`
 * (ADR-006 §"Slug rules").
 */
export type RedeAmilNome =
  | 'AMIL ONE S6500 BLACK QP'
  | 'AMIL S750 QP'
  | 'AMIL S580 QP'
  | 'AMIL S450 QP'
  | 'AMIL S450 QC'
  | 'AMIL S380 QP'
  | 'AMIL S380 QC'
  | 'BLACK'
  | 'ADESÃO OURO MAIS'
  | 'ADESÃO BRONZE RJ'
  | 'ADESÃO BRONZE SP';

/**
 * Array imutável das 11 redes ativas para iteração runtime.
 * Usado em type guards e helpers do loader.
 */
export const REDES_AMIL_ATIVAS: readonly RedeAmilNome[] = [
  'AMIL ONE S6500 BLACK QP',
  'AMIL S750 QP',
  'AMIL S580 QP',
  'AMIL S450 QP',
  'AMIL S450 QC',
  'AMIL S380 QP',
  'AMIL S380 QC',
  'BLACK',
  'ADESÃO OURO MAIS',
  'ADESÃO BRONZE RJ',
  'ADESÃO BRONZE SP',
] as const;

/**
 * Prestador no formato raw do dataset (saída do scraper Power BI).
 * Não inclui `tipoInferido` nem `slug` — esses são adicionados em
 * `parsePrestador()` (loader) quando o cache é construído.
 */
export interface PrestadorAmilRaw {
  codigo: string;
  nome: string;
  uf: string;
  municipio: string;
  bairro: string;
  redes: string[];
}

/**
 * Prestador enriquecido (raw + metadata derivada).
 * É o formato consumido pelas Stories 7.2-7.10.
 */
export interface PrestadorAmil extends PrestadorAmilRaw {
  tipoInferido: TipoAtendimentoInferido;
  slug: string;
}

/**
 * Dataset completo da rede credenciada Amil (formato do JSON).
 */
export interface DatasetRedeAmil {
  geradoEm: string;
  fonte: string;
  totalRedes: number;
  totalPrestadores: number;
  redes: string[];
  prestadores: PrestadorAmilRaw[];
}

/**
 * Município com prestadores Amil — agregação derivada do loader.
 */
export interface MunicipioRedeAmil {
  uf: string;
  municipio: string;
  cidadeSlug: string;
  ufSlug: string;
  totalPrestadores: number;
}

/**
 * Estatísticas agregadas da rede inteira — usadas no hub
 * `/rede-credenciada` (Story 7.2 stats dataset-driven).
 *
 * `geradoEm` é o ISO timestamp do snapshot Power BI (`dataset.geradoEm`)
 * — usado em `<time>` no hub para "última atualização".
 */
export interface EstatisticasRede {
  geradoEm: string;
  totalPrestadores: number;
  totalUFs: number;
  totalMunicipios: number;
  porTipo: Record<TipoAtendimentoInferido, number>;
  porUF: Record<string, number>;
  porRede: Record<RedeAmilNome, number>;
}

/**
 * Estatísticas por UF — usadas em pages-cidade (Story 7.5)
 * e drawer de UF (Story 7.2 `<UfShortcutChips />`).
 */
export interface EstatisticasUFAmil {
  uf: string;
  ufSlug: string;
  totalPrestadores: number;
  totalMunicipios: number;
  porTipo: Record<TipoAtendimentoInferido, number>;
  porRede: Record<RedeAmilNome, number>;
}

/**
 * Type guard runtime para validar dataset cru desserializado de JSON.
 * Usado pelo loader no boot para sinalizar dataset corrompido cedo
 * (vs deixar erros de undefined emergirem em runtime de páginas).
 */
export function isDatasetRedeAmil(value: unknown): value is DatasetRedeAmil {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.geradoEm !== 'string' ||
    typeof candidate.fonte !== 'string' ||
    typeof candidate.totalRedes !== 'number' ||
    typeof candidate.totalPrestadores !== 'number'
  ) {
    return false;
  }

  if (!Array.isArray(candidate.redes) || !candidate.redes.every((r) => typeof r === 'string')) {
    return false;
  }

  if (!Array.isArray(candidate.prestadores)) {
    return false;
  }

  return candidate.prestadores.every(isPrestadorAmilRaw);
}

/**
 * Type guard para um único prestador raw — auxiliar de
 * `isDatasetRedeAmil()`. Exportado para tests e validação granular.
 */
export function isPrestadorAmilRaw(value: unknown): value is PrestadorAmilRaw {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.codigo === 'string' &&
    typeof candidate.nome === 'string' &&
    typeof candidate.uf === 'string' &&
    typeof candidate.municipio === 'string' &&
    typeof candidate.bairro === 'string' &&
    Array.isArray(candidate.redes) &&
    candidate.redes.every((r) => typeof r === 'string')
  );
}
