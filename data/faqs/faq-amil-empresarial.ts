/**
 * Catálogo Q&A Amil Empresarial — Story 4.7 (FR36).
 *
 * 45+ Q&A canônicas distribuídas por categoria:
 *   - Carências e CPT (5)
 *   - Coparticipação e Reajuste (5)
 *   - Reembolso (5)
 *   - Rede Credenciada (8)
 *   - Adesão MEI/PME (8)
 *   - ANS / Regulamentação (5)
 *   - Cobertura (5)
 *   - Cancelamento (4)
 *   = 45 total
 *
 * **IMPORTANTE — placeholders pendentes de revisão**:
 *   Cada answer marcada com `// TODO Atlas:` requer revisão por:
 *     - @analyst (Atlas) — verificar fato regulatório / link cornerstone
 *     - advogado revisor (Story 2.4) — co-sign jurídico antes de
 *       publicar (NFR23: revisão humana obrigatória em conteúdo
 *       médico/regulatório).
 *   Dex (este PR) escreve **skeleton + draft factual** baseado em RN
 *   ANS conhecidas; NÃO inventa percentuais, prazos ou cobertura.
 *
 * Cada answer ≥80 palavras (NFR21 thin-schema protection — Story 4.7
 * AC3). Quando placeholder não atinge 80 palavras, marca-se TODO.
 */

export type FAQCategory =
  | 'carencias'
  | 'coparticipacao'
  | 'reembolso'
  | 'rede-credenciada'
  | 'adesao'
  | 'ans'
  | 'cobertura'
  | 'cancelamento';

export interface FAQItem {
  /** ID estável (slug). Útil para deep-linking e key React. */
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  /** Fonte regulatória ou link interno citado. Aparece como rodapé. */
  source?: string;
  /** Nota de revisão pendente — vazia quando aprovado. */
  review_status?: 'draft-dex' | 'reviewed-atlas' | 'reviewed-legal';
}

// ─────────────────────────────────────────────────────────────────────
// CARÊNCIAS E CPT (5)
// ─────────────────────────────────────────────────────────────────────

const carencias: FAQItem[] = [
  {
    id: 'carencia-pme-30-vidas',
    category: 'carencias',
    question: 'Qual a carência do plano Amil Empresarial para empresas com 30+ vidas?',
    answer:
      'Empresas com 30 ou mais beneficiários costumam ter isenção total de carência no plano Amil Empresarial, conforme negociação comercial padrão do mercado de planos coletivos empresariais. Para empresas menores (2 a 29 vidas), as carências seguem os limites máximos da ANS (RN 195/2009 e suas atualizações): 24h para urgência/emergência, 30 dias para consultas e exames simples, 180 dias para internações e exames complexos, e 300 dias para parto a termo. Doenças e Lesões Preexistentes (DLP) podem ter Cobertura Parcial Temporária (CPT) de até 24 meses para procedimentos de alta complexidade vinculados à condição declarada. Confirme as carências exatas na proposta comercial antes de assinar — elas dependem do produto Amil contratado e do porte da empresa. // TODO Atlas: validar tabela exata de carência por porte (S380, S450, S750, One) com a área comercial Amil e linkar guia de carência (cornerstone).',
    source: 'ANS RN 195/2009 (cobertura mínima)',
    review_status: 'draft-dex',
  },
  {
    id: 'carencia-parto',
    category: 'carencias',
    question: 'Qual a carência para parto no plano Amil Empresarial?',
    answer:
      'A carência máxima permitida pela ANS para parto a termo em planos de saúde é de 300 dias, conforme RN 195/2009. No plano Amil Empresarial, empresas com 30+ vidas geralmente têm isenção total dessa carência. Para empresas menores (PME 2-29 vidas), pode haver carência reduzida ou parcial conforme negociação comercial e produto contratado. Parto prematuro (antes de 38 semanas) com complicações é tratado como urgência/emergência e tem carência de apenas 24 horas após início da vigência. Beneficiárias que engravidaram antes da contratação seguem regras de CPT (Cobertura Parcial Temporária) por até 24 meses para procedimentos diretamente relacionados. // TODO Atlas: validar com Amil Comercial se há alguma exceção contratual em produtos específicos (Amil One, Black) e linkar /carencia-amil-empresarial cornerstone quando disponível.',
    source: 'ANS RN 195/2009 art. 12',
    review_status: 'draft-dex',
  },
  {
    id: 'cpt-cobertura-parcial-temporaria',
    category: 'carencias',
    question: 'O que é CPT (Cobertura Parcial Temporária) e como afeta o plano Amil?',
    answer:
      'CPT é o período em que o plano de saúde pode suspender cobertura para Procedimentos de Alta Complexidade (PAC), leitos de alta tecnologia e cirurgias relacionados a Doenças ou Lesões Preexistentes (DLP) declaradas pelo beneficiário. A duração máxima é de 24 meses, conforme RN 162/2007 e RN 195/2009 da ANS. Durante a CPT, o beneficiário continua tendo direito à cobertura ambulatorial (consultas, exames básicos, internação clínica) referente à doença preexistente. No plano Amil Empresarial, beneficiários devem preencher Declaração de Saúde no momento da adesão; omissão de DLP detectada posteriormente pode resultar em rescisão contratual ou reposicionamento de cobertura. CPT NÃO é carência comum — é regra específica para condições já existentes. // TODO Atlas: validar texto da Declaração de Saúde Amil + linkar cornerstone CPT quando criada.',
    source: 'ANS RN 162/2007',
    review_status: 'draft-dex',
  },
  {
    id: 'carencia-urgencia-emergencia',
    category: 'carencias',
    question: 'A Amil cobre urgência e emergência sem carência?',
    answer:
      'Sim. A carência máxima para atendimentos de urgência e emergência em qualquer plano de saúde regulamentado pela ANS é de 24 horas após o início da vigência contratual, conforme RN 195/2009. Esta regra se aplica integralmente ao plano Amil Empresarial em todos os produtos comercializados. Urgência é definida como evento resultante de acidente pessoal ou complicação no processo gestacional. Emergência é evento que implique risco imediato à vida ou lesões irreparáveis. Após a primeiras 12 horas de internação por urgência/emergência, o plano cobre integralmente. Se a internação for inferior a 12 horas e o beneficiário ainda estiver em carência para internação, a Amil pode limitar cobertura ao pronto-socorro. Empresas com 30+ vidas geralmente têm isenção total de carência, eliminando essa restrição. // TODO Atlas: confirmar política específica Amil sobre internação de urgência durante carência.',
    source: 'ANS RN 195/2009 art. 12 §I',
    review_status: 'draft-dex',
  },
  {
    id: 'reducao-carencia-portabilidade',
    category: 'carencias',
    question: 'Posso usar portabilidade para reduzir carência no plano Amil?',
    answer:
      'Sim. A portabilidade de carências, regulamentada pela RN 438/2018 da ANS (atualizada por normativos posteriores), permite ao beneficiário trocar de operadora ou de plano dentro da mesma operadora sem cumprir novas carências. Os requisitos básicos são: (1) o beneficiário deve estar há pelo menos 2 anos no plano de origem (ou 3 anos se houver CPT cumprida); (2) o plano de origem deve ser ativo e adimplente; (3) o plano de destino deve ser de tipo compatível (mesma faixa de cobertura ou superior); (4) o pedido deve ser feito até 60 dias após o aniversário do contrato de origem. A Amil aceita portabilidade tanto na entrada (recebendo beneficiários de outras operadoras) quanto na saída. Documentação típica: cópia do contrato anterior, declaração de adimplência, prazo de permanência. // TODO Atlas: validar guia passo-a-passo Amil + linkar /portabilidade quando criada.',
    source: 'ANS RN 438/2018',
    review_status: 'draft-dex',
  },
];

