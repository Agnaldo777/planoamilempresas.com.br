/**
 * Loader canônico da rede credenciada Amil — Story 7.1 Foundation Epic 7.
 *
 * Lê o dataset estático em `src/data/operadoras/amil/rede-credenciada.json`
 * (mirror via Story 7.10 do canon em planodesaudepj — ADR-007 SSOT) e expõe
 * 13+ helpers tipo-seguros consumidos pelas Stories 7.2-7.10.
 *
 * Cache em memória construído no boot do build worker (RSC SSG/ISR).
 * Sem chamadas runtime — tudo build-time.
 *
 * Substitui o loader legado em `data/rede-credenciada/rede-amil.ts`
 * (deprecated em Story 7.1 AC6, removido em Story 7.2).
 */

import type {
  DatasetRedeAmil,
  EstatisticasRede,
  EstatisticasUFAmil,
  MunicipioRedeAmil,
  PrestadorAmil,
  PrestadorAmilRaw,
  RedeAmilNome,
  TipoAtendimentoInferido,
} from '@/types/rede-credenciada-amil';
import {
  REDES_AMIL_ATIVAS,
  isDatasetRedeAmil,
} from '@/types/rede-credenciada-amil';
import { validateRedeSlugsCoverage } from '@/lib/operadoras/amil/slugs';
import datasetRaw from '@/data/operadoras/amil/rede-credenciada.json';

// ──────────────────────────────────────────────────────────────────────
// Re-exports — facade canônico (Story 7.1 v2 migração)
// Consumers (app/, components/, scripts/) devem importar APENAS deste loader.
// Tipos vivem em `@/types/rede-credenciada-amil`; expostos aqui para conveniência.
// ──────────────────────────────────────────────────────────────────────

export type {
  DatasetRedeAmil,
  EstatisticasRede,
  EstatisticasUFAmil,
  MunicipioRedeAmil,
  PrestadorAmil,
  PrestadorAmilRaw,
  RedeAmilNome,
  TipoAtendimentoInferido,
};
export { REDES_AMIL_ATIVAS };

// ──────────────────────────────────────────────────────────────────────
// Constantes derivadas
// ──────────────────────────────────────────────────────────────────────

const TIPOS_ATENDIMENTO_KEYS: readonly TipoAtendimentoInferido[] = [
  'Hospital',
  'Pronto-Socorro',
  'Maternidade',
  'Clínica',
  'Laboratório',
  'Diagnóstico por Imagem',
  'Centro/Instituto',
  'Odontologia',
  'Outro',
] as const;

// ──────────────────────────────────────────────────────────────────────
// Slug helper determinístico (NFR14 — idempotente)
// ──────────────────────────────────────────────────────────────────────

/**
 * Converte string em slug URL-friendly. Idempotente:
 * `slugify(slugify(x)) === slugify(x)`.
 *
 * Story 7.1 AC5 — tests cobrem 6 casos canônicos.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ──────────────────────────────────────────────────────────────────────
// Inferência de tipo de atendimento (regex no nome — gap supplido)
// ──────────────────────────────────────────────────────────────────────

/**
 * Infere `TipoAtendimentoInferido` a partir do nome do prestador.
 * Heurística regex baseada em padrões comuns de nomenclatura ANS.
 * Precisão estimada ~85-90% — casos ambíguos caem em `'Outro'`.
 *
 * Ordem das regras importa (Maternidade antes de Hospital, p.ex.).
 */
