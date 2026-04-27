# Rede Credenciada Amil — Plano Consolidado de Integração SEO

**Status:** 📋 **Proposed** — aguarda revisão @po
**Data:** 2026-04-26
**Autor:** Orion (aios-master) — orquestração multi-agente (Alex/Uma/Aria/Morgan)
**Última revisão:** —
**Origem:** orquestração brief usuário "trabalho grandioso focado em SEO topo-Google"

---

## 0. Sumário Executivo

### Oportunidade

O dataset **`rede-credenciada.json`** disponível externamente em `planodesaudepj/src/data/operadoras/amil/` (geração 2026-04-26) contém **9.325 prestadores em 26 UFs e 438 municípios** — **4,5× maior** que o dataset assumido no PRD v1.2.2 (Story 6.5 cita 2.071 prestadores em 23 UFs). Esse delta destrava potencial de **~12.700 URLs SEO** (vs ~3.500-4.500 do plano atual), preservando a hierarquia já formalizada no **ADR-005** sem mudar o desenho arquitetural.

### Escopo recomendado

**NÃO é scope creep** — é **recalibração quantitativa** de Stories já aprovadas (6.5 e 6.6). O dataset substitui o JSON antigo (978 KB, 2.071 prestadores) por uma versão atualizada do mesmo schema funcional, mantendo coerência com `data/rede-credenciada/rede-amil.ts` (loader + 13 helpers já existentes). A tela `/rede-credenciada` (Screen 7 do front-end-spec) e os 5 ataques SEO permanecem; só os volumes-target dobram/triplicam.

### Recomendação

**GO com escopo dimensionado por densidade**: indexar agressivamente os 5 estados com >300 prestadores (RJ/SP/DF/PR/MG = 7.926 prestadores, 85% do dataset) na Wave 1; estados com <50 prestadores entram em Wave 2 com template "região em expansão" para evitar thin content. Decisões críticas: (1) **deduplicar dataset entre os dois projetos** (single source of truth no `planoamilempresas`), (2) **investigar o gap 11 vs 49 redes** antes de commit, (3) **recalibrar Story 6.5 ACs** para os volumes reais.

---

## 1. Análise SEO / Keyword / Conversion (Alex — Analyst)

### 1.1 Clusters de keywords destravados

O dataset abre **5 clusters de busca distintos**, cada um com intent e funil próprios:

| Cluster | Padrão de busca | Volume estimado/mês (BR) | Concorrência | Intent | Conversão típica |
|---|---|---|---|---|---|
| **A. Município genérico** | "rede credenciada amil [cidade]" | 200-2.000 (top-20 cidades) | Média | Avaliação cobertura | ⭐⭐⭐ Alta |
| **B. Bairro** | "hospital amil [bairro] [cidade]" | 10-500 (long-tail) | Baixa | Geo-local específico | ⭐⭐⭐⭐ Muito alta |
| **C. Prestador nominal** | "[nome do hospital] aceita amil" | 5-200 cada | Quase zero | Validação pré-uso | ⭐⭐ Baixa (cliente já tem plano) |
| **D. Tipo + região** | "laboratório amil [cidade]" / "hospital amil [uf]" | 50-800 | Baixa-Média | Avaliação cobertura | ⭐⭐⭐ Média-alta |
| **E. Rede × UF** | "amil one s750 onde aceita [estado]" | 20-300 | Quase zero | Pré-compra qualificada | ⭐⭐⭐⭐⭐ Top |

**Cluster E é o mais sub-explorado e mais qualificado**: quem busca "amil one s750 onde aceita SP" já decidiu o produto e está em pre-purchase validation. Concorrente nenhum cobre isso com schema.

### 1.2 Estimativa de URLs viáveis (cruzamento ADR-005)

| Tipo de página (ADR-005) | Volume real (dataset) | Viabilidade SEO | Comentário |
|---|---|---|---|
| `/rede-credenciada` (hub) | 1 | ✅ | Ataque 1 — entry point |
| `/rede/[uf]` | **26** | ✅ todas | mas 6 UFs Norte com <15 prestadores precisam template "rede em expansão" |
| `/rede/[uf]/[municipio]` | **438** | ✅ ~85% | top-100 cidades têm conteúdo robusto; cauda 200-300 cidades fica em SSG mas com risk thin content |
| `/rede/[uf]/[municipio]/[bairro]` | **1.687** | ⚠️ filtrar | só publicar bairros com ≥3 prestadores (~600-800 viáveis) — abaixo disso é thin content |
| `/rede/[uf]/[municipio]/[prestador-slug]` | **9.325** | ✅ todas | mas conteúdo precisa enriquecimento (sem endereço/tel ainda — gap conhecido) |
| `/rede/[rede-slug]` | 11 | ✅ | só **11 redes ativas** detectadas, não 49 (gap a investigar) |
| `/rede/[rede-slug]/[uf]` | **~286** | ✅ ~80% | filtrar combinações com <2 prestadores |
| `/[tipo]/[uf]/[municipio]` | **994** | ⚠️ filtrar | tipo inferido tem 75% "Outro" — só publicar combinações onde tipo classificado tem ≥3 prestadores (~250-350 viáveis) |
| **TOTAL teórico** | **~12.768** | — | — |
| **TOTAL realista (filtros anti-thin)** | **~10.500-11.000** | ✅ | moat 3× plano original |