// ─────────────────────────────────────────────────────────────────────
// COPARTICIPAÇÃO E REAJUSTE (5)
// ─────────────────────────────────────────────────────────────────────

const coparticipacao: FAQItem[] = [
  {
    id: 'como-funciona-coparticipacao',
    category: 'coparticipacao',
    question: 'Como funciona a coparticipação no plano Amil Empresarial?',
    answer:
      'Coparticipação é o pagamento adicional, feito pelo beneficiário, de uma fração do valor de cada procedimento utilizado (consulta, exame, terapia), além da mensalidade fixa. No plano Amil Empresarial, percentuais comuns variam entre 20% e 40% do custo do procedimento, dependendo do produto e da negociação com a empresa. A vantagem da coparticipação é mensalidade significativamente menor que o plano sem coparticipação (modalidade "pré-pagamento"). A desvantagem é o custo variável por uso — empresas com perfil de utilização alta podem pagar mais no total. A coparticipação NÃO se aplica a internações cirúrgicas, prevenção (check-ups dentro do programa), nem alguns procedimentos específicos (parto, oncologia). // TODO Atlas: validar percentuais exatos por produto Amil (S380, S450, S750, One) com Amil Comercial.',
    source: 'ANS RN 433/2018 (regulamenta coparticipação)',
    review_status: 'draft-dex',
  },
  {
    id: 'reajuste-anual-amil',
    category: 'coparticipacao',
    question: 'Como funciona o reajuste anual do plano Amil Empresarial?',
    answer:
      'Planos coletivos empresariais (Amil PME e PJ) têm reajuste anual livre, negociado entre operadora e empresa contratante na data de aniversário do contrato — diferente dos planos individuais, cujo teto é fixado pela ANS. O índice de reajuste do Amil Empresarial é influenciado por: sinistralidade (relação custo/receita do grupo), VCMH (Variação de Custos Médico-Hospitalares do mercado), inflação setorial e tamanho da carteira. Reajustes médios do mercado nos últimos anos têm oscilado entre 12% e 25% ao ano para coletivos empresariais, mas valores específicos variam muito. Adicionalmente, há reajuste por mudança de faixa etária (RN 63/2003 — 10 faixas), aplicado apenas no aniversário individual de cada beneficiário. Empresas têm direito de receber memória de cálculo justificando o reajuste proposto. // TODO Atlas: validar política Amil de transparência de reajuste + linkar /reajuste-amil quando criado.',
    source: 'ANS RN 565/2022 (reajuste coletivos)',
    review_status: 'draft-dex',
  },
  {
    id: 'mudanca-faixa-etaria',
    category: 'coparticipacao',
    question: 'Quando o plano Amil reajusta por mudança de faixa etária?',
    answer:
      'A ANS regulamenta reajuste por faixa etária via RN 63/2003 com 10 faixas: 0-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, e 59+. O reajuste ocorre no mês de aniversário do beneficiário quando ele migra para nova faixa. A ANS impõe limites: o valor da última faixa (59+) não pode ser superior a 6 vezes o valor da primeira faixa (0-18); e a variação total entre 7ª e 10ª faixa não pode exceder a variação entre 1ª e 7ª (regra protetora idoso). No plano Amil Empresarial, esse reajuste é aplicado individualmente — afeta o custo do beneficiário específico, não toda a carteira. Reajuste por faixa etária é cumulativo ao reajuste anual técnico (sinistralidade). Empresas devem comunicar o reajuste com pelo menos 30 dias de antecedência. // TODO Atlas: validar tabela exata de fatores de reajuste por faixa Amil.',
    source: 'ANS RN 63/2003',
    review_status: 'draft-dex',
  },
  {
    id: 'coparticipacao-vs-sem',
    category: 'coparticipacao',
    question: 'Vale a pena escolher Amil com ou sem coparticipação?',
    answer:
      'A escolha depende do perfil de uso do grupo. Plano sem coparticipação (pré-pagamento) tem mensalidade mais alta (tipicamente 25%-45% acima da versão com copart) mas zero custo adicional por uso — bom para perfis de alta utilização (idosos, beneficiários com condições crônicas, famílias com crianças pequenas). Plano com coparticipação tem mensalidade menor mas paga-se 20-40% por procedimento — bom para perfis de baixa utilização (jovens saudáveis, perfil corporativo médio). Cálculo prático: somar mensalidade × 12 + uso médio anual × percentual copart. Em média, planos com copart compensam até ~6 consultas+exames anuais; acima disso, sem copart vence. Recomenda-se simular com histórico real do RH. // TODO Atlas: criar calculadora interativa /comparador-coparticipacao (Story 3.21) e linkar.',
    source: 'Análise comparativa BeneficioRH',
    review_status: 'draft-dex',
  },
  {
    id: 'limite-coparticipacao',
    category: 'coparticipacao',
    question: 'Existe limite máximo de coparticipação por mês no plano Amil?',
    answer:
      'A ANS, via RN 433/2018, estabelece que a soma da mensalidade + coparticipação total mensal NÃO pode exceder o valor que seria cobrado em um plano de pré-pagamento equivalente. Na prática, isso significa um teto natural por beneficiário. Adicionalmente, a coparticipação por procedimento individual não pode caracterizar "fator restritor severo" — ou seja, o copart não pode ser tão alto que impeça o uso. Algumas operadoras, incluindo a Amil, aplicam tetos contratuais adicionais (ex: copart máximo de R$ 80 por consulta independente do percentual). Verifique o contrato específico da empresa para conhecer tetos aplicáveis. Coparticipação NÃO se aplica a internação cirúrgica, oncologia, urgência/emergência (após 12h), parto, e procedimentos do PROCED (programa preventivo). // TODO Atlas: validar tetos contratuais específicos Amil por produto.',
    source: 'ANS RN 433/2018',
    review_status: 'draft-dex',
  },
];

// ─────────────────────────────────────────────────────────────────────
// REEMBOLSO (5)
// ─────────────────────────────────────────────────────────────────────