export function inferTipoAtendimento(nome: string): TipoAtendimentoInferido {
  const upper = nome.toUpperCase();

  if (/PRONTO\s*SOCORRO|\bPS\b/.test(upper)) {
    return 'Pronto-Socorro';
  }
  if (/MATERNIDADE/.test(upper)) {
    return 'Maternidade';
  }
  if (/HOSPITAL|\bHOSP\b/.test(upper)) {
    return 'Hospital';
  }
  if (/LABORAT[OÓ]RIO|\bLAB\b|AN[ÁA]LISES\s*CL[IÍ]NICAS|PATOLOGIA/.test(upper)) {
    return 'Laboratório';
  }
  if (/IMAGEM|RADIOLOG|RAIO[\s-]?X|TOMOGR|RESSON|ULTRASSOM|ULTRASSON/.test(upper)) {
    return 'Diagnóstico por Imagem';
  }
  if (/ODONT|DENT[IÁ]RI|ORTODONTIA/.test(upper)) {
    return 'Odontologia';
  }
  if (/CL[IÍ]NICA/.test(upper)) {
    return 'Clínica';
  }
  if (/INSTITUTO|CENTRO\b|FUNDA[CÇ][AÃ]O/.test(upper)) {
    return 'Centro/Instituto';
  }

  return 'Outro';
}

// ──────────────────────────────────────────────────────────────────────
// Parser e validação de boot
// ──────────────────────────────────────────────────────────────────────

/**
 * Enriquece `PrestadorAmilRaw` em `PrestadorAmil` adicionando
 * `tipoInferido` (via regex) e `slug` (via `slugify`). Preserva
 * todas as redes do raw — filtragem de redes ativas/inativas é
 * responsabilidade do consumer (Story 7.7 Cluster E).
 */
function parsePrestador(raw: PrestadorAmilRaw): PrestadorAmil {
  const slugSeed = `${raw.codigo}-${raw.nome}-${raw.bairro}`;
  return {
    codigo: raw.codigo,
    nome: raw.nome,
    uf: raw.uf,
    municipio: raw.municipio,
    bairro: raw.bairro,
    redes: raw.redes,
    tipoInferido: inferTipoAtendimento(raw.nome),
    slug: slugify(slugSeed),
  };
}

/**
 * Valida e tipa o dataset bruto importado do JSON. Falha fast no boot
 * com mensagem orientada para detecção de drift hub→mirror (ADR-007).
 */
function loadDataset(): DatasetRedeAmil {
  if (!isDatasetRedeAmil(datasetRaw)) {
    throw new Error(
      'Failed to load rede-credenciada dataset: shape inválido. ' +
        'Esperado schema v2 (SCP v1.2.3). Verificar sync canon→mirror (ADR-007 SSOT).'
    );
  }

  const slugCoverage = validateRedeSlugsCoverage();
  if (!slugCoverage.ok) {
    throw new Error(
      `Failed to load rede-credenciada slugs: drift entre RedeAmilNome e REDE_SLUGS. ` +
        `Faltando: [${slugCoverage.faltando.join(', ')}]. Extras: [${slugCoverage.extras.join(', ')}].`
    );
  }

  return datasetRaw;
}

// ──────────────────────────────────────────────────────────────────────
// Cache em memória — construído no boot, congelado após
// ──────────────────────────────────────────────────────────────────────

interface LoaderCache {
  readonly dataset: DatasetRedeAmil;
  readonly prestadores: readonly PrestadorAmil[];
  readonly municipios: readonly MunicipioRedeAmil[];
  readonly byUf: ReadonlyMap<string, readonly PrestadorAmil[]>;
  readonly byMunicipioSlug: ReadonlyMap<string, readonly PrestadorAmil[]>;
  readonly byBairroSlug: ReadonlyMap<string, readonly PrestadorAmil[]>;
  readonly byPrestadorSlug: ReadonlyMap<string, PrestadorAmil>;
  readonly byRede: ReadonlyMap<RedeAmilNome, readonly PrestadorAmil[]>;
  readonly byTipo: ReadonlyMap<TipoAtendimentoInferido, readonly PrestadorAmil[]>;
  readonly municipiosBySlug: ReadonlyMap<string, MunicipioRedeAmil>;
  readonly estatisticas: EstatisticasRede;
}

let cache: LoaderCache | null = null;

