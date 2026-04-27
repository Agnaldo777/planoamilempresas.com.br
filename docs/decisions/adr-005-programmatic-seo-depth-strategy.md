# ADR-005: Programmatic SEO Depth Strategy

**Status:** ✅ **Accepted v1** (2026-04-24) → **Updated v2** (2026-04-26 — recalibração dataset 9.325 prestadores)
**Data:** 2026-04-24 (v1) · 2026-04-26 (v2)
**Autor:** Aria (Architect) — Synkra AIOS
**Co-sign v2:** Pax (PO) · Orion (aios-master)
**Última atualização:** 2026-04-26 (v2 recalibração via SCP v1.2.3)

---

## Change Log

| Versão | Data | Autor | Mudança |
|---|---|---|---|
| v1 | 2026-04-24 | Aria | Versão original; 2.071 prestadores · 23 UFs · ~5.000-6.500 URLs total |
| v2 | 2026-04-26 | Aria + Pax | Recalibração para dataset 9.325 prestadores · 26 UFs · ~10.500 URLs total (após filtros anti-thin); Story 6.5 movida para Epic 7 — ver SCP v1.2.3 |

---

## Context

O site `planoamilempresas.com.br` combina **4 ativos SEO programáticos diferentes** que precisam coexistir sem canibalizar entre si nem cair em "thin content" (penalidade Helpful Content / SpamBrain do Google):

1. **Tabela de preços** (matriz produto × UF × coparticipação) — `data/tabelas-amil.ts`
2. **Rede credenciada** (4 níveis hierárquicos: UF → município → bairro → prestador) — `data/rede-credenciada/`
3. **Páginas-cidade simples** (~742 herdadas do clone, Story 5.0 estilo `/plano-amil-[cidade]`)
4. **Matriz CNAE × cidade × porte** (~600 páginas, Story 5.x)

A coexistência desses 4 ativos cria risco de:
- **Canibalização de keywords** (múltiplas páginas competindo no mesmo termo de busca)
- **Thin content** (páginas geradas por template sem variação suficiente)
- **Internal linking caótico** (over-linking automático universal)
- **Schema markup conflitante** (rich snippets competindo na SERP)

## Decision

Adotar uma **hierarquia de URLs com profundidade controlada (depth-aware)** para evitar canibalização e thin content entre os 4 ativos:

| Tipo | Depth max | URL pattern | Volume estimado v2 (dataset 9.325) |
|---|---|---|---|
| Pillar | L0 | `/guia-plano-amil-empresarial` | 1 |
| Cornerstones | L1 | `/[slug]` | 15 |
| Tabela preço | L1 | `/tabela-precos-amil-2026` | 1 (filtros via query) |
| Rede hub | L1 | `/rede-credenciada` | 1 |
| Páginas-cidade simples (clone) | L1 | `/plano-amil-[cidade]` | ~742 |
| Rede UF | L2 | `/rede/[uf]` | **26** (Norte agora coberto parcialmente) |
| Matriz CNAE | L3 | `/plano-amil/[cidade]/[cnae]` | ~600 |
| Rede município | L3 | `/rede/[uf]/[municipio]` | **438** |
| Rede produto × UF (Cluster E) | L2 | `/rede/[rede-slug]/[uf]` | **~286** (11 redes × 26 UFs filtradas ≥2 prestadores) |
| Tipo × UF × Município | L3 | `/[tipo]/[uf]/[municipio]` | **~250-350** (filtrados ≥3 prestadores classificados) |
| Matriz CNAE+porte | L4 | `/plano-amil/[cidade]/[cnae]/[porte]` | ~600 |
| Rede bairro | L4 | `/rede/[uf]/[municipio]/[bairro]` | **~700-800** (filtrados ≥3 prestadores) |
| Rede prestador | L4 | `/rede/[uf]/[municipio]/[prestador-slug]` | **9.325** (~7.500 indexados após noindex anti-thin) |

**Total estimado v2: ~10.500 URLs SEO no MVP** (após filtros anti-thin em bairro/prestador/tipo).
**Total teórico v2:** ~12.768 URLs.