### 1.3 Funil de conversão por cluster

> 🔒 **Hipóteses de conversão movidas para `docs/_internal/conversion-hypotheses-rede-credenciada.md`** (mitigação M-04 do PO re-validation 2026-04-26).
>
> Os números de CR (taxa de conversão) por cluster são **estimativas externas, não dados validados do projeto**, e foram isolados em diretório interno para evitar leak para copy público. Calibração real virá pós-launch via Story 5.8 (GSC Cluster Report) e Story 4.5 (Tracking de Funil).
>
> **Para priorização de esforço de conteúdo:** consultar o arquivo interno acima.
> **Para claim público (SEO copy, pitch deck, propostas):** NÃO usar — aguardar dados de A/B test.

### 1.4 Schema.org alavancável (ganho rich snippet)

| Schema | Onde aplicar | Ganho esperado |
|---|---|---|
| `MedicalOrganization` (subtipos: `Hospital`, `MedicalClinic`, `MedicalLaboratory`, `EmergencyService`) | Páginas-prestador | **CTR +20-35%** em SERP local (Google rich card "About this place" mesmo sem coords completas) |
| `LocalBusiness` (fallback quando tipo não inferido) | Prestadores tipo "Outro" | CTR +10-15% (estrelas/endereço básico) |
| `ItemList` + `MedicalOrganization[]` | Páginas-município, bairro, tipo | Snippet de carousel local |
| `BreadcrumbList` | Todas | CTR +5-10% (path visível na SERP) |
| `FAQPage` | Hub `/rede-credenciada` + páginas-município top-20 | Real estate SERP (até 8 perguntas expandíveis) |
| `HealthInsurancePlan` | Páginas `/rede/[rede-slug]` e `/rede/[rede-slug]/[uf]` | Diferenciação produto (gap competitivo total) |
| `Organization` + `sameAs` | Footer/header global | Knowledge panel de marca (longo prazo) |

**Concorrentes mapeados (`competitor-analysis.md`):** zero usam JSON-LD em rede credenciada. Ganho de CTR é dominância pura por enquanto.

### 1.5 Cruzamento com ADR-005 — alinhado, mas requer 3 ajustes

| Item ADR-005 | Plano original | Real (dataset 9.325) | Ajuste necessário |
|---|---|---|---|
| `/rede/[uf]` | 23 | **26** | atualizar nº (Norte agora coberto parcialmente) |
| `/rede/[uf]/[municipio]` | ~300-500 | **438** | dentro do range, OK |
| `/rede/[uf]/[municipio]/[bairro]` | ~800-1.500 | **1.687** | aplicar filtro "≥3 prestadores" → cai pra ~700-800 (range OK) |
| `/rede/[uf]/[municipio]/[prestador-slug]` | **2.071** | **9.325** | ⚠️ **+4.5×**: ADR-005 e Story 6.5 precisam ser revisados |
| **TOTAL ADR-005** | ~5.000-6.500 | ~10.500-11.000 (após filtros) | impacto direto em Story 6.5 / Build Performance |

---

## 2. UX/UI Proposto (Uma — UX Design Expert)

### 2.1 Princípios

- **Mobile-first crítico** — 70%+ do tráfego saúde é mobile (Statista 2025)
- **Preservar Screen 7 já desenhado** (front-end-spec.md linhas 732-764) — ajustes só onde dataset 4.5× exige
- **Filtros progressivos**, não 6 filtros frontais (overwhelming em mobile)
- **WCAG 2.1 AA non-negotiable** (já enforced em PRD)
- **LCP <1.8s mesmo com 9k registros** — solução: dataset NÃO vai client-side todo

### 2.2 Hub `/rede-credenciada` — wireframe ajustado

