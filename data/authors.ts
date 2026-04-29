/**
 * Author Catalog — YMYL E-E-A-T (Story 6.9 / NFR22)
 *
 * Single source of truth para autores e revisores de conteúdo YMYL
 * (saúde, regulatório, financeiro). Cada autor tem credenciais
 * verificáveis (SUSEP, OAB, CRM) declaradas em schema Person.
 *
 * NOTA: campos com prefixo `[Nome]` ou OAB/CRM com `___` são
 * placeholders — devem ser preenchidos quando contratos forem
 * formalizados (Story 2.4, Story 1.0 AC4). NÃO inventar identificadores.
 */

export type AuthorRole =
  | 'corretor'
  | 'editor'
  | 'revisor-juridico'
  | 'revisor-medico'
  | 'organizacao';

export interface AuthorCredential {
  type: 'SUSEP' | 'OAB' | 'CRM' | 'ANS_BROKER' | 'CNPJ';
  value: string;
  /** URL pública para verificação (registro oficial). */
  url?: string;
}

export interface Author {
  /** Slug usado em rota /autores/[slug]/. */
  id: string;
  /** Schema.org @type. Person para humanos, Organization para BeneficioRH. */
  type: 'Person' | 'Organization';
  name: string;
  jobTitle: string;
  role: AuthorRole;
  credentials: AuthorCredential[];
  /** Biografia curta (≤60 palavras) — usada em byline. */
  bioShort: string;
  /** Biografia longa (≤200 palavras) — usada em /autores/[slug]/. */
  bioLong: string;
  /** URL absoluta ou relativa da foto (≥1000px). */
  image?: string;
  /** Link para página dedicada do autor (relativo). */
  url: string;
  /** Tópicos de expertise (Schema.org knowsAbout). */
  knowsAbout: string[];
  /** Perfis externos (Schema.org sameAs). */
  sameAs?: string[];
  /** Afiliação institucional (Schema.org affiliation). */
  affiliation?: {
    type: 'Organization';
    name: string;
    url?: string;
  };
}

export type AuthorId =
  | 'agnaldo-silva'
  | 'beneficiorh'
  | 'revisor-juridico'
  | 'revisor-medico';