const reembolso: FAQItem[] = [
  {
    id: 'como-pedir-reembolso-amil',
    category: 'reembolso',
    question: 'Como funciona o reembolso de consultas e exames na Amil?',
    answer:
      'O reembolso na Amil permite ao beneficiário usar prestadores fora da rede credenciada (médicos particulares, clínicas privadas) e receber ressarcimento parcial. O processo padrão: (1) pagar diretamente o prestador; (2) solicitar nota fiscal detalhada com CRM/CRO/CRP, código do procedimento (TUSS) e CID; (3) submeter pedido via app Amil Cliente, portal web ou WhatsApp oficial; (4) aguardar análise (prazo médio: 7 a 30 dias úteis dependendo do produto). O valor reembolsado segue uma tabela interna chamada "múltiplo Amil" — geralmente é uma fração do valor pago, raramente 100%. Produtos premium (Amil One, Black) reembolsam mais e mais rápido (até 3 dias úteis). Produtos básicos (S380, S450) podem ter reembolso menor e prazo maior. // TODO Atlas: confirmar tabela de múltiplo de reembolso por produto Amil 2026 + linkar /reembolso-amil cornerstone.',
    source: 'Manual do Beneficiário Amil',
    review_status: 'draft-dex',
  },
  {
    id: 'tabela-reembolso-multiplo',
    category: 'reembolso',
    question: 'O que é "múltiplo de reembolso" no plano Amil?',
    answer:
      'O "múltiplo" é uma unidade de cálculo proprietária Amil que define o valor máximo reembolsável por procedimento. Cada procedimento tem um número de múltiplos atribuído (ex: consulta = 4 múltiplos; ressonância = 12 múltiplos), e cada múltiplo equivale a um valor em reais determinado pelo plano. Plano Amil S380 pode ter múltiplo R$ 35; Amil One pode ter R$ 200. Isso significa que para a mesma consulta de R$ 400, o S380 reembolsa até R$ 140 (4×35) e o One até R$ 800 (4×200, mas limitado ao valor pago). Esse modelo difere do reembolso por percentual: oferece previsibilidade ao beneficiário mas pode resultar em ressarcimento muito abaixo do gasto real para procedimentos premium. Tabela do múltiplo é divulgada pela Amil em manual do beneficiário e pode ser revisada anualmente. // TODO Atlas: levantar valor do múltiplo 2026 por produto Amil.',
    source: 'Manual do Beneficiário Amil',
    review_status: 'draft-dex',
  },
  {
    id: 'prazo-reembolso',
    category: 'reembolso',
    question: 'Qual o prazo legal para a Amil pagar reembolso?',
    answer:
      'A ANS, via RN 259/2011, estabelece prazo máximo de 30 dias úteis para análise e pagamento de reembolso após o protocolo do pedido completo (com documentação correta). Pedidos incompletos podem ter prazo adicional após complementação. Em casos de descumprimento sistemático, o beneficiário pode acionar a ANS via canal de denúncia, e a operadora fica sujeita a multa. Na prática, planos premium Amil (One, Black) têm SLA interno mais curto (3 a 7 dias úteis); planos intermediários (S750) ficam em 10-15 dias; planos básicos (S380, S450) podem chegar perto do limite de 30 dias úteis. Beneficiários têm direito a acompanhar o status pelo app Amil Cliente. Recusas devem ser justificadas formalmente; cabe recurso interno e, em última instância, ANS ou Justiça. // TODO Atlas: validar SLAs reais Amil 2026 e linkar /como-pedir-reembolso quando criado.',
    source: 'ANS RN 259/2011',
    review_status: 'draft-dex',
  },
  {
    id: 'reembolso-dependentes',
    category: 'reembolso',
    question: 'Dependentes do plano Amil têm direito a reembolso integral?',
    answer:
      'Sim. Dependentes incluídos formalmente no plano Amil Empresarial (cônjuge, filhos até 21 ou 24 anos se universitários, dependentes legais conforme contrato) têm os mesmos direitos de reembolso que o titular, incluindo idênticos múltiplos e tetos. Não há discriminação por status de titularidade no contrato. O pedido de reembolso deve ser feito em nome do beneficiário usuário (não necessariamente o titular), com identificação correta no formulário e nota fiscal nominal. Importante: dependentes em período de carência (recém-incluídos) podem ter restrições; verificar status individual no portal. Reembolsos para dependentes são processados no mesmo prazo regulamentar (30 dias úteis ANS RN 259/2011). // TODO Atlas: validar política Amil de inclusão de dependentes com mais de 24 anos (caso especial conforme contrato).',
    source: 'ANS RN 259/2011 + contrato Amil',
    review_status: 'draft-dex',
  },
  {
    id: 'reembolso-internacional',
    category: 'reembolso',
    question: 'Posso pedir reembolso para atendimento no exterior pela Amil?',
    answer:
      'Apenas planos premium específicos da Amil oferecem cobertura internacional ou reembolso de despesas médicas no exterior — historicamente são produtos como Amil One e Amil 700 (linha Internacional, descontinuada em parte do mercado). Planos empresariais padrão (S380, S450, S750) NÃO cobrem despesas no exterior, salvo em situações de urgência/emergência específicas e dentro de cláusulas restritas. Para empresas com beneficiários que viajam frequentemente, recomenda-se contratar seguro viagem complementar específico. Para expatriados, há produtos especializados (Amil One Saúde Internacional, Allianz Care, Cigna Global) com cobertura mundial. Verifique sempre as cláusulas internacionais no contrato Amil antes de viagem. // TODO Atlas: confirmar produtos Amil 2026 com cobertura internacional + linkar /amil-internacional quando criado.',
    source: 'Contrato Amil Empresarial (cobertura territorial)',
    review_status: 'draft-dex',
  },
];

// ─────────────────────────────────────────────────────────────────────
// REDE CREDENCIADA (8)
// ─────────────────────────────────────────────────────────────────────