```
┌──────────────────────────────────────────────────┐
│ HEADER (fixo)                                    │
├──────────────────────────────────────────────────┤
│ HERO                                             │
│ H1: Rede Credenciada Amil — 9.325 prestadores   │
│ Subtítulo: "Encontre hospitais, laboratórios     │
│ e clínicas Amil em sua cidade"                   │
│ Atualizado em: 26 abr 2026 ✓                     │
├──────────────────────────────────────────────────┤
│ BUSCA PRINCIPAL (Command/Combobox Radix)         │
│ ┌────────────────────────────────────────────┐ │
│ │ 🔍 Buscar cidade, bairro ou prestador…    │ │
│ └────────────────────────────────────────────┘ │
│ ▸ Sugestões: Rio de Janeiro, São Paulo, Brasília│
├──────────────────────────────────────────────────┤
│ ATALHOS POR ESTADO (chips horizontais)           │
│ [RJ 3.696] [SP 2.996] [DF 447] [PR 394] [+22]   │
├──────────────────────────────────────────────────┤
│ FILTROS AVANÇADOS (Accordion colapsável)         │
│ ▸ Tipo de prestador: [Hospital] [Lab] [Clínica] │
│ ▸ Rede/Produto Amil: [combobox 11 redes]        │
├──────────────────────────────────────────────────┤
│ RESULTADOS (lazy-load por scroll, 25 por vez)    │
│ ┌──────────────────────────────────────────┐ │
│ │ 🏥 Hospital São Lucas                     │ │
│ │ Copacabana · Rio de Janeiro · RJ          │ │
│ │ Aceita: Black, S750, Platinum +5         │ │
│ │ [Ver detalhes →]                          │ │
│ └──────────────────────────────────────────┘ │
│ [continua…]                                      │
├──────────────────────────────────────────────────┤
│ FAQ (8 perguntas, FAQPage schema)                │
├──────────────────────────────────────────────────┤
│ CTA: Quer cotação para sua empresa? [WhatsApp] │
├──────────────────────────────────────────────────┤
│ DISCLAIMER ANS + corretor SUSEP                  │
└──────────────────────────────────────────────────┘
```

**Componentes Radix UI:** `Command` (busca com fuzzy), `Combobox` (rede), `Accordion` (filtros), `ScrollArea` (resultados), `Tabs` (alternar lista/mapa), `HoverCard` (preview prestador desktop), `Dialog` (mobile detail view).

### 2.3 Página-prestador `/rede/[uf]/[municipio]/[prestador-slug]`

Realista dado **gaps do dataset** (sem endereço/tel/coords):

```
┌─────────────────────────────────────────────────┐
│ Breadcrumb: Início › Rede › RJ › Rio › [Nome] │
├─────────────────────────────────────────────────┤
│ H1: [NOME DO PRESTADOR]                         │
│ Subtítulo: Bairro · Município · UF              │
│ Tipo inferido (badge): 🏥 Hospital              │
├─────────────────────────────────────────────────┤
│ COBERTURA AMIL (lista visual de 11 redes)       │
│ ✓ AMIL ONE S6500 BLACK QP                       │
│ ✓ BLACK                                         │
│ ✓ AMIL S750 QP                                  │
│ ✗ ADESÃO BRONZE RJ (não credenciado)            │
│ … (todas as 11 redes listadas, marcadas ou não)│
├─────────────────────────────────────────────────┤
│ MAPA APROXIMADO (Leaflet/OSM, centroide bairro) │
│ ⚠️ Aviso: localização aproximada (ver app oficial│
│   Amil para endereço exato)                     │
├─────────────────────────────────────────────────┤
│ COMO USAR ESTE PRESTADOR                        │
│ 1. Confirme cobertura no app oficial Amil      │
│ 2. Agende com seu plano em mãos                │
│ 3. [Botão WhatsApp para corretor] - ajuda?     │
├─────────────────────────────────────────────────┤
│ PRESTADORES PRÓXIMOS (mesmo bairro)             │
│ [Card] [Card] [Card]                            │
├─────────────────────────────────────────────────┤
│ PERGUNTAS FREQUENTES (FAQPage schema)           │
├─────────────────────────────────────────────────┤
│ DISCLAIMER + última atualização visível         │
└─────────────────────────────────────────────────┘
```

**Sem inventar conteúdo**: o que o dataset não tem (telefone, endereço completo, especialidades) **não é exibido**. Em vez disso, "Confirme no app oficial Amil" + CTA WhatsApp ao corretor.

### 2.4 Página-rede `/rede/[rede-slug]/[uf]` (cluster E — top conversão)

Esta é nova vs Screen 7 e merece atenção dedicada:

