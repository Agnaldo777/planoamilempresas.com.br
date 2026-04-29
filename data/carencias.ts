/**
 * data/carencias.ts — Story 3.20 (FR39)
 *
 * Fonte canônica de carências aplicáveis ao plano Amil Empresarial.
 *
 * **Estratégia regulatória:** este dataset usa os limites MÁXIMOS legais
 * permitidos pela ANS (RN 195/2009 + atualizações da RN 438/2018 e
 * RN 593/2024) como referência conservadora. Planos Amil específicos
 * podem oferecer prazos menores (PME 30+ vidas tipicamente isenta carência);
 * placeholders `// Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)`
 * marcam onde a Promo comercial pode otimizar. NUNCA inventar prazos
 * específicos da Amil sem fonte verificável (NFR23).
 *
 * **Compliance:**
 *   - NFR23: revisão humana obrigatória — todo prazo aqui é mínimo ANS
 *   - ADR-006: Amil não aparece em nomes/IDs (apenas como referência)
 *   - Story 2.4: advogado revisor co-sign antes de deploy
 *
 * **Fontes:**
 *   - RN 195/2009: https://www.gov.br/ans/pt-br/assuntos/legislacao
 *   - RN 438/2018 (portabilidade): https://www.gov.br/ans/pt-br
 *   - RN 593/2024 (atualização rol procedimentos): https://www.gov.br/ans/pt-br
 */

export type CarenciaCategoriaKey =
  | 'urgenciaEmergencia'
  | 'consultasEletivas'
  | 'examesSimples'
  | 'examesComplexos'
  | 'internacoesClinicas'
  | 'internacoesCirurgicas'
  | 'altaComplexidade'
  | 'parto'
  | 'cpt';

export interface CarenciaItem {
  /** Chave estável do item (usada em React keys e URLs futuras). */
  id: CarenciaCategoriaKey;
  /** Categoria legível (label exibido na UI). */
  categoria: string;
  /** Carência mínima legal em DIAS (ANS). */
  dias: number;
  /** Descrição do que cobre + nuances regulatórias. */
  descricao: string;
  /** Base legal (ex: 'RN 195/2009 art. 12'). */
  baseLegal: string;
  /** Comentário de Promo Amil (validar via Story 6.x antes de afirmar). */
  notaAmil?: string;
}

/**
 * Tabela de carências canônica — limites máximos ANS RN 195/2009.
 *
 * **IMPORTANTE:** este é o "pior caso" legal. PME 30+ vidas geralmente
 * tem isenção total negociada comercialmente. Apresentar como REFERÊNCIA
 * + disclaimer "Sua empresa pode ter isenção via PME 30+" + CTA cotação
 * personalizada.
 */