function buildCache(): LoaderCache {
  const dataset = loadDataset();

  const prestadores: PrestadorAmil[] = dataset.prestadores
    .map(parsePrestador)
    .filter((p) => p.uf.length > 0 && p.municipio.length > 0);

  // Aggregate: municípios
  const municipiosMap = new Map<string, MunicipioRedeAmil>();
  for (const prestador of prestadores) {
    const ufSlug = prestador.uf.toLowerCase();
    const cidadeSlug = slugify(prestador.municipio);
    const key = `${ufSlug}|${cidadeSlug}`;

    const existing = municipiosMap.get(key);
    if (existing) {
      existing.totalPrestadores += 1;
    } else {
      municipiosMap.set(key, {
        uf: prestador.uf,
        municipio: prestador.municipio,
        ufSlug,
        cidadeSlug,
        totalPrestadores: 1,
      });
    }
  }
  const municipios: MunicipioRedeAmil[] = Array.from(municipiosMap.values()).sort(
    (a, b) => b.totalPrestadores - a.totalPrestadores
  );

  // Index: byUf
  const byUf = new Map<string, PrestadorAmil[]>();
  for (const prestador of prestadores) {
    const key = prestador.uf.toLowerCase();
    const bucket = byUf.get(key);
    if (bucket) {
      bucket.push(prestador);
    } else {
      byUf.set(key, [prestador]);
    }
  }

  // Index: byMunicipioSlug (key = "ufSlug|cidadeSlug")
  const byMunicipioSlug = new Map<string, PrestadorAmil[]>();
  for (const prestador of prestadores) {
    const key = `${prestador.uf.toLowerCase()}|${slugify(prestador.municipio)}`;
    const bucket = byMunicipioSlug.get(key);
    if (bucket) {
      bucket.push(prestador);
    } else {
      byMunicipioSlug.set(key, [prestador]);
    }
  }

  // Index: byBairroSlug (key = "ufSlug|cidadeSlug|bairroSlug")
  const byBairroSlug = new Map<string, PrestadorAmil[]>();
  for (const prestador of prestadores) {
    if (prestador.bairro.length === 0) {
      continue;
    }
    const key = `${prestador.uf.toLowerCase()}|${slugify(prestador.municipio)}|${slugify(prestador.bairro)}`;
    const bucket = byBairroSlug.get(key);
    if (bucket) {
      bucket.push(prestador);
    } else {
      byBairroSlug.set(key, [prestador]);
    }
  }

  // Index: byPrestadorSlug (key = "ufSlug|cidadeSlug|prestadorSlug")
  const byPrestadorSlug = new Map<string, PrestadorAmil>();
  for (const prestador of prestadores) {
    const key = `${prestador.uf.toLowerCase()}|${slugify(prestador.municipio)}|${prestador.slug}`;
    byPrestadorSlug.set(key, prestador);
  }

  // Index: byRede (apenas redes ativas — filtra strings que não estão em REDES_AMIL_ATIVAS)
  const byRede = new Map<RedeAmilNome, PrestadorAmil[]>();
  for (const rede of REDES_AMIL_ATIVAS) {
    byRede.set(rede, []);
  }
  for (const prestador of prestadores) {
    for (const redeStr of prestador.redes) {
      if (isRedeAmilNome(redeStr)) {
        byRede.get(redeStr)?.push(prestador);
      }
    }
  }

  // Index: byTipo
  const byTipo = new Map<TipoAtendimentoInferido, PrestadorAmil[]>();
  for (const tipo of TIPOS_ATENDIMENTO_KEYS) {
    byTipo.set(tipo, []);
  }
  for (const prestador of prestadores) {
    byTipo.get(prestador.tipoInferido)?.push(prestador);
  }

  // Index: municipiosBySlug (key = "ufSlug|cidadeSlug")
  const municipiosBySlug = new Map<string, MunicipioRedeAmil>();
  for (const municipio of municipios) {
    municipiosBySlug.set(`${municipio.ufSlug}|${municipio.cidadeSlug}`, municipio);
  }

  // Stats agregadas
  const porTipo = TIPOS_ATENDIMENTO_KEYS.reduce<Record<TipoAtendimentoInferido, number>>(
    (acc, tipo) => {
      acc[tipo] = byTipo.get(tipo)?.length ?? 0;
      return acc;
    },
    {} as Record<TipoAtendimentoInferido, number>
  );

  const porUF: Record<string, number> = {};
  for (const [ufLower, bucket] of byUf.entries()) {
    porUF[ufLower.toUpperCase()] = bucket.length;
  }

  const porRede = REDES_AMIL_ATIVAS.reduce<Record<RedeAmilNome, number>>(
    (acc, rede) => {
      acc[rede] = byRede.get(rede)?.length ?? 0;
      return acc;
    },
    {} as Record<RedeAmilNome, number>
  );

  const estatisticas: EstatisticasRede = {
    geradoEm: dataset.geradoEm,
    totalPrestadores: prestadores.length,
    totalUFs: byUf.size,
    totalMunicipios: municipios.length,
    porTipo,
    porUF,
    porRede,
  };

  return {
    dataset,
    prestadores,
    municipios,
    byUf,
    byMunicipioSlug,
    byBairroSlug,
    byPrestadorSlug,
    byRede,
    byTipo,
    municipiosBySlug,
    estatisticas,
  };
}

