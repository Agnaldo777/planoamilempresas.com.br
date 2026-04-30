/**
 * 8 perguntas frequentes do hub `/rede-credenciada` (Story 7.2 AC5).
 *
 * Estrutura para FAQPage schema JSON-LD (Schema.org Question/Answer).
 * Copy escrito para captura de Featured Snippet + voice search.
 *
 * Não usar CMS aqui (Sanity é Story 5.x); content estático melhora
 * build-time SSG e elimina request runtime.
 *
 * Story 7.2 referência: ADR-006 §"5 Mitigações" mit. 1 (disclaimer
 * canônico embutido em algumas respostas para reforçar compliance).
 */

export interface FAQItem {
  /** Pergunta em formato H3 (snippet-friendly). */
  question: string;
  /** Resposta em parágrafo único, 40-80 palavras (Featured Snippet target). */
  answer: string;
}

/**
 * 8 perguntas canônicas do hub. Ordem importa (primeira = mais buscada).
 *
 * Critérios de seleção:
 * 1. "como funciona" / "o que é" → onboarding (Q1, Q2)
 * 2. "como saber" / "como descobrir" → search intent direto (Q3, Q4)
 * 3. "diferença entre" → produto comparativo (Q5)
 * 4. "atualização" / "freshness" → confiança (Q6)
 * 5. "área de cobertura" → geografia (Q7)
 * 6. "se mudar de cidade" → caso de uso (Q8)
 */
export const REDE_CREDENCIADA_FAQS: readonly FAQItem[] = [
  {
    question: 'O que é a rede credenciada Amil?',
    answer:
      'A rede credenciada Amil é o conjunto de hospitais, laboratórios, clínicas, prontos-socorros e profissionais de saúde que aceitam atendimento via planos da Amil Assistência Médica Internacional. Atualmente inclui mais de 9 mil prestadores cadastrados em 26 estados brasileiros. Cada produto Amil (S380, S450, S580, S750, ONE Black, etc.) tem rede específica — sempre verifique no app oficial Amil antes de cada procedimento.',
  },
  {
    question: 'Como saber se um hospital aceita meu plano Amil?',
    answer:
      'Você pode buscar pelo nome do hospital, cidade ou bairro neste site (campo de busca acima) ou pelo aplicativo oficial Amil (disponível para iOS e Android). Cada prestador exibe explicitamente quais redes/produtos Amil aceita. Importante: nem todo prestador aceita todos os produtos — confirme sempre a cobertura específica do seu plano antes de procedimentos.',
  },
  {
    question: 'Como funciona a busca por cidade ou bairro?',
    answer:
      'Digite o nome da cidade, bairro ou prestador no campo de busca. O sistema retorna hospitais, laboratórios e clínicas próximos com filtros por tipo de atendimento (Hospital, Laboratório, Clínica, Diagnóstico, etc.) e por produto Amil. Os resultados consideram apenas prestadores com cadastro ativo na Amil no último snapshot do dataset oficial.',
  },
  {
    question: 'A rede credenciada é a mesma em todo o Brasil?',
    answer:
      'Não. A cobertura varia significativamente por estado: Rio de Janeiro tem aproximadamente 3,7 mil prestadores, São Paulo cerca de 3 mil, Distrito Federal 447, e estados do Norte (AM, AP, RR) têm cobertura mais limitada. Antes de contratar, confirme se sua cidade tem cobertura adequada ao seu perfil de uso.',
  },
  {
    question: 'Qual a diferença entre os produtos Amil S380, S450, S580, S750 e ONE Black?',
    answer:
      'A numeração reflete o tamanho da rede credenciada: S380 (rede mais enxuta, preço menor), S450 e S580 (intermediários), S750 (rede ampla), e ONE Black/S6500 (rede premium, top hospitais). QC = enfermaria; QP = quarto privativo. Cada produto tem coparticipação e abrangência geográfica próprias — consulte tabela de preços e simule sua cotação.',
  },
  {
    question: 'Com que frequência a lista de prestadores é atualizada?',
    answer:
      'A Amil atualiza diariamente sua base oficial. Este site sincroniza com o dataset público da Amil mensalmente (primeira semana de cada mês). Por isso, sempre confirme no aplicativo Amil ou ligando para o prestador antes de comparecer — descredenciamentos pontuais podem ocorrer entre nossas atualizações.',
  },
  {
    question: 'Posso usar a rede credenciada em qualquer estado do Brasil?',
    answer:
      'Depende da abrangência contratual do seu plano. Planos com abrangência nacional (geralmente S750 e superiores) cobrem qualquer prestador credenciado no Brasil. Planos regionais (alguns S380/S450) cobrem apenas o estado de contratação. Sempre confirme a abrangência específica no seu contrato antes de viagens ou mudanças permanentes de endereço.',
  },
  {
    question: 'O que acontece se eu mudar de cidade ou estado?',
    answer:
      'Se seu plano tem abrangência nacional, você usa imediatamente a rede credenciada da nova cidade. Se for regional, será necessário portar o plano (sem nova carência) ou contratar plano novo na cidade de destino. Para mudanças permanentes, recomendamos consultar antecipadamente a cobertura na nova região via este site ou app Amil.',
  },
] as const;
