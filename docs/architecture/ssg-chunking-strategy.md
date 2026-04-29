# SSG Chunking Strategy — Story 7.4 (FR45)

**Status:** Implemented (infra) | **Owner:** @architect (Aria) | **Story:** 7.4

## Problema

Geração SSG de **9.325 páginas-prestador** individuais estoura o build budget de 25min do Vercel Hobby tier. Empíricamente:

- 9.325 páginas × ~3,5ms/página (geração JSON-LD + render RSC) ≈ **32 minutos**
- Hobby tier corta builds em 30 minutos
- Pro tier ($20/mês) suporta até 45min mas custo é decisão Agnaldo

## Solução: Chunking por Phase + MVP cap

### 3 modos de build configuráveis via env vars

| Modo | Env vars | Volume | Build time esperado |
|------|----------|--------|---------------------|
| **MVP build (default)** | (sem env vars) | ~120 páginas | < 5 min |
| **Phase 1 full** | `BUILD_FULL_PROVIDERS=true` | 7.166 páginas (Sudeste) | ~25 min |
| **Phase 1 + 2 full** | `BUILD_FULL_PROVIDERS=true` `PHASE_2_ENABLED=true` | 9.325 páginas | ~32 min (Hobby cortará — usar Pro) |

### Phase rationale (ADR-005 v2)

- **Phase 1 (Sudeste):** RJ + SP + MG + ES = 7.166 prestadores ≈ **77% do volume**, **~80% da demanda histórica de busca**
- **Phase 2 (resto Brasil):** 22 UFs ≈ 2.159 prestadores

### MVP cap rationale

Durante desenvolvimento, **30 prestadores por UF** garante:
- Build < 5min (feedback loop rápido)
- Cobertura suficiente para validar template + schemas
- Top-densidade por UF (ordenação inerente do dataset)

## Implementação

### Arquivos

```
src/lib/operadoras/amil/chunked-static-params.ts
  ├─ getPrestadorStaticParams()  ← consumido por generateStaticParams
  ├─ resolveChunkConfig()        ← lê env vars
  ├─ reportChunkVolume()         ← debug/CI report
  └─ const PHASE_1_UFS = ['RJ','SP','MG','ES']
  └─ const MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL = 5
  └─ const MVP_BUILD_CAP_PER_UF = 30

app/(marketing)/rede/[uf]/[municipio]/[prestadorSlug]/page.tsx
  ├─ generateStaticParams() → getPrestadorStaticParams()
  ├─ generateMetadata() com noindex anti-thin (<5 prestadores no município)
  └─ schema MedicalBusiness/Hospital/MedicalClinic/etc. discriminado por tipoInferido
```

### Tipos de schema mapeados (AC3 da Story 7.4)

| `tipoInferido` | Schema.org `@type` | Notas |
|----------------|---------------------|-------|
| `Hospital` | `Hospital` | — |
| `Maternidade` | `Hospital` | + `medicalSpecialty: { name: 'Obstetrics' }` |
| `Pronto-Socorro` | `EmergencyService` | — |
| `Clínica` | `MedicalClinic` | — |
| `Laboratório` | `MedicalLaboratory` | — |
| `Diagnóstico por Imagem` | `MedicalImagingService` | Subtype canonical |
| `Odontologia`, `Centro/Instituto`, `Outro` | `MedicalOrganization` | Fallback |

## Anti-thin content (AC6)

Município com `<5` prestadores totais → página-prestador renderiza:
- `<meta name="robots" content="noindex,follow">`
- `canonical` aponta para `/rede/[uf]/[municipio]/` (página-cidade pai)

Threshold em `MIN_PRESTADORES_MUNICIPIO_PARA_PRESTADOR_INDIVIDUAL` (centralizado para tuning).

## Roadmap pós-MVP

| Próximo passo | Trigger | Owner |
|---------------|---------|-------|
| Migrar para Vercel Pro tier ($20/mês) | quando ativar Phase 2 | Agnaldo (decisão) |
| Implementar Story 7.5 (página-cidade) | resolve canonical do anti-thin | @dev (Dex) |
| Implementar Story 7.10 (pipeline mensal) | atualiza dataset auto | @data-engineer (Dara) |
| Adicionar mapa Leaflet (centroide) | enriquecer página-prestador | @dev (Dex) — Story 7.4 Task 7 |
| Integrar templates Story 7.3 | conteúdo ≥600 palavras + ≥8 interpolações | @dev (Dex) |

## Validação

```bash
# Volume report sem build:
npx tsx -e "import {reportChunkVolume} from './src/lib/operadoras/amil/chunked-static-params'; console.log(reportChunkVolume())"

# Build MVP (default):
npm run build

# Build Phase 1 full:
BUILD_FULL_PROVIDERS=true npm run build

# Build Phase 1 + 2 full (apenas Pro tier):
BUILD_FULL_PROVIDERS=true PHASE_2_ENABLED=true npm run build
```

## Open questions

1. **Pro tier upgrade timing:** Phase 2 só faz sentido após validar SERP impact de Phase 1. Esperar ≥30 dias pós Phase 1 deploy.
2. **Prebuild JSON-LD:** se Phase 1 estourar 25min, alternativa é pré-gerar todo schema em script offline e importar como string (drop ~30% do build time).
3. **Sitemap shard:** AC8 requer `sitemap-prestadores.xml` separado — fora do escopo deste documento; ver Story 7.4 Task 8.

## Referências

- ADR-005 v2 (programmatic SEO depth strategy) — volumes recalibrados
- ADR-007 (Dataset SSOT) — origem dos prestadores
- Story 7.4 — AC1-AC14
- Story 7.5 — página-cidade (canonical do anti-thin)
- `src/lib/operadoras/amil/chunked-static-params.ts` — implementação
- `app/(marketing)/rede/[uf]/[municipio]/[prestadorSlug]/page.tsx` — consumidor