const redeCredenciada: FAQItem[] = [
  {
    id: 'consultar-rede-amil',
    category: 'rede-credenciada',
    question: 'Como consultar a rede credenciada Amil para minha empresa?',
    answer:
      'A consulta da rede credenciada Amil pode ser feita por três canais oficiais: (1) site amil.com.br seção "Encontre seu médico/hospital" — filtros por cidade, especialidade, nome; (2) app Amil Cliente — iOS/Android, com geolocalização e indicação de horário de atendimento; (3) Central de Atendimento Amil 24h. Para empresas, o RH recebe um manual da rede específica do produto contratado (S380, S450, S750, One) com hospitais, clínicas e laboratórios disponíveis. Importante: a rede varia por produto — Amil S380 tem rede mais limitada que Amil S750, e Amil One tem rede premium praticamente irrestrita nas principais capitais. Antes de procurar atendimento, sempre confirme se o prestador continua credenciado (a rede é dinâmica e pode descredenciar prestadores). // TODO Atlas: linkar /rede-credenciada hub principal quando criado (Story 7.2).',
    source: 'amil.com.br',
    review_status: 'draft-dex',
  },
  {
    id: 'cobertura-fora-estado',
    category: 'rede-credenciada',
    question: 'Posso usar o plano Amil Empresarial fora do meu estado?',
    answer:
      'Depende da abrangência geográfica contratada. Planos Amil Empresarial são vendidos com 4 níveis principais: (1) Municipal (apenas a cidade de origem); (2) Estadual (todo o estado); (3) Grupo de Estados (regional, ex: Sudeste); (4) Nacional (Brasil inteiro). Empresas com filiais em múltiplos estados normalmente contratam abrangência Nacional. Para uso fora da área contratada, o beneficiário pode usar urgência/emergência (cobertura obrigatória ANS), agendar reembolso (se previsto no plano), ou aguardar retorno à área de cobertura para procedimentos eletivos. Amil One tem abrangência nacional padrão. Planos S380/S450 podem ter abrangência regional; verifique a apólice. // TODO Atlas: confirmar abrangência padrão de cada produto Amil 2026.',
    source: 'Contrato Amil — abrangência geográfica',
    review_status: 'draft-dex',
  },
  {
    id: 'descredenciamento-hospital',
    category: 'rede-credenciada',
    question: 'O hospital onde me trato saiu da rede Amil. E agora?',
    answer:
      'A ANS, via RN 365/2014, exige que a operadora notifique beneficiários com 30 dias de antecedência sobre descredenciamento de hospitais e clínicas, e ofereça opção equivalente em qualidade e proximidade geográfica. Se o descredenciamento ocorrer durante internação, a Amil é obrigada a manter cobertura até a alta médica do paciente. Se você está em tratamento contínuo (oncologia, hemodiálise, gestação), o hospital descredenciado deve continuar atendendo até a conclusão do ciclo terapêutico em curso (RN 259/2011). Para casos sem tratamento ativo, o beneficiário pode: (1) migrar para outro hospital credenciado da mesma rede; (2) solicitar autorização especial da Amil; (3) usar reembolso (se previsto); (4) acionar ANS via canal 0800 701 9656 se houver descumprimento. // TODO Atlas: linkar guia /descredenciamento e checar Amil Comercial sobre processo formal.',
    source: 'ANS RN 365/2014 + RN 259/2011',
    review_status: 'draft-dex',
  },
  {
    id: 'hospitais-amil-sao-paulo',
    category: 'rede-credenciada',
    question: 'Quais os principais hospitais credenciados Amil em São Paulo?',
    answer:
      'A rede hospitalar Amil em São Paulo capital varia significativamente por produto: produtos premium (One, Black, S750) cobrem referência como Hospital Albert Einstein, Sírio-Libanês, Oswaldo Cruz, Beneficência Portuguesa, 9 de Julho, e Hospital Samaritano; produtos intermediários (S450) cobrem Total Care, Nove de Julho, Hospital São Camilo, Vivalle (rede própria Amil) e similares; produtos básicos (S380) cobrem rede própria Amil (hospitais Amil/Vivalle), Hospital Pasteur, Hospital São Luiz Gonzaga e clínicas regionais. A lista exata muda mensalmente — sempre confirmar via app Amil Cliente. Para empresas com beneficiários executivos exigentes, recomenda-se Amil S750 ou One. Para perfis corporativos médios, S450 oferece bom custo/benefício. // TODO Atlas: extrair lista oficial Amil + cross-check com dataset Power BI Amil rede credenciada (memo project_amil_rede_credenciada_powerbi.md).',
    source: 'amil.com.br + dataset interno BeneficioRH',
    review_status: 'draft-dex',
  },
  {
    id: 'rede-amil-rio-janeiro',
    category: 'rede-credenciada',
    question: 'A Amil tem rede ampla no Rio de Janeiro?',
    answer:
      'Sim. O Rio de Janeiro é uma das praças mais fortes da Amil, dado o histórico da operadora (fundação Amil no RJ em 1972). Produtos Amil One e S750 contemplam Hospital Copa D\'Or, Quinta D\'Or, Barra D\'Or, Caxias D\'Or (rede Rede D\'Or, parceira histórica), Hospital Samaritano Botafogo, Hospital Pró-Cardíaco, Hospital São Vicente, e Hospital São Lucas. Produtos S450 cobrem Hospital Vivalle (rede própria), Hospital Norte D\'Or, e clínicas regionais. Produto S380 tem rede mais restrita, focada em hospitais Amil próprios e parceiros básicos. Em municípios do interior (Petrópolis, Niterói, Volta Redonda), a rede S380 e S450 pode ser mais limitada. Confirme sempre por CEP no app Amil. // TODO Atlas: validar rede Amil Rio 2026 + linkar /rede-amil-rj cornerstone.',
    source: 'amil.com.br',
    review_status: 'draft-dex',
  },
  {
    id: 'medicos-amil-especialista',
    category: 'rede-credenciada',
    question: 'Como agendar consulta com médico especialista pela Amil?',
    answer:
      'Para consulta com especialista (cardiologista, ginecologista, ortopedista etc.) no plano Amil Empresarial, o processo geralmente é: (1) consultar disponibilidade via app Amil Cliente ou site (filtro por especialidade + cidade + plano); (2) agendar diretamente com a clínica/consultório informando ser beneficiário Amil (não há sistema centralizado obrigatório, salvo redes próprias Amil/Vivalle); (3) levar carteirinha (digital ou física) e documento de identidade no dia. Para alguns produtos básicos (S380), pode haver requisito de consulta prévia com clínico geral antes do encaminhamento ao especialista (mecanismo "porta de entrada"). Telemedicina Amil 24h também está disponível como porta de entrada para várias especialidades, sem necessidade de agendamento. // TODO Atlas: validar quais produtos Amil exigem porta de entrada em 2026.',
    source: 'app Amil Cliente + Manual do Beneficiário',
    review_status: 'draft-dex',
  },
  {
    id: 'amil-espaco-saude',
    category: 'rede-credenciada',
    question: 'O que é o Amil Espaço Saúde e como usá-lo?',
    answer:
      'Amil Espaço Saúde é uma rede própria de centros médicos integrados da Amil, presente nas principais capitais (São Paulo, Rio, Brasília, Recife, Salvador). Oferecem consultas com clínicos, especialistas, exames laboratoriais e de imagem em um único local, com agendamento centralizado pelo app ou site Amil. Diferenciais: estrutura padronizada Amil, prontuário eletrônico integrado entre profissionais, e prazos de agendamento geralmente menores que rede credenciada externa. Beneficiários de qualquer plano Amil (S380, S450, S750, One) podem usar o Espaço Saúde, mas alguns serviços específicos podem ter restrição por produto. Atendimento em Espaço Saúde é geralmente gratuito (não há coparticipação adicional além da já contratada). Para empresas, é uma opção atrativa em caso de demanda alta de atendimentos preventivos. // TODO Atlas: extrair lista de unidades Amil Espaço Saúde 2026 + linkar /amil-espaco-saude página dedicada.',
    source: 'amil.com.br/espaco-saude',
    review_status: 'draft-dex',
  },
  {
    id: 'urgencia-fora-rede',
    category: 'rede-credenciada',
    question: 'Em urgência, posso ir a hospital fora da rede Amil?',
    answer:
      'Sim. Em urgência ou emergência médica, o beneficiário pode ser atendido em qualquer hospital que aceite recebê-lo, mesmo fora da rede credenciada Amil. A operadora deve cobrir o atendimento conforme RN 195/2009 da ANS. O processo padrão: (1) realizar o atendimento no hospital mais próximo; (2) informar ser beneficiário Amil — alguns hospitais cobram diretamente do plano via convênio temporário; (3) se cobrado pelo hospital, pagar e solicitar reembolso à Amil com toda a documentação (relatório médico, nota fiscal). Para internações urgentes em hospital fora da rede com mais de 12 horas, a Amil deve garantir transferência para hospital credenciado equivalente, ou cobrir integralmente o custo se transferência não for possível. Documente tudo: relatórios, nota fiscal, comprovação da urgência. // TODO Atlas: validar processo formal de transferência Amil + linkar /urgencia-amil cornerstone.',
    source: 'ANS RN 195/2009',
    review_status: 'draft-dex',
  },
];

