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

/**
 * Dicionário de acentuação correta para cidades de maior tráfego (o dataset
 * vem todo em CAIXA-ALTA sem acento). Demais cidades caem no Title Case genérico.
 */
const CIDADES_ACENTUADAS: Record<string, string> = {
  'SAO PAULO': 'São Paulo', 'RIO DE JANEIRO': 'Rio de Janeiro', BRASILIA: 'Brasília',
  GOIANIA: 'Goiânia', 'BELO HORIZONTE': 'Belo Horizonte', SALVADOR: 'Salvador',
  FORTALEZA: 'Fortaleza', RECIFE: 'Recife', CURITIBA: 'Curitiba',
  'PORTO ALEGRE': 'Porto Alegre', MANAUS: 'Manaus', BELEM: 'Belém',
  FLORIANOPOLIS: 'Florianópolis', VITORIA: 'Vitória', NATAL: 'Natal',
  'JOAO PESSOA': 'João Pessoa', MACEIO: 'Maceió', TERESINA: 'Teresina',
  'CAMPO GRANDE': 'Campo Grande', CUIABA: 'Cuiabá', ARACAJU: 'Aracaju',
  'SAO LUIS': 'São Luís', MACAPA: 'Macapá', PALMAS: 'Palmas', 'BOA VISTA': 'Boa Vista',
  'PORTO VELHO': 'Porto Velho', 'RIO BRANCO': 'Rio Branco', GUARULHOS: 'Guarulhos',
  CAMPINAS: 'Campinas', 'SANTO ANDRE': 'Santo André', NITEROI: 'Niterói',
  'NOVA FRIBURGO': 'Nova Friburgo', 'JUIZ DE FORA': 'Juiz de Fora',
  UBERLANDIA: 'Uberlândia', 'RIBEIRAO PRETO': 'Ribeirão Preto', SOROCABA: 'Sorocaba',
  'APARECIDA DE GOIANIA': 'Aparecida de Goiânia', 'SAO GONCALO': 'São Gonçalo',
  'DUQUE DE CAXIAS': 'Duque de Caxias', 'SAO BERNARDO DO CAMPO': 'São Bernardo do Campo',
};

const PREPOSICOES = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

/**
 * Converte nome de local do dataset (CAIXA-ALTA) para exibição:
 * "SAO PAULO" → "São Paulo"; "BARRA DA TIJUCA" → "Barra da Tijuca".
 * Usa dicionário acentuado quando disponível; senão Title Case com preposições.
 */
export function tituloLocal(nome: string): string {
  if (!nome) return nome;
  const up = nome.trim().toUpperCase();
  if (CIDADES_ACENTUADAS[up]) return CIDADES_ACENTUADAS[up];
  return nome
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && PREPOSICOES.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}