function getCache(): LoaderCache {
  if (cache === null) {
    cache = buildCache();
  }
  return cache;
}

function isRedeAmilNome(value: string): value is RedeAmilNome {
  return (REDES_AMIL_ATIVAS as readonly string[]).includes(value);
}

// ──────────────────────────────────────────────────────────────────────
// API pública — 14 helpers (AC2 + AC2-bis amendment O-1 não tem helper, é constante)
// ──────────────────────────────────────────────────────────────────────

/**
 * Retorna todos os prestadores enriquecidos. Cache warmed no primeiro call.
 */
export function getAllPrestadores(): readonly PrestadorAmil[] {
  return getCache().prestadores;
}

/**
 * Lista de municípios únicos (UF × município) com contagem de prestadores.
 * Ordenado desc por `totalPrestadores`.
 */
export function getMunicipios(): readonly MunicipioRedeAmil[] {
  return getCache().municipios;
}

/**
 * Resolve UF + cidade slug → município. Retorna `null` se inválido.
 */
export function getMunicipioBySlug(
  ufSlug: string,
  cidadeSlug: string
): MunicipioRedeAmil | null {
  const key = `${ufSlug.toLowerCase()}|${cidadeSlug.toLowerCase()}`;
  return getCache().municipiosBySlug.get(key) ?? null;
}

/**
 * Prestadores de um município específico. Retorna array vazio se UF/cidade inválidos.
 */
export function getPrestadoresPorMunicipio(
  ufSlug: string,
  cidadeSlug: string
): readonly PrestadorAmil[] {
  const key = `${ufSlug.toLowerCase()}|${cidadeSlug.toLowerCase()}`;
  return getCache().byMunicipioSlug.get(key) ?? [];
}

/**
 * Prestadores de um bairro específico (UF + cidade + bairro slugs).
 * Story 7.6 — usa filtro bipartite (≥3 = indexável; 1-2 = noindex+canonical).
 */
export function getPrestadoresPorBairro(
  ufSlug: string,
  cidadeSlug: string,
  bairroSlug: string
): readonly PrestadorAmil[] {
  const key = `${ufSlug.toLowerCase()}|${cidadeSlug.toLowerCase()}|${bairroSlug.toLowerCase()}`;
  return getCache().byBairroSlug.get(key) ?? [];
}

/**
 * Municípios filtrados por UF, ordenados por contagem desc.
 */
export function getMunicipiosByUf(uf: string): readonly MunicipioRedeAmil[] {
  const ufLower = uf.toLowerCase();
  return getCache().municipios.filter((m) => m.ufSlug === ufLower);
}

/**
 * Top-N municípios por contagem de prestadores. Story 7.2 chips top-5 UFs.
 */
export function getTopMunicipios(limit: number): readonly MunicipioRedeAmil[] {
  return getCache().municipios.slice(0, limit);
}

/**
 * Bairros agregados com contagem dado um set arbitrário de prestadores.
 * Útil para drawer "outros bairros de {Município}" (Story 7.6 internal linking).
 */