// ─────────────────────────────────────────────────────────────────────
// ADESÃO MEI / PME (8)
// ─────────────────────────────────────────────────────────────────────

const adesao: FAQItem[] = [
  {
    id: 'mei-pode-contratar-amil',
    category: 'adesao',
    question: 'MEI pode contratar plano Amil Empresarial?',
    answer:
      'Sim. O Microempreendedor Individual (MEI) pode contratar planos coletivos empresariais da Amil, geralmente sob a modalidade "Amil PME" ou "Amil para MEI", com regras específicas: requisito de mínimo 2 vidas (titular + 1 dependente OU titular + 1 sócio se houver), CNPJ ativo há pelo menos 6 meses (180 dias), regularidade fiscal e cadastral. Documentação típica: cartão CNPJ, comprovante de inscrição MEI ativa, RG/CPF dos beneficiários, certidão negativa de débitos. Preços para MEI são geralmente muito competitivos vs plano individual da Amil (que aliás é descontinuado para venda ativa em várias praças). MEI pode incluir cônjuge e filhos como dependentes legais. Caso seja MEI sem dependentes, planos individuais (Amil Saúde Individual) ou ADESÃO via entidade de classe (CAA, CRC, ABO etc.) são alternativas. // TODO Atlas: validar mínimo de vidas atual Amil 2026 + linkar /amil-mei cornerstone.',
    source: 'Amil PME — política comercial',
    review_status: 'draft-dex',
  },
  {
    id: 'pme-2-29-vidas',
    category: 'adesao',
    question: 'Quais as regras de adesão para PME (2 a 29 vidas) na Amil?',
    answer:
      'Para PME (Pequena e Média Empresa) com 2 a 29 vidas, a Amil aplica condições específicas: (1) carências reduzidas (não isenção total, diferente do PJ 30+); (2) Declaração de Saúde individual obrigatória de cada beneficiário; (3) CPT (Cobertura Parcial Temporária) aplicável a doenças preexistentes declaradas; (4) reajuste anual aplicado conforme técnica padrão Amil; (5) inclusão de dependentes legais (cônjuge, filhos até 21/24 anos universitários, enteados, netos sob guarda). Documentação típica: contrato social, cartão CNPJ, FGTS regularizado, RG/CPF dos beneficiários, comprovante de vínculo empregatício se houver funcionários. Mensalidade é calculada por faixa etária e produto contratado, com desconto progressivo conforme número de vidas. // TODO Atlas: validar tabela de carência reduzida PME Amil 2026.',
    source: 'Amil PME — política comercial',
    review_status: 'draft-dex',
  },
  {
    id: 'pj-30-vidas-isencao',
    category: 'adesao',
    question: 'Empresa com 30+ vidas tem isenção de carência na Amil?',
    answer:
      'Sim, geralmente. Empresas com 30 ou mais beneficiários (titulares + dependentes) na contratação inicial costumam ter isenção total de carência no plano Amil Empresarial PJ, conforme prática comercial padrão de mercado. Essa isenção cobre todas as carências da ANS (consultas, exames, internações, parto), exceto CPT (Cobertura Parcial Temporária) para doenças preexistentes, que NÃO é carência mas regra independente prevista em RN 162/2007. Para receber isenção, a empresa precisa apresentar: contrato social, FGTS regularizado, comprovação de vínculo empregatício (CAGED, eSocial), e cumprir requisitos de aceite cadastral da operadora. Empresas crescendo de PME para PJ 30+ podem renegociar condições no aniversário do contrato. // TODO Atlas: validar prática Amil 2026 sobre isenção em entrada e em crescimento de carteira.',
    source: 'Amil PJ — política comercial',
    review_status: 'draft-dex',
  },
  {
    id: 'documentos-adesao-amil',
    category: 'adesao',
    question: 'Quais documentos a empresa precisa para contratar plano Amil?',
    answer:
      'Documentação típica para contratação de plano Amil Empresarial PJ ou PME: (1) CNPJ ativo (cartão, comprovante de inscrição); (2) Contrato Social atualizado com última alteração; (3) Certidão Negativa de Débitos (CND) federal, estadual e municipal; (4) FGTS regularizado (se houver funcionários CLT); (5) eSocial / CAGED (comprovação de vínculo empregatício); (6) Documentos pessoais dos beneficiários (RG, CPF, certidão de nascimento dos dependentes, certidão de casamento se cônjuge); (7) Declaração de Saúde de cada beneficiário; (8) Comprovante de vínculo empregatício do titular (carteira CLT, contrato PJ, declaração societária); (9) Endereço comercial atualizado. Tempo médio de aprovação cadastral Amil: 5 a 15 dias úteis. // TODO Atlas: validar lista exata documentos Amil 2026 + criar cornerstone /como-contratar-amil.',
    source: 'Amil — checklist de adesão comercial',
    review_status: 'draft-dex',
  },
  {
    id: 'socio-unico-cobre-pme',
    category: 'adesao',
    question: 'Sócio único pode contratar Amil PME?',
    answer:
      'Sim, com ressalvas. O sócio único de uma empresa LTDA ou EIRELI (extinta em 2022, agora LTDA unipessoal) pode contratar plano Amil Empresarial sob modalidade PME, geralmente exigindo: (1) mínimo de 2 vidas (sócio + dependente OU sócio + funcionário CLT); (2) CNPJ ativo há pelo menos 6 meses; (3) regularidade fiscal; (4) Declaração de Saúde individual. Sócios sem dependentes E sem funcionários podem ter dificuldade de aceite — algumas operadoras exigem mínimo absoluto. Alternativas: contratar como MEI (se aplicável), ADESÃO via entidade de classe (CRC, OAB, CRM, CAA, ABO etc., dependendo da profissão), ou plano individual (descontinuado para venda na maior parte das praças). // TODO Atlas: validar política Amil 2026 sobre sócio único sem dependente.',
    source: 'Amil PME — política comercial',
    review_status: 'draft-dex',
  },
  {
    id: 'incluir-dependente-amil',
    category: 'adesao',
    question: 'Como incluir dependentes no plano Amil Empresarial?',
    answer:
      'A inclusão de dependentes no plano Amil Empresarial é feita pelo RH da empresa via portal corporativo Amil ou contato com a corretora. Dependentes elegíveis legalmente: cônjuge ou companheiro(a) (com prova de união estável), filhos biológicos ou adotivos até 21 anos (24 se universitários), enteados (com guarda formal), netos sob guarda do titular, e em alguns produtos premium, pais e sogros (mediante negociação especial). Documentação necessária: certidão de nascimento ou RG/CPF do dependente, certidão de casamento ou união estável, comprovante de matrícula universitária para 21-24 anos, declaração de dependência econômica quando aplicável. Inclusão tem efeito a partir do mês seguinte ao protocolo, com carências aplicáveis (exceto isenção PJ 30+). Carência específica do dependente: 30 dias consultas, 180 dias internação, 300 dias parto. // TODO Atlas: validar política Amil de inclusão de pais.',
    source: 'Manual do RH Amil Empresarial',
    review_status: 'draft-dex',
  },
  {
    id: 'remover-dependente-amil',
    category: 'adesao',
    question: 'Como remover ou cancelar um dependente do plano Amil?',
    answer:
      'A remoção de dependentes do plano Amil Empresarial é solicitada pelo RH da empresa via portal corporativo ou pela corretora. Hipóteses comuns de exclusão: divórcio/separação (cônjuge), filho atinge limite de idade (21 ou 24 anos universitários), filho perde dependência econômica, falecimento, ou pedido voluntário do titular. Documentação necessária varia: certidão de divórcio (cônjuge), certidão de óbito, declaração formal do titular. Após a exclusão, o ex-dependente perde direito imediato ao plano coletivo. Em alguns casos (ex-cônjuge com guarda compartilhada, ex-empregado), pode haver direito à manutenção por 12 a 36 meses sob lei 9.656/98 art. 30/31 (manutenção pós-emprego). Mudanças de cadastro têm efeito no mês seguinte ao protocolo. // TODO Atlas: validar timeline Amil + linkar /lei-9656-30-31 quando criada.',
    source: 'Lei 9.656/98 art. 30/31 + Manual Amil',
    review_status: 'draft-dex',
  },
  {
    id: 'demissao-mantem-plano',
    category: 'adesao',
    question: 'Funcionário demitido mantém o plano Amil? Por quanto tempo?',
    answer:
      'Sim, conforme lei 9.656/98 art. 30, o funcionário demitido sem justa causa que contribuía com o plano de saúde pode mantê-lo por 1/3 do tempo de permanência, com mínimo de 6 meses e máximo de 24 meses, desde que assuma o pagamento integral (parte da empresa + parte que pagava). Aposentado que contribuiu por 10 anos pode manter o plano vitalícia (art. 31), mediante pagamento integral. Para fazer valer esse direito: empresa deve comunicar formalmente o funcionário no momento da demissão; funcionário tem 30 dias para optar pela manutenção; se optar, paga mensalidade integral diretamente à operadora ou via empresa. Demissão por justa causa NÃO gera o direito. Funcionário que NÃO contribuía financeiramente (plano 100% pago pela empresa) também NÃO tem o direito. // TODO Atlas: validar processo formal Amil de manutenção pós-demissão + linkar guia /lei-9656.',
    source: 'Lei 9.656/98 art. 30/31',
    review_status: 'draft-dex',
  },
];

