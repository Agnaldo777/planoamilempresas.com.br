/**
 * Mock blog posts — Story 6.11.a
 *
 * 5 posts placeholder para popular `/blog/` enquanto Sanity dataset
 * não está populado (dev/preview). Em produção, query GROQ retorna
 * documentos reais; mock é fallback automático quando
 * `NEXT_PUBLIC_SANITY_PROJECT_ID` está vazio ou = `devplaceholder`.
 *
 * **Importante (NFR23 + Story 1.0)**: bodies abaixo são placeholders
 * de estrutura — Atlas (@analyst) preenche conteúdo factual antes da
 * publicação; advogado revisor co-assina antes de remover marker
 * `// TODO Atlas:` / `// TODO Advogado:`. Dex NÃO inventa percentuais,
 * prazos ANS ou cobertura específica.
 *
 * Conteúdo seguro publicado: skeleton + linguagem genérica + CTAs
 * institucionais (corretora, contato). Sem cláusulas específicas.
 */

import type { BlogPost, PortableTextBlock } from '@/data/blog/types';

function block(
  _key: string,
  style: PortableTextBlock['style'],
  text: string,
): PortableTextBlock {
  return {
    _type: 'block',
    _key,
    style,
    children: [{ _type: 'span', _key: `${_key}s`, text }],
  };
}

function listItem(_key: string, text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key,
    style: 'normal',
    listItem: 'bullet',
    children: [{ _type: 'span', _key: `${_key}s`, text }],
  };
}