```
┌─────────────────────────────────────────────────┐
│ Breadcrumb: Início › Rede › Amil S750 › SP     │
├─────────────────────────────────────────────────┤
│ H1: Onde o plano Amil S750 é aceito em São Paulo│
│ Subtítulo: 187 prestadores credenciados em SP   │
│ Atualizado: 26 abr 2026                         │
├─────────────────────────────────────────────────┤
│ STATS RÁPIDOS                                   │
│ 🏥 12 Hospitais · 🧪 24 Labs · 🏛 89 Clínicas │
│ Top cidades: SP capital (78), Campinas (12)…   │
├─────────────────────────────────────────────────┤
│ MAPA (Leaflet com pins por cidade)              │
├─────────────────────────────────────────────────┤
│ PARA EMPRESAS QUE QUEREM AMIL S750 EM SP       │
│ [3 parágrafos editoriais 400 palavras]          │
│ + tabela mensalidade base (link → /tabela…)     │
├─────────────────────────────────────────────────┤
│ LISTA DE PRESTADORES (agrupada por município)   │
│ ▾ São Paulo (78)                                │
│   - Hospital X · Vila Mariana                   │
│   - Hospital Y · Itaim Bibi                     │
│   …                                             │
│ ▾ Campinas (12)                                 │
│   …                                             │
├─────────────────────────────────────────────────┤
│ CTA: Cotação para esta rede [WhatsApp/Form]    │
├─────────────────────────────────────────────────┤
│ DISCLAIMER                                      │
└─────────────────────────────────────────────────┘
```

Schema markup: `HealthInsurancePlan` + `ItemList` (de prestadores) + `FAQPage` + `BreadcrumbList`.

### 2.5 Hierarquia de filtros — busca livre primeiro

**Decisão UX:** busca livre (Command) é o entry point principal. Filtros UF→Município→Bairro são fallback secundário em accordion. Por quê:
- Usuário tipa "São Paulo" mais rápido do que clica 3 dropdowns
- 87% das sessões mobile são scroll-and-tap, não filter heavy (Baymard Institute)
- Filtros aninhados em mobile = abandono

### 2.6 Acessibilidade WCAG 2.1 AA (extras desta tela)

- Combobox (`Command` Radix) com `aria-autocomplete="list"` e anúncio de count em live region
- Filtros chip com role="button" + aria-pressed
- Mapa Leaflet alternativo: tabela acessível por padrão (mapa é "enhancement"), conforme front-end-spec linha 1280
- Contraste paleta `#0066B3 / #00C389` validar em badges de tipo (cinco, alguns ratio <4.5:1) — usar variantes `-700` se necessário
- Foco visível com outline `#00C389` 2px (já em design tokens)

### 2.7 Core Web Vitals — estratégia

| Métrica | Target | Como atingir com 9k registros |
|---|---|---|
| **LCP <1.8s** | ✅ obrigatório | Nunca embarcar dataset full client-side. Server-render top-25 + lazy-load demais via streaming RSC |
| **INP <200ms** | ✅ obrigatório | Busca client-side com `useDeferredValue` + index pré-built (Fuse.js ou MiniSearch sobre subset) |
| **CLS <0.05** | ✅ obrigatório | Skeleton heights fixos para cards, sem mapa em above-fold |

---

## 3. Arquitetura Técnica (Aria — Architect)

### 3.1 Estratégia de geração — híbrido SSG + ISR

| Tipo de página | Estratégia | Justificativa |
|---|---|---|
| `/rede-credenciada` (hub) | **RSC + ISR 7d** | Hub muda quando dataset atualiza (mensal); 7d gera fresh signal SEO sem rebuild |
| `/rede/[uf]` (26) | **SSG + ISR 30d** | Conteúdo agregado estável |
| `/rede/[uf]/[municipio]` top-100 (450) | **SSG full** | Densidade alta, vale o build time |
| `/rede/[uf]/[municipio]` cauda (~338) | **ISR sob demanda (revalidate 30d)** | Reduz build inicial, gera on first hit |
| `/rede/[uf]/[municipio]/[bairro]` (~700-800) | **SSG full** | Filtrados ≥3 prestadores; long-tail moat |
| `/rede/[uf]/[municipio]/[prestador-slug]` (9.325) | **SSG por região (chunking)** | Sudeste primeiro (RJ+SP = 6.692), depois CO/NE/Sul/Norte |
| `/rede/[rede-slug]/[uf]` (~286) | **SSG full** | Cluster E = high-conversion, vale o build |
| `/[tipo]/[uf]/[municipio]` (~250-350 filtrados) | **SSG full** | Filtrar tipo classificado ≥3 prestadores |

**Total SSG inicial estimado:** ~10.500 URLs.

### 3.2 Build time — risco e mitigação

ADR-005 + architecture.md "Build Performance" estimaram 5.000-6.500 URLs em ~30-40min Hobby. Com 10.500 URLs:

