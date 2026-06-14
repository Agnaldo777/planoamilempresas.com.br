/**
 * Comparativos Amil vs concorrentes — rotas estáticas (plano Atlas, Onda 1 P1).
 *
 * Captura o intent comparativo ("amil vs bradesco", "amil ou sulamérica") que
 * o site oficial ignora. Conteúdo FACTUAL e HONESTO (E-E-A-T em YMYL): dados de
 * referência verificáveis (vidas ~ANS, Reclame Aqui público, reajuste coletivo
 * divulgado), posicionamento equilibrado ("Amil quando X, concorrente quando Y")
 * — nunca denegrir. Números são REFERÊNCIA, sujeitos a variação por ano/contrato.
 *
 * ADR-006: somos corretor independente; comparamos operadoras de forma neutra.
 */

export interface LinhaComparativo {
  criterio: string;
  amil: string;
  concorrente: string;
}

export interface ComparativoInfo {
  slug: string;
  concorrente: string;
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  /** Parágrafos editoriais únicos. */
  intro: string[];
  linhas: LinhaComparativo[];
  /** Quando faz mais sentido cada um (honestidade). */
  escolhaAmil: string[];
  escolhaConcorrente: string[];
  veredicto: string;
  faqs: { pergunta: string; resposta: string }[];
}

// Perfil-base da Amil (constante entre comparativos).
const AMIL = {
  vidas: '~6,1 milhões',
  fundacao: '1978',
  modelo: 'Verticalizada (rede própria + credenciada)',
  ra: '7,7 (BOA)',
  reajuste2025: '~15,75%',
} as const;

