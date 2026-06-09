/**
 * Unidades Federativas — fonte única de verdade para validação e nomes.
 *
 * Compartilhado pelas rotas de rede credenciada (Stories 7.x) para evitar
 * duplicação do mapa UF → nome em cada page.tsx.
 */

export const UFS_VALIDAS = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
] as const;

export type Uf = (typeof UFS_VALIDAS)[number];

export const UF_NOMES: Record<Uf, string> = {
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
  GO: 'Goiás', MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso', PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco',
  PI: 'Piauí', PR: 'Paraná', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RO: 'Rondônia', RR: 'Roraima', RS: 'Rio Grande do Sul', SC: 'Santa Catarina',
  SE: 'Sergipe', SP: 'São Paulo', TO: 'Tocantins',
};

/** Confirma se uma string (qualquer caixa) é uma UF brasileira válida. */
export function isUfValida(uf: string): uf is Uf {
  return (UFS_VALIDAS as readonly string[]).includes(uf.toUpperCase());
}

/** Nome por extenso da UF; retorna a sigla em maiúsculas se desconhecida. */
export function ufNome(uf: string): string {
  const upper = uf.toUpperCase();
  return UF_NOMES[upper as Uf] ?? upper;
}