| Cenário | Build time projetado | Decisão |
|---|---|---|
| Sem chunking, Hobby tier | **~60-75min** ❌ Excede teto Hobby (45min) | Bloqueante |
| Chunking por região + Hobby | ~30min/phase × 4 phases | Viável mas 4 deploys/dia |
| Sem chunking, Pro tier | ~20-30min em 1 build (12 concurrent) | ✅ **Recomendado** |
| ISR para cauda + SSG só top-N | ~25min Hobby | ✅ alternativa boa |

**Decisão recomendada:** estratégia híbrida — top-50 cidades + top-1000 prestadores SSG full + cauda em ISR. Reduz build a ~2.500 URLs estáticos + 7.500 ISR sob demanda. Cabe em Hobby.

### 3.3 Storage do dataset — JSON estático (NÃO Upstash Redis)

| Opção | Veredito |
|---|---|
| **JSON estático em `src/data/operadoras/amil/rede-credenciada.json`** | ✅ **Escolhido** |
| Upstash Redis | ❌ Overkill — dataset é build-time only, não runtime; Redis paga em RU/s sem ganho |
| PostgreSQL (Vercel Postgres) | ❌ Sobre-engineering — dataset cabe em memória; queries são lookup simples |

Loader em `src/lib/operadoras/amil/rede-credenciada-loader.ts` (já parcialmente desenhado em `data/rede-credenciada/rede-amil.ts`) com:
- Cache em memória (Map) construído no boot do build worker
- Helpers: `getByUf`, `getByMunicipio`, `getByBairro`, `getBySlug`, `getByRede`, `getStats`, etc.

**Upstash Redis fica reservado** para o que está no PRD: rate limiting do form, cache de chamadas BrasilAPI/CNPJ, KV de leads (não para o dataset).

### 3.4 Pipeline de atualização (Story 6.6 reforçada)

Status atual: `data/rede-credenciada/README.md` já documenta sync manual hub→site. Próxima evolução:

```
┌─────────────────────────────────────────────────────────┐
│ FASE 1 — MANUAL (hoje, até Story 6.6 fechar)           │
├─────────────────────────────────────────────────────────┤
│ 1. node scrape_powerbi_amil.js (no hub planodesaudepj)  │
│ 2. cp para planoamilempresas/data/rede-credenciada/      │
│ 3. git add + commit + push                               │
│ 4. Vercel rebuild automático                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ FASE 2 — AUTOMATIZADO (Story 6.6)                       │
├─────────────────────────────────────────────────────────┤
│ • GitHub Action mensal (cron 1º dia 03:00 BRT)         │
│ • Roda Playwright em runner Linux                       │
│ • Diff vs anterior — alerta se Δ > 20%                  │
│ • Notifica WhatsApp Agnaldo para validação              │
│ • Auto-PR + auto-merge se diff <5% e checks ✅          │
│ • Vercel deploy + sitemap.xml ping ao GSC              │
└─────────────────────────────────────────────────────────┘
```

### 3.5 Risco de thin content — mitigações

Páginas-prestador **sem endereço/telefone/especialidade** são o maior risco. Mitigação obrigatória:

1. **Mínimo 600 palavras por página** (regra Story 5.7) — atingir via:
   - 3 parágrafos editoriais por tipo (template variável: hospital vs lab vs clínica)
   - Tabela de redes aceitas (8-11 linhas)
   - 5 perguntas FAQ específicas por tipo de prestador
   - "Como usar este prestador" (3 passos contextualizados)
   - "Prestadores próximos" (3 cards do mesmo bairro)

2. **Variação contextual via templates** (não copy-paste literal):
   - Tipo "Hospital" → menciona pronto-socorro 24h, internação, maternidade
   - Tipo "Laboratório" → menciona horários, exames de rotina, jejum
   - Tipo "Clínica" → menciona consulta eletiva, especialidades comuns
   - Tipo "Outro" → template genérico mas com nome+bairro+UF interpolados

3. **`noindex` em páginas com prestador único em cidade <5 prestadores**: cauda extrema é thin content quase certo, melhor bloquear que arriscar Helpful Content penalty. Adicionar regra no loader.

4. **GSC Cluster Report (Story 5.8)** monitora canibalização e thin content pós-launch.

### 3.6 Investigação pendente — gap "11 redes vs 49 redes"

Ao analisar o dataset:
- Header `redes` array: **49 strings**
- Prestadores realmente associados a redes: **apenas 11 redes**