export const COMPARATIVOS_INFO: Record<string, ComparativoInfo> = {
  'amil-vs-bradesco': {
    slug: 'amil-vs-bradesco',
    concorrente: 'Bradesco Saúde',
    metaTitle: 'Amil ou Bradesco Saúde? Comparativo Empresarial 2026',
    metaDescription:
      'Amil vs Bradesco Saúde no plano empresarial: rede, modelo, reputação, reajuste e para que perfil cada um é melhor. Comparativo honesto de corretor autorizado.',
    tagline:
      'Duas das maiores no B2B, com filosofias opostas: a Amil é verticalizada (rede própria) e a Bradesco é seguradora (rede 100% credenciada e reembolso forte).',
    intro: [
      'Amil e Bradesco Saúde disputam o topo do plano de saúde empresarial, mas resolvem o problema de formas diferentes. A Amil é verticalizada — tem hospitais próprios além da rede credenciada — e cresceu forte em 2025, com presença concentrada em SP, RJ e DF. A Bradesco Saúde é uma seguradora: não tem hospital próprio, trabalha com rede 100% credenciada e tradição em reembolso, sendo referência para quem valoriza livre escolha de médico.',
      'Na prática, a escolha gira em torno de dois eixos: custo-rede (a Amil costuma ser mais competitiva na entrada e em SP/RJ) versus livre escolha e reembolso (terreno histórico da Bradesco, mais premium). Ambas são sólidas; o que muda é o encaixe com o perfil da empresa.',
    ],
    linhas: [
      { criterio: 'Beneficiários', amil: AMIL.vidas, concorrente: '~3,5-4 milhões' },
      { criterio: 'Fundação', amil: AMIL.fundacao, concorrente: '1984' },
      { criterio: 'Modelo', amil: AMIL.modelo, concorrente: 'Seguradora (rede credenciada + reembolso)' },
      { criterio: 'Foco', amil: 'Coletivo empresarial, forte em SP/RJ/DF', concorrente: 'Coletivo premium, livre escolha' },
      { criterio: 'Reembolso', amil: 'Nas linhas premium (One)', concorrente: 'Tradição forte em reembolso' },
      { criterio: 'Reclame Aqui (ref.)', amil: AMIL.ra, concorrente: '~8,1' },
      { criterio: 'Reajuste coletivo 2025 (ref.)', amil: AMIL.reajuste2025, concorrente: '~12,62%' },
    ],
    escolhaAmil: [
      'Quer melhor custo-rede na entrada e na operação em SP, RJ e DF.',
      'Valoriza rede própria verticalizada e linhas com bom custo-benefício (S380/S450).',
      'PME/MEI buscando preço competitivo com cobertura nacional.',
    ],
    escolhaConcorrente: [
      'Prioriza livre escolha de médico e reembolso amplo.',
      'Perfil mais premium, com orçamento para ticket maior.',
      'Quer a tradição de uma seguradora pura, sem rede própria.',
    ],
    veredicto:
      'Para a maioria das PMEs sensíveis a custo-rede (especialmente em SP/RJ/DF), a Amil tende a ser mais competitiva. Para empresas que fazem do reembolso e da livre escolha o centro do benefício, a Bradesco é forte. A decisão correta sai da cotação por CNPJ comparando rede e valor para o seu perfil.',
    faqs: [
      {
        pergunta: 'Amil ou Bradesco é melhor para empresa?',
        resposta:
          'Depende do perfil. A Amil costuma ganhar em custo-rede e em SP/RJ/DF; a Bradesco em livre escolha e reembolso premium. Ambas são sólidas — compare a rede dos hospitais que sua equipe usa e o valor por CNPJ antes de decidir.',
      },
      {
        pergunta: 'Qual tem a melhor rede credenciada?',
        resposta:
          'São diferentes: a Amil é verticalizada (rede própria + credenciada, forte no Sudeste) e a Bradesco é 100% credenciada com livre escolha e reembolso. O "melhor" depende dos hospitais específicos que você precisa — verifique a rede por cidade.',
      },
    ],
  },
  'amil-vs-sulamerica': {
    slug: 'amil-vs-sulamerica',
    concorrente: 'SulAmérica',
    metaTitle: 'Amil ou SulAmérica? Comparativo Empresarial 2026',
    metaDescription:
      'Amil vs SulAmérica no plano empresarial: modelo, rede, reembolso, reputação e perfil ideal de cada um. Comparativo honesto de corretor autorizado.',
    tagline:
      'A Amil é verticalizada e competitiva em custo; a SulAmérica é premium tradicional, com sinergia da Rede D\'Or e reembolso reconhecido.',
    intro: [
      'Amil e SulAmérica miram o coletivo empresarial, mas em faixas diferentes. A Amil tem rede própria e disputa preço com cobertura nacional. A SulAmérica é uma das marcas premium mais tradicionais do país, com forte reembolso e sinergia com a Rede D\'Or desde 2022 — o que reforça o acesso a hospitais de alto padrão.',
      'O ponto de decisão é o posicionamento: a Amil tende a entregar melhor custo-rede no dia a dia, enquanto a SulAmérica brilha em perfis que priorizam reembolso e rede premium. Para quadros executivos, a comparação costuma ser SulAmérica vs linha Amil One.',
    ],
    linhas: [
      { criterio: 'Beneficiários', amil: AMIL.vidas, concorrente: '~2,5-3 milhões' },
      { criterio: 'Fundação', amil: AMIL.fundacao, concorrente: '1895' },
      { criterio: 'Modelo', amil: AMIL.modelo, concorrente: 'Seguradora premium (sinergia Rede D\'Or)' },
      { criterio: 'Foco', amil: 'Custo-rede, forte em SP/RJ/DF', concorrente: 'Premium, reembolso e livre escolha' },
      { criterio: 'Reclame Aqui (ref.)', amil: AMIL.ra, concorrente: '~8,0' },
      { criterio: 'Reajuste coletivo 2025 (ref.)', amil: AMIL.reajuste2025, concorrente: '~12,45%' },
    ],
    escolhaAmil: [
      'Quer melhor custo-rede e preço competitivo na entrada.',
      'Opera principalmente em SP, RJ e DF.',
      'PME que prioriza cobertura nacional sem ticket premium.',
    ],
    escolhaConcorrente: [
      'Prioriza reembolso e livre escolha de médico.',
      'Perfil premium com acesso à Rede D\'Or como prioridade.',
      'Quadro executivo que valoriza marca premium tradicional.',
    ],
    veredicto:
      'A Amil costuma vencer em custo-rede para a operação geral; a SulAmérica é forte em perfis premium e reembolso. Para diretoria, compare a SulAmérica com a linha Amil One. A cotação por CNPJ, olhando a rede dos hospitais desejados, define o melhor encaixe.',
    faqs: [
      {
        pergunta: 'Amil ou SulAmérica para empresa?',
        resposta:
          'A Amil tende a ser mais competitiva em custo-rede (sobretudo SP/RJ/DF); a SulAmérica é premium, forte em reembolso e na Rede D\'Or. Para cargos executivos, compare SulAmérica com a linha Amil One. Decida pela rede e valor do seu perfil.',
      },
    ],
  },
  'amil-vs-hapvida': {
    slug: 'amil-vs-hapvida',
    concorrente: 'Hapvida / NotreDame',
    metaTitle: 'Amil ou Hapvida? Comparativo Empresarial 2026',
    metaDescription:
      'Amil vs Hapvida/NotreDame no plano empresarial: modelo verticalizado, preço, cobertura e reputação. Comparativo honesto de corretor autorizado.',
    tagline:
      'As duas são verticalizadas, mas a Hapvida lidera em volume e preço PME (forte no Norte/Nordeste), enquanto a Amil é mais forte no Sudeste premium.',
    intro: [
      'Amil e Hapvida/NotreDame (GNDI) são ambas verticalizadas — têm hospitais próprios. A Hapvida é a maior por número de vidas e tem preço PME muito agressivo, com presença histórica forte no Norte e Nordeste. A Amil tem rede própria mais concentrada no Sudeste (SP/RJ) e posicionamento um pouco acima em percepção de rede.',
      'A decisão tende a ser preço × percepção de rede/qualidade e geografia. Onde a Hapvida tem rede própria densa, o preço é difícil de bater; onde a empresa precisa de rede no Sudeste premium, a Amil costuma encaixar melhor.',
    ],
    linhas: [
      { criterio: 'Beneficiários', amil: AMIL.vidas, concorrente: '~9-16 milhões (grupo)' },
      { criterio: 'Fundação', amil: AMIL.fundacao, concorrente: '1979 / 1968 (GNDI)' },
      { criterio: 'Modelo', amil: AMIL.modelo, concorrente: 'Verticalizada (rede própria densa)' },
      { criterio: 'Foco', amil: 'Sudeste, custo-rede e premium (One)', concorrente: 'Volume e preço PME; forte Norte/Nordeste' },
      { criterio: 'Reclame Aqui (ref.)', amil: AMIL.ra, concorrente: '~7,0-7,5' },
      { criterio: 'Diferencial', amil: 'Rede premium no Sudeste (linha One/D\'Or)', concorrente: 'Preço PME imbatível onde tem rede própria' },
    ],
    escolhaAmil: [
      'Opera no Sudeste e quer rede premium (linha One, hospitais de referência).',
      'Valoriza percepção de rede/qualidade acima do menor preço.',
      'Precisa de cobertura nacional consistente em SP/RJ/DF.',
    ],
    escolhaConcorrente: [
      'Busca o menor preço PME possível e tem operação onde a Hapvida tem rede própria.',
      'Forte presença no Norte/Nordeste.',
      'Prioriza custo sobre rede premium.',
    ],
    veredicto:
      'Se preço é o fator nº1 e sua operação está onde a Hapvida tem rede própria densa, ela é difícil de bater. Se você precisa de rede premium no Sudeste, a Amil encaixa melhor. Compare a rede real na sua cidade — é o que separa as duas.',
    faqs: [
      {
        pergunta: 'Amil ou Hapvida é melhor?',
        resposta:
          'A Hapvida lidera em preço PME e volume, forte no Norte/Nordeste; a Amil é mais forte em rede premium no Sudeste. As duas são verticalizadas — o "melhor" depende da sua cidade e de quanto você prioriza preço vs percepção de rede.',
      },
    ],
  },
  'amil-vs-unimed': {
    slug: 'amil-vs-unimed',
    concorrente: 'Unimed',
    metaTitle: 'Amil ou Unimed? Comparativo Empresarial 2026',
    metaDescription:
      'Amil vs Unimed no plano empresarial: cobertura nacional, modelo cooperativo, rede e perfil ideal. Comparativo honesto de corretor autorizado.',
    tagline:
      'A Unimed tem a maior capilaridade do país (sistema de cooperativas), mas é fragmentada por região; a Amil é uma operadora única, verticalizada e forte no Sudeste.',
    intro: [
      'A comparação Amil vs Unimed é, na verdade, "operadora única vs sistema de cooperativas". A Unimed cobre a maior parte do território brasileiro, mas cada cooperativa (Unimed BH, Unimed Rio, etc.) é uma empresa independente, com rede, preço e qualidade próprios. A Amil é uma operadora nacional única e verticalizada, com padrão mais homogêneo e concentração no Sudeste.',
      'Para empresas com filiais espalhadas em cidades menores, a capilaridade da Unimed é difícil de igualar. Para quem opera em grandes centros do Sudeste e quer padrão único de atendimento e rede própria, a Amil tende a ser mais previsível.',
    ],
    linhas: [
      { criterio: 'Beneficiários', amil: AMIL.vidas, concorrente: '~18 milhões (sistema)' },
      { criterio: 'Fundação', amil: AMIL.fundacao, concorrente: '1967 (sistema)' },
      { criterio: 'Modelo', amil: AMIL.modelo, concorrente: 'Sistema de cooperativas (regional)' },
      { criterio: 'Cobertura', amil: 'Nacional, concentrada no Sudeste', concorrente: 'A maior capilaridade do país' },
      { criterio: 'Padrão', amil: 'Único (operadora nacional)', concorrente: 'Varia por cooperativa regional' },
      { criterio: 'Reclame Aqui (ref.)', amil: AMIL.ra, concorrente: 'Varia por cooperativa' },
    ],
    escolhaAmil: [
      'Opera em grandes centros do Sudeste e quer padrão único de rede.',
      'Valoriza rede própria verticalizada e previsibilidade.',
      'Quer negociar com uma operadora nacional única.',
    ],
    escolhaConcorrente: [
      'Tem filiais em cidades menores onde a Unimed local é forte.',
      'Precisa da maior capilaridade geográfica possível.',
      'A cooperativa regional da sua cidade tem boa reputação.',
    ],
    veredicto:
      'Em cidades menores, a capilaridade da Unimed é um trunfo difícil de bater — mas a qualidade varia por cooperativa. Em grandes centros do Sudeste, a Amil entrega padrão único e rede própria. Verifique a reputação da Unimed local e compare com a rede Amil na sua cidade.',
    faqs: [
      {
        pergunta: 'Amil ou Unimed para empresa?',
        resposta:
          'A Unimed tem a maior cobertura do país, mas é um sistema de cooperativas independentes (a qualidade varia por região). A Amil é uma operadora única e verticalizada, forte no Sudeste. Em cidades menores avalie a Unimed local; em grandes centros, a Amil tende a ser mais previsível.',
      },
    ],
  },
  'amil-vs-porto-seguro': {
    slug: 'amil-vs-porto-seguro',
    concorrente: 'Porto Seguro Saúde',
    metaTitle: 'Amil ou Porto Seguro Saúde? Comparativo Empresarial 2026',
    metaDescription:
      'Amil vs Porto Seguro Saúde no plano empresarial: rede, reputação, cross-sell e perfil ideal. Comparativo honesto de corretor autorizado.',
    tagline:
      'A Amil é maior e verticalizada, com cobertura nacional; a Porto Seguro é forte em PME na Grande SP, com ótima reputação de atendimento e ecossistema de cross-sell.',
    intro: [
      'A Porto Seguro Saúde cresceu rápido no PME, especialmente na Grande São Paulo, e é reconhecida pela qualidade de atendimento e pela sinergia com o ecossistema Porto (auto, residência, etc.). A Amil é bem maior, verticalizada e com cobertura nacional mais ampla, sobretudo fora do eixo SP.',
      'Para empresas na Grande SP que valorizam atendimento e já usam outros produtos Porto, a Porto Saúde é muito competitiva. Para quem precisa de cobertura nacional mais ampla ou opera fora de SP, a Amil tende a cobrir melhor.',
    ],
    linhas: [
      { criterio: 'Beneficiários', amil: AMIL.vidas, concorrente: '~500-600 mil' },
      { criterio: 'Fundação', amil: AMIL.fundacao, concorrente: '1945 (grupo Porto)' },
      { criterio: 'Modelo', amil: AMIL.modelo, concorrente: 'Seguradora, forte PME na Grande SP' },
      { criterio: 'Cobertura', amil: 'Nacional', concorrente: 'Mais concentrada (SP e região)' },
      { criterio: 'Reclame Aqui (ref.)', amil: AMIL.ra, concorrente: '~8,0' },
      { criterio: 'Diferencial', amil: 'Escala nacional + rede própria', concorrente: 'Atendimento + cross-sell ecossistema Porto' },
    ],
    escolhaAmil: [
      'Precisa de cobertura nacional ampla ou opera fora de SP.',
      'Quer escala e rede própria verticalizada.',
      'Tem colaboradores distribuídos em vários estados.',
    ],
    escolhaConcorrente: [
      'Opera na Grande SP e valoriza reputação de atendimento.',
      'Já usa o ecossistema Porto (auto, frota) e quer sinergia.',
      'PME paulista priorizando experiência do cliente.',
    ],
    veredicto:
      'Na Grande SP, a Porto Seguro é uma escolha forte por atendimento e cross-sell. Para cobertura nacional ou operação fora de SP, a Amil cobre melhor. Compare a rede na sua cidade e o valor por CNPJ.',
    faqs: [
      {
        pergunta: 'Amil ou Porto Seguro Saúde?',
        resposta:
          'A Porto Seguro é muito forte em PME na Grande SP, com ótima reputação de atendimento e sinergia com o ecossistema Porto. A Amil é maior e nacional. Se você opera fora de SP ou precisa de cobertura ampla, a Amil tende a cobrir melhor.',
      },
    ],
  },
};

export const COMPARATIVO_SLUGS = Object.keys(COMPARATIVOS_INFO);
