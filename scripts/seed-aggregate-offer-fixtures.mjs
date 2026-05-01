#!/usr/bin/env node
/**
 * seed-aggregate-offer-fixtures.mjs — Story 3.23 (FR51)
 *
 * Lê `data/tabelas-amil.ts` (heurística regex), extrai preços por UF, e
 * gera fixtures em `data/aggregate-offers/[uf].json` com:
 *   - lowPrice: min de todos os preços de planos do UF
 *   - highPrice: max de todos os preços de planos do UF
 *   - offerCount: total de pares (plano × faixa etária) com preço > 0
 *   - estado: nome completo
 *
 * **Quando rodar:**
 *   - Após cada atualização mensal de `tabelas-amil.ts` (Story 6.6)
 *   - Antes de build SSG das pages estaduais `/precos/[uf]/`
 *
 * **Out of scope** (não rodar agora):
 *   - Pages estaduais `/precos/[uf]/` ainda não existem (Epic 6).
 *   - Stakeholder roda quando integrar.
 *
 * Uso:
 *   node scripts/seed-aggregate-offer-fixtures.mjs
 *
 * Saída:
 *   data/aggregate-offers/sp.json
 *   data/aggregate-offers/rj.json
 *   ... (1 por UF presente em TABELAS_POR_ESTADO)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const TABELAS_PATH = path.join(REPO_ROOT, 'data', 'tabelas-amil.ts');
const OUTPUT_DIR = path.join(REPO_ROOT, 'data', 'aggregate-offers');

const UF_TO_ESTADO = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
  RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo',
  SE: 'Sergipe', TO: 'Tocantins',
};

/**
 * Heurística: extrai cada bloco `export const TABELA_XX: TabelaEstadoAmil = {`
 * e dentro dele captura todos os numerais em chamadas `precos(...)`.
 */
function parseTabelas(source) {
  const ufs = {};
  // Match: export const TABELA_<UF> ... fim do objeto (próximo "}\n)" + termina antes do próximo "// =====")
  const blockRe = /export const TABELA_([A-Z]{2})\s*:\s*TabelaEstadoAmil\s*=\s*\{([\s\S]*?)^\}/gm;
  let m;
  while ((m = blockRe.exec(source)) !== null) {
    const uf = m[1];
    const body = m[2];
    // Match todos os arrays de preços: `precos(num, num, ..., num)`
    const prices = [];
    const precosRe = /precos\(([^)]+)\)/g;
    let pm;
    while ((pm = precosRe.exec(body)) !== null) {
      const nums = pm[1]
        .split(',')
        .map((s) => Number.parseFloat(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
      prices.push(...nums);
    }
    // Conta planos: cada `{ id: '...'`
    const planoCount = (body.match(/\{\s*id:\s*['"`]/g) || []).length;
    ufs[uf] = { uf, prices, planoCount };
  }
  return ufs;
}

async function main() {
  const source = await fs.readFile(TABELAS_PATH, 'utf8');
  const ufs = parseTabelas(source);
  const ufKeys = Object.keys(ufs);
  if (ufKeys.length === 0) {
    console.error('[seed] Nenhuma UF detectada em tabelas-amil.ts. Heurística pode estar quebrada.');
    process.exit(1);
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  let written = 0;
  for (const uf of ufKeys) {
    const { prices, planoCount } = ufs[uf];
    if (prices.length === 0) {
      console.warn(`[seed] UF ${uf}: sem preços extraídos — pulando.`);
      continue;
    }
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);
    const offerCount = prices.length; // pares plano × faixa etária com preço > 0
    const fixture = {
      uf,
      estado: UF_TO_ESTADO[uf] || null,
      lowPrice: Number.parseFloat(lowPrice.toFixed(2)),
      highPrice: Number.parseFloat(highPrice.toFixed(2)),
      offerCount,
      planoCount,
      generatedAt: new Date().toISOString(),
      source: 'data/tabelas-amil.ts',
    };
    const outPath = path.join(OUTPUT_DIR, `${uf.toLowerCase()}.json`);
    await fs.writeFile(outPath, JSON.stringify(fixture, null, 2) + '\n', 'utf8');
    written++;
    console.log(
      `[seed] ${uf} — lowPrice=${fixture.lowPrice} highPrice=${fixture.highPrice} offerCount=${offerCount} → ${path.relative(REPO_ROOT, outPath)}`,
    );
  }

  console.log(`\n[seed] OK — ${written} fixtures geradas em ${path.relative(REPO_ROOT, OUTPUT_DIR)}/`);
}

main().catch((err) => {
  console.error('[seed] ERRO:', err);
  process.exit(1);
});
