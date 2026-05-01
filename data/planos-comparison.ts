/**
 * data/planos-comparison.ts — Story 3.21 (FR38)
 *
 * Dataset canônico de planos Amil para o comparador `<PlanComparison />`.
 * 5 planos representativos × ~10 features comparáveis.
 *
 * **NÃO inventar features.** Onde a Amil não publica spec confirmada,
 * marcar `// TODO Atlas: validar` e usar valor `null` (renderiza "—").
 *
 * **Compliance:**
 *   - FR38 (PRD v1.3.1): comparador URL shareable + schema Product × N
 *   - FR54: `Product.brand="Amil"` ok; Organization=BeneficioRH (em Product.provider)
 *   - ADR-006: slug intra-Amil sem trademark no path principal
 *   - NFR23: revisão humana — todo TODO Atlas: precisa validação Amil Comercial
 */

export type PlanoSlug =
  | 'bronze'
  | 'prata'
  | 'ouro'
  | 'platinum'
  | 'black';

export type FeatureKey =
  | 'cobertura-nacional'
  | 'rede-credenciada'
  | 'hospitais-premium'
  | 'telemedicina'
  | 'reembolso'
  | 'coparticipacao'
  | 'acomodacao'
  | 'abrangencia'
  | 'cobertura-internacional'
  | 'odontologia';

export type FeatureValue =
  | { kind: 'incluso' }
  | { kind: 'nao-incluso' }
  | { kind: 'premium' }
  | { kind: 'texto'; valor: string }
  | { kind: 'indisponivel' };

export interface FeatureRow {
  /** Chave estável do recurso. */
  id: FeatureKey;
  /** Label exibido na coluna esquerda. */
  label: string;
  /** Descrição opcional para tooltip / leitura adicional. */
  descricao?: string;
}

export interface PlanoComparison {
  /** Slug estável (URL param). */
  slug: PlanoSlug;
  /** Nome curto exibido no header da coluna (ex: "Bronze"). */
  nome: string;
  /** Nome completo do produto Amil (`Product.name` no schema). */
  nomeCompleto: string;
  /** Tier comercial — usado para ordenação default. */
  tier: 1 | 2 | 3 | 4 | 5;
  /** Descrição curta — usada em `Product.description`. */
  descricao: string;
  /** Faixa de preço base referência 30-39 anos (BRL). */
  priceFrom: number | null;
  /** Mapping featureKey → FeatureValue. Campo ausente = "indisponivel". */
  features: Readonly<Partial<Record<FeatureKey, FeatureValue>>>;
}

/**
 * Definição canônica das linhas de comparação (ordem de renderização).
 *
 * Hoarder: `<PlanComparison />` itera sobre `FEATURE_ROWS` e busca
 * `plano.features[row.id]`; valor ausente cai em `indisponivel` ("—").
 */
export const FEATURE_ROWS: readonly FeatureRow[] = [
  {
    id: 'cobertura-nacional',
    label: 'Cobertura Nacional',
    descricao:
      'Atendimento em rede credenciada Amil em todo o território brasileiro.',
  },
  {
    id: 'abrangencia',
    label: 'Abrangência',
    descricao: 'Regional (grupo de municípios) ou Nacional.',
  },
  {
    id: 'rede-credenciada',
    label: 'Rede Credenciada',
    descricao:
      'Tamanho aproximado da rede de prestadores acessível pelo plano.',
  },
  {
    id: 'hospitais-premium',
    label: 'Hospitais Premium',
    descricao:
      'Acesso a hospitais Top-Tier (Albert Einstein, Sírio-Libanês, Oswaldo Cruz, etc.).',
  },
  {
    id: 'acomodacao',
    label: 'Acomodação Hospitalar',
    descricao: 'Quarto Coletivo (QC) ou Quarto Privativo (QP).',
  },
  {
    id: 'telemedicina',
    label: 'Telemedicina 24h',
    descricao: 'Consultas médicas remotas via app.',
  },
  {
    id: 'coparticipacao',
    label: 'Coparticipação',
    descricao:
      'Pagamento adicional por uso (consulta/exame) além da mensalidade.',
  },
  {
    id: 'reembolso',
    label: 'Reembolso (rede livre)',
    descricao:
      'Reembolso de procedimentos fora da rede credenciada (LR — Livre Recebimento).',
  },
  {
    id: 'cobertura-internacional',
    label: 'Cobertura Internacional',
    descricao:
      'Atendimento e reembolso em consultas/internações fora do Brasil.',
  },
  {
    id: 'odontologia',
    label: 'Odontologia Inclusa',
    descricao: 'Plano dental embutido (sem custo adicional).',
  },
];

/**
 * Dataset canônico de planos.
 *
 * Valores derivados de informações públicas Amil + práticas de mercado;
 * specs específicas (ex: contagem exata de prestadores na rede de cada
 * tier) marcadas com `// TODO Atlas: validar` quando não há fonte direta.
 */