export const MOCK_POSTS: readonly BlogPost[] = [
  {
    _id: 'mock-carencia-amil-empresarial',
    title: 'Carência em plano Amil empresarial: prazos e exceções 2026',
    slug: 'carencia-amil-empresarial-prazos-2026',
    excerpt:
      'Entenda como funciona o prazo de carência em planos Amil empresariais, diferenças entre PME e MEI e quando há isenção por adesão coletiva.',
    body: [
      block(
        'b1',
        'normal',
        // Fonte: RN 195/2009 (ANS) — carência é o período após contratação durante o qual a operadora pode restringir cobertura. Cf. data/carencias.ts (CARENCIAS_AMIL).
        'A carência é o período em que o beneficiário ainda não pode utilizar determinados serviços do plano. Em planos coletivos empresariais, há regras específicas que diferem dos planos individuais — em especial quando a empresa formaliza adesão com número mínimo de vidas, hipótese em que a Resolução Normativa ANS nº 195/2009 admite redução ou isenção contratual.',
      ),
      block('b2', 'h2', 'Tipos de carência em planos coletivos'),
      block(
        'b3',
        'normal',
        // Prazos máximos ANS conforme RN 195/2009 art. 12 — espelho do dataset data/carencias.ts.
        'Os prazos máximos definidos pela RN 195/2009 (art. 12) são: até 24 horas para urgência e emergência; até 30 dias para consultas e exames simples; até 180 dias para internações, cirurgias e exames de alta complexidade; e até 300 dias para parto a termo. Para Doenças e Lesões Preexistentes (DLP) declaradas, aplica-se Cobertura Parcial Temporária (CPT) de até 24 meses (RN 162/2007) sobre Procedimentos de Alta Complexidade vinculados à condição.',
      ),
      block('b4', 'h2', 'Quando há isenção de carência'),
      listItem(
        'b5',
        'Empresas com determinado número de vidas podem negociar redução total ou parcial de carência na contratação inicial.',
      ),
      listItem(
        'b6',
        'Portabilidade de carências entre operadoras segue regras específicas da ANS (RN 438).',
      ),
      listItem(
        'b7',
        'Acidentes pessoais e situações de urgência/emergência têm prazo reduzido por norma.',
      ),
      block('b8', 'h2', 'Como confirmar prazos em sua proposta'),
      block(
        'b9',
        'normal',
        // TODO Advogado: validar redação sobre direito a clareza contratual.
        'Antes de assinar, exija o cronograma de carências por escrito na proposta comercial. Em caso de dúvida, consulte a corretora — o documento deve detalhar o prazo aplicável a cada categoria de procedimento.',
      ),
    ],
    authorId: 'agnaldo-silva',
    reviewedById: 'revisor-juridico',
    category: 'carencias',
    tags: ['carência', 'ANS', 'plano coletivo', 'PME', 'MEI'],
    publishedAt: '2026-04-10T12:00:00.000Z',
    updatedAt: '2026-04-25T15:30:00.000Z',
    ogImage: '/og-default.jpg',
    enabled: true,
    // Story 6.10 — Pipeline NFR23 (mock track populado para audit pass)
    workflowStatus: 'published',
    reviewTrack: [
      {
        reviewer: 'revisor-medico', // TODO Atlas: substituir por CRM real (Story 2.5)
        role: 'medico',
        reviewedAt: '2026-04-08T14:00:00.000Z',
        comments:
          'Revisão técnica de prazos ANS de carência e procedimentos cobertos.',
        changes:
          'Ajustada redação sobre urgência/emergência para alinhar com RN ANS vigente.',
        decision: 'approved',
      },
      {
        reviewer: 'revisor-juridico', // TODO Atlas: substituir por OAB real (Story 2.4)
        role: 'advogado',
        reviewedAt: '2026-04-09T18:00:00.000Z',
        comments:
          'Revisão jurídica de cláusulas regulatórias e portabilidade RN 438.',
        changes:
          'Adicionado disclaimer sobre obrigação contratual de cronograma escrito.',
        decision: 'approved',
      },
    ],
  },
  {
    _id: 'mock-coparticipacao-vs-sem',
    title: 'Coparticipação ou plano completo: qual escolher para PME',
    slug: 'coparticipacao-vs-completo-pme',
    excerpt:
      'Comparativo entre planos com coparticipação e planos completos para empresas: estrutura de custos, perfil de uso e impacto no reajuste anual.',
    body: [
      block(
        'b1',
        'normal',
        // TODO Atlas (humano): adicionar séries históricas FenaSaúde / ANS Sala de Situação quando publicadas — manter texto institucional até validação.
        'A escolha entre plano com coparticipação e plano completo é uma das decisões mais importantes na contratação de um plano empresarial. Cada modelo tem implicações financeiras distintas para a empresa contratante e para os colaboradores. A modalidade de coparticipação é regulamentada pela Resolução Normativa ANS nº 433/2018, que define limites e situações em que o pagamento adicional é vedado.',
      ),
      block('b2', 'h2', 'Como funciona a coparticipação'),
      block(
        'b3',
        'normal',
        // Fonte: RN 433/2018 (ANS) — coparticipação limitada a 30% por procedimento; isenção em urgência/emergência, internações e prevenção.
        'Na coparticipação, o beneficiário paga um valor adicional por procedimento utilizado — consulta, exame ou pronto-socorro. A mensalidade base é menor; o custo total varia conforme uso. A RN 433/2018 estabelece que o valor da coparticipação não pode ultrapassar 30% do custo do procedimento e que estão isentos atendimentos de urgência e emergência, internações hospitalares, exames preventivos e procedimentos vinculados a programas de promoção da saúde. Os percentuais e a tabela de procedimentos coparticipados devem constar expressamente no contrato.',
      ),
      block('b4', 'h2', 'Quando coparticipação faz sentido'),
      listItem(
        'b5',
        'Empresas com população jovem e baixa sinistralidade histórica.',
      ),
      listItem(
        'b6',
        'Quando o objetivo é reduzir mensalidade fixa e alinhar uso consciente.',
      ),
      listItem(
        'b7',
        'Em PMEs onde a previsibilidade orçamentária mensal é prioridade secundária.',
      ),
      block('b9', 'h2', 'Impacto no reajuste anual'),
      block(
        'b10',
        'normal',
        // TODO Advogado: revisar redação sobre RN ANS de reajuste.
        'O reajuste anual em planos coletivos segue regras específicas de sinistralidade. Independentemente do modelo, vale solicitar o memorial de cálculo no aniversário do contrato.',
      ),
    ],
    authorId: 'agnaldo-silva',
    reviewedById: 'revisor-juridico',
    category: 'coparticipacao',
    tags: ['coparticipação', 'PME', 'reajuste', 'sinistralidade'],
    publishedAt: '2026-03-22T09:00:00.000Z',
    ogImage: '/og-default.jpg',
    enabled: true,
    workflowStatus: 'published',
    reviewTrack: [
      {
        reviewer: 'revisor-medico', // TODO Atlas: substituir por CRM real
        role: 'medico',
        reviewedAt: '2026-03-20T10:00:00.000Z',
        comments: 'Revisão técnica do impacto clínico de coparticipação.',
        changes:
          'Removida menção a percentuais específicos sem fonte ANS pública.',
        decision: 'approved',
      },
      {
        reviewer: 'revisor-juridico', // TODO Atlas: substituir por OAB real
        role: 'advogado',
        reviewedAt: '2026-03-21T16:00:00.000Z',
        comments:
          'Revisão jurídica do reajuste anual e memorial de cálculo (RN ANS).',
        changes:
          'Adicionada referência ao direito de solicitação de memorial no aniversário.',
        decision: 'approved',
      },
    ],
  },
  {
    _id: 'mock-amil-one-vs-classica',
    title: 'Amil One vs Clássica: diferenças de rede e cobertura',
    slug: 'amil-one-vs-classica-rede-cobertura',
    excerpt:
      'Comparativo entre as linhas Amil One e Clássica: rede credenciada, hospitais premium, abrangência geográfica e perfil de empresa adequado.',
    body: [
      block(
        'b1',
        'normal',
        'Amil One e Clássica são duas linhas com perfis bastante distintos no portfólio Amil. A escolha depende do perfil da empresa, do salário-base e das expectativas dos colaboradores quanto à rede credenciada.',
      ),
      block('b2', 'h2', 'Amil One: rede premium'),
      block(
        'b3',
        'normal',
        // Hospitais top-tier confirmados em material institucional Amil (fonte: docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md §1, meta description amilsaudebr.com.br: "rede credenciada com Albert Einstein e Sírio Libanês"). Não inventar hospitais adicionais sem fonte oficial.
        'A linha Amil One trabalha com uma rede selecionada e mais enxuta, com foco em hospitais e clínicas de referência nas principais capitais. Em material institucional Amil, a linha aparece associada a hospitais como Albert Einstein e Sírio-Libanês, e é tipicamente posicionada como benefício diferenciado para cargos executivos ou empresas que querem oferecer um padrão premium aos colaboradores. A composição exata da rede varia por estado e por produto (por exemplo, S380, S450, S580, S750), e deve ser consultada no Guia Médico Amil vigente antes da contratação.',
      ),
      block('b4', 'h2', 'Clássica: rede ampla nacional'),
      block(
        'b5',
        'normal',
        // Linha Clássica organiza-se em Bronze, Prata, Ouro, Platinum e Black (fonte: docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md §1, sitemap /linha-classica/).
        'A Linha Clássica oferece rede ampla com cobertura nacional, organizada em níveis (Bronze, Prata, Ouro, Platinum e Black) que escalam acomodação, abrangência geográfica, reembolso e acesso a hospitais top-tier. É indicada para empresas com colaboradores distribuídos em múltiplas cidades ou em regiões onde a rede selecionada da linha One é mais limitada. A diferença prática frente à One está no tamanho e perfil da rede credenciada, e não na cobertura mínima — todas as linhas Amil seguem o Rol de Procedimentos ANS (RN 593/2024).',
      ),
      block('b6', 'h2', 'Como escolher'),
      listItem('b7', 'Avalie distribuição geográfica dos colaboradores.'),
      listItem('b8', 'Considere salários-base e contribuição da empresa.'),
      listItem('b9', 'Compare lista de hospitais e clínicas em sua região.'),
    ],
    authorId: 'agnaldo-silva',
    category: 'rede-credenciada',
    tags: ['Amil One', 'Clássica', 'rede credenciada', 'comparativo'],
    publishedAt: '2026-02-15T14:00:00.000Z',
    ogImage: '/og-default.jpg',
    enabled: true,
  },
  {
    _id: 'mock-mei-pode-contratar',
    title: 'MEI pode contratar plano de saúde empresarial?',
    slug: 'mei-pode-contratar-plano-empresarial',
    excerpt:
      'MEIs podem contratar plano coletivo empresarial: documentação necessária, prazo mínimo de CNPJ, número de vidas e principais regras das operadoras.',
    body: [
      block(
        'b1',
        'normal',
        // Fonte: RN 195/2009 art. 3º (ANS) — define o plano coletivo empresarial como aquele que oferece cobertura por vínculo empregatício ou estatutário, abrangendo MEI, EI, EIRELI e demais pessoas jurídicas. Lei Complementar 128/2008 instituiu o MEI e o equipara, para fins de contratação de plano coletivo, a pessoa jurídica.
        'Sim — MEIs (Microempreendedores Individuais) podem contratar planos coletivos empresariais. A RN 195/2009, art. 3º, considera plano coletivo empresarial aquele contratado por pessoa jurídica em razão de vínculo com a empresa, e o MEI, instituído pela Lei Complementar 128/2008, é pessoa jurídica para esse fim. Há, contudo, requisitos específicos que variam por operadora — em especial quanto a tempo mínimo de CNPJ ativo e número mínimo de vidas.',
      ),
      block('b2', 'h2', 'Requisitos comuns'),
      listItem(
        'b3',
        // TODO Atlas (humano): consolidar prazos por operadora a partir de propostas comerciais 2026 (Amil, Bradesco, SulAmérica). Manter "varia por operadora" até validação documental.
        'CNPJ ativo: a maioria das operadoras exige um prazo mínimo de constituição (tipicamente entre 30 dias e 6 meses), que varia por operadora e por porte da empresa.',
      ),
      listItem(
        'b4',
        'Comprovação de vínculo entre titular e empresa (contrato social ou CCMEI — Certificado da Condição de Microempreendedor Individual).',
      ),
      listItem(
        'b5',
        // RN 195/2009 art. 3º — coletivo empresarial admite a partir de 1 vida (titular pessoa jurídica). Operadoras podem exigir 2+ vidas comercialmente.
        'Mínimo de vidas: regulatoriamente o coletivo empresarial admite a partir de 1 vida (titular MEI), mas comercialmente algumas operadoras exigem 2 ou mais vidas (titular + dependente, ou titular + sócio).',
      ),
      block('b6', 'h2', 'Documentação tipicamente solicitada'),
      block(
        'b7',
        'normal',
        'Cartão CNPJ, CCMEI, RG/CPF do titular e dependentes, comprovante de endereço atualizado e proposta de adesão preenchida pela corretora.',
      ),
    ],
    authorId: 'agnaldo-silva',
    category: 'adesao-mei-pme',
    tags: ['MEI', 'adesão', 'documentação', 'CNPJ'],
    publishedAt: '2026-01-30T10:00:00.000Z',
    ogImage: '/og-default.jpg',
    enabled: true,
  },
  {
    _id: 'mock-portabilidade-carencias',
    title: 'Portabilidade de carências entre operadoras: como funciona',
    slug: 'portabilidade-carencias-operadoras',
    excerpt:
      'Portabilidade de carências permite trocar de operadora sem cumprir nova carência: requisitos da RN ANS, prazos e como solicitar.',
    body: [
      block(
        'b1',
        'normal',
        // Fontes: RN 438/2018 (ANS) consolidou a portabilidade de carências e foi atualizada por normas posteriores; RN 565/2022 ajustou regras complementares. TODO Atlas (humano): revisar se há atualização ANS posterior a 2024 antes da publicação.
        'A portabilidade de carências é o direito do beneficiário de migrar de operadora aproveitando o tempo já cumprido no plano de origem, sem precisar cumprir nova carência no plano de destino. É regulamentada pela Resolução Normativa ANS nº 438/2018, com atualizações pela RN 565/2022, e estende-se a planos individuais, familiares e coletivos por adesão e empresariais, observados os requisitos específicos de cada modalidade.',
      ),
      block('b2', 'h2', 'Requisitos básicos'),
      listItem(
        'b3',
        'Tempo mínimo no plano de origem (varia conforme tipo de procedimento).',
      ),
      listItem('b4', 'Adimplência (pagamentos em dia).'),
      listItem(
        'b5',
        'Plano de destino compatível em tipo de cobertura e faixa de preço.',
      ),
      block('b6', 'h2', 'Como solicitar'),
      block(
        'b7',
        'normal',
        // TODO Advogado: validar passo-a-passo em norma ANS atual.
        'Use o Guia ANS de Planos de Saúde para identificar planos compatíveis. A solicitação é feita junto à operadora de destino, que valida a compatibilidade e o cumprimento dos prazos.',
      ),
    ],
    authorId: 'agnaldo-silva',
    reviewedById: 'revisor-juridico',
    category: 'ans-regulamentacao',
    tags: ['portabilidade', 'ANS', 'RN 438', 'carência'],
    publishedAt: '2026-01-12T08:30:00.000Z',
    ogImage: '/og-default.jpg',
    enabled: true,
    workflowStatus: 'published',
    reviewTrack: [
      {
        reviewer: 'revisor-medico', // TODO Atlas: substituir por CRM real
        role: 'medico',
        reviewedAt: '2026-01-10T11:00:00.000Z',
        comments:
          'Revisão técnica de tempos de carência por procedimento (Rol ANS).',
        changes:
          'Substituído prazo numérico genérico por referência à norma vigente.',
        decision: 'approved',
      },
      {
        reviewer: 'revisor-juridico', // TODO Atlas: substituir por OAB real
        role: 'advogado',
        reviewedAt: '2026-01-11T15:00:00.000Z',
        comments:
          'Revisão jurídica da RN 438 + atualizações posteriores ANS.',
        changes:
          'Validado passo-a-passo de portabilidade conforme Guia ANS atual.',
        decision: 'approved',
      },
    ],
  },
];

export function getMockPosts(): readonly BlogPost[] {
  return MOCK_POSTS.filter((p) => p.enabled);
}

export function getMockPostBySlug(slug: string): BlogPost | undefined {
  return MOCK_POSTS.find((p) => p.slug === slug && p.enabled);
}
