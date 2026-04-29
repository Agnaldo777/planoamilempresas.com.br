# Research — Análise Competitiva dos Concorrentes Amil

**Data da análise:** 2026-04-27
**Migrado de:** `/c/Users/benef/satelite-amil-astro/research/` (projeto Astro+Bun descontinuado em 2026-04-28)
**Owner:** Atlas (analyst) → input para Morgan (PM) e Uma (UX)

## Concorrentes auditados

1. **amilplanos.com.br** — WordPress + UX Themes, ~1.500 páginas, blog com 4 posts spam off-topic, tabela de preços de set/2022
2. **planodesaudeamil.com.br** — WordPress + Flatsome, ~2.500 páginas, blog 100% on-topic, FAQ 45+ Q&A, mas 2.400 city pages com texto template idêntico

## Documentos

| # | Arquivo | Conteúdo |
|---|---------|----------|
| 01 | `01-sitemap-inventory.md` | Inventário de URLs do amilplanos.com.br + estrutura sitemaps |
| 02 | `02-pages-scraped.md` | 10 páginas estratégicas raspadas (homepage, planos, FAQ, blog, city sample) |
| 03 | `03-competitor-analysis.md` | Análise técnica do amilplanos: schema, meta, CWV, blog, gaps |
| 04 | `04-project-brief.md` | Brief inicial do satélite Amil (escopo, posicionamento) |
| 05 | `05-planodesaudeamil-deep-scrape.md` | Raspagem profunda do planodesaudeamil.com.br |
| 06 | `06-tabela-comparativa-concorrentes.md` | Tabela 8 dimensões × 2 sites + plano de ataque |
| 07 | `07-deep-scrape-confirmacoes.md` | Confirmações via curl/grep no HTML cru + performance real (TTFB ~3s) |
| 08 | `08-acertos-erros-detalhado.md` | ⭐ **Tabela final acertos × erros** com word count, tabelas de preços e rede credenciada |

## Achados principais (resumo executivo)

### amilplanos.com.br — 6,0/10
**Acertos:** /coparticipacao/ dedicada, /rede-de-hospitais-dor-amil/, sub-redes diferenciadas, H1 city com qualifier, hospitais reais em capitais.
**Erros graves:** preços de set/2022, 4 posts spam (WNBA, casino, Champions), centenas de slugs duplicados `-2`, sem schema, sem meta description.

### planodesaudeamil.com.br — 6,5/10
**Acertos:** preços out/2025, blog 100% on-topic, FAQ 45+ Q&A, /por-adesao/ dedicadas, subpath `/rede-credenciada/[uf]/`, CNPJ+SUSEP visíveis, dados quantificáveis (6M beneficiários).
**Erros graves:** ~2.400 city pages com texto idêntico (risco Helpful Content), hospitais nacionais em municípios pequenos, TTFB ~3s, sem schema, sem meta description.

## Como usar

1. **Morgan (PM)** — input para PRD v1.3 (incorporar 13 acertos do PSAmil + 8 acertos do amilplanos)
2. **Aria (Architect)** — input para ADR-009 (estratégia ecossistema) e revisão Architecture v1.3
3. **Uma (UX)** — benchmark visual (inspiração, não cópia literal — ver `ecosystem-link-strategy.md` §5)
4. **Pax (PO)** — basear stories em gaps identificados (FAQPage schema, hospitais reais por município, tabela mensal)
5. **Quinn (QA)** — checklist de "anti-erros do concorrente" (sem slugs `-2`, sem texto template idêntico, sem blog spam)

## Diferenciais a implementar (consolidado dos 8 docs)

- ✅ Schema 100% (Org, LocalBusiness × 5570, Product, FAQPage, BreadcrumbList, Article, MedicalBusiness, Offer)
- ✅ Meta description dinâmica por página
- ✅ City pages com hospitais REAIS por município (banco IBGE + scraping rede credenciada)
- ✅ Tabela de preços auto-atualizada mensalmente (selo "Atualizado em [mm/aaaa]")
- ✅ FAQPage schema sobre 45+ Q&As
- ✅ Sub-pillars de rede credenciada (D'or, One, Fácil, Clássica)
- ✅ CNPJ + SUSEP visíveis no footer global
- ✅ Author schema YMYL (E-E-A-T para saúde)
- ✅ H1 city pages com qualifier ("Plano de Saúde Amil em [Cidade] — [Estado]")
- ✅ Page com `/coparticipacao/` dedicada (gap do PSAmil)
- ✅ Calculadora interativa de carências (gap dos 2)
- ✅ Mapa interativo de hospitais (gap dos 2)
- ✅ Comparador de planos ("Amil Bronze vs Prata") (gap dos 2)
- ✅ Glossário `/glossario/` (gap dos 2)
- ✅ Posts comparativos ("Amil vs Bradesco") (tabu dos sites Amil-only)