Isso é suspeito. Hipóteses:
- (a) Scraper enumerou 49 mas só 11 vieram populadas no `prestadores[].redes`
- (b) Memória `project_amil_rede_credenciada_powerbi.md` registra que dropdown "Rede" tem 176+ produtos mas só 49 foram capturados visualmente
- (c) Prestadores podem aceitar redes não listadas no array `redes[]` do JSON (incoerência interna)

**Action:** rodar `scrape_powerbi_amil.js` em modo verbose ou enumerar `dataset.prestadores[].redes` set-difference com `dataset.redes` para validar antes de depender do array. Bloqueante para `/rede/[rede-slug]` pages.

### 3.7 Sitemap dinâmico

Estrutura recomendada (vai em `src/app/sitemap.ts`):

```ts
// Sitemap shards (Google aceita até 50.000 URLs por arquivo)
sitemap-pages.xml         → core (home, pillar, cornerstones, tools)
sitemap-rede.xml          → /rede-credenciada + /rede/[uf] + /rede/[rede-slug]
sitemap-rede-municipios.xml → /rede/[uf]/[municipio]
sitemap-rede-bairros.xml  → /rede/[uf]/[municipio]/[bairro]
sitemap-prestadores.xml   → /rede/[uf]/[municipio]/[prestador-slug]
sitemap-tipos.xml         → /[tipo]/[uf]/[municipio]
sitemap-cidades-clone.xml → /plano-amil-[cidade] (Story 5.0)
sitemap-cnae.xml          → matriz CNAE × cidade
```

Cada shard com `<lastmod>` real do dataset → fresh signal forte.

---

## 4. Roadmap de Stories (Morgan — PM)

### 4.1 Impacto no PRD v1.2.2 — não cria stories novas, **recalibra existentes**

| Story atual | Status | Mudança proposta |
|---|---|---|
| **6.5 Rede Credenciada — Pipeline + 5 Ataques SEO** | Aprovada | Recalibrar volumes: 2.071→9.325 prestadores; 3.500-4.500→10.500 URLs; reescrever ACs 14 (build time) |
| **6.6 Pipeline Mensal** | Aprovada | Adicionar AC: deduplicação dataset hub↔site (single source) |
| **5.7 Auditoria de Conteúdo Wave 1+2** | Aprovada | Estender escopo para auditar ≥600 palavras em páginas-prestador |
| **5.8 GSC Cluster Report** | Aprovada | Sem mudança — já cobre |
| **1.4 Canary** | Aprovada | Validar build time real após chunking decision |

### 4.2 Stories novas propostas (se aprovado o GO)

| ID | Nome | Tamanho | Bloqueio |
|---|---|---|---|
| **6.5a** | Pre-flight: validar gap 11 vs 49 redes do dataset | XS (1d) | bloqueia 6.5 |
| **6.5b** | Loader rede-amil.ts — atualizar para 9.325 prestadores + helpers `getByRede()` | S (2-3d) | bloqueia 6.5 |
| **6.5c** | Templates editoriais por tipo (Hospital / Lab / Clínica / Outro) — 4 variantes ≥600 palavras | M (5-7d) | bloqueia 6.5 |
| **6.5d** | Filtros anti-thin (noindex regras, ≥3 prestadores/bairro, ≥3 cidades/tipo) | S (2d) | bloqueia 6.5 |
| **6.5e** | `<NetworkSearch />` Client Component com MiniSearch index | M (4-5d) | parte de 6.5 |
| **6.5f** | Schemas JSON-LD por tipo (`MedicalOrganization` + subtipos) | S (3d) | parte de 6.5 |
| **6.5g** | `/rede/[rede-slug]/[uf]` cluster E (high-conversion) | M (4-5d) | parte de 6.5 |

**Total adicionado:** ~21-26 dev-days (3-4 semanas com 1 dev). **Cabe no budget de 14-18 semanas**: epic 6 já tem 5-6 semanas alocadas, esse refinamento entra dentro dele.

### 4.3 Priorização recomendada — onda por valor

**Wave 1 — máximo ROI (cobre 85% do tráfego potencial):**
- Hub `/rede-credenciada`
- 5 estados densos: RJ, SP, DF, PR, MG (= 7.926 prestadores, 85%)
- Top-50 municípios SSG full
- Cluster E completo (286 páginas rede×UF)

**Wave 2 — cobertura completa:**
- Demais 21 estados
- Cauda de municípios em ISR
- Bairros filtrados (≥3 prestadores)
- Tipos+UF+município filtrados

**Wave 3 — long-tail extremo:**
- Páginas-prestador individuais (chunking por região)
- Internal linking automatizado refinado
- FAQs por tipo de prestador

### 4.4 Gating