export const CARENCIAS_AMIL = {
  urgenciaEmergencia: {
    id: 'urgenciaEmergencia',
    categoria: 'Urgência e Emergência',
    dias: 0,
    descricao:
      'Atendimento de urgência (acidente pessoal ou complicação gestacional) e emergência (risco imediato à vida). A ANS permite até 24h de carência; planos Amil PME comumente aplicam carência zero.',
    baseLegal: 'RN 195/2009 art. 12 §I + RN 13/1998 + RN 259/2011',
    // Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)
    // RN 13/1998 e RN 259/2011 garantem atendimento de urgência/emergência em até 12h após decorridas as 24h iniciais.
    notaAmil:
      'Carência ANS de até 24h (RN 195/2009 art. 12 §I). Após 24h da vigência, atendimento de urgência/emergência deve ser garantido em até 12h (RN 13/1998 + RN 259/2011). Em PME 30+ vidas, isenção total é prática comercial padrão.',
  },
  consultasEletivas: {
    id: 'consultasEletivas',
    categoria: 'Consultas Eletivas',
    dias: 30,
    descricao:
      'Consultas médicas eletivas com profissionais da rede credenciada (clínico geral, especialistas). PME 30+ vidas geralmente isenta. Em PME pequena (2-29 vidas), até 30 dias.',
    baseLegal: 'RN 195/2009 art. 12',
    // Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)
    // TODO Atlas: confirmar campanha "Promo Amil" vigente 2026 com tabela kitcorretoramil.com.br
    notaAmil:
      'Carência ANS de 30 dias é o teto legal. Em adesões PME 30+ vidas, isenção total é prática comercial padrão da Amil; em PME 2-29 vidas, prazo pode ser reduzido por campanha comercial vigente (validar com proposta).',
  },
  examesSimples: {
    id: 'examesSimples',
    categoria: 'Exames Simples',
    dias: 30,
    descricao:
      'Exames laboratoriais e de imagem de baixa complexidade (raio-X, ultrassom, hemograma, EAS). Carência ANS de até 30 dias.',
    baseLegal: 'RN 195/2009 art. 12',
    // Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)
    // TODO Atlas: confirmar campanha "Promo Amil" vigente 2026 com tabela kitcorretoramil.com.br
    notaAmil:
      'Limite ANS de 30 dias. Mesma carência aplicada a consultas eletivas em planos coletivos Amil; PME 30+ vidas tipicamente isenta integralmente.',
  },
  examesComplexos: {
    id: 'examesComplexos',
    categoria: 'Exames Complexos',
    dias: 180,
    descricao:
      'Exames de alta complexidade (ressonância magnética, tomografia, endoscopia, cintilografia). Carência ANS de até 180 dias.',
    baseLegal: 'RN 195/2009 art. 12',
    // Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)
    // TODO Atlas: confirmar campanha "Promo Amil" vigente 2026 com tabela kitcorretoramil.com.br
    notaAmil:
      'Limite ANS de 180 dias. Em PME 30+ vidas, isenção total é prática comercial padrão; demais portes seguem o teto legal salvo Promo vigente.',
  },
  internacoesClinicas: {
    id: 'internacoesClinicas',
    categoria: 'Internações Clínicas',
    dias: 180,
    descricao:
      'Internações clínicas eletivas (não-cirúrgicas) em enfermaria ou apartamento, conforme acomodação contratada. Carência ANS de até 180 dias.',
    baseLegal: 'RN 195/2009 art. 12',
    // Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)
    // RN 13/1998 + RN 259/2011 garantem atendimento de urgência em até 12h, mesmo em internações clínicas com indicação emergencial.
    notaAmil:
      'Internação clínica eletiva: até 180 dias (limite ANS). Internação por urgência ou emergência segue o regime de Urgência/Emergência (RN 13/1998 + RN 259/2011, atendimento garantido em até 12h).',
  },
  internacoesCirurgicas: {
    id: 'internacoesCirurgicas',
    categoria: 'Internações Cirúrgicas',
    dias: 180,
    descricao:
      'Internações cirúrgicas eletivas (não-emergenciais). Inclui cirurgias programadas, materiais e diárias. Carência ANS de até 180 dias.',
    baseLegal: 'RN 195/2009 art. 12',
    // Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)
    // RN 13/1998 + RN 259/2011 garantem atendimento de urgência cirúrgica em até 12h.
    notaAmil:
      'Cirurgia eletiva: até 180 dias (limite ANS). Cirurgia em situação de urgência/emergência segue regime próprio (RN 13/1998 + RN 259/2011), com atendimento em até 12h independentemente de carência.',
  },
  altaComplexidade: {
    id: 'altaComplexidade',
    categoria: 'Procedimentos de Alta Complexidade',
    dias: 180,
    descricao:
      'Procedimentos de alta complexidade (PAC): oncologia, cardiologia intervencionista, transplantes, terapias renais. Quando vinculados a DLP, sujeito a CPT (24 meses).',
    baseLegal: 'RN 195/2009 + RN 593/2024 (rol)',
    // Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)
    // CPT (RN 162/2007) suspende cobertura PAC vinculada a DLP por até 24 meses, independentemente do prazo de carência geral.
    notaAmil:
      'Limite ANS de 180 dias para PAC sem vínculo a DLP. Em caso de Doença ou Lesão Preexistente declarada, aplica-se CPT por até 24 meses (RN 162/2007). PME 30+ vidas tipicamente isenta a carência regular, mas a CPT por DLP é regulatória e não negociável.',
  },
  parto: {
    id: 'parto',
    categoria: 'Parto a Termo (Obstetrícia)',
    dias: 300,
    descricao:
      'Parto a termo (≥38 semanas) — vaginal ou cesárea, com cobertura obstétrica. Parto prematuro com complicações é tratado como urgência (carência 0/24h). PME 30+ vidas geralmente isenta.',
    baseLegal: 'RN 195/2009 art. 12 §III',
    // Plano específico Amil pode oferecer prazos menores via Promo (Story 6.x)
    // Prazo de 300 dias é o teto legal ANS (RN 195/2009 art. 12 §III) para parto a termo em planos com segmentação obstetrícia.
    notaAmil:
      'Carência máxima ANS de 300 dias para parto a termo (RN 195/2009 art. 12 §III). Parto prematuro ou complicação gestacional é classificado como urgência/emergência (carência reduzida). Em PME 30+ vidas, isenção integral é prática comercial padrão.',
  },
  cpt: {
    id: 'cpt',
    categoria: 'CPT (Cobertura Parcial Temporária)',
    dias: 720,
    descricao:
      'Cobertura Parcial Temporária para Doenças e Lesões Preexistentes (DLP) declaradas: suspende cobertura de Procedimentos de Alta Complexidade (PAC), leitos de alta tecnologia e cirurgias relacionadas à condição por até 24 meses.',
    baseLegal: 'RN 162/2007 + RN 195/2009',
    // Prazo padrão CPT é 24 meses (720 dias) conforme RN 162/2007 art. 5º — não negociável comercialmente.
    notaAmil:
      'Prazo padrão de 24 meses (RN 162/2007 art. 5º). Aplica-se exclusivamente a PAC, leitos de alta tecnologia e cirurgias vinculadas à DLP declarada — demais coberturas seguem carência geral. CPT exige Declaração de Saúde formal na adesão; omissão de DLP pode caracterizar fraude e ensejar rescisão contratual unilateral pela operadora.',
  },
} as const satisfies Record<CarenciaCategoriaKey, CarenciaItem>;

