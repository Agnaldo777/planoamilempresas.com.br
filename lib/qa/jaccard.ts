/**
 * Jaccard similarity helper — Story 5.7 (Anti-Cookie-Cutter NFR25).
 *
 * Single source of truth para o algoritmo Jaccard usado pelo audit
 * de cookie-cutter. Reusável em scripts (`scripts/audit-cookie-cutter.mjs`)
 * e tests.
 *
 * **Por que Jaccard?**
 * - Operação O(|A| + |B|) sobre sets de tokens; trivial de calcular para
 *   amostra de ~30 páginas (435 pares).
 * - Não requer training (cosine TF-IDF requer corpus base).
 * - Sensível a "boilerplate idêntico" — exatamente o sinal que queremos
 *   detectar (texto > 70% idêntico entre instâncias é o gatilho NFR25).
 *
 * **N-gram strategy:**
 * - Default: 3-gram word level. Captura sequências curtas tipicamente
 *   compartilhadas em templates ("a rede credenciada amil"). Mais
 *   sensível a duplicação real do que 1-gram (que já dá score alto
 *   só por compartilhar vocabulário básico do domínio).
 * - 1-gram fica disponível para sanity-checks e debug.
 *
 * **Normalização:**
 * - lowercase, strip de pontuação ASCII + acentuação Latin-1 (mantém
 *   palavras pt-BR como "saúde" → "saude" para não inflar score por
 *   variantes de encoding/acentuação inconsistente).
 * - whitespace collapsed.
 * - tokens vazios descartados.
 *
 * **Determinismo:** sets são construídos a partir de string normalizada;
 * mesma entrada → mesmo score.
 */

export interface JaccardOptions {
  /** Tamanho do n-gram. Default 3 (word-level shingles). */
  ngram?: number;
  /** Se true, normaliza removendo acentuação. Default true. */
  stripDiacritics?: boolean;
}

/**
 * Normaliza texto para comparação: lowercase, strip pontuação,
 * (opcional) strip acentos, collapse whitespace.
 */
export function normalizeText(
  input: string,
  options: { stripDiacritics?: boolean } = {},
): string {
  const stripDiacritics = options.stripDiacritics ?? true;
  let text = input.toLowerCase();

  if (stripDiacritics) {
    // NFD: separa caracter base + diacrítico → remove diacríticos
    // (Unicode block U+0300-U+036F = Combining Diacritical Marks).
    text = text.normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // Substitui qualquer caracter não-alfanumérico (Unicode) por espaço.
  // \p{L} = letras, \p{N} = números (Unicode-aware).
  text = text.replace(/[^\p{L}\p{N}\s]/gu, ' ');

  // Collapse whitespace + trim.
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Tokeniza string normalizada em palavras.
 * Retorna array vazio se string for vazia/whitespace.
 */
export function tokenize(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) return [];
  return trimmed.split(/\s+/);
}

/**
 * Gera n-grams (shingles) a partir de array de tokens.
 *
 * - Para n=1, retorna o array de tokens (deduplicado externamente via Set).
 * - Para n>1, retorna sequências contíguas de N tokens joinadas por espaço.
 * - Se array tem menos elementos que n, retorna 1 shingle com tudo
 *   (fallback para textos muito curtos — evita Set vazio que gera NaN).
 */
export function ngrams(tokens: string[], n: number): string[] {
  if (n < 1 || !Number.isInteger(n)) {
    throw new Error(`ngram size must be positive integer, got: ${n}`);
  }
  if (tokens.length === 0) return [];
  if (tokens.length < n) return [tokens.join(' ')];

  const result: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    result.push(tokens.slice(i, i + n).join(' '));
  }
  return result;
}

/**
 * Jaccard similarity entre dois sets: |A ∩ B| / |A ∪ B|.
 *
 * - Retorna 1.0 se ambos sets vazios (definição matemática 0/0 = 1
 *   para "ambos vazios são idênticos"; aplicação aqui: 2 textos vazios
 *   são considerados idênticos por convenção).
 * - Retorna 0.0 se um set vazio e outro não.
 */
export function jaccardSets<T>(a: Set<T>, b: Set<T>): number {
  if (a.size === 0 && b.size === 0) return 1.0;
  if (a.size === 0 || b.size === 0) return 0.0;

  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return intersection / union;
}

/**
 * Calcula Jaccard similarity entre 2 textos.
 *
 * Pipeline: normalize → tokenize → ngrams → Set → jaccard.
 *
 * @param text1 primeiro texto
 * @param text2 segundo texto
 * @param options.ngram default 3
 * @param options.stripDiacritics default true
 * @returns 0.0 (totalmente diferente) a 1.0 (idêntico)
 */
export function jaccardSimilarity(
  text1: string,
  text2: string,
  options: JaccardOptions = {},
): number {
  const ngram = options.ngram ?? 3;
  const stripDiacritics = options.stripDiacritics ?? true;

  const norm1 = normalizeText(text1, { stripDiacritics });
  const norm2 = normalizeText(text2, { stripDiacritics });

  const tokens1 = tokenize(norm1);
  const tokens2 = tokenize(norm2);

  const set1 = new Set(ngrams(tokens1, ngram));
  const set2 = new Set(ngrams(tokens2, ngram));

  return jaccardSets(set1, set2);
}

/**
 * Conta tokens contextuais (ocorrências) no texto. Usado pelo audit
 * para validar mínimo de "interpolações" por página (NFR25 + nota Pax
 * v1.2.4: ≥8 ocorrências distintas de tokens contextuais).
 *
 * @param text texto bruto
 * @param contextualTokens lista de tokens (ex: ["São Paulo", "SP", "Vila Mariana"])
 * @returns objeto com count por token + total
 */
export function countContextualTokens(
  text: string,
  contextualTokens: readonly string[],
): { byToken: Record<string, number>; total: number; distinctMatched: number } {
  const normText = normalizeText(text);
  const byToken: Record<string, number> = {};
  let total = 0;
  let distinctMatched = 0;

  for (const token of contextualTokens) {
    const normToken = normalizeText(token);
    if (normToken.length === 0) {
      byToken[token] = 0;
      continue;
    }
    // word-boundary safe: split por whitespace e match exato sub-string
    // de tokens. Para multi-word, usamos contagem de occurrences via split.
    const escaped = normToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<=^|\\s)${escaped}(?=$|\\s)`, 'g');
    const matches = normText.match(re);
    const count = matches ? matches.length : 0;
    byToken[token] = count;
    total += count;
    if (count > 0) distinctMatched++;
  }

  return { byToken, total, distinctMatched };
}