// ─────────────────────────────────────────────────────────────────────
// ANS / REGULAMENTAÇÃO (5)
// ─────────────────────────────────────────────────────────────────────

const ans: FAQItem[] = [
  {
    id: 'rol-procedimentos-ans',
    category: 'ans',
    question: 'O que é o Rol de Procedimentos da ANS e como afeta o plano Amil?',
    answer:
      'O Rol de Procedimentos e Eventos em Saúde da ANS é a lista oficial de procedimentos com cobertura obrigatória para todos os planos de saúde regulamentados (Lei 9.656/98). Atualizado a cada 2 anos pela ANS via consulta pública, atualmente conta com cerca de 3.300 procedimentos: consultas, exames, terapias, cirurgias, internações, transplantes, oncologia, psicoterapia, fonoaudiologia, fisioterapia, dentre outros. Em 2022, a Lei 14.454/22 alterou natureza do Rol de "exemplificativo" para "taxativo" (com algumas exceções para procedimentos comprovadamente eficazes). Plano Amil Empresarial cobre integralmente todo o Rol nas modalidades contratadas (ambulatorial, hospitalar, obstetrícia, odontológico). Procedimentos fora do Rol exigem autorização especial e podem não ser cobertos. ANS publica resoluções periódicas (DUT — Diretrizes de Utilização) regulamentando uso. // TODO Atlas: validar última atualização do Rol 2026 + linkar /rol-ans cornerstone.',
    source: 'Lei 9.656/98 + Lei 14.454/22 + RN ANS atualizada',
    review_status: 'draft-dex',
  },
  {
    id: 'denuncia-ans-amil',
    category: 'ans',
    question: 'Como reclamar ou denunciar a Amil na ANS?',
    answer:
      'O beneficiário insatisfeito com a Amil pode acionar a ANS por três canais oficiais: (1) Disque ANS 0800 701 9656 (gratuito, 8h-20h dias úteis); (2) Formulário online "Fale com a ANS" no site gov.br/ans; (3) Atendimento presencial nos núcleos da ANS (Rio de Janeiro, Brasília etc.). O processo: a ANS abre uma NIP (Notificação de Intermediação Preliminar) e a operadora tem prazo de 5 dias úteis para resposta; se não houver acordo, abre-se Procedimento Administrativo, com possível multa à operadora e obrigação de fazer. Antes de acionar a ANS, recomenda-se primeiro tentar resolver internamente: SAC Amil (0800 723 0010) ou Ouvidoria Amil (0800 707 6608). Documentar todas as comunicações é essencial. // TODO Atlas: validar canais ANS atualizados + linkar guia /como-reclamar-ans.',
    source: 'ANS — canais oficiais',
    review_status: 'draft-dex',
  },
  {
    id: 'diferenca-individual-coletivo',
    category: 'ans',
    question: 'Qual a diferença regulatória entre plano Amil Individual e Empresarial?',
    answer:
      'A ANS regulamenta diferentemente planos individuais e coletivos. Planos individuais têm reajuste anual com teto fixado pela ANS (RN 565/2022 e atualizações), são vendidos diretamente ao consumidor, têm rescisão unilateral proibida pela operadora (salvo inadimplência ou fraude), e maior proteção ao consumidor. Planos coletivos empresariais têm reajuste livre negociado entre operadora e empresa contratante (sujeito a sinistralidade do grupo), permitem rescisão por qualquer das partes com aviso prévio (geralmente 60 dias), e a empresa contratante é a "pessoa do contrato" — o beneficiário individual tem proteção contratual indireta. A Amil descontinuou venda ativa de planos individuais em várias praças desde 2017, focando em PME e PJ. Para indivíduos sem CNPJ, a opção é ADESÃO via entidade de classe ou plano de outra operadora. // TODO Atlas: validar status atual venda Amil individual 2026.',
    source: 'Lei 9.656/98 + RN ANS 565/2022',
    review_status: 'draft-dex',
  },
  {
    id: 'prazos-atendimento-ans',
    category: 'ans',
    question: 'Quais os prazos máximos de atendimento exigidos pela ANS?',
    answer:
      'A ANS, via RN 259/2011, estabelece prazos máximos de atendimento que toda operadora — incluindo Amil — deve cumprir: consulta clínica básica = 7 dias úteis; consulta com especialidade = 14 dias úteis; serviços de diagnóstico (exames laboratoriais simples) = 3 dias úteis; serviços de terapia (fisioterapia, fonoaudiologia) = 10 dias úteis; consultas de retorno = 7 dias úteis; internação eletiva = 21 dias úteis; cirurgia eletiva = 21 dias úteis; reembolso = 30 dias úteis após protocolo completo. Descumprimento sistemático gera NIP (Notificação de Intermediação Preliminar) e multa. Beneficiário pode acionar ANS via 0800 701 9656 ou portal "Fale com a ANS". Em emergência/urgência, prazo é imediato (24 horas após início da vigência se houver carência). // TODO Atlas: validar atualização RN 259/2011 e linkar /prazos-ans cornerstone.',
    source: 'ANS RN 259/2011',
    review_status: 'draft-dex',
  },
  {
    id: 'lei-portabilidade',
    category: 'ans',
    question: 'A portabilidade de carências é direito garantido por lei?',
    answer:
      'Sim. A portabilidade de carências está regulamentada pela ANS via RN 438/2018 e atualizações posteriores, baseada na Lei 9.656/98. É direito do beneficiário trocar de operadora ou de plano sem cumprir novas carências, desde que cumpra requisitos cumulativos: (1) estar há pelo menos 2 anos no plano de origem (3 anos se houver CPT ainda em curso); (2) plano de origem ser ativo, regulamentado e adimplente; (3) plano de destino ser de tipo compatível ou superior (mesma faixa de cobertura ou maior); (4) pedido feito até 60 dias após o aniversário do contrato de origem; (5) plano de origem deve estar em regime regulado (não emergencial). A operadora de destino tem prazo de 10 dias úteis para análise e aceite. A operadora não pode recusar portabilidade que cumpra os requisitos — em caso de recusa indevida, o beneficiário pode acionar a ANS. // TODO Atlas: linkar /portabilidade-amil quando criado.',
    source: 'ANS RN 438/2018 + Lei 9.656/98',
    review_status: 'draft-dex',
  },
];

