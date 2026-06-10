/**
 * Dados editoriais dos produtos Amil — Frente 2 (conteúdo/SEO).
 *
 * Fonte única para as páginas /planos/[slug] (e reuso futuro). Inclui sinônimos
 * de nomenclatura legada ("Amil 400/700") para capturar busca antiga sem afirmar
 * equivalência exata. Valores são REFERÊNCIA ("a partir de"), sujeitos a cotação
 * (feedback_claims_metricas — sem claim oficial).
 */

export interface PlanoInfo {
  slug: string;
  nome: string;
  linha: 'Selecionada' | 'Clássica' | 'One (Premium)' | 'Fácil (Regional)';
  abrangencia: string;
  acomodacao: string;
  desdeRef: string;
  status: 'ativo' | 'descontinuado';
  /** Termos antigos pelos quais o produto ainda é buscado (aproximado). */
  sinonimos: string[];
  publico: string;
  /** Parágrafos editoriais (texto único). */
  sobre: string[];
}

export const PLANOS_INFO: Record<string, PlanoInfo> = {
  'amil-facil-s60': {
    slug: 'amil-facil-s60',
    nome: 'Amil Fácil S60',
    linha: 'Fácil (Regional)',
    abrangencia: 'Regional (SP/RJ/PR)',
    acomodacao: 'Enfermaria',
    desdeRef: 'R$ 89,90',
    status: 'ativo',
    sinonimos: ['Amil Fácil 60', 'plano amil mais barato'],
    publico: 'Empresas que operam onde a Amil tem rede própria consolidada e buscam custo-benefício.',
    sobre: [
      'O Amil Fácil S60 é o produto de entrada da linha regional da Amil, desenhado para empresas em mercados onde a operadora tem rede própria (com destaque para São Paulo, Rio de Janeiro e Paraná). É a opção de menor mensalidade do portfólio.',
      'Por ser regional, a cobertura se concentra na rede da praça contratada. Empresas com colaboradores em múltiplos estados devem avaliar uma linha nacional (S380, S450) para garantir atendimento fora da região.',
    ],
  },
  'amil-facil-s80': {
    slug: 'amil-facil-s80',
    nome: 'Amil Fácil S80',
    linha: 'Fácil (Regional)',
    abrangencia: 'Regional (SP/RJ/PR)',
    acomodacao: 'Enfermaria/Apto',
    desdeRef: 'R$ 119,90',
    status: 'ativo',
    sinonimos: ['Amil Fácil 80'],
    publico: 'Empresas regionais que querem rede um pouco mais ampla que o S60.',
    sobre: [
      'O Amil Fácil S80 amplia a rede do S60 dentro da linha regional, mantendo o posicionamento de custo-benefício para SP, RJ e PR.',
      'Continua sendo um plano de abrangência regional — para cobertura nacional, avalie as linhas Selecionada (S380/S450/S750).',
    ],
  },
  'amil-s380': {
    slug: 'amil-s380',
    nome: 'Amil S380',
    linha: 'Selecionada',
    abrangencia: 'Nacional',
    acomodacao: 'Enfermaria/Apartamento',
    desdeRef: 'R$ 165,52',
    status: 'ativo',
    sinonimos: ['Amil 200', 'Amil 300'],
    publico: 'PMEs que precisam de cobertura nacional com o melhor custo de entrada.',
    sobre: [
      'O Amil S380 é o plano nacional de entrada da Linha Selecionada e o mais contratado por pequenas e médias empresas. Oferece cobertura em todo o Brasil com rede credenciada de hospitais, laboratórios e clínicas.',
      'É a porta de entrada para quem quer abrangência nacional sem o ticket das linhas superiores. Conforme a necessidade da equipe por hospitais de referência, vale comparar com o S450 e o S750.',
    ],
  },
  'amil-s450': {
    slug: 'amil-s450',
    nome: 'Amil S450',
    linha: 'Selecionada',
    abrangencia: 'Nacional',
    acomodacao: 'Apartamento',
    desdeRef: 'R$ 184,21',
    status: 'ativo',
    sinonimos: ['Amil 400'],
    publico: 'Empresas que querem rede ampliada e acomodação em apartamento.',
    sobre: [
      'O Amil S450 é o plano intermediário da Linha Selecionada, com cobertura nacional e rede ampliada em relação ao S380 — incluindo hospitais de médio e grande porte, maternidades reconhecidas e centros de diagnóstico de alta complexidade.',
      'Mantém todos os benefícios do S380 e adiciona acesso a uma rede mais robusta, sendo um dos pontos de equilíbrio mais procurados entre cobertura e preço no plano empresarial.',
    ],
  },
  'amil-s580': {
    slug: 'amil-s580',
    nome: 'Amil S580',
    linha: 'Selecionada',
    abrangencia: 'Nacional',
    acomodacao: 'Apartamento',
    desdeRef: '—',
    status: 'descontinuado',
    sinonimos: ['Amil 500'],
    publico: 'Beneficiários que já possuem o plano (linha em transição).',
    sobre: [
      'O Amil S580 era um plano intermediário-superior da Linha Selecionada. Atualmente está em transição e não é mais comercializado para novas contratações.',
      'Para necessidades equivalentes, as opções vigentes são o Amil S450 (logo abaixo) e o Amil S750 (acima), ambos com cobertura nacional.',
    ],
  },
  'amil-s750': {
    slug: 'amil-s750',
    nome: 'Amil S750',
    linha: 'Selecionada',
    abrangencia: 'Nacional',
    acomodacao: 'Apartamento',
    desdeRef: 'R$ 251,95',
    status: 'ativo',
    sinonimos: ['Amil 700'],
    publico: 'Empresas que querem a rede mais completa da Linha Selecionada.',
    sobre: [
      'O Amil S750 é o topo da Linha Selecionada, com a rede credenciada nacional mais ampla da linha — indicado para empresas que priorizam acesso a hospitais de referência para seus colaboradores.',
      'É a escolha de quem busca o melhor da Linha Selecionada antes de migrar para a linha One (premium). Compare a rede por cidade para confirmar a cobertura dos hospitais desejados.',
    ],
  },
  'amil-one-s2500': {
    slug: 'amil-one-s2500',
    nome: 'Amil One S2500',
    linha: 'One (Premium)',
    abrangencia: 'Nacional',
    acomodacao: 'Apartamento',
    desdeRef: 'R$ 420,00',
    status: 'ativo',
    sinonimos: ['Amil One 2500', 'Lincx LT3'],
    publico: 'Executivos e empresas que buscam rede premium nacional.',
    sobre: [
      'O Amil One S2500 abre a linha premium One (originada da antiga Lincx), com rede selecionada de alto padrão em âmbito nacional.',
      'Indicado para perfis executivos. Para cobertura internacional e o topo da rede premium, a opção é o One S6500 Black.',
    ],
  },
  'amil-one-s6500-black': {
    slug: 'amil-one-s6500-black',
    nome: 'Amil One S6500 Black',
    linha: 'One (Premium)',
    abrangencia: 'Nacional + Internacional',
    acomodacao: 'Apartamento',
    desdeRef: 'R$ 591,63',
    status: 'ativo',
    sinonimos: ['Amil One Black', 'Lincx LT4', 'Amil Black premium'],
    publico: 'Alta direção e empresas que exigem o topo da rede + cobertura internacional.',
    sobre: [
      'O Amil One S6500 Black é o plano premium do portfólio Amil, com a rede credenciada mais completa e cobertura de despesas médicas internacionais — voltado à alta direção.',
      'É o produto de topo da linha One (ex-Lincx LT4). Reúne rede de referência nacional e suporte internacional, com ticket compatível com o segmento premium.',
    ],
  },
};

export const PLANO_SLUGS = Object.keys(PLANOS_INFO);
