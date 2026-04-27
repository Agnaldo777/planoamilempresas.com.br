// Smoke test do loader v2 — emula sem TypeScript runtime
// Replica a lógica essencial em JS puro para validar o JSON novo

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'rede-credenciada.json'), 'utf8'),
)

// Valida shape v2
const checks = {
  hasGeradoEm: typeof data.geradoEm === 'string',
  hasTotal: typeof data.totalPrestadores === 'number',
  hasRedesArray: Array.isArray(data.redes),
  hasPrestadores: Array.isArray(data.prestadores),
  prestadoresShape: data.prestadores[0]
    ? typeof data.prestadores[0].codigo === 'string' &&
      typeof data.prestadores[0].nome === 'string' &&
      Array.isArray(data.prestadores[0].redes)
    : false,
}

console.log('=== SHAPE VALIDATION (v2 schema) ===')
for (const [k, v] of Object.entries(checks)) {
  console.log(`  ${v ? '✅' : '❌'} ${k}`)
}

const allPassed = Object.values(checks).every(Boolean)
if (!allPassed) {
  console.error('❌ FALHOU validação de shape — abortando')
  process.exit(1)
}

console.log('\n=== STATS ===')
console.log(`  geradoEm: ${data.geradoEm}`)
console.log(`  totalPrestadores: ${data.totalPrestadores}`)
console.log(`  totalRedes (header): ${data.totalRedes}`)

// Prestadores com pelo menos 1 rede
const ativos = data.prestadores.filter(
  (p) => Array.isArray(p.redes) && p.redes.length > 0,
)
console.log(`  Prestadores com redes: ${ativos.length}`)

// Redes únicas em prestadores[].redes
const redesAtivas = new Set()
for (const p of data.prestadores) {
  for (const r of p.redes || []) redesAtivas.add(r)
}
console.log(`  Redes únicas em prestadores[].redes: ${redesAtivas.size}`)
console.log(`  Lista:`)
for (const r of redesAtivas) console.log(`    - ${r}`)

// Cross-check com REDE_KEYS do loader
const REDE_KEYS = [
  'ADESÃO OURO MAIS',
  'AMIL S380 QP',
  'AMIL S380 QC',
  'BLACK',
  'AMIL S580 QP',
  'AMIL S750 QP',
  'AMIL S450 QC',
  'AMIL S450 QP',
  'AMIL ONE S6500 BLACK QP',
  'ADESÃO BRONZE RJ',
  'ADESÃO BRONZE SP',
]

console.log('\n=== CROSS-CHECK REDE_KEYS (loader v2) ↔ dataset ===')
for (const k of REDE_KEYS) {
  const inDataset = redesAtivas.has(k)
  console.log(`  ${inDataset ? '✅' : '❌'} ${k}`)
}
const missing = [...redesAtivas].filter((r) => !REDE_KEYS.includes(r))
if (missing.length > 0) {
  console.log('\n⚠️ Redes em dataset NÃO previstas em REDE_KEYS:')
  for (const r of missing) console.log(`    - ${r}`)
} else {
  console.log('\n✅ REDE_KEYS cobre 100% das redes ativas')
}

// Município top-3
const muniCount = {}
for (const p of data.prestadores) {
  const k = `${p.uf}|${p.municipio}`
  muniCount[k] = (muniCount[k] || 0) + 1
}
const top3 = Object.entries(muniCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
console.log('\n=== TOP 3 MUNICÍPIOS ===')
for (const [k, v] of top3) console.log(`  ${k}: ${v}`)

console.log('\n✅ Loader v2 smoke test PASSED')