export const authors: Record<AuthorId, Author> = {
  'agnaldo-silva': {
    id: 'agnaldo-silva',
    type: 'Person',
    name: 'Agnaldo Silva',
    jobTitle: 'Corretor de Seguros e Editor — SUSEP 201054484',
    role: 'corretor',
    credentials: [
      {
        type: 'SUSEP',
        value: '201054484',
        url: 'https://www2.susep.gov.br/safe/menumercado/regagentes/pesquisa.asp',
      },
    ],
    bioShort:
      'Corretor de seguros autorizado SUSEP 201054484, especializado em planos de saúde empresariais Amil. Editor responsável do portal BeneficioRH.',
    bioLong:
      'Agnaldo Silva é corretor de seguros autorizado pela SUSEP sob o registro 201054484, com atuação focada em planos de saúde empresariais. Sócio da BeneficioRH (CNPJ 14.764.085/0001-99), atende empresas de pequeno e médio porte na contratação, gestão e renovação de planos coletivos Amil. Atua como editor responsável do portal, garantindo que cada conteúdo publicado passe por revisão técnica (corretor) e jurídica (advogado parceiro) antes de ir ao ar — pipeline alinhado às diretrizes E-E-A-T do Google para conteúdo YMYL.',
    image: '/authors/agnaldo-silva.jpg',
    url: '/sobre-corretor',
    knowsAbout: [
      'plano de saúde empresarial',
      'Amil',
      'ANS',
      'carências',
      'reajuste de plano',
      'CPT (Cobertura Parcial Temporária)',
      'corretagem de seguros',
    ],
    sameAs: [
      // TODO: confirmar handle stakeholder Story 1.0 AC1.1
      // 'https://www.linkedin.com/in/agnaldo-silva-beneficiorh',
    ],
    affiliation: {
      type: 'Organization',
      name: 'BeneficioRH',
      url: 'https://beneficiorh.com.br',
    },
  },
  beneficiorh: {
    id: 'beneficiorh',
    type: 'Organization',
    name: 'BeneficioRH',
    jobTitle: 'Editor Institucional',
    role: 'organizacao',
    credentials: [{ type: 'CNPJ', value: '14.764.085/0001-99' }],
    bioShort:
      'Corretora autorizada SUSEP 201054484, especialista em planos de saúde empresariais Amil. Editor institucional do portal.',
    bioLong:
      'BeneficioRH é corretora de seguros e benefícios autorizada pela SUSEP, registrada sob CNPJ 14.764.085/0001-99 e habilitada na ANS para corretagem de planos de saúde. Atende empresas em todo o território nacional na contratação de planos Amil empresariais, com foco em pequenas e médias empresas. O conteúdo institucional do portal é publicado pela BeneficioRH como entidade editora, com revisão jurídica obrigatória em temas regulatórios e de saúde.',
    image: '/logo.png',
    url: '/sobre-nos',
    knowsAbout: [
      'plano de saúde empresarial',
      'Amil',
      'ANS',
      'corretagem de seguros',
      'benefícios corporativos',
    ],
    sameAs: [
      'https://www.linkedin.com/company/beneficiorh',
    ],
  },
  'revisor-juridico': {
    id: 'revisor-juridico',
    type: 'Person',
    // Placeholder: nome real virá da Story 2.4 (advogado contratado).
    name: '[Nome do Advogado Revisor]',
    jobTitle: 'Revisor Jurídico Regulatório — OAB ___',
    role: 'revisor-juridico',
    credentials: [
      {
        type: 'OAB',
        value: '___',
        url: 'https://cna.oab.org.br/',
      },
    ],
    bioShort:
      'Advogado especializado em direito regulatório de saúde suplementar (Lei 9.656/98, RNs ANS) e direito do consumidor.',
    bioLong:
      'Advogado parceiro responsável pela revisão jurídica de conteúdo regulatório do portal. Especializado em direito da saúde suplementar (Lei 9.656/98, normas ANS), direito do consumidor e contratos coletivos. Cada conteúdo sobre carência, CPT, reajuste, coberturas obrigatórias e disputas com operadora passa por sua revisão antes de publicação. Identidade e OAB serão divulgados após formalização do contrato (Story 2.4).',
    image: '/authors/revisor-juridico-placeholder.jpg',
    url: '/autores/revisor-juridico',
    knowsAbout: [
      'Lei 9.656/98',
      'ANS',
      'direito da saúde suplementar',
      'direito do consumidor',
      'contratos coletivos',
    ],
  },
  'revisor-medico': {
    id: 'revisor-medico',
    type: 'Person',
    // Placeholder: contratação opcional v1, mandatory v2 (Story 1.0/2.5).
    name: '[Nome do Médico Revisor]',
    jobTitle: 'Revisor Técnico Médico — CRM ___',
    role: 'revisor-medico',
    credentials: [
      {
        type: 'CRM',
        value: '___',
        url: 'https://portal.cfm.org.br/',
      },
    ],
    bioShort:
      'Médico parceiro responsável pela revisão técnica de conteúdo de saúde (procedimentos, coberturas, doenças preexistentes).',
    bioLong:
      'Médico parceiro responsável pela revisão técnica de conteúdo de saúde do portal — procedimentos cobertos por Rol ANS, condições preexistentes (CPT), telemedicina, doenças crônicas e diretrizes médicas. Identidade e CRM serão divulgados após formalização do contrato (versão 2 do portal, Story 2.5).',
    image: '/authors/revisor-medico-placeholder.jpg',
    url: '/autores/revisor-medico',
    knowsAbout: [
      'medicina',
      'Rol de Procedimentos ANS',
      'doenças preexistentes',
      'telemedicina',
    ],
  },
};

/** Categorias YMYL que exigem reviewedBy obrigatório (NFR22 + NFR23). */
export const YMYL_CATEGORIES = [
  'carencia',
  'cpt',
  'reajuste',
  'ans',
  'coberturas',
  'doencas',
  'legislacao-ans',
] as const;

export type YmylCategory = (typeof YMYL_CATEGORIES)[number];

/** Type guard para AuthorId. */
export function isAuthorId(value: unknown): value is AuthorId {
  return typeof value === 'string' && value in authors;
}

/** Lookup seguro de autor com fallback para BeneficioRH. */
export function getAuthor(id: AuthorId): Author {
  return authors[id];
}
