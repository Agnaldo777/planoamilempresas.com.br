/**
 * Conteúdo editorial dos segmentos empresariais (matriz por porte).
 *
 * Fonte única das páginas /empresarial/[segmento] — fecha os 404s da matriz
 * empresarial (Onda 1, plano Atlas 2026-06-14) e captura o cluster transacional
 * "plano amil mei", "amil empresarial 2 vidas", "PME 2-29 vidas", etc.
 *
 * Anti-thin: cada segmento tem texto único, regras factuais (ANS/RN) e planos
 * recomendados próprios. Valores são REFERÊNCIA ("a partir de"), sujeitos a
 * cotação (feedback_claims_metricas). Sem claim oficial Amil (ADR-006).
 */

export interface SegmentoInfo {
  slug: string;
  /** Nome curto exibido no breadcrumb/cards. */
  nome: string;
  /** H1 da página (keyword-rica). */
  titulo: string;
  metaTitle: string;
  metaDescription: string;
  /** Subtítulo do hero. */
  tagline: string;
  /** Resumo factual para tabela (mínimo de vidas, porte ANS, etc.). */
  ficha: { rotulo: string; valor: string }[];
  /** Parágrafos editoriais únicos. */
  intro: string[];
  /** Blocos "como funciona / por que". */
  blocos: { titulo: string; texto: string }[];
  /** Slugs de PLANOS_INFO recomendados para o segmento. */
  planosRecomendados: string[];
  faqs: { pergunta: string; resposta: string }[];
}