- **6.5a (validação 11vs49 redes)** bloqueia 6.5b/c/g
- **6.5b (loader atualizado)** bloqueia todas as demais
- **Story 6.6 não bloqueia 6.5** mas sync manual deve estar documentado antes do primeiro deploy de rede

---

## 5. Riscos & Mitigações (Consolidado)

| Risco | Severidade | Probabilidade | Mitigação |
|---|---|---|---|
| **Helpful Content penalty (thin content em ~9k prestadores sem endereço/tel)** | 🔴 Alta | Média | Templates ≥600 palavras + filtros noindex em casos extremos + variação por tipo + monitoring GSC (Story 5.8) |
| **Build time excede tier Hobby (45min)** | 🟡 Média | Alta sem chunking | Híbrido SSG+ISR conforme §3.1; upgrade Pro $20/mês como contingência |
| **Cease & desist Amil (uso de marca)** | 🔴 Alta | Baixa-Média | Disclaimer corretor SUSEP em todas; sem logo Amil; texto "corretor autorizado, não Amil"; plano contingência domínio-ponte (ADR-004) |
| **Dataset desincroniza entre `planodesaudepj` e `planoamilempresas`** | 🟡 Média | Alta sem automação | Story 6.6 single-source-of-truth + validação diff Story 6.6 AC4 |
| **Inferência de tipo (75% "Outro") gera schema impreciso** | 🟢 Baixa | Alta | Fallback para `LocalBusiness` quando "Outro"; melhorar regex em iteração |
| **Gap 11 vs 49 redes invalida cluster E** | 🟡 Média | Média | Story 6.5a pre-flight validação antes de dependência |
| **Páginas-prestador não convertem (cluster C)** | 🟢 Baixa | Alta (esperada) | Aceitar — valor é autoridade SEO + brand + indireto, não lead direto |
| **Concorrente Amilsa/CompanyHero replica dataset em 60d** | 🟡 Média | Baixa | Moat real é o conjunto: dataset + tabela + matriz CNAE + cornerstones + autoridade. Não replicável em 60d |
| **Mudança Amil descontinua dataset Power BI público** | 🔴 Alta | Baixa | Snapshot histórico em S3/Blob mensal; degrade gracioso para "última atualização há X meses" + disclaimer |

---

## 6. Decisão Recomendada

### ✅ **GO com escopo dimensionado por densidade**

**Justificativa:**
1. **Plano arquitetural já existe e é sólido** (ADR-005 + Story 6.5/6.6 + front-end-spec Screen 7) — recalibração quantitativa, não scope creep
2. **Dataset 4.5× maior é gain real** sem custo arquitetural significativo (mesmo loader, mesmas rotas, só mais SSG/ISR)
3. **Moat competitivo aumenta**: 10.500 URLs com schema rich vs concorrentes com zero JSON-LD = ganho de SERP real
4. **ROI assimétrico**: Wave 1 (5 estados densos) cobre 85% do potencial com ~25% do esforço total
5. **Riscos controláveis**: thin content endereçado por templates+filters+noindex; build time por chunking ou Pro tier $20/mês

### ⚠️ Condições de GO

1. **Story 6.5a (pre-flight)** roda primeiro — não comprometer 286 URLs cluster E sem confirmar gap redes
2. **Story 6.5b (loader)** atualiza para 9.325 antes de qualquer template
3. **PRD v1.2.3** com recalibração de Story 6.5 ACs 14-17 (volumes corretos) — Sprint Change Proposal leve, owners @pm + @po
4. **Honestidade de conversão**: nenhum claim de CR público sem A/B test pós-launch (feedback memorizado)
5. **Single source of truth**: dataset vive em `planoamilempresas/data/rede-credenciada/rede-credenciada.json`; hub `planodesaudepj` consome ou cópia

### 📅 Timeline estimado

| Sprint (2 semanas) | Entrega |
|---|---|
| Sprint X+0 | 6.5a validação + 6.5b loader |
| Sprint X+1 | 6.5c templates + 6.5d filtros |
| Sprint X+2 | 6.5e NetworkSearch + 6.5f schemas |
| Sprint X+3 | 6.5g cluster E + Wave 1 deploy |
| Sprint X+4 | Wave 2 + Story 5.7 audit |
| Sprint X+5 | Wave 3 + Story 5.8 GSC Cluster Report |

**Pré-requisitos cumpridos:** Stories 1.0→1.4 (kickoff/fork/DNS/CI-CD/canary).
**Bloqueios externos:** confirmação stakeholder do mapeamento 11 redes ↔ tabela de preço (gap conhecido).

---

## Anexo A — Análise estatística completa do dataset

Gerado em 2026-04-26 via `analyze_amil_dataset.js`. Dataset fonte: `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json` (geradoEm 2026-04-26T02:21:13Z).