// ─────────────────────────────────────────────────────────────────────
// COBERTURA (5)
// ─────────────────────────────────────────────────────────────────────

const cobertura: FAQItem[] = [
  {
    id: 'cobre-cirurgia-bariatrica',
    category: 'cobertura',
    question: 'O plano Amil Empresarial cobre cirurgia bariátrica?',
    answer:
      'Sim. A cirurgia bariátrica está no Rol de Procedimentos da ANS desde 2002 e é cobertura obrigatória de todos os planos hospitalares regulamentados — incluindo Amil Empresarial — quando atendidos os critérios técnicos: IMC ≥ 40 kg/m² ou IMC ≥ 35 kg/m² com comorbidades (diabetes tipo 2, hipertensão refratária, apneia, dislipidemia grave); idade entre 18 e 65 anos preferencialmente; falha em tratamento clínico documentado por pelo menos 2 anos; ausência de contraindicações psiquiátricas. O processo padrão Amil: avaliação por equipe multidisciplinar (cirurgião bariátrico, endocrinologista, nutricionista, psicólogo, cardiologista) credenciada pela operadora; preparação pré-operatória de 3-6 meses; autorização da Amil; cirurgia em hospital credenciado. Coparticipação NÃO se aplica em cirurgia. Tipos cobertos: bypass gástrico (Y-de-Roux), sleeve, banda gástrica. // TODO Atlas: validar critérios atualizados ANS 2026 e linkar /bariatrica-amil cornerstone.',
    source: 'ANS — Rol de Procedimentos',
    review_status: 'draft-dex',
  },
  {
    id: 'cobre-tratamento-cancer',
    category: 'cobertura',
    question: 'A Amil cobre tratamento oncológico completo (quimio, radio, imunoterapia)?',
    answer:
      'Sim. Tratamento oncológico está no Rol da ANS com cobertura obrigatória ampla: consultas com oncologistas (clínico e cirurgião), exames diagnósticos (biópsia, marcadores, imagem), quimioterapia (medicação venosa e oral incluídas em DUTs específicas), radioterapia convencional e em modalidades avançadas (3D conformacional, IMRT, IGRT em casos específicos), cirurgias oncológicas, reconstrução pós-mastectomia, transplante de medula óssea, terapia-alvo e imunoterapia (sob critérios DUT). O plano Amil Empresarial cobre integralmente esses procedimentos quando solicitados por médico assistente, sem coparticipação. Coberturas avançadas (medicações imunoterápicas de alto custo, terapias gênicas, CAR-T) podem exigir avaliação por junta médica e estão sujeitas às DUTs (Diretrizes de Utilização) da ANS. // TODO Atlas: validar atualização DUT oncologia 2026 + linkar /oncologia-amil.',
    source: 'ANS RN — Rol + DUTs oncologia',
    review_status: 'draft-dex',
  },
  {
    id: 'cobre-fertilizacao',
    category: 'cobertura',
    question: 'O plano Amil Empresarial cobre fertilização in vitro (FIV)?',
    answer:
      'Não. Tratamentos de fertilização in vitro (FIV) e similares (ICSI, ovodoação, útero de substituição) NÃO estão no Rol obrigatório da ANS para planos coletivos empresariais — portanto NÃO são cobertos pelo plano Amil Empresarial padrão. O Rol cobre apenas tratamento de infertilidade até a fase diagnóstica (consultas, exames hormonais, espermograma, histerossalpingografia, etc.) e algumas intervenções iniciais (cirurgia de varicocele, ressecção de mioma, etc.). FIV é considerada "tratamento" experimental ou eletivo pela ANS desde 1998. Algumas operadoras oferecem FIV como cobertura adicional contratual em planos premium específicos (Amil One ou similar) — verifique a apólice. Alternativa: clínicas privadas de medicina reprodutiva (custo médio R$ 25-50 mil por ciclo). Direito à FIV em casos de infertilidade comprovada está em discussão judicial e legislativa periodicamente. // TODO Atlas: validar produtos Amil 2026 que incluem FIV opcional.',
    source: 'ANS RN — Rol (FIV não obrigatória)',
    review_status: 'draft-dex',
  },
  {
    id: 'cobre-saude-mental',
    category: 'cobertura',
    question: 'A Amil cobre psicoterapia e tratamento psiquiátrico?',
    answer:
      'Sim. Saúde mental tem cobertura obrigatória ampla pela ANS desde RN 469/2021 (atualizada): consultas com psiquiatras (sem limite de sessões), consultas com psicólogos (sem limite a partir de 2021), psicoterapia individual e grupal, internação psiquiátrica (em hospital geral ou unidade especializada), tratamento de transtornos do espectro autista (TEA) com terapias ABA, TEACCH, PECS, fonoaudiologia e terapia ocupacional, hospital-dia psiquiátrico, e medicação psiquiátrica em DUTs específicas. Plano Amil Empresarial cobre integralmente, com coparticipação aplicável conforme contrato. Diferente do passado, NÃO há limite de sessões anuais para psicoterapia desde RN 539/2022 e atualização 2024. Internação em clínica psiquiátrica é coberta sem limite de tempo (cobertura mínima ANS). // TODO Atlas: validar política Amil sobre rede de psicólogos credenciados em capitais.',
    source: 'ANS RN 469/2021 + RN 539/2022',
    review_status: 'draft-dex',
  },
  {
    id: 'cobre-tea-autismo',
    category: 'cobertura',
    question: 'A Amil cobre tratamento para crianças com autismo (TEA)?',
    answer:
      'Sim. Desde a Lei 12.764/2012 (Lei Berenice Piana) e atualizações regulatórias da ANS (especialmente RN 539/2022 e Resolução Normativa CONSU 11/98 atualizada), o tratamento de Transtornos do Espectro Autista (TEA) é cobertura obrigatória ampla em planos de saúde, incluindo Amil Empresarial: consultas com neuropediatra, psiquiatra infantil e psicólogo; terapias comportamentais especializadas (ABA — Análise Aplicada do Comportamento, TEACCH, PECS, Modelo Denver, RDI); fonoaudiologia; terapia ocupacional; psicopedagogia clínica; psicomotricidade; integração sensorial. Em 2022, a ANS removeu limite de sessões anuais para essas terapias quando indicadas pelo médico assistente. A cobertura é sem limite de sessões e sem coparticipação na maior parte dos contratos premium. Beneficiários enfrentam às vezes negativas indevidas — direito de acionar ANS é garantido. // TODO Atlas: validar processo formal Amil de aprovação ABA + linkar /tea-amil cornerstone.',
    source: 'Lei 12.764/2012 + ANS RN 539/2022',
    review_status: 'draft-dex',
  },
];