export const SEGMENTOS_INFO: Record<string, SegmentoInfo> = {
  mei: {
    slug: 'mei',
    nome: 'MEI',
    titulo: 'Plano de Saúde Amil para MEI: o mesmo Amil, com preço de empresa',
    metaTitle: 'Plano de Saúde Amil MEI 2026 | A partir de 2 vidas — Cotação',
    metaDescription:
      'Plano Amil empresarial para MEI a partir de 2 vidas: em média 30% a 40% mais barato que o individual, com a mesma rede Amil. CNPJ ativo há 6 meses. Cotação online.',
    tagline:
      'Tem MEI ativo há pelo menos 6 meses? Você já pode contratar o Amil na modalidade empresarial — em média 30% a 40% mais barato que um plano pessoa física com a mesma rede.',
    ficha: [
      { rotulo: 'Mínimo de vidas', valor: '2 vidas (titular + 1 dependente ou sócio)' },
      { rotulo: 'Requisito', valor: 'CNPJ MEI ativo há pelo menos 180 dias' },
      { rotulo: 'Economia vs individual', valor: 'em média 30% a 40% (cobertura equivalente)' },
      { rotulo: 'Modalidade', valor: 'Coletivo empresarial (PME Porte I)' },
    ],
    intro: [
      'O plano de saúde Amil para MEI usa a modalidade coletiva empresarial — a mesma de qualquer empresa — só que liberada para o microempreendedor individual a partir de 2 vidas. Na prática, você acessa a rede credenciada Amil pagando a tabela de empresa, que é estruturalmente mais barata que a tabela de pessoa física.',
      'Esse é o motivo de o Brasil ter mais de 13 milhões de MEIs ativos migrando para o CNPJ: enquanto o plano individual encarece e quase não é mais vendido, o plano empresarial PME segue acessível e protegido por regras coletivas. Para o MEI, é a porta de entrada mais vantajosa para um plano de saúde de qualidade.',
      'A contratação exige CNPJ ativo há pelo menos 180 dias e, em geral, duas vidas — que podem ser o titular mais um dependente (cônjuge, filho) ou um segundo sócio. A rede, a cobertura e o rol ANS são os mesmos dos planos empresariais maiores.',
    ],
    blocos: [
      {
        titulo: 'Por que o MEI paga menos que a pessoa física',
        texto:
          'O plano individual precifica o risco de uma única pessoa e tem reajuste anual com teto da ANS, mas valor de entrada alto. O plano empresarial dilui o risco no grupo e parte de tabelas coletivas — por isso, com a mesma rede Amil, o MEI costuma economizar de 30% a 40%. O argumento de conversão central do plano PJ é exatamente esse.',
      },
      {
        titulo: 'Quais planos o MEI pode contratar',
        texto:
          'O MEI acessa as mesmas linhas do empresarial: do Amil Fácil (regional, menor mensalidade em SP/RJ/PR) ao S380/S450 (nacional). A escolha depende dos hospitais que a equipe quer usar e da praça de atuação. Vale comparar a rede por cidade antes de fechar.',
      },
      {
        titulo: 'Carências e documentos',
        texto:
          'A carência segue a tabela ANS (urgência/emergência em 24h, consultas e exames simples em até 30 dias, partos em 300 dias). Para a contratação, o MEI apresenta o CCMEI (Certificado da Condição de MEI), documento dos beneficiários e comprovante de atividade. Quem vem de outro plano pode usar a portabilidade (RN 438) para não cumprir carência de novo.',
      },
    ],
    planosRecomendados: ['amil-facil-s60', 'amil-s380', 'amil-s450'],
    faqs: [
      {
        pergunta: 'MEI pode ter plano de saúde empresarial Amil?',
        resposta:
          'Sim. O MEI com CNPJ ativo há pelo menos 180 dias contrata o Amil na modalidade coletiva empresarial, geralmente a partir de 2 vidas. É mais vantajoso que o plano pessoa física: com a mesma rede credenciada, a economia média fica entre 30% e 40%.',
      },
      {
        pergunta: 'Quantas vidas o MEI precisa para contratar?',
        resposta:
          'Em regra, 2 vidas. Podem ser o titular (o próprio MEI) mais um dependente — cônjuge, filho ou outro familiar elegível — ou um segundo sócio. Algumas condições aceitam o MEI individual; confirme na cotação por CNPJ.',
      },
      {
        pergunta: 'Quanto custa o plano Amil para MEI em 2026?',
        resposta:
          'O valor depende da linha escolhida, das idades das vidas e da cidade. As linhas de entrada partem de valores de referência por volta de R$ 90 a R$ 165 por vida, e o preço final só é fechado na cotação por CNPJ. O ganho frente ao individual costuma passar de R$ 2.500 por ano.',
      },
      {
        pergunta: 'Preciso esperar o MEI completar 6 meses?',
        resposta:
          'Sim, a operadora exige CNPJ ativo há pelo menos 180 dias para a contratação empresarial. Se o seu MEI ainda não completou esse prazo, vale já simular para contratar assim que liberar.',
      },
    ],
  },
  'pme-2-a-29-vidas': {
    slug: 'pme-2-a-29-vidas',
    nome: 'PME 2 a 29 vidas',
    titulo: 'Plano de Saúde Amil PME (2 a 29 vidas): Porte I com proteção de pool',
    metaTitle: 'Plano Amil PME 2 a 29 vidas 2026 | Porte I — Cotação por CNPJ',
    metaDescription:
      'Plano Amil empresarial para PME de 2 a 29 vidas (Porte I): cobertura nacional, pool de risco RN 309 que protege do reajuste por sinistro isolado e cotação por CNPJ.',
    tagline:
      'A pequena empresa de 2 a 29 vidas é o segmento que mais cresce — e tem uma proteção que pouca gente conhece: o pool de risco da ANS (RN 309) impede que um único sinistro exploda o seu reajuste.',
    ficha: [
      { rotulo: 'Faixa de vidas', valor: '2 a 29 vidas (Porte I)' },
      { rotulo: 'Requisito', valor: 'CNPJ ativo (ME, EPP, LTDA ou MEI), 6+ meses' },
      { rotulo: 'Proteção de reajuste', valor: 'Pool de risco único — RN 309/2012' },
      { rotulo: 'Abrangência', valor: 'Nacional (Linha Selecionada)' },
    ],
    intro: [
      'O plano de saúde Amil PME para empresas de 2 a 29 vidas se enquadra no Porte I da regulação. É o segmento de micro e pequena empresa que mais cresce no Brasil — contratos coletivos de até 5 vidas já representam mais de 15% do mercado — porque oferece cobertura de empresa com custo bem menor que o plano individual.',
      'O ponto mais subestimado desse porte é a proteção contra reajuste. Pela RN 309/2012 da ANS, todos os contratos com menos de 30 vidas de uma operadora são reajustados em conjunto, num "pool de risco" único. Isso significa que um único colaborador com sinistro alto não dispara o reajuste só da sua empresa — o risco é diluído entre milhares de contratos.',
      'A contratação parte de 2 vidas, aceita qualquer CNPJ ativo (ME, EPP, LTDA e até MEI) e dá acesso às linhas nacionais da Amil. É o ponto de equilíbrio entre preço e cobertura mais procurado por empresas em crescimento.',
    ],
    blocos: [
      {
        titulo: 'Pool de risco: a proteção do Porte I',
        texto:
          'Empresas com menos de 30 vidas não negociam reajuste individualmente — elas entram no pool coletivo da operadora (RN 309/2012). Na prática, isso protege a pequena empresa de um reajuste explosivo por causa de um único caso grave. É um argumento de segurança quase nunca explorado, mas decisivo para quem teme a imprevisibilidade do plano coletivo.',
      },
      {
        titulo: 'Reajuste: 2-29 vidas vs 30+ vidas',
        texto:
          'Há um trade-off honesto: porque o Porte I entra no pool, a média de reajuste das pequenas (cerca de 13,5% em 2026) tende a ficar alguns pontos acima da média das empresas com 30+ vidas (cerca de 8,7%). A contrapartida é a previsibilidade e a proteção contra o caso isolado. Quem cresce e passa de 30 vidas ganha poder de negociação — vale reavaliar nessa virada.',
      },
      {
        titulo: 'Quais planos cabem na PME 2-29',
        texto:
          'As linhas nacionais (S380, S450, S750) cobrem a maior parte das necessidades da pequena empresa, do custo de entrada à rede mais completa. A escolha depende dos hospitais de referência que a equipe quer acessar e da cidade — compare a rede credenciada antes de decidir.',
      },
    ],
    planosRecomendados: ['amil-s380', 'amil-s450', 'amil-s750'],
    faqs: [
      {
        pergunta: 'Qual o mínimo de vidas para o plano PME Amil?',
        resposta:
          'A partir de 2 vidas. Empresas de 2 a 29 vidas se enquadram no Porte I, com qualquer CNPJ ativo (ME, EPP, LTDA ou MEI). A partir de 30 vidas, o contrato passa para o Porte II, com regras de reajuste diferentes.',
      },
      {
        pergunta: 'A pequena empresa fica desprotegida no reajuste?',
        resposta:
          'Não. Pela RN 309/2012 da ANS, contratos com menos de 30 vidas são reajustados em conjunto, num pool de risco único. Isso impede que um sinistro isolado dispare o reajuste só da sua empresa — o risco é diluído entre todos os contratos pequenos da operadora.',
      },
      {
        pergunta: 'Quanto custa o plano Amil PME por vida?',
        resposta:
          'Os valores de referência por vida variam conforme a linha e as faixas etárias do grupo — as linhas nacionais partem de cerca de R$ 165 por vida. O preço exato depende do CNPJ, do número de vidas e da composição de idades; solicite a cotação para o número fechado.',
      },
      {
        pergunta: 'Vale a pena migrar de operadora quando a PME cresce?',
        resposta:
          'Pode valer. Ao ultrapassar 30 vidas, a empresa ganha poder de negociação e sai do pool obrigatório. Se o reajuste veio alto, a portabilidade (RN 438) permite trocar de plano sem cumprir carência de novo. Avalie a cada renovação anual.',
      },
    ],
  },
  'pme-30-a-99-vidas': {
    slug: 'pme-30-a-99-vidas',
    nome: 'PME 30 a 99 vidas',
    titulo: 'Plano de Saúde Amil PME (30 a 99 vidas): Porte II com poder de negociação',
    metaTitle: 'Plano Amil PME 30 a 99 vidas 2026 | Porte II — Cotação',
    metaDescription:
      'Plano Amil empresarial para empresas de 30 a 99 vidas (Porte II): reajuste por sinistralidade própria, carência reduzida vindo de congênere e rede nacional. Cotação por CNPJ.',
    tagline:
      'A partir de 30 vidas, sua empresa sai do pool obrigatório e passa a negociar o reajuste pela própria sinistralidade — com mais poder de barganha e condições de carência reduzida.',
    ficha: [
      { rotulo: 'Faixa de vidas', valor: '30 a 99 vidas (Porte II)' },
      { rotulo: 'Reajuste', valor: 'Por sinistralidade do próprio contrato' },
      { rotulo: 'Carência', valor: 'Reduzida/isenta vinda de congênere (a partir de 10 vidas)' },
      { rotulo: 'Abrangência', valor: 'Nacional (Selecionada e One)' },
    ],
    intro: [
      'O plano de saúde Amil para empresas de 30 a 99 vidas se enquadra no Porte II. É a faixa em que a empresa deixa de ser tratada apenas como parte do pool coletivo e passa a ter o reajuste calculado pela sinistralidade do próprio contrato — o que dá previsibilidade e poder de negociação a quem mantém o grupo saudável.',
      'Esse porte costuma destravar condições melhores: carência reduzida (ou isenta) para quem vem de um plano congênere, normalmente a partir de 10 vidas migradas, e acesso facilitado às linhas superiores (S750 e One). É o momento em que a gestão de benefícios começa a fazer diferença real no custo.',
      'Para o RH, o Porte II também significa relatórios de uso, possibilidade de coparticipação desenhada e negociação anual com base em dados. A escolha da linha deve equilibrar a rede desejada pelos colaboradores e a meta de sinistralidade da empresa.',
    ],
    blocos: [
      {
        titulo: 'Reajuste por sinistralidade própria',
        texto:
          'No Porte II, o reajuste deixa de seguir só o pool e passa a refletir a sinistralidade do seu contrato. Empresas que cuidam da saúde da equipe (prevenção, uso consciente) podem segurar reajustes mais baixos que a média do mercado. É o início da gestão ativa de benefícios.',
      },
      {
        titulo: 'Carência reduzida vinda de congênere',
        texto:
          'Empresas que migram de outra operadora costumam negociar redução ou isenção de carência a partir de 10 vidas vindas de um plano congênere. Isso facilita a troca por melhor rede ou preço sem expor a equipe a novos prazos — um diferencial forte na renovação.',
      },
      {
        titulo: 'Linhas indicadas para 30-99 vidas',
        texto:
          'Além das linhas nacionais Selecionadas (S450, S750), o Porte II viabiliza o acesso à linha One (premium) para parte do quadro — útil quando há cargos executivos. A combinação de linhas por nível (operacional × liderança) é uma estratégia comum nesse porte.',
      },
    ],
    planosRecomendados: ['amil-s450', 'amil-s750', 'amil-one-s2500'],
    faqs: [
      {
        pergunta: 'O que muda no plano Amil a partir de 30 vidas?',
        resposta:
          'A empresa passa para o Porte II: o reajuste deixa de seguir o pool de risco obrigatório e passa a ser calculado pela sinistralidade do próprio contrato. Isso dá mais poder de negociação e previsibilidade para quem mantém o grupo saudável.',
      },
      {
        pergunta: 'Tem isenção de carência para 30 a 99 vidas?',
        resposta:
          'Em geral, sim, quando a empresa migra de um plano congênere — a redução ou isenção de carência costuma valer a partir de 10 vidas migradas. As regras exatas dependem da análise do contrato de origem; confirme na cotação.',
      },
      {
        pergunta: 'Posso ter linhas diferentes para níveis diferentes?',
        resposta:
          'Sim. No Porte II é comum combinar linhas por nível: uma linha nacional (S450/S750) para o quadro geral e a linha One (premium) para cargos executivos. A estrutura é desenhada na cotação conforme a política de benefícios da empresa.',
      },
      {
        pergunta: 'Como reduzir o reajuste no Porte II?',
        resposta:
          'Mantendo a sinistralidade sob controle (prevenção, uso consciente, coparticipação bem desenhada) e renegociando a cada renovação com base nos dados de uso. Se ainda assim o reajuste vier alto, a portabilidade (RN 438) é uma alavanca de negociação real.',
      },
    ],
  },
  'grandes-empresas': {
    slug: 'grandes-empresas',
    nome: 'Grandes Empresas (100+)',
    titulo: 'Plano de Saúde Amil para Grandes Empresas (100+ vidas): condições personalizadas',
    metaTitle: 'Plano Amil Grandes Empresas 2026 | 100+ vidas — Cotação',
    metaDescription:
      'Plano Amil empresarial para grandes empresas (100+ vidas): contrato personalizado, reajuste por sinistralidade negociada, rede premium One e gestão de benefícios. Fale com um corretor.',
    tagline:
      'A partir de 100 vidas, o plano deixa de ser tabela e vira contrato desenhado: condições, rede por nível de cargo e reajuste negociado pela sinistralidade do grupo.',
    ficha: [
      { rotulo: 'Faixa de vidas', valor: '100+ vidas (grande grupo)' },
      { rotulo: 'Contratação', valor: 'Personalizada, condições negociadas' },
      { rotulo: 'Reajuste', valor: 'Por sinistralidade negociada do grupo' },
      { rotulo: 'Rede', valor: 'Do nacional (Selecionada) ao premium internacional (One Black)' },
    ],
    intro: [
      'Para grandes empresas (100 vidas ou mais), o plano de saúde Amil deixa de ser uma tabela pronta e passa a ser um contrato desenhado. O reajuste é negociado pela sinistralidade do próprio grupo, a rede pode ser combinada por nível de cargo e a gestão de benefícios entra como peça central da política de RH.',
      'É o porte em que a hierarquia de planos faz sentido: linha premium One (até a cobertura internacional do One Black) para a alta direção, linhas nacionais Selecionadas (S450/S750) para a maioria do quadro e, quando faz sentido, regionais para praças específicas. A Amil tem foco declarado em coletivo empresarial nas praças onde sua rede própria e seu crescimento se concentram (SP, RJ e DF).',
      'A condução desse tipo de contrato pede um corretor que monte a estrutura, acompanhe a sinistralidade e negocie a renovação com dados — não uma cotação automática. É aqui que o atendimento por corretora autorizada faz a maior diferença em custo ao longo do tempo.',
    ],
    blocos: [
      {
        titulo: 'Contrato personalizado, não tabela',
        texto:
          'Acima de 100 vidas, condições, coparticipação, rede e até regras de elegibilidade são desenhadas para a empresa. O preço por vida e o reajuste passam a depender da negociação e da sinistralidade do grupo, não de uma tabela fixa — o que abre espaço real para otimização de custo com boa gestão.',
      },
      {
        titulo: 'Hierarquia de planos por cargo',
        texto:
          'O grande grupo costuma combinar linhas: One/One Black para a diretoria (rede premium e cobertura internacional), Selecionada nacional para a maioria e regional onde a rede própria Amil é forte. Essa estrutura por nível equilibra atratividade do benefício e custo total.',
      },
      {
        titulo: 'Gestão de benefícios e renovação',
        texto:
          'Relatórios de sinistralidade, programas de prevenção e desenho de coparticipação tornam-se ferramentas de controle de custo. A renovação anual deixa de ser passiva: com dados, a empresa (e seu corretor) negocia reajustes mais baixos ou avalia portabilidade quando a proposta não fecha.',
      },
    ],
    planosRecomendados: ['amil-s750', 'amil-one-s2500', 'amil-one-s6500-black'],
    faqs: [
      {
        pergunta: 'Como funciona o plano Amil para empresas com 100+ vidas?',
        resposta:
          'Acima de 100 vidas o contrato é personalizado: condições, rede por nível de cargo, coparticipação e reajuste são negociados conforme a sinistralidade do grupo. Não é tabela pronta — é um desenho de benefícios feito sob medida, normalmente conduzido por um corretor.',
      },
      {
        pergunta: 'Dá para ter planos diferentes para diretoria e operação?',
        resposta:
          'Sim, e é o mais comum. Grandes grupos combinam a linha premium One (inclusive a One Black, com cobertura internacional) para a alta direção e linhas nacionais Selecionadas para a maioria do quadro, otimizando atratividade e custo.',
      },
      {
        pergunta: 'Como reduzir o custo do plano numa grande empresa?',
        resposta:
          'Com gestão ativa: acompanhamento de sinistralidade, programas de prevenção, coparticipação bem desenhada e negociação anual com base em dados. Quando a renovação não fecha, a portabilidade e a concorrência entre operadoras são alavancas reais de custo.',
      },
      {
        pergunta: 'Vale a pena ter um corretor para um contrato grande?',
        resposta:
          'Para 100+ vidas, faz muita diferença. O corretor monta a estrutura por cargo, acompanha a sinistralidade, compara operadoras e negocia a renovação — sem custo adicional para a empresa, já que a remuneração vem da operadora.',
      },
    ],
  },
};

export const SEGMENTO_SLUGS = Object.keys(SEGMENTOS_INFO);