### A.1 Top 20 municípios

| Rank | UF | Município | Prestadores |
|---|---|---|---|
| 1 | RJ | Rio de Janeiro | 2.202 |
| 2 | SP | São Paulo | 1.194 |
| 3 | DF | Brasília | 447 |
| 4 | RJ | Niterói | 369 |
| 5 | PR | Curitiba | 229 |
| 6 | CE | Fortaleza | 224 |
| 7 | SP | Campinas | 182 |
| 8 | GO | Goiânia | 156 |
| 9 | SP | Jundiaí | 145 |
| 10 | RJ | Petrópolis | 135 |
| 11 | RJ | Nova Iguaçu | 133 |
| 12 | SP | Santo André | 133 |
| 13 | PE | Recife | 132 |
| 14 | RJ | Duque de Caxias | 129 |
| 15 | RJ | São Gonçalo | 121 |
| 16 | SP | São Bernardo do Campo | 113 |
| 17 | MG | Belo Horizonte | 111 |
| 18 | SP | Mogi das Cruzes | 101 |
| 19 | BA | Salvador | 98 |
| 20 | SP | Santos | 91 |

### A.2 Distribuição por UF (todas)

```
RJ  3.696   ████████████████████████████████████
SP  2.996   ███████████████████████████████
DF    447   ████
PR    394   ████
MG    393   ████
CE    241   ██
GO    229   ██
PE    226   ██
BA    175   █
RN     91   ▌
ES     81   ▌
RS     73   ▌
PB     46   ▎
SC     36   ▎
MT     35   ▎
PA     35   ▎
AL     30   ▎
MS     29   ▎
MA     22   ▎
TO     11   ▏
SE     10   ▏
RO      8   ▏
PI      8   ▏
AM      8   ▏
AP      4   ▏
RR      1   ▏
```

### A.3 Distribuição de tipos (regex inferido)

| Tipo | Count | % |
|---|---|---|
| Outro (não-classificado) | 6.978 | 74.8% |
| Clínica | 936 | 10.0% |
| Laboratório | 504 | 5.4% |
| Centro/Instituto | 502 | 5.4% |
| Hospital | 199 | 2.1% |
| Diagnóstico por Imagem | 175 | 1.9% |
| Maternidade | 20 | 0.2% |
| Odontologia | 7 | 0.1% |
| Pronto-Socorro | 4 | 0.0% |

### A.4 11 redes ativas (não 49)

| Rede | Prestadores | Slug proposto |
|---|---|---|
| ADESÃO OURO MAIS | 4.980 | `adesao-ouro-mais` |
| AMIL S380 QP | 4.969 | `amil-s380-qp` |
| AMIL S380 QC | 4.969 | `amil-s380-qc` |
| BLACK | 4.963 | `black` |
| AMIL S580 QP | 4.961 | `amil-s580-qp` |
| AMIL S750 QP | 4.959 | `amil-s750-qp` |
| AMIL S450 QC | 4.956 | `amil-s450-qc` |
| AMIL S450 QP | 4.955 | `amil-s450-qp` |
| AMIL ONE S6500 BLACK QP | 1.521 | `amil-one-s6500-black-qp` |
| ADESÃO BRONZE RJ | 1.142 | `adesao-bronze-rj` |
| ADESÃO BRONZE SP | 937 | `adesao-bronze-sp` |

> ⚠️ Header do JSON anuncia 49 redes mas só 11 têm prestadores associados. Story 6.5a pre-flight resolve.

### A.5 Top 5 bairros (concentração para clusters de bairro)

| UF | Município | Bairro | Prestadores |
|---|---|---|---|
| RJ | Rio de Janeiro | Barra da Tijuca | 314 |
| RJ | Rio de Janeiro | Tijuca | 250 |
| RJ | Niterói | Icaraí | 185 |
| RJ | Rio de Janeiro | Copacabana | 184 |
| DF | Brasília | Asa Sul | 169 |

---

## Referências

- `docs/prd.md` v1.2.2 — Story 6.5, 6.6, 5.7, 5.8
- `docs/architecture.md` — Build Performance, Workflow 4 (Atualização Mensal)
- `docs/front-end-spec.md` — Screen 7 (Rede Credenciada)
- `docs/decisions/adr-005-programmatic-seo-depth-strategy.md`
- `docs/decisions/adr-000-nextjs-over-astro.md`
- `data/rede-credenciada/README.md` — pipeline + compliance
- `C:\Users\benef\analyze_amil_dataset.js` — script de análise (artefato deste plano)
- `C:\Users\benef\amil-rede.html` — visualizador local do dataset

— Orion, orquestrando o sistema 🎯