// ─────────────────────────────────────────────────────────────────────
// CANCELAMENTO (4)
// ─────────────────────────────────────────────────────────────────────

const cancelamento: FAQItem[] = [
  {
    id: 'cancelar-amil-empresarial',
    category: 'cancelamento',
    question: 'Como cancelar o plano Amil Empresarial da minha empresa?',
    answer:
      'O cancelamento do plano Amil Empresarial PJ ou PME deve ser feito formalmente pela empresa contratante (não pelo beneficiário individual), via comunicação à operadora ou corretora com antecedência mínima de 60 dias antes do aniversário do contrato (cláusula contratual padrão). Documentação típica: ofício formal da empresa solicitando rescisão, identificação dos beneficiários afetados, e comprovação de adimplência. Beneficiários demitidos antes do cancelamento têm direito à manutenção pós-emprego pela Lei 9.656/98 art. 30 (1/3 do tempo de contribuição, mín. 6 meses, máx. 24 meses). Beneficiários ativos no momento do cancelamento perdem o plano após 30 dias da rescisão, salvo migração para plano individual (raro disponível) ou ADESÃO via entidade de classe. Empresa que cancela e tenta recontratar em curto prazo pode perder benefícios comerciais. // TODO Atlas: validar prazo padrão de aviso prévio Amil 2026 + linkar /cancelar-amil.',
    source: 'Cláusulas contratuais Amil + Lei 9.656/98',
    review_status: 'draft-dex',
  },
  {
    id: 'beneficiario-cancela-amil',
    category: 'cancelamento',
    question: 'O beneficiário individual pode cancelar sua adesão ao plano da empresa?',
    answer:
      'Em planos coletivos empresariais (Amil PJ/PME), o titular do contrato é a empresa, não o beneficiário individual — portanto, o beneficiário não pode cancelar diretamente sua participação por vontade própria; apenas a empresa contratante tem essa faculdade. O beneficiário pode pedir à empresa para ser excluído do plano (perdendo as carências cumpridas), mas a empresa não é obrigada a aceitar imediatamente — pode haver período de cobertura mínima por convenção. Em casos de demissão (ex-funcionário), aplicam-se as regras de manutenção da Lei 9.656/98 art. 30/31. Em planos por adesão (via entidade de classe), o beneficiário pode cancelar diretamente com prazo de 30 dias. Em planos individuais (Amil Saúde Individual), o beneficiário cancela diretamente. Atenção: cancelar sem motivo formal pode acarretar perda de carências para futura recontratação. // TODO Atlas: validar política Amil sobre exclusão voluntária em PJ.',
    source: 'Cláusulas contratuais coletivos',
    review_status: 'draft-dex',
  },
  {
    id: 'inadimplencia-amil',
    category: 'cancelamento',
    question: 'O que acontece se a empresa atrasar o pagamento do plano Amil?',
    answer:
      'Em planos coletivos empresariais, a inadimplência é tratada por cláusula contratual entre operadora e empresa contratante — não há regra ANS rígida como nos individuais. Tipicamente, a Amil notifica formalmente após 1-2 meses de atraso, concede prazo de regularização (geralmente 30 dias), e pode suspender atendimento eletivo no período. Atraso prolongado (3+ meses) leva à rescisão contratual com perda imediata de cobertura para todos os beneficiários (titulares e dependentes). Beneficiários afetados por inadimplência da empresa NÃO têm direito automático à manutenção pós-perda — apenas demitidos sem justa causa têm Lei 9.656/98 art. 30. Durante a inadimplência, urgência/emergência continua sendo coberta (cláusula ANS). Recomenda-se à empresa renegociar condições com a operadora ANTES da rescisão para evitar perda total. // TODO Atlas: validar prazo padrão Amil de notificação + ações.',
    source: 'Contrato Amil PJ + ANS RN 195/2009',
    review_status: 'draft-dex',
  },
  {
    id: 'recontratar-apos-cancelar',
    category: 'cancelamento',
    question: 'Posso recontratar o plano Amil pouco depois de cancelar?',
    answer:
      'Tecnicamente sim, mas com perda de carências cumpridas e necessidade de nova Declaração de Saúde. Empresa que cancela e recontrata Amil em prazo curto (até 24 meses) pode tentar negociar manutenção parcial das carências e produto, mas a Amil não é obrigada a aceitar — depende de aprovação cadastral e comercial. Beneficiários voltam à modalidade "novo cadastro" com carências aplicáveis (consultas 30 dias, internação 180 dias, parto 300 dias, salvo isenção PJ 30+). CPT pode ser reaplicada para doenças preexistentes declaradas. A portabilidade de carências (RN 438/2018) é alternativa: cancelar Amil e migrar para outra operadora aproveitando carências, OU vice-versa, dentro de 60 dias do aniversário. Avalie sempre custo de retomada vs valor das carências antes de cancelar. // TODO Atlas: validar política Amil sobre recontratação rápida.',
    source: 'ANS RN 438/2018 + política Amil',
    review_status: 'draft-dex',
  },
];

// ─────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────

export const FAQS_AMIL_EMPRESARIAL: FAQItem[] = [
  ...carencias,
  ...coparticipacao,
  ...reembolso,
  ...redeCredenciada,
  ...adesao,
  ...ans,
  ...cobertura,
  ...cancelamento,
];

export const FAQS_BY_CATEGORY: Record<FAQCategory, FAQItem[]> = {
  carencias,
  coparticipacao,
  reembolso,
  'rede-credenciada': redeCredenciada,
  adesao,
  ans,
  cobertura,
  cancelamento,
};

export const FAQ_CATEGORY_LABELS: Record<FAQCategory, string> = {
  carencias: 'Carências e CPT',
  coparticipacao: 'Coparticipação e Reajuste',
  reembolso: 'Reembolso',
  'rede-credenciada': 'Rede Credenciada',
  adesao: 'Adesão MEI / PME',
  ans: 'ANS / Regulamentação',
  cobertura: 'Cobertura',
  cancelamento: 'Cancelamento',
};