export const PLANOS_COMPARISON: ReadonlyArray<PlanoComparison> = [
  {
    slug: 'bronze',
    nome: 'Bronze',
    nomeCompleto: 'Amil Bronze Empresarial',
    tier: 1,
    descricao:
      'Plano de entrada para PME, com cobertura ANS completa, telemedicina e abrangência regional.',
    // TODO Atlas (humano): obter tabela 2026 oficial (kitcorretoramil PDFs 2026.01/2026.02 — ver docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md). Manter `null` até validação Amil Comercial; UI renderiza "Sob consulta".
    priceFrom: null,
    features: {
      // Linha Clássica/Bronze: tipicamente regional, sem hospitais top-tier (fonte: docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md §1, sitemap /linha-classica/amil-bronze.html)
      'cobertura-nacional': { kind: 'nao-incluso' },
      abrangencia: { kind: 'texto', valor: 'Regional (Grupo Municípios)' },
      'rede-credenciada': { kind: 'texto', valor: 'Básica' },
      'hospitais-premium': { kind: 'nao-incluso' },
      acomodacao: { kind: 'texto', valor: 'QC (Coletivo)' },
      // Telemedicina obrigatória pela RN 539/2022 (telessaúde) — disponível em todos os planos Amil.
      telemedicina: { kind: 'incluso' },
      // Coparticipação regulada pela RN 433/2018 (limite 30% por procedimento, isenção em urgência/emergência).
      coparticipacao: { kind: 'texto', valor: 'Sim (típico)' },
      reembolso: { kind: 'nao-incluso' },
      'cobertura-internacional': { kind: 'nao-incluso' },
      odontologia: { kind: 'nao-incluso' },
    },
  },
  {
    slug: 'prata',
    nome: 'Prata',
    nomeCompleto: 'Amil Prata Empresarial',
    tier: 2,
    descricao:
      'Plano intermediário com abrangência ampliada, telemedicina e rede credenciada estendida.',
    // TODO Atlas (humano): obter tabela 2026 oficial via Amil Comercial / kitcorretoramil PDFs.
    priceFrom: null,
    features: {
      // Linha Clássica Prata: nacional sem acesso a top-tier (fonte: docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md §1).
      'cobertura-nacional': { kind: 'incluso' },
      abrangencia: { kind: 'texto', valor: 'Nacional' },
      'rede-credenciada': { kind: 'texto', valor: 'Estendida' },
      'hospitais-premium': { kind: 'nao-incluso' },
      acomodacao: { kind: 'texto', valor: 'QC (Coletivo)' },
      telemedicina: { kind: 'incluso' },
      // Coparticipação opcional na contratação — RN 433/2018 (limite 30%/procedimento, isenção urgência/emergência).
      coparticipacao: { kind: 'texto', valor: 'Opcional' },
      reembolso: { kind: 'nao-incluso' },
      'cobertura-internacional': { kind: 'nao-incluso' },
      odontologia: { kind: 'nao-incluso' },
    },
  },
  {
    slug: 'ouro',
    nome: 'Ouro',
    nomeCompleto: 'Amil Ouro Empresarial',
    tier: 3,
    descricao:
      'Plano com acomodação privativa, rede ampla nacional e início de acesso a hospitais top-tier.',
    // TODO Atlas (humano): obter tabela 2026 oficial via Amil Comercial / kitcorretoramil PDFs.
    priceFrom: null,
    features: {
      // Linha Clássica Ouro: nacional + acomodação QP. Acesso parcial a top-tier varia por contrato — manter "Parcial" até validação rede oficial.
      'cobertura-nacional': { kind: 'incluso' },
      abrangencia: { kind: 'texto', valor: 'Nacional' },
      'rede-credenciada': { kind: 'texto', valor: 'Ampla' },
      // TODO Atlas (humano): confirmar com tabela rede credenciada Amil Ouro 2026 quais hospitais top-tier estão inclusos por região.
      'hospitais-premium': { kind: 'texto', valor: 'Parcial' },
      acomodacao: { kind: 'texto', valor: 'QP (Privativo)' },
      telemedicina: { kind: 'incluso' },
      coparticipacao: { kind: 'texto', valor: 'Opcional' },
      reembolso: { kind: 'nao-incluso' },
      'cobertura-internacional': { kind: 'nao-incluso' },
      odontologia: { kind: 'nao-incluso' },
    },
  },
  {
    slug: 'platinum',
    nome: 'Platinum',
    nomeCompleto: 'Amil Platinum Empresarial',
    tier: 4,
    descricao:
      'Plano premium com acesso a hospitais top-tier, reembolso em rede livre e benefícios estendidos.',
    // TODO Atlas (humano): obter tabela 2026 oficial via Amil Comercial / kitcorretoramil PDFs.
    priceFrom: null,
    features: {
      // Linha Clássica Platinum: rede premium + hospitais top-tier (Albert Einstein, Sírio-Libanês — fonte: docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md §1, meta description amilsaudebr).
      'cobertura-nacional': { kind: 'incluso' },
      abrangencia: { kind: 'texto', valor: 'Nacional' },
      'rede-credenciada': { kind: 'texto', valor: 'Premium' },
      'hospitais-premium': { kind: 'incluso' },
      acomodacao: { kind: 'texto', valor: 'QP (Privativo)' },
      telemedicina: { kind: 'incluso' },
      coparticipacao: { kind: 'texto', valor: 'Opcional' },
      // Reembolso disponível — valor por porte (S380, S450, S580, S750, One). TODO Atlas (humano): tabela reembolso 2026 não verificada — manter UI "Sim, varia por porte" até obter PDF oficial Amil.
      reembolso: { kind: 'incluso' },
      // Linha Clássica Platinum tipicamente NÃO tem cobertura internacional — esta é diferencial da linha Black (Amil One). TODO Atlas (humano): caso campanha Amil 2026 ofereça cobertura internacional opcional em Platinum, atualizar a partir de comunicado oficial.
      'cobertura-internacional': { kind: 'nao-incluso' },
      odontologia: { kind: 'nao-incluso' },
    },
  },
  {
    slug: 'black',
    nome: 'Black',
    nomeCompleto: 'Amil One Black Empresarial',
    tier: 5,
    descricao:
      'Plano top de linha com cobertura internacional, hospitais top-tier nacionais, reembolso ampliado e atendimento concierge.',
    // TODO Atlas (humano): produto Amil One Black tipicamente "sob consulta" — obter faixa de preço com Amil Comercial (kitcorretoramil indica versões Black I e Black II em material 2026).
    priceFrom: null,
    features: {
      // Amil One Black: linha premium com Albert Einstein e Sírio-Libanês na rede (fonte: docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md §1, meta description "rede credenciada com Albert Einstein e Sírio Libanês").
      'cobertura-nacional': { kind: 'incluso' },
      abrangencia: { kind: 'texto', valor: 'Nacional + Internacional' },
      'rede-credenciada': { kind: 'texto', valor: 'Top Premium' },
      'hospitais-premium': { kind: 'premium' },
      acomodacao: { kind: 'texto', valor: 'QP (Privativo)' },
      telemedicina: { kind: 'incluso' },
      coparticipacao: { kind: 'texto', valor: 'Sem (típico premium)' },
      // Reembolso premium em rede livre — valor varia por porte. TODO Atlas (humano): tabela de reembolso 2026 não verificada publicamente; manter UI "varia por porte" até obter material oficial Amil One.
      reembolso: { kind: 'premium' },
      'cobertura-internacional': { kind: 'incluso' },
      // TODO Atlas (humano): confirmar com material kitcorretoramil 2026 se Amil Dental está incluso por padrão em Amil One Black ou contratado em separado. Manter "incluso" até validação; se não confirmado, alterar para "nao-incluso".
      odontologia: { kind: 'incluso' },
    },
  },
];