export function getBairrosDoMunicipio(
  prestadores: readonly PrestadorAmil[]
): readonly { bairro: string; total: number }[] {
  const counts = new Map<string, number>();
  for (const prestador of prestadores) {
    if (prestador.bairro.length === 0) {
      continue;
    }
    counts.set(prestador.bairro, (counts.get(prestador.bairro) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([bairro, total]) => ({ bairro, total }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Prestadores que aceitam uma rede específica. Story 7.7 (Cluster E).
 */
export function getPrestadoresPorRede(rede: RedeAmilNome): readonly PrestadorAmil[] {
  return getCache().byRede.get(rede) ?? [];
}

/**
 * Prestadores de um tipo específico. Story 7.8 (tipo×UF×município).
 */
export function getPrestadoresPorTipo(
  tipo: TipoAtendimentoInferido
): readonly PrestadorAmil[] {
  return getCache().byTipo.get(tipo) ?? [];
}

/**
 * Estatísticas agregadas da rede inteira. Story 7.2 hub stats dataset-driven.
 */
export function getEstatisticasRede(): EstatisticasRede {
  return getCache().estatisticas;
}

/**
 * Estatísticas por UF. Story 7.5 (página-cidade) + Story 7.2 chips drawer.
 */
export function getEstatisticasByUF(uf: string): EstatisticasUFAmil {
  const ufUpper = uf.toUpperCase();
  const ufLower = uf.toLowerCase();
  const prestadoresUf = getCache().byUf.get(ufLower) ?? [];

  const municipiosUf = new Set(prestadoresUf.map((p) => p.municipio));

  const porTipo = TIPOS_ATENDIMENTO_KEYS.reduce<Record<TipoAtendimentoInferido, number>>(
    (acc, tipo) => {
      acc[tipo] = prestadoresUf.filter((p) => p.tipoInferido === tipo).length;
      return acc;
    },
    {} as Record<TipoAtendimentoInferido, number>
  );

  const porRede = REDES_AMIL_ATIVAS.reduce<Record<RedeAmilNome, number>>(
    (acc, rede) => {
      acc[rede] = prestadoresUf.filter((p) => p.redes.includes(rede)).length;
      return acc;
    },
    {} as Record<RedeAmilNome, number>
  );

  return {
    uf: ufUpper,
    ufSlug: ufLower,
    totalPrestadores: prestadoresUf.length,
    totalMunicipios: municipiosUf.size,
    porTipo,
    porRede,
  };
}

/**
 * Slug de um prestador (já gerado em `parsePrestador()`). Acessor canônico.
 */
export function prestadorSlug(prestador: PrestadorAmil): string {
  return prestador.slug;
}

/**
 * Resolve UF + cidade + prestador slugs → prestador. Retorna `null` se inválido.
 * Story 7.4 — usado em `generateStaticParams()`.
 */
export function getPrestadorBySlug(
  ufSlug: string,
  cidadeSlug: string,
  prestadorSlugValue: string
): PrestadorAmil | null {
  const key = `${ufSlug.toLowerCase()}|${cidadeSlug.toLowerCase()}|${prestadorSlugValue}`;
  return getCache().byPrestadorSlug.get(key) ?? null;
}

/**
 * Helper interno exportado para tests — expõe metadata do dataset
 * (geradoEm, fonte, totals do header). Útil para validar shape pós-pipeline 7.10.
 */
export function getDatasetMetadata(): {
  geradoEm: string;
  fonte: string;
  totalRedes: number;
  totalPrestadores: number;
} {
  const { dataset } = getCache();
  return {
    geradoEm: dataset.geradoEm,
    fonte: dataset.fonte,
    totalRedes: dataset.totalRedes,
    totalPrestadores: dataset.totalPrestadores,
  };
}

/**
 * Reset do cache — usado APENAS em tests para isolar invocações.
 * Não exportar como API pública em produção.
 *
 * @internal
 */
export function __resetCacheForTests(): void {
  cache = null;
}