> ⚠️ **v1 → v2:** Dataset evoluiu de 2.071 prestadores · 23 UFs (snapshot 2026-04-25 manhã) para 9.325 prestadores · 26 UFs (snapshot 2026-04-26 02:21Z). Volume real cresceu ~4,5×; aplicação de filtros anti-thin (≥3 prestadores em bairro/tipo, noindex em cidade <5 prestadores) traz para ~10.500 indexáveis. Schema raiz do dataset também mudou (de booleanos por rede para `redes: string[]`), motivando rewrite do loader em Story 7.1. Detalhes em `docs/sprint-change-proposal-v1.2.3.md`.

### Regras críticas anti-canibalização

- **Páginas-cidade simples (clone) NÃO duplicar conteúdo da matriz CNAE × cidade** — usam intent diferente: "plano para cidade" (genérico) vs "plano para CNAE em cidade" (vertical)
- **Schemas markup diferenciados** por tipo de página:
  - `Product` + `Offer` → tabela de preços
  - `LocalBusiness` → rede credenciada (prestador)
  - `Article` + `FAQPage` → cornerstones
  - `WebPage` → cidade simples (sem schema heavy, evita rich snippet competing)
- **Internal linking respeita silo:** pillar → cornerstones → matriz → cidades simples (cross-link contextual com hand-curated anchor text, **não** automático universal — evita over-linking)
- **Canonical tags em todas as páginas** (cada URL é canônica de si mesma; filtros via query string NÃO geram canonicalização separada — `?uf=sp` permanece com canonical apontando para URL base)

## Consequences

- ✅ **Volume de longa cauda massivo** (5.000+ URLs) — moat real frente a concorrentes Tier B
- ✅ **Difícil para concorrentes replicar** — exigiria Power BI scraping + tabelas reais + 742 páginas + matriz CNAE com conteúdo único
- ✅ **Schemas diferenciados** evitam SERP self-cannibalism em rich snippets
- ✅ **Silos respeitados** preservam topical authority por cluster
- ⚠️ **Build time de SSG para 5.000+ páginas é variável** — mitigação detalhada na seção "Build Performance" do `architecture.md` (chunking + ISR + tier Hobby/Pro)
- ⚠️ **Risk de Helpful Content penalty se conteúdo for thin** — mitigado por:
  - Dados reais (preços indexáveis, prestadores reais com bairro/município)
  - Variação contextual por CNAE/cidade/porte (FAQs específicas, parágrafos de contexto)
  - Mínimo **600 palavras por página programática** (Wave 1+2 audited via Story 5.7)
- ⚠️ **Canibalização requer monitoramento contínuo** — Story 5.8 implementa GSC Cluster Report para detectar páginas competindo na mesma query

## Alternatives Considered

| Opção | Veredito | Por quê |
|---|---|---|
| **Hierarquia depth-aware com 4 ativos coexistindo** | ✅ Escolhido | Maximiza moat de longa cauda preservando topical authority |
| Apenas tabela de preços + rede (sem matriz CNAE / cidade simples) | ❌ Rejeitado | Perde 1.342 páginas de longa cauda (clone + matriz); reduz moat drasticamente |
| Tudo em flat URL structure (sem hierarquia) | ❌ Rejeitado | Internal linking caótico; sem silos; rede bairro/prestador ficaria sem contexto |
| Noindex em páginas L4 (rede bairro/prestador) para reduzir thin-content risk | ❌ Rejeitado | L4 é onde mora a longa cauda real (bairro + prestador) — noindex destrói o moat |

## References

- `docs/architecture.md` (seção ADRs inline — fonte original)
- `docs/architecture.md` seção "Build Performance" — estratégia SSG em escala
- `docs/prd.md` v1.2.2 Story 5.0 — 742 cidades-clone reaproveitadas
- `docs/prd.md` v1.2.2 Story 5.7 — auditoria de conteúdo Wave 1+2
- `docs/prd.md` v1.2.2 Story 5.8 — GSC Cluster Report (monitoramento canibalização)
- `docs/prd.md` v1.2.2 Story 6.5 — expansão SEO (~3.500 URLs)
- `docs/prd.md` v1.2.2 Story 6.6 — 2 datasets (tabela preço + rede credenciada)