/**
 * Index por slug para lookup O(1) — evita re-iterar no componente.
 */
export const PLANOS_COMPARISON_BY_SLUG: Readonly<
  Record<PlanoSlug, PlanoComparison>
> = Object.freeze(
  Object.fromEntries(
    PLANOS_COMPARISON.map((p) => [p.slug, p]),
  ) as Record<PlanoSlug, PlanoComparison>,
);

/**
 * Valida e normaliza um array de slugs vindos da URL.
 *
 * **Regras:**
 *   - Mínimo 2, máximo 4 (UX/legibilidade — AC3.21.1)
 *   - Slugs inválidos descartados silenciosamente
 *   - Ordem normalizada por `tier` ascendente (evita canibalização SEO)
 *   - Se resultado < 2, retorna fallback `['bronze','prata','ouro']`
 *
 * @param input Lista bruta de slugs (de `searchParams.planos.split(',')`).
 * @returns     Lista normalizada e válida (sempre ≥2 itens).
 */
export function normalizePlanSlugs(input: readonly string[]): PlanoSlug[] {
  const validSlugs = (Object.keys(PLANOS_COMPARISON_BY_SLUG) as PlanoSlug[]);
  const set = new Set<PlanoSlug>();
  for (const raw of input) {
    const normalized = raw.trim().toLowerCase();
    if (validSlugs.includes(normalized as PlanoSlug)) {
      set.add(normalized as PlanoSlug);
    }
  }

  let result = Array.from(set);
  // Limita a 4 (mantém os 4 primeiros no input)
  if (result.length > 4) result = result.slice(0, 4);

  // Fallback: se < 2 válidos, usa default canônico
  if (result.length < 2) {
    return ['bronze', 'prata', 'ouro'];
  }

  // Ordena por tier ascendente (canonical order)
  return result.sort(
    (a, b) =>
      PLANOS_COMPARISON_BY_SLUG[a].tier - PLANOS_COMPARISON_BY_SLUG[b].tier,
  );
}

/**
 * Parse de string `?planos=bronze,prata,ouro` → array de slugs válidos.
 */
export function parsePlanosQuery(query: string | undefined | null): PlanoSlug[] {
  if (!query || typeof query !== 'string') {
    return ['bronze', 'prata', 'ouro'];
  }
  return normalizePlanSlugs(query.split(','));
}
