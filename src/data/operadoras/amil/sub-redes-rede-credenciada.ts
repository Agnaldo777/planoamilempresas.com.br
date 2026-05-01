/**
 * Sub-Redes Amil — Mapeamento canônico (Story 7.11 FR44)
 *
 * Define as **5 sub-redes Amil** cobertas em `/rede-credenciada/[sub-rede]/`.
 *
 * **Fonte das classificações:**
 * - Comunicação oficial Amil: rede D'or, Amil One, Linha Selecionada (Fácil),
 *   Linha Clássica
 * - Cross-reference com `data/tabelas-amil.ts` (segmentações) e
 *   `src/lib/operadoras/amil/rede-credenciada-loader.ts` (loader canônico,
 *   11 redes ativas no dataset Power BI 2026-04-26)
 *
 * **Disclaimer GAP de dataset:**
 * - O dataset Power BI Amil retorna `prestadores[].redes: string[]` com 11 valores
 *   (`AMIL S380 QP`, `BLACK`, `ADESÃO BRONZE RJ`, etc.) — não há campo explícito
 *   "rede D'or" ou "tipo de hospital próprio". Mitigação: classificação parcial via
 *   nome do prestador (heurística HOSPITAL D'OR / SANTA HELENA / SAMARITANO etc.)
 *   + mapping rede→sub-rede.
 * - TODO Atlas: validar lista oficial de hospitais D'or contra Amil (ANS) e
 *   refinar heurística de classificação.
 *
 * **ADR-006 compliance (URL-as-Trademark):**
 * - Slugs evitam usar marca "Amil" sozinha — sempre qualificada
 *   (ex: `/rede-credenciada/amil-one-rede-selecionada/` ok; `/amil/` não ok)
 * - Mitigação 2: cada sub-rede renderiza disclaimer ANS + corretor SUSEP
 *
 * **PRD references:** FR44 (sub-pillars rede credenciada), NFR25 (anti-cookie-cutter)
 */

import type { RedeAmilNome } from '@/types/rede-credenciada-amil'

/**
 * Slug canônico das sub-redes (URL-friendly + ADR-006 compliant).
 *
 * Reservado em URL: `/rede-credenciada/[subRedeSlug]/`
 */
export type SubRedeSlug =
  | 'hospitais-dor'
  | 'amil-one-rede-selecionada'
  | 'amil-facil-rede-selecionada'
  | 'classica'
  | 'amil-medial'

/**
 * Posicionamento estratégico de cada sub-rede.
 *
 * Usado para:
 * - Diferenciação editorial (anti-cookie-cutter NFR25)
 * - Schema HealthInsurancePlan.description
 * - Title/H1 templates
 */
export type PosicionamentoSubRede =
  | 'premium-hospitalar'
  | 'premium-executivo'
  | 'pme-budget-regional'
  | 'rede-ampla-nacional'
  | 'medicina-de-grupo-regional'

/**
 * Dataset canônico de cada sub-rede.
 *
 * Cross-link com:
 * - `produtosAmilRelacionados`: nomes literais que devem casar com `data/tabelas-amil.ts`
 * - `redesDataset`: subset das 11 redes ativas em `@/types/rede-credenciada-amil`
 *   (`RedeAmilNome`) que pertencem a esta sub-rede
 * - `hospitaisFlagship`: lista nominal hardcoded de hospitais reconhecidos publicamente
 *   como da sub-rede (Atlas valida)
 */
export interface SubRedeAmil {
  /** Slug URL-friendly (ADR-006 compliant) */
  slug: SubRedeSlug
  /** Nome canônico para H1/title (sem palavra "Amil" inicial — adicionada em template) */
  nome: string
  /** Nome curto para breadcrumbs */
  nomeCurto: string
  /** Posicionamento estratégico (drives copy diferenciada) */
  posicionamento: PosicionamentoSubRede
  /** Descrição one-liner para meta description / hero subtitle */
  tagline: string
  /** Produtos Amil que dão acesso a essa sub-rede (nominal — TODO Atlas valida) */
  produtosAmilRelacionados: string[]
  /**
   * Redes literais do dataset Power BI que pertencem a essa sub-rede.
   *
   * Empty array = sub-rede não tem mapping direto em redes Power BI
   * (ex: D'or é hospitais próprios, não código de rede). Usar `hospitaisFlagship`.
   */
  redesDataset: readonly RedeAmilNome[]
  /**
   * Lista nominal de hospitais/clínicas flagship dessa sub-rede.
   * Heurística primária para classificação por nome.
   */
  hospitaisFlagship: readonly string[]
  /** Origem/posicionamento (200 palavras editorial) — TODO @po Pax valida copy */
  origem: string
  /** Público-alvo principal */
  publicoAlvo: string
}