/**
 * Lista ordenada por carência crescente — útil para renderizar tabela
 * na UI do `<CarenciaCalculator />` em ordem "do que libera mais cedo
 * para o que libera mais tarde".
 */
export const CARENCIAS_AMIL_ORDENADAS: readonly CarenciaItem[] = Object.values(
  CARENCIAS_AMIL,
).sort((a, b) => a.dias - b.dias);

/**
 * Helper — soma `dias` à `dataInicio` (UTC-safe, sem timezone drift)
 * e retorna nova `Date`. Usado pelo CarenciaCalculator para computar
 * data prevista de liberação.
 *
 * @param dataInicio Data de contratação (vigência do contrato).
 * @param dias       Carência em dias (≥ 0).
 * @returns          Data prevista da liberação da cobertura.
 */
export function adicionarDias(dataInicio: Date, dias: number): Date {
  const result = new Date(dataInicio.getTime());
  result.setUTCDate(result.getUTCDate() + dias);
  return result;
}

/**
 * Formata Date em string pt-BR `dd/mm/yyyy`. Usa UTC para evitar
 * drift de timezone (relevante apesar de BR não ter DST).
 */
export function formatarDataBR(date: Date): string {
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = date.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Parse string `yyyy-mm-dd` (formato `<input type="date">`) → Date UTC.
 * Retorna `null` se inválido.
 */
export function parseDataInput(input: string): Date | null {
  if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return null;
  const [yearStr, monthStr, dayStr] = input.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}
