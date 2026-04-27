// =============================================================================
// TABELAS DE PREÇOS — AMIL EMPRESARIAL (PME)
// Fonte: tabelas oficiais fornecidas pela Amil ao corretor autorizado.
// Atualização: editar apenas os valores nos objetos TABELA_XX abaixo.
// Todos os planos: "Exceto MEI" (exceptoMEI = true).
// =============================================================================

// ---------- Tipos ----------

export type FaixaEtaria =
  | '00 a 18'
  | '19 a 23'
  | '24 a 28'
  | '29 a 33'
  | '34 a 38'
  | '39 a 43'
  | '44 a 48'
  | '49 a 53'
  | '54 a 58'
  | '59 ou +'

export const FAIXAS_ETARIAS = [
  '00 a 18',
  '19 a 23',
  '24 a 28',
  '29 a 33',
  '34 a 38',
  '39 a 43',
  '44 a 48',
  '49 a 53',
  '54 a 58',
  '59 ou +',
] as const satisfies readonly FaixaEtaria[]

export type Segmentacao =
  | 'Bronze'
  | 'Bronze Mais'
  | 'Prata'
  | 'Ouro'
  | 'Platinum'
  | 'Platinum Mais'

export type Acomodacao = 'QC' | 'QP'
export type Abrangencia = 'Grupo de Municípios' | 'Nacional'

export interface PlanoAmil {
  id: string
  nome: string
  segmentacao: Segmentacao
  acomodacao: Acomodacao
  abrangencia: Abrangencia
  coparticipacaoPct: number
  reembolso: boolean
  exceptoMEI: boolean
  precos: Record<FaixaEtaria, number>
}

export interface TabelaEstadoAmil {
  estado: string
  sigla: string
  atualizadoEm: string
  planos: PlanoAmil[]
}

// Helper tipado: recebe exatamente 10 valores, na ordem das FAIXAS_ETARIAS.
type DezValores = [number, number, number, number, number, number, number, number, number, number]

function precos(...valores: DezValores): Record<FaixaEtaria, number> {
  return Object.fromEntries(
    FAIXAS_ETARIAS.map((faixa, i) => [faixa, valores[i]]),
  ) as Record<FaixaEtaria, number>
}