/**
 * Catálogo canônico das 5 sub-redes Amil cobertas.
 *
 * **Anti-cookie-cutter (NFR25):** cada `origem` é texto único refletindo
 * posicionamento real da sub-rede. Não usar template/regex repetido.
 */
export const SUB_REDES_AMIL: Record<SubRedeSlug, SubRedeAmil> = {
  'hospitais-dor': {
    slug: 'hospitais-dor',
    nome: "Rede D'Or",
    nomeCurto: "D'Or",
    posicionamento: 'premium-hospitalar',
    tagline:
      "Rede própria UnitedHealth — hospitais de referência reconhecidos por excelência clínica e tecnologia de ponta.",
    produtosAmilRelacionados: [
      'Amil One S6500 Black',
      'Amil Black',
      'Platinum Mais',
    ],
    redesDataset: ['AMIL ONE S6500 BLACK QP', 'BLACK'] as const,
    hospitaisFlagship: [
      'COPA D OR',
      'BARRA D OR',
      'QUINTA D OR',
      'NORTE D OR',
      'OESTE D OR',
      'D OR',
      'SAO LUIZ',
      'PERINATAL',
      'SAMARITANO',
      'BANGU',
      'NIITEROI D OR',
    ] as const,
    origem:
      "A Rede D'Or São Luiz é o maior grupo hospitalar privado do Brasil, adquirido pela UnitedHealth em 2024 e integrado à carteira Amil em 2025. Reúne hospitais como Copa D'Or, Barra D'Or, Quinta D'Or e Hospital São Luiz — referências em alta complexidade no Rio de Janeiro e em São Paulo. Para o decisor PJ, contratar planos com acesso à rede D'Or significa garantir aos colaboradores atendimento em estabelecimentos com infraestrutura de UTI, centros oncológicos e maternidades de Tier 1, com tempo médio de espera reduzido em comparação a redes amplas. A inclusão da rede D'Or é o principal diferenciador dos planos Amil Black e Amil One — produtos top da operadora.",
    publicoAlvo:
      'Empresas com colaboradores executivos, headcount qualificado e demanda por experiência hospitalar premium em RJ/SP/BSB.',
  },
  'amil-one-rede-selecionada': {
    slug: 'amil-one-rede-selecionada',
    nome: 'Amil One Rede Selecionada',
    nomeCurto: 'Amil One',
    posicionamento: 'premium-executivo',
    tagline:
      'Rede curada premium para alta diretoria — concierge médico, hospitais de excelência e atendimento personalizado.',
    produtosAmilRelacionados: ['Amil One S6500 Black', 'Amil One S2500'],
    redesDataset: ['AMIL ONE S6500 BLACK QP'] as const,
    hospitaisFlagship: [
      'ALBERT EINSTEIN',
      'SIRIO LIBANES',
      'OSWALDO CRUZ',
      'COPA D OR',
      'BARRA D OR',
      '9 DE JULHO',
      'NOVE DE JULHO',
    ] as const,
    origem:
      'O Amil One é a linha executive da operadora — produtos com mensalidade acima de R$ 2.500/vida e rede curada que inclui Albert Einstein, Sírio-Libanês, Oswaldo Cruz e os principais hospitais Rede D\'Or. Diferente da Linha Clássica (rede ampla nacional), o Amil One trabalha com rede menor mas com qualidade hospitalar Tier 1 garantida. Inclui benefícios diferenciados como acompanhante 24h, quarto privativo padrão, concierge médico e cobertura internacional opcional. É o produto preferido de diretorias executivas e empresas que oferecem benefício saúde como ferramenta de retenção de talentos sênior.',
    publicoAlvo:
      'Diretoria, board, sócios e profissionais sênior com benefício saúde como peça-chave do pacote de remuneração.',
  },
  'amil-facil-rede-selecionada': {
    slug: 'amil-facil-rede-selecionada',
    nome: 'Amil Fácil Rede Selecionada',
    nomeCurto: 'Amil Fácil',
    posicionamento: 'pme-budget-regional',
    tagline:
      'Rede regional otimizada para PME — mensalidade acessível, cobertura local densa, ideal para 2-29 vidas.',
    produtosAmilRelacionados: [
      'Amil Fácil S60',
      'Amil Fácil S80',
      'Amil S380 QP',
      'Amil S380 QC',
    ],
    redesDataset: ['AMIL S380 QP', 'AMIL S380 QC'] as const,
    hospitaisFlagship: [] as const,
    origem:
      'A linha Amil Fácil é o produto de entrada para PME no portfólio Amil — concebido para empresas de 2 a 29 vidas que precisam oferecer plano de saúde com mensalidade controlada. A rede é regional (não nacional), com foco em hospitais e clínicas dentro do estado contratado, e exclui as redes premium (D\'Or, Einstein, Sírio). Em troca, mensalidade média 35-45% inferior à Linha Clássica. Para o decisor PJ que precisa cumprir convenção coletiva, atender exigência de benefício corporativo ou simplesmente reter colaboradores administrativos sem custo proibitivo, o Amil Fácil é o ponto de equilíbrio. Cobertura geográfica concentrada em SP, RJ, MG, PR e DF.',
    publicoAlvo:
      'Pequenas empresas (2-29 vidas) com sede em capitais ou regiões metropolitanas; preferência por mensalidade controlada sobre rede ampla.',
  },
  classica: {
    slug: 'classica',
    nome: 'Linha Clássica',
    nomeCurto: 'Clássica',
    posicionamento: 'rede-ampla-nacional',
    tagline:
      'Rede ampla nacional — cobertura em 26 UFs, ideal para empresas com colaboradores distribuídos em múltiplos estados.',
    produtosAmilRelacionados: [
      'Amil S450 QP',
      'Amil S450 QC',
      'Amil S580 QP',
      'Amil S750 QP',
    ],
    redesDataset: [
      'AMIL S450 QP',
      'AMIL S450 QC',
      'AMIL S580 QP',
      'AMIL S750 QP',
    ] as const,
    hospitaisFlagship: [] as const,
    origem:
      'A Linha Clássica reúne os produtos Amil S450, S580 e S750 — a coluna vertebral da operadora em cobertura nacional. Para empresas com colaboradores distribuídos em múltiplos estados (matriz em SP + filiais em RJ, MG, PR, RS), a Clássica é a opção que entrega rede credenciada presente em 26 UFs do dataset oficial Amil. Inclui hospitais regionais reconhecidos sem premium dos planos One, e mantém abrangência nacional com 9.325 prestadores cadastrados. Ideal como benefício corporativo padrão para colaboradores CLT mid-level.',
    publicoAlvo:
      'Médias e grandes empresas com colaboradores em múltiplas capitais; perfil colaborador CLT mid-level (gerentes, especialistas, supervisores).',
  },
  'amil-medial': {
    slug: 'amil-medial',
    nome: 'Amil Medial',
    nomeCurto: 'Medial',
    posicionamento: 'medicina-de-grupo-regional',
    tagline:
      'Rede regional Medial absorvida pela Amil — opção popular em adesão Bronze RJ/SP com mensalidade competitiva.',
    produtosAmilRelacionados: [
      'Adesão Bronze RJ',
      'Adesão Bronze SP',
      'Adesão Ouro Mais',
    ],
    redesDataset: [
      'ADESÃO BRONZE RJ',
      'ADESÃO BRONZE SP',
      'ADESÃO OURO MAIS',
    ] as const,
    hospitaisFlagship: [] as const,
    origem:
      'A Medial Saúde foi adquirida pela Amil em 2009 e a marca foi integrada ao portfólio sob a forma de planos Adesão Bronze (RJ, SP) e Adesão Ouro Mais. A rede herdada da Medial é regional — concentrada em RJ e SP — e atende public-alvo de adesão (associações, sindicatos, conselhos profissionais). Para autônomos e MEI elegíveis a contratos de adesão, é uma porta de entrada ao ecossistema Amil com mensalidade ~25-30% inferior à Clássica. Importante: cobertura geográfica restrita; não recomendada para empresas com filiais nacionais.',
    publicoAlvo:
      'MEI, autônomos e profissionais elegíveis a planos de adesão por sindicato/associação em RJ ou SP.',
  },
}

/**
 * Slugs ordenados por relevância SEO/comercial (drives ordem em hub e sitemap).
 */
export const SUB_REDE_SLUGS: readonly SubRedeSlug[] = [
  'hospitais-dor',
  'amil-one-rede-selecionada',
  'classica',
  'amil-facil-rede-selecionada',
  'amil-medial',
] as const

/**
 * Lookup helper — retorna sub-rede por slug ou null se inválido.
 */
export function getSubRedeBySlug(slug: string): SubRedeAmil | null {
  if (!(slug in SUB_REDES_AMIL)) return null
  return SUB_REDES_AMIL[slug as SubRedeSlug]
}