// =============================================================================
// SP — SÃO PAULO (copart. 30%)
// =============================================================================
export const TABELA_SP: TabelaEstadoAmil = {
  estado: 'São Paulo',
  sigla: 'SP',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'sp-bronze-qc', nome: 'Bronze QC', segmentacao: 'Bronze', acomodacao: 'QC', abrangencia: 'Grupo de Municípios', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(111.15, 150.94, 177.19, 177.19, 177.19, 197.92, 273.33, 326.36, 469.31, 665.48) },
    { id: 'sp-bronze-mais-qc', nome: 'Bronze Mais QC', segmentacao: 'Bronze Mais', acomodacao: 'QC', abrangencia: 'Grupo de Municípios', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(134.54, 182.71, 214.48, 214.48, 214.48, 239.57, 330.85, 395.03, 568.05, 805.49) },
    { id: 'sp-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(235.92, 276.03, 336.76, 404.11, 424.32, 466.75, 583.44, 641.78, 802.23, 1403.90) },
    { id: 'sp-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(261.87, 306.39, 373.80, 448.56, 470.99, 518.09, 647.61, 712.37, 890.46, 1558.31) },
    { id: 'sp-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(295.31, 345.51, 421.52, 505.82, 531.11, 584.22, 730.28, 803.31, 1004.14, 1757.25) },
    { id: 'sp-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(327.80, 383.53, 467.91, 561.49, 589.56, 648.52, 810.65, 891.72, 1114.65, 1950.64) },
    { id: 'sp-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(452.14, 529.00, 645.38, 774.46, 813.18, 894.50, 1118.13, 1229.94, 1537.43, 2690.50) },
    { id: 'sp-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(456.63, 534.26, 651.80, 782.16, 821.27, 903.40, 1129.25, 1242.18, 1552.73, 2717.28) },
  ],
}

// =============================================================================
// RJ — RIO DE JANEIRO (copart. 30%)
// =============================================================================
export const TABELA_RJ: TabelaEstadoAmil = {
  estado: 'Rio de Janeiro',
  sigla: 'RJ',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'rj-bronze-qc', nome: 'Bronze QC', segmentacao: 'Bronze', acomodacao: 'QC', abrangencia: 'Grupo de Municípios', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(129.67, 176.09, 206.71, 206.71, 206.71, 230.90, 318.87, 380.73, 547.49, 776.34) },
    { id: 'rj-bronze-mais-qc', nome: 'Bronze Mais QC', segmentacao: 'Bronze Mais', acomodacao: 'QC', abrangencia: 'Grupo de Municípios', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(179.83, 210.40, 256.69, 308.03, 323.43, 355.77, 444.71, 489.18, 611.48, 1070.09) },
    { id: 'rj-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(208.34, 243.76, 297.39, 356.87, 374.71, 412.18, 515.23, 566.75, 708.44, 1239.77) },
    { id: 'rj-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(231.26, 270.57, 330.10, 396.12, 415.93, 457.52, 571.90, 629.09, 786.36, 1376.13) },
    { id: 'rj-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(239.99, 280.79, 342.56, 411.07, 431.62, 474.78, 593.48, 652.83, 816.04, 1428.07) },
    { id: 'rj-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(266.39, 311.68, 380.25, 456.30, 479.12, 527.03, 658.79, 724.67, 905.84, 1585.22) },
    { id: 'rj-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(322.31, 377.10, 460.06, 552.07, 579.67, 637.64, 797.05, 876.76, 1095.95, 1917.91) },
    { id: 'rj-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(325.51, 380.85, 464.64, 557.57, 585.45, 644.00, 805.00, 885.50, 1106.88, 1937.04) },
  ],
}

// =============================================================================
// MG — MINAS GERAIS (copart. 40%, sem Bronze)
// =============================================================================
export const TABELA_MG: TabelaEstadoAmil = {
  estado: 'Minas Gerais',
  sigla: 'MG',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'mg-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(171.20, 200.30, 244.37, 293.24, 307.90, 338.69, 423.36, 465.70, 582.13, 1018.73) },
    { id: 'mg-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(190.04, 222.35, 271.27, 325.52, 341.80, 375.98, 469.98, 516.98, 646.23, 1130.90) },
    { id: 'mg-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(218.18, 255.27, 311.43, 373.72, 392.41, 431.65, 539.56, 593.52, 741.90, 1298.33) },
    { id: 'mg-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(242.17, 283.34, 345.67, 414.80, 435.54, 479.09, 598.86, 658.75, 823.44, 1441.02) },
    { id: 'mg-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(291.02, 340.49, 415.40, 498.48, 523.40, 575.74, 719.68, 791.65, 989.56, 1731.73) },
    { id: 'mg-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(293.90, 343.86, 419.51, 503.41, 528.58, 581.44, 726.80, 799.48, 999.35, 1748.86) },
  ],
}

// =============================================================================
// PR — PARANÁ (copart. 40%, com Bronze)
// =============================================================================
export const TABELA_PR: TabelaEstadoAmil = {
  estado: 'Paraná',
  sigla: 'PR',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'pr-bronze-qc', nome: 'Bronze QC', segmentacao: 'Bronze', acomodacao: 'QC', abrangencia: 'Grupo de Municípios', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(147.74, 200.63, 235.52, 235.52, 235.52, 263.08, 363.31, 433.79, 623.79, 884.53) },
    { id: 'pr-bronze-qp', nome: 'Bronze QP', segmentacao: 'Bronze', acomodacao: 'QP', abrangencia: 'Grupo de Municípios', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(163.99, 222.70, 261.43, 261.43, 261.43, 292.02, 403.28, 481.52, 692.43, 981.87) },
    { id: 'pr-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(221.76, 259.46, 316.54, 379.85, 398.84, 438.72, 548.40, 603.24, 754.05, 1319.59) },
    { id: 'pr-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(246.16, 288.01, 351.37, 421.64, 442.72, 486.99, 608.74, 669.61, 837.01, 1464.77) },
    { id: 'pr-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(252.17, 295.04, 359.95, 431.94, 453.54, 498.89, 623.61, 685.97, 857.46, 1500.56) },
    { id: 'pr-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(279.91, 327.49, 399.54, 479.45, 503.42, 553.76, 692.20, 761.42, 951.78, 1665.62) },
    { id: 'pr-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(325.82, 381.21, 465.08, 558.10, 586.01, 644.61, 805.76, 886.34, 1107.93, 1938.88) },
    { id: 'pr-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(329.05, 384.99, 469.69, 563.63, 591.81, 650.99, 813.74, 895.11, 1118.89, 1958.06) },
  ],
}

// =============================================================================
// SC — SANTA CATARINA (copart. 40%, sem Bronze)
// =============================================================================
export const TABELA_SC: TabelaEstadoAmil = {
  estado: 'Santa Catarina',
  sigla: 'SC',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'sc-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(237.18, 277.50, 338.55, 406.26, 426.57, 469.23, 586.54, 645.19, 806.49, 1411.36) },
    { id: 'sc-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(263.27, 308.03, 375.80, 450.96, 473.51, 520.86, 651.08, 716.19, 895.24, 1566.67) },
    { id: 'sc-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(269.71, 315.56, 384.98, 461.98, 485.08, 533.59, 666.99, 733.69, 917.11, 1604.94) },
    { id: 'sc-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(299.37, 350.26, 427.32, 512.78, 538.42, 592.26, 740.33, 814.36, 1017.95, 1781.41) },
    { id: 'sc-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(332.47, 388.99, 474.57, 569.48, 597.95, 657.75, 822.19, 904.41, 1130.51, 1978.39) },
    { id: 'sc-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(335.77, 392.85, 479.28, 575.14, 603.90, 664.29, 830.36, 913.40, 1141.75, 1998.06) },
  ],
}

// =============================================================================
// RS — RIO GRANDE DO SUL (copart. 40%, sem Bronze)
// =============================================================================
export const TABELA_RS: TabelaEstadoAmil = {
  estado: 'Rio Grande do Sul',
  sigla: 'RS',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'rs-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(263.74, 308.58, 376.47, 451.76, 474.35, 521.79, 652.24, 717.46, 896.83, 1569.45) },
    { id: 'rs-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: false, exceptoMEI: true,
      precos: precos(292.75, 342.52, 417.87, 501.44, 526.51, 579.16, 723.95, 796.35, 995.44, 1742.02) },
    { id: 'rs-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(299.91, 350.89, 428.09, 513.71, 539.40, 593.34, 741.68, 815.85, 1019.81, 1784.67) },
    { id: 'rs-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(332.90, 389.49, 475.18, 570.22, 598.73, 658.60, 823.25, 905.58, 1131.98, 1980.97) },
    { id: 'rs-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(344.10, 402.60, 491.17, 589.40, 618.87, 680.76, 850.95, 936.05, 1170.06, 2047.61) },
    { id: 'rs-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 40, reembolso: true, exceptoMEI: true,
      precos: precos(347.51, 406.59, 496.04, 595.25, 625.01, 687.51, 859.39, 945.33, 1181.66, 2067.91) },
  ],
}

// =============================================================================
// DF — DISTRITO FEDERAL (copart. 30%, com Bronze + Platinum Mais)
// =============================================================================
export const TABELA_DF: TabelaEstadoAmil = {
  estado: 'Distrito Federal',
  sigla: 'DF',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'df-bronze-qc', nome: 'Bronze QC', segmentacao: 'Bronze', acomodacao: 'QC', abrangencia: 'Grupo de Municípios', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(216.17, 293.56, 344.61, 344.61, 344.61, 384.93, 531.59, 634.72, 912.73, 1294.25) },
    { id: 'df-bronze-qp', nome: 'Bronze QP', segmentacao: 'Bronze', acomodacao: 'QP', abrangencia: 'Grupo de Municípios', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(239.95, 325.85, 382.52, 382.52, 382.52, 427.27, 590.06, 704.53, 1013.11, 1436.59) },
    { id: 'df-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(289.90, 339.18, 413.80, 496.56, 521.39, 573.53, 716.91, 788.60, 985.75, 1725.06) },
    { id: 'df-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(321.80, 376.51, 459.34, 551.21, 578.77, 636.65, 795.81, 875.39, 1094.24, 1914.92) },
    { id: 'df-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(323.43, 378.41, 461.66, 553.99, 581.69, 639.86, 799.83, 879.81, 1099.76, 1924.58) },
    { id: 'df-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(359.00, 420.03, 512.44, 614.93, 645.68, 710.25, 887.81, 976.59, 1220.74, 2136.30) },
    { id: 'df-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(381.07, 445.85, 543.94, 652.73, 685.37, 753.91, 942.39, 1036.63, 1295.79, 2267.63) },
    { id: 'df-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(384.85, 450.27, 549.33, 659.20, 692.16, 761.38, 951.73, 1046.90, 1308.63, 2290.10) },
    { id: 'df-platinum-mais-qp-r1', nome: 'Platinum Mais QP R1', segmentacao: 'Platinum Mais', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(473.60, 554.11, 676.01, 811.21, 851.77, 936.95, 1171.19, 1288.31, 1610.39, 2818.18) },
    { id: 'df-platinum-mais-qp-r2', nome: 'Platinum Mais QP R2', segmentacao: 'Platinum Mais', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(478.31, 559.62, 682.74, 819.29, 860.25, 946.28, 1182.85, 1301.14, 1626.43, 2846.25) },
  ],
}

// =============================================================================
// GO — GOIÁS (copart. 30%, sem Bronze, com Platinum Mais)
// =============================================================================
export const TABELA_GO: TabelaEstadoAmil = {
  estado: 'Goiás',
  sigla: 'GO',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'go-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(289.90, 339.18, 413.80, 496.56, 521.39, 573.53, 716.91, 788.60, 985.75, 1725.06) },
    { id: 'go-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(321.80, 376.51, 459.34, 551.21, 578.77, 636.65, 795.81, 875.39, 1094.24, 1914.92) },
    { id: 'go-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(323.43, 378.41, 461.66, 553.99, 581.69, 639.86, 799.83, 879.81, 1099.76, 1924.58) },
    { id: 'go-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(359.00, 420.03, 512.44, 614.93, 645.68, 710.25, 887.81, 976.59, 1220.74, 2136.30) },
    { id: 'go-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(381.07, 445.85, 543.94, 652.73, 685.37, 753.91, 942.39, 1036.63, 1295.79, 2267.63) },
    { id: 'go-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(384.85, 450.27, 549.33, 659.20, 692.16, 761.38, 951.73, 1046.90, 1308.63, 2290.10) },
    { id: 'go-platinum-mais-qp-r1', nome: 'Platinum Mais QP R1', segmentacao: 'Platinum Mais', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(473.60, 554.11, 676.01, 811.21, 851.77, 936.95, 1171.19, 1288.31, 1610.39, 2818.18) },
    { id: 'go-platinum-mais-qp-r2', nome: 'Platinum Mais QP R2', segmentacao: 'Platinum Mais', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(478.31, 559.62, 682.74, 819.29, 860.25, 946.28, 1182.85, 1301.14, 1626.43, 2846.25) },
  ],
}

// =============================================================================
// BA — BAHIA (copart. 30%, sem Bronze)
// =============================================================================
export const TABELA_BA: TabelaEstadoAmil = {
  estado: 'Bahia',
  sigla: 'BA',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'ba-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(349.85, 409.32, 499.37, 599.24, 629.20, 692.12, 865.15, 951.67, 1189.59, 2081.78) },
    { id: 'ba-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(388.33, 454.35, 554.31, 665.17, 698.43, 768.27, 960.34, 1056.37, 1320.46, 2310.81) },
    { id: 'ba-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(385.97, 451.58, 550.93, 661.12, 694.18, 763.60, 954.50, 1049.95, 1312.44, 2296.77) },
    { id: 'ba-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(428.44, 501.27, 611.55, 733.86, 770.55, 847.61, 1059.51, 1165.46, 1456.83, 2549.45) },
    { id: 'ba-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(463.03, 541.75, 660.94, 793.13, 832.79, 916.07, 1145.09, 1259.60, 1574.50, 2755.38) },
    { id: 'ba-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(467.62, 547.12, 667.49, 800.99, 841.04, 925.14, 1156.43, 1272.07, 1590.09, 2782.66) },
  ],
}

// =============================================================================
// PE — PERNAMBUCO (copart. 30%, sem Bronze)
// =============================================================================
export const TABELA_PE: TabelaEstadoAmil = {
  estado: 'Pernambuco',
  sigla: 'PE',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'pe-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(312.22, 365.30, 445.67, 534.80, 561.54, 617.69, 772.11, 849.32, 1061.65, 1857.89) },
    { id: 'pe-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(346.57, 405.49, 494.70, 593.64, 623.32, 685.65, 857.06, 942.77, 1178.46, 2062.31) },
    { id: 'pe-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(399.26, 467.13, 569.90, 683.88, 718.07, 789.88, 987.35, 1086.09, 1357.61, 2375.82) },
    { id: 'pe-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(443.18, 518.52, 632.59, 759.11, 797.07, 876.78, 1095.98, 1205.58, 1506.98, 2637.22) },
    { id: 'pe-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(503.38, 588.95, 718.52, 862.22, 905.33, 995.86, 1244.83, 1369.31, 1711.64, 2995.37) },
    { id: 'pe-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(508.36, 594.78, 725.63, 870.76, 914.30, 1005.73, 1257.16, 1382.88, 1728.60, 3025.05) },
  ],
}

// =============================================================================
// CE — CEARÁ (copart. 30%, sem Bronze)
// =============================================================================
export const TABELA_CE: TabelaEstadoAmil = {
  estado: 'Ceará',
  sigla: 'CE',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'ce-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(213.37, 249.64, 304.56, 365.47, 383.74, 422.11, 527.64, 580.40, 725.50, 1269.63) },
    { id: 'ce-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(236.85, 277.11, 338.07, 405.68, 425.96, 468.56, 585.70, 644.27, 805.34, 1409.35) },
    { id: 'ce-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(286.61, 335.33, 409.10, 490.92, 515.47, 567.02, 708.78, 779.66, 974.58, 1705.52) },
    { id: 'ce-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(318.14, 372.22, 454.11, 544.93, 572.18, 629.40, 786.75, 865.43, 1081.79, 1893.13) },
    { id: 'ce-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(380.55, 445.24, 543.19, 651.83, 684.42, 752.86, 941.08, 1035.19, 1293.99, 2264.48) },
    { id: 'ce-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(384.33, 449.67, 548.60, 658.32, 691.24, 760.36, 950.45, 1045.50, 1306.88, 2287.04) },
  ],
}

// =============================================================================
// MA — MARANHÃO (copart. 30%, sem Bronze)
// =============================================================================
export const TABELA_MA: TabelaEstadoAmil = {
  estado: 'Maranhão',
  sigla: 'MA',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'ma-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(402.33, 470.73, 574.29, 689.15, 723.61, 795.97, 994.96, 1094.46, 1368.08, 2394.14) },
    { id: 'ma-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(446.58, 522.50, 637.45, 764.94, 803.19, 883.51, 1104.39, 1214.83, 1518.54, 2657.45) },
    { id: 'ma-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(443.87, 519.33, 633.58, 760.30, 798.32, 878.15, 1097.69, 1207.46, 1509.33, 2641.33) },
    { id: 'ma-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(492.71, 576.47, 703.29, 843.95, 886.15, 974.77, 1218.46, 1340.31, 1675.39, 2931.93) },
    { id: 'ma-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(532.48, 623.00, 760.06, 912.07, 957.67, 1053.44, 1316.80, 1448.48, 1810.60, 3168.55) },
    { id: 'ma-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(537.76, 629.18, 767.60, 921.12, 967.18, 1063.90, 1329.88, 1462.87, 1828.59, 3200.03) },
  ],
}

// =============================================================================
// PB — PARAÍBA (copart. 30%, sem Bronze) — valores idênticos aos de RN
// =============================================================================
export const TABELA_PB: TabelaEstadoAmil = {
  estado: 'Paraíba',
  sigla: 'PB',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'pb-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(240.05, 280.86, 342.65, 411.18, 431.74, 474.91, 593.64, 653.00, 816.25, 1428.44) },
    { id: 'pb-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(266.45, 311.75, 380.34, 456.41, 479.23, 527.15, 658.94, 724.83, 906.04, 1585.57) },
    { id: 'pb-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(291.80, 341.41, 416.52, 499.82, 524.81, 577.29, 721.61, 793.77, 992.21, 1736.37) },
    { id: 'pb-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(323.91, 378.97, 462.34, 554.81, 582.55, 640.81, 801.01, 881.11, 1101.39, 1927.43) },
    { id: 'pb-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(336.16, 393.31, 479.84, 575.81, 604.60, 665.06, 831.33, 914.46, 1143.08, 2000.39) },
    { id: 'pb-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(339.50, 397.22, 484.61, 581.53, 610.61, 671.67, 839.59, 923.55, 1154.44, 2020.27) },
  ],
}

// =============================================================================
// RN — RIO GRANDE DO NORTE (copart. 30%, sem Bronze)
// =============================================================================
export const TABELA_RN: TabelaEstadoAmil = {
  estado: 'Rio Grande do Norte',
  sigla: 'RN',
  atualizadoEm: '2026-04-24',
  planos: [
    { id: 'rn-prata-qc', nome: 'Prata QC', segmentacao: 'Prata', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(240.05, 280.86, 342.65, 411.18, 431.74, 474.91, 593.64, 653.00, 816.25, 1428.44) },
    { id: 'rn-prata-qp', nome: 'Prata QP', segmentacao: 'Prata', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: false, exceptoMEI: true,
      precos: precos(266.45, 311.75, 380.34, 456.41, 479.23, 527.15, 658.94, 724.83, 906.04, 1585.57) },
    { id: 'rn-ouro-qc', nome: 'Ouro QC', segmentacao: 'Ouro', acomodacao: 'QC', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(291.80, 341.41, 416.52, 499.82, 524.81, 577.29, 721.61, 793.77, 992.21, 1736.37) },
    { id: 'rn-ouro-qp', nome: 'Ouro QP', segmentacao: 'Ouro', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(323.91, 378.97, 462.34, 554.81, 582.55, 640.81, 801.01, 881.11, 1101.39, 1927.43) },
    { id: 'rn-platinum-qp-r1', nome: 'Platinum QP R1', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(336.16, 393.31, 479.84, 575.81, 604.60, 665.06, 831.33, 914.46, 1143.08, 2000.39) },
    { id: 'rn-platinum-qp-r2', nome: 'Platinum QP R2', segmentacao: 'Platinum', acomodacao: 'QP', abrangencia: 'Nacional', coparticipacaoPct: 30, reembolso: true, exceptoMEI: true,
      precos: precos(339.50, 397.22, 484.61, 581.53, 610.61, 671.67, 839.59, 923.55, 1154.44, 2020.27) },
  ],
}

// =============================================================================
// ÍNDICE GERAL — 14 estados disponíveis (de 20 planejados).
// =============================================================================

export const TABELAS_POR_ESTADO: Record<string, TabelaEstadoAmil> = {
  SP: TABELA_SP,
  RJ: TABELA_RJ,
  MG: TABELA_MG,
  PR: TABELA_PR,
  SC: TABELA_SC,
  RS: TABELA_RS,
  DF: TABELA_DF,
  GO: TABELA_GO,
  BA: TABELA_BA,
  PE: TABELA_PE,
  CE: TABELA_CE,
  MA: TABELA_MA,
  PB: TABELA_PB,
  RN: TABELA_RN,
  // Faltam 6 estados para completar os 20 planejados.
}

export const ESTADOS_DISPONIVEIS = Object.keys(TABELAS_POR_ESTADO)

// =============================================================================
// HELPERS DE CONSULTA DINÂMICA
// =============================================================================

/** Retorna todos os planos de um estado. */
export function getPlanosDoEstado(sigla: string): PlanoAmil[] {
  return TABELAS_POR_ESTADO[sigla.toUpperCase()]?.planos ?? []
}

/** Converte idade em número para a faixa etária ANS correspondente. */
export function idadeParaFaixa(idade: number): FaixaEtaria {
  if (idade <= 18) return '00 a 18'
  if (idade <= 23) return '19 a 23'
  if (idade <= 28) return '24 a 28'
  if (idade <= 33) return '29 a 33'
  if (idade <= 38) return '34 a 38'
  if (idade <= 43) return '39 a 43'
  if (idade <= 48) return '44 a 48'
  if (idade <= 53) return '49 a 53'
  if (idade <= 58) return '54 a 58'
  return '59 ou +'
}

/** Preço de um plano para uma idade específica. */
export function precoPorIdade(plano: PlanoAmil, idade: number): number {
  return plano.precos[idadeParaFaixa(idade)]
}

/** Prêmio mensal total somando as idades de todos os beneficiários. */
export function calcularPremioMensal(plano: PlanoAmil, idades: number[]): number {
  return idades.reduce((total, idade) => total + precoPorIdade(plano, idade), 0)
}

/** Filtra planos por critérios combinados. */
export interface FiltroPlanos {
  sigla: string
  segmentacao?: Segmentacao
  acomodacao?: Acomodacao
  reembolso?: boolean
}

export function filtrarPlanos(filtro: FiltroPlanos): PlanoAmil[] {
  return getPlanosDoEstado(filtro.sigla).filter(p =>
    (filtro.segmentacao === undefined || p.segmentacao === filtro.segmentacao) &&
    (filtro.acomodacao === undefined || p.acomodacao === filtro.acomodacao) &&
    (filtro.reembolso === undefined || p.reembolso === filtro.reembolso),
  )
}

/** Agrupa planos de um estado por segmentação (Bronze/Prata/Ouro/Platinum...). */
export function planosPorSegmentacao(sigla: string): Partial<Record<Segmentacao, PlanoAmil[]>> {
  const planos = getPlanosDoEstado(sigla)
  return planos.reduce<Partial<Record<Segmentacao, PlanoAmil[]>>>((acc, p) => {
    if (!acc[p.segmentacao]) acc[p.segmentacao] = []
    acc[p.segmentacao]!.push(p)
    return acc
  }, {})
}
