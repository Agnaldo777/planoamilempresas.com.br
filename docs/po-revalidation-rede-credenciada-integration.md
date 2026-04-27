# Re-validação PO — Rede Credenciada Integration Plan

**Documento:** PO Re-validation Report — Rede Credenciada Integration Plan
**Projeto:** planoamilempresas.com.br
**Validador:** Pax (Product Owner — Synkra AIOS) ♎
**Data:** 2026-04-26
**Input validado:** `docs/rede-credenciada-integration-plan.md` (orquestrado por Orion / aios-master)
**Inputs cruzados:** `prd.md` v1.2.2, `architecture.md` v1.1, `front-end-spec.md` v1.0, ADRs 000-005, `data/rede-credenciada/rede-amil.ts`, `data/rede-credenciada/rede-credenciada.json` (atual), dataset novo em `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json`
**Checklist canônico:** PO Master Checklist (12 itens, mesmo framework do `po-revalidation-report-v1.2.2.md`)

---

## Seção 1 — Resumo Executivo

### Veredito

**APROVADO COM CONDIÇÕES** — plano vai para Sprint Change Proposal v1.2.3, mas **com 1 BLOCKER e 3 MAJOR issues que precisam ser resolvidos no SCP antes de qualquer story de dev iniciar**.

### Pass rate geral

**81,5%** (9,8 de 12 itens da framework PO Master Checklist).

| Faixa | Significado | Decisão Pax |
|---|---|---|
| ≥ 95% | Aprovação direta, segue para SCP sem mudanças | — |
| 85-94% | Aprovação com ressalvas, mudanças menores no SCP | — |
| **70-84%** | **Aprovação com condições, SCP precisa endereçar issues HIGH antes de @sm criar stories** | **← Estamos aqui** |
| < 70% | Não aprovado, retorno para Orion + squad | — |

### Top 3 forças

1. **Recalibração quantitativa, não scope creep.** Plano corretamente identifica que ADR-005 + Story 6.5 + Screen 7 já desenharam o esqueleto da rede credenciada, e o dataset novo de 9.325 prestadores é input quantitativo a uma arquitetura existente. Isso preserva trabalho prévio (`competitor-analysis.md`, `keyword-strategy-research-prompt.md`, ADR-005 anti-canibalização) e evita re-debate de decisões já fechadas.

2. **Escopo dimensionado por densidade é prudente.** Wave 1 com top-5 estados (RJ/SP/DF/PR/MG = 7.926 prestadores, 85% do dataset) cobre a maior parte do potencial SEO com ~25% do esforço. Estratégia híbrida SSG+ISR endereça o risk de build time (NFR1, ADR-005, architecture.md "Build Performance"). É decisão consistente com a memória do projeto (`feedback_claims_metricas.md` + `project_amil_rede_credenciada_powerbi.md`).

3. **Honestidade sobre limitações é exemplar.** Plano explicitamente flag (a) gap 11 vs 49 redes como bloqueante, (b) tipo inferido com 75% "Outro" como problema de schema, (c) páginas-prestador sem endereço/tel como risco de thin content, (d) CR 5-8% cluster E como "estimativa externa, não publicar". Alinha com feedback memorizado sobre A/B test + honestidade vs claims sem fonte. **Mas a proteção contra leak desses claims precisa ser mais forte (ver MAJOR-3 abaixo).**

### Top 3 gaps

1. **🚨 BLOCKER — Schema do loader `rede-amil.ts` é INCOMPATÍVEL com dataset novo, não apenas precisa "atualização".** Plano subestima Story 6.5b como "S 2-3 dias". Realidade verificada nos arquivos:
   - **Loader atual** (`data/rede-credenciada/rede-amil.ts` linhas 62-79) espera schema raw `{Prestador (combinado), UF, "Município", Bairro, "REDE 300 NACIONAL BLUE": boolean, "REDE 200 NACIONAL BLUE": boolean, "AMIL ONE S6500 BLACK QP": boolean, "AMIL ONE S2500 QP": boolean, BLACK: boolean, "PLATINUM MAIS": boolean, "PLATINUM QP": boolean, "AMIL S750 QP": boolean, "AMIL S580 QP": boolean, "AMIL S450 QP": boolean}` — **14 colunas com 10 booleanos por rede**.
   - **Dataset novo** (`planodesaudepj/src/data/operadoras/amil/rede-credenciada.json`) tem schema `{geradoEm, fonte, totalRedes, totalPrestadores, redes[], prestadores[].{codigo, nome, uf, municipio, bairro, redes: string[]}}` — **shape RAIZ diferente, redes como array de strings (não booleanos)**.
   - **5 das 10 redes do enum `RedeAmilNome` SUMIRAM** no dataset novo: `REDE 300 NACIONAL BLUE`, `REDE 200 NACIONAL BLUE`, `AMIL ONE S2500 QP`, `PLATINUM MAIS`, `PLATINUM QP`.
   - **6 redes NOVAS apareceram**: `ADESÃO OURO MAIS`, `AMIL S380 QP`, `AMIL S380 QC`, `AMIL S450 QC`, `ADESÃO BRONZE RJ`, `ADESÃO BRONZE SP`.
   - **Severidade: BLOCKER.** Loader, tipos (`RedeAmilNome`, `REDE_KEYS`, `REDE_SLUGS`), parser `parsePrestador`, e função `getPrestadoresPorRede(rede: RedeAmilNome)` são todos rewrite, não atualização. Story 6.5b precisa ser **M (4-5 dias)**, não S, e precisa ser mapeada em ACs explícitas com migração ordenada do enum.

2. **🟠 MAJOR — Plano não decidiu single-source-of-truth do dataset entre `planodesaudepj` e `planoamilempresas`.** Plano sugere "single source no `planoamilempresas`" (Seção 5 e 6.3), mas o scraper canônico vive em `C:\Users\benef\scrape_powerbi_amil.js` e o dataset 2026-04-26 foi gerado para o hub `planodesaudepj`, não para `planoamilempresas`. Existem 3 caminhos viáveis:
   - **A)** Hub é source-of-truth, `planoamilempresas` é mirror via Story 6.6 (cp file + commit)
   - **B)** `planoamilempresas` é source-of-truth, hub passa a consumir do `planoamilempresas`
   - **C)** Scraper passa a gravar nos 2 projetos simultaneamente (write-twice)
   - O plano implica B sem justificar por quê (e por quê o hub deixaria de ser canon). Decisão impacta Story 6.6 ACs e o pipeline de Vercel Cron. Memória `project_planodesaudepj_pending_github.md` registra que o hub tem commits Amil prontos no master local — escolher B agora pode invalidar trabalho do hub.

3. **🟠 MAJOR — ADR-005 está com Status "Accepted" mas plano propõe recalibração que altera parâmetros centrais.** ADR-005 Decision table cita `/rede/[uf]/[municipio]/[prestador-slug]` com **2.071 URLs** e total **5.000-6.500 URLs**. Plano novo propõe **9.325 prestadores** e total **~10.500 URLs**. Não é incremento marginal — é mudança de ~60-100% no volume. Process compliance exige:
   - **Adendo formal ao ADR-005** (não basta atualizar inline na architecture.md), com nova versão ou subseção "v2 Recalibration 2026-04-26" + Authored by Aria + Pax co-sign.
   - OR um **novo ADR-006** "Programmatic SEO Depth Recalibration — Dataset 2026-04" referenciando que ADR-005 fica overrided em parte.
   - Sem isso, audit trail fica quebrado. Memória do projeto registra preferência por governança ADR explícita (extração inline → arquivo formal foi tarefa do próprio Pax 2 dias atrás).

---

## Seção 2 — Validação ponto-a-ponto do brief Orion

> Brief original do usuário tinha 5 áreas focais. Aqui está a leitura Pax de cada uma.

### 2.1 Scope alignment com PRD v1.2.2

**Veredito: PARCIAL — alinhado em arquitetura, desalinhado em volumes.**

| Item PRD v1.2.2 | Plano novo propõe | Coerência |
|---|---|---|
| Story 6.5 cita 2.071 prestadores · 23 UFs · 14 colunas | 9.325 prestadores · 26 UFs · schema novo | ❌ Recalibração obrigatória |
| Story 6.5 cita ~3.500-4.500 URLs SEO | ~10.500 URLs SEO | ❌ Recalibração obrigatória |
| Story 6.5 cita "Loader funcional + 13 helpers cache" | Loader rewrite implícito | ❌ Re-escrita parcial |
| Story 6.6 AC 7 "Vercel detecta push e re-renderiza" | Manter; adicionar AC para single-source-of-truth | ⚠️ Adicionar AC |
| FR13 + FR23 (busca rede credenciada filtrável) | Hub `<NetworkSearch />` + filtros UF/Município/Tipo/Rede | ✅ Compatível |
| NFR1 (LCP <2.0s, Lighthouse ≥92) | Plano cita LCP <1.8s (mais agressivo) | ✅ Atende, talvez over-engineering |
| NFR2 (≤100KB JS) | Busca client-side com index pré-built (MiniSearch) | ✅ Compatível se index for ≤30KB |
| NFR9 (WCAG 2.1 AA) | Plano detalha aria-autocomplete, live region, fallback tabular | ✅ Compatível |

**Inflate Epic 6?** Plano adiciona 7 sub-stories (6.5a-6.5g, ~21-26 dev-days). Epic 6 atual tem 8 stories (6.1-6.8). Pós-recalibração, fica 6.1-6.8 + 6.5a-g = **15 stories**, ~doubling do epic. **Risco: Epic 6 perde foco "ferramentas de moat".** Recomendação: criar **Epic 7 — Programmatic SEO Rede Credenciada** com as 6.5a-g + 6.5 + 6.6 movidas, deixando Epic 6 como "calculator + tabela + biblioteca" puro. Decisão de Morgan no SCP.

### 2.2 Coerência com ADRs

| ADR | Status atual | Coerência com plano |
|---|---|---|
| ADR-000 (Next.js over Astro) | ✅ Accepted | ✅ Compatível — Next.js suporta o pattern proposto |
| ADR-001 (Sanity v3) | ✅ Accepted | ✅ Compatível — `networkProvider` schema é overlay editorial; dataset cru fica em JSON estático (decisão correta no plano §3.3) |
| ADR-002 (CRM Adapter — Clint) | ✅ Updated | N/A — sem impacto |
| ADR-003 (Calculator) | 📝 Proposed | N/A — sem impacto |
| ADR-004 (DNS Strategy) | 📝 Proposed | ✅ Reforçado — risco cease & desist mais forte com ~10.500 URLs nomeadas "Amil"; plano de contingência domínio-ponte continua válido |
| **ADR-005 (Programmatic SEO Depth)** | ✅ Accepted | ❌ **Recalibração necessária — ver MAJOR-3 acima** |

### 2.3 Gating crítico — pre-flight 6.5a (gap 11 vs 49 redes)

**Veredito: CONDICIONALMENTE bloqueante.**

- **Para Cluster E** (`/rede/[rede-slug]/[uf]` — 286 URLs estimadas): **SIM, bloqueante.** Publicar 11 páginas-rede sabendo que existem 38 redes adicionais não cobertas é risco de canibalização interna quando essas 38 entrarem (cada nova rede pode rebatear URLs já indexadas).
- **Para Wave 1 sem Cluster E:** NÃO bloqueante. Hub + páginas-cidade + páginas-prestador podem rodar sem Cluster E completo.

**Recomendação:** Story 6.5a tem 2 outputs possíveis:
- Output 1 — "Dataset tem realmente 11 redes ativas; 38 redes restantes do header `redes[]` são metadados de dropdown sem prestadores associados na fonte." → **GO** Cluster E com 11 URLs.
- Output 2 — "Dataset incompleto; 38 redes têm prestadores mas o scraper não capturou." → **HOLD** Cluster E até scraper rodar em modo verbose para capturar all-redes; ETA scraper rerun ~4-8h Playwright.

**Adicional**: Story 6.5a precisa expandir escopo para cobrir também o **mapeamento 11 redes do dataset ↔ 6 segmentações Bronze/Prata/Ouro/Platinum/Platinum Mais** da `data/tabelas-amil.ts` PRD v1.2.2. Sem esse mapping, página `/rede/[rede-slug]/[uf]` não consegue linkar coerentemente para `/tabela-precos-amil-2026?segmentacao=...`.

### 2.4 Riscos compliance

**Veredito: PARCIAL — coberto em narrativa, não em ACs operacionalizadas.**

| Compliance check | Plano cobre? |
|---|---|
| Disclaimer "rede sujeita a alterações pela operadora + última atualização [DATA]" | ✅ Cita em §1.5 e §4.4 (Story 6.5 AC 11) — herdado do PRD vigente |
| Disclaimer SUSEP corretor (NFR7, NFR8) | ⚠️ Cita "disclaimer corretor SUSEP em todas" mas não detalha ATC para validar nas 7 sub-stories — RIPS para auditoria |
| "Sem logo Amil oficial — apenas texto" (NFR8) | ⚠️ README do data já cobre; plano não reforça |
| **Risco URL-as-trademark** ("AMIL S750 QP" em URL) | ❌ **Gap silencioso — ver MAJOR-2-bis abaixo** |
| Story 5.7 audit ≥600 palavras × 9.325 páginas | ❌ Plano não tem estratégia operacional de audit em escala — ver MINOR-2 |
| Domínio-ponte ADR-004 contingência cease & desist | ⚠️ Plano cita mas não atualiza para volume 10.500 URLs |

**MAJOR-2-bis (extensão do MAJOR-2 do brief original):** URLs com nomes de produto Amil (`/rede/amil-s750-qp/sp`, `/rede/black/rj`, `/rede/adesao-ouro-mais/df`) são uso comercial de nome de produto Amil em URL pública — risk de marca. NFR8 é restrito ao "uso do termo Amil em texto" mas URL não foi modelada explicitamente. Mitigações alternativas:
- **A)** Slugs neutros + label visível (`/rede/premium-s750/sp` mostrando "AMIL S750 QP") — perde sinal SEO mas reduz risk
- **B)** Manter slugs canônicos + disclaimer agressivo + plano de contingência domínio-ponte (ADR-004) acionável em ≤24h
- **C)** Híbrido: slug com nome reduzido sem "AMIL" prefix (`/rede/s750-qp/sp`)

Decisão precisa Aria + advogado revisor (Story 2.4 deliverable). Plano novo deveria flagar essa decisão como bloqueante para Story 6.5g.

### 2.5 Honestidade de claims

**Veredito: BOA INTENÇÃO, INSUFICIENTE PROTEÇÃO.**

Plano §1.3 declara taxas de conversão (CR 1-2% Cluster A, 3-5% Cluster B, 5-8% Cluster E, etc.) e conclui com:
> ⚠️ Honestidade requerida: as taxas acima são estimativas baseadas em benchmarks externos, não dados reais do projeto. NÃO afirmar essas taxas em material publicado.

**Problema:** o documento `rede-credenciada-integration-plan.md` está em `docs/` que vai ser commitado ao repo. Memória `feedback_claims_metricas.md` registra preferência por A/B test + honestidade. Ricks de leak:
- Stakeholder copia trecho para pitch deck / proposta comercial
- Screenshot em apresentação
- Search interno futuro encontra "CR 5-8%" e assume como número validado
- Marketing terceirizado (redator freelance) lê doc e usa em copy SEO

**Recomendação:** mover Seção 1.3 (taxas de conversão) para `docs/_internal/conversion-hypotheses-rede-credenciada.md` com header gigante:
```
⚠️ INTERNAL WORKING NOTES — DO NOT QUOTE EXTERNALLY
These conversion rates are external benchmarks, NOT project data.
Calibrate via A/B test (Story 5.8 GSC Cluster Report) before any public claim.
```

E no `rede-credenciada-integration-plan.md` substituir a tabela detalhada por uma frase única:
> Hipóteses de conversão por cluster foram documentadas em `docs/_internal/conversion-hypotheses-rede-credenciada.md` para uso interno. Calibração real virá pós-launch via Story 5.8.

Isso faz o claim sair do material rastreável publicamente sem perder o trabalho intelectual.

---

## Seção 3 — Score por área (12 itens framework PO Master)

| # | Área | Pass rate | Observação |
|---|---|---|---|
| 1 | **Goal Alignment (Plano ↔ PRD ↔ ADRs)** | **75%** | ADR-005 recalibração obrigatória (MAJOR-3); Epic 6 risk de bloating (recomendar Epic 7 separado) |
| 2 | **FRs cobertos** | **95%** | FR13 (busca rede filtrável) + FR23 (filtro CEP/cidade/especialidade) cobertos. FR23 menciona "especialidade" — plano honestamente reconhece gap; mitigação Phase 2 |
| 3 | **NFRs com solução técnica** | **88%** | NFR1/2/9 atendidos. NFR8 (uso marca Amil) não estende para URL slugs (MAJOR-2-bis). NFR16 (DR/RTO) não menciona snapshot do dataset histórico (recomendado anexo) |
| 4 | **Stories testáveis** | **85%** | 6.5a-g têm tamanhos relativos mas faltam ACs concretos. 6.5b está como "S 2-3d" mas verificação de código revela ser M 4-5d (BLOCKER). 6.5c precisa estimar quantos templates editoriais (4 tipos × como variam por tamanho?) |
| 5 | **Sequenciamento lógico** | **92%** | 6.5a → 6.5b → 6.5c..g é sequência correta; 6.5a ANTES de qualquer outra é OK. Pequeno gap: dependência de Story 6.5g em mapeamento `data/tabelas-amil.ts` não está explícita |
| 6 | **Cross-cutting concerns** | **80%** | Compliance ANS coberto narrativamente; SUSEP/CNPJ menção genérica em todas as sub-stories falta operacionalizar (precisa AC em cada sub-story); GSC Cluster Report (5.8) bem referenciado |
| 7 | **Cross-validation com FE Spec / Architecture** | **70%** | Plano §2.2-2.7 detalha UX bem; mas FE spec atual ainda é v1.0 (drift conhecido do report v1.2.2 — Pax registrou patches pendentes). Plano novo NÃO menciona se Uma precisa atualizar FE spec Screen 7 para refletir 9.325 prestadores; risk de FE spec ficar com a Screen 7 obsoleta |
| 8 | **Data Models completos** | **70%** | Schema novo `{codigo, nome, uf, municipio, bairro, redes[]}` está implícito no plano mas NÃO documentado como interface TypeScript. Story 6.5b precisa ter AC explícita: "novo `interface PrestadorAmil` em `src/types/rede-credenciada-amil.ts`" alinhado com NFR14 (TypeScript estrito) e code-standards.md |
| 9 | **ADRs documentados** | **70%** | ADR-005 não recalibrado (MAJOR-3). Decisão URL-as-trademark (MAJOR-2-bis) precisa ADR novo. Pode ser ADR-006 ou seção de ADR-004 |
| 10 | **Risk Management** | **85%** | Riscos explicitados em tabela (§5 do plano). Falta: risco de scraper Power BI quebrar (mudança UI Amil) → snapshot histórico em S3 mensal alinhado com NFR16. Falta: risco de Helpful Content penalty operacionalizado em audit Story 5.7 (estratégia amostral, não exhaustiva — MINOR-2) |
| 11 | **Pendências bloqueantes** | **75%** | 1 BLOCKER + 3 MAJOR + 4 MINOR documentados neste relatório. Plano subestima Story 6.5b (BLOCKER); decisão SSOT (MAJOR-2); recalibração ADR-005 (MAJOR-3); URL-as-trademark (MAJOR-2-bis) |
| 12 | **Aprovação para Sprint Change Proposal v1.2.3** | **APROVADO COM CONDIÇÕES** | GO criteria detalhado na Seção 6 |

**Pass rate ponderado: 9,8/12 = 81,5%.**

---

## Seção 4 — Issues por severidade

### 🚨 BLOCKER (1)

**B-01 — Story 6.5b: Loader rede-amil.ts é REWRITE, não update.**
- **Impacto:** Sub-estima esforço em 50-100%. Cronograma da seção 4.3 do plano (Sprint X+0 entrega 6.5a + 6.5b) fica irrealista — 6.5b sozinho consome o sprint.
- **Detalhamento técnico:**
  - Schema raw esperado pelo loader atual é incompatível com schema novo (10 booleanos vs 1 array de strings)
  - Enum `RedeAmilNome` (10 valores) precisa virar union de 11 strings DIFERENTES + plano de migração ordenada
  - Constante `REDE_KEYS` + `REDE_SLUGS` precisam regeneração
  - Função `parsePrestador` lógica de extração `Prestador: "10000020 - INSTITUTO DE OLHOS"` não se aplica (dataset novo já vem com `codigo` + `nome` separados)
  - Helpers `getPrestadoresPorRede(rede: RedeAmilNome)`: assinatura muda
  - Cache em memória continua mas com tipos diferentes
  - Tests unitários (se houver) precisam regeneração
- **Mitigação:** re-tamanhar 6.5b para **M (4-5 dev-days)** + adicionar AC: "deprecação ordenada do enum antigo; tipos novos em `src/types/rede-credenciada-amil.ts`; loader em `src/lib/operadoras/amil/rede-credenciada-loader.ts`"
- **Owner:** @sm (River) durante story drafting; @dev (Dex) na implementação
- **Quando:** ANTES de Sprint X+1 começar

### 🟠 MAJOR (3+1)

**M-01 — Single-source-of-truth do dataset não decidido.**
- **Impacto:** Story 6.6 ACs ficam ambíguas; risk de drift entre `planodesaudepj` e `planoamilempresas`
- **Mitigação:** decisão de Morgan + Aria + Pax no SCP v1.2.3 com 3 caminhos:
  - **A) Hub é canon, planoamilempresas é mirror** ← Pax recomenda essa
  - **B) planoamilempresas é canon, hub consome dali**
  - **C) Write-twice no scraper**
- **Owner:** @pm (Morgan) com co-sign Aria + Pax
- **Quando:** parte do SCP v1.2.3

**M-02 — Risk URL-as-trademark com nomes de produto Amil em slugs.**
- **Impacto:** Aumenta superfície de cease & desist da Amil em ~10.500 URLs (vs ~3.500 no plano original)
- **Mitigação:** decisão A/B/C (ver Seção 2.4 deste relatório) com input de advogado revisor (Story 2.4 deliverable). Documentar como ADR-006 ou subseção em ADR-004.
- **Owner:** @architect (Aria) + advogado
- **Quando:** ANTES de Story 6.5g (Cluster E) iniciar

**M-03 — ADR-005 precisa recalibração formal.**
- **Impacto:** Audit trail quebrado; volumes "5.000-6.500 URLs" do ADR ficam contraditórios com novo plano "10.500 URLs"
- **Mitigação:** ADR-005 v2 (Update) ou ADR-006 novo. Pax recomenda **ADR-005 v2** (Update + Change Log + Authored by Aria + Pax co-sign 2026-04-26)
- **Owner:** @architect (Aria)
- **Quando:** parte do SCP v1.2.3

**M-04 — Hipóteses de conversão (CR 5-8% etc) precisam isolamento físico.**
- **Impacto:** Risk de leak para copy público / pitch externo; quebra preferência registrada em memória `feedback_claims_metricas.md`
- **Mitigação:** mover seção 1.3 do plano para `docs/_internal/conversion-hypotheses-rede-credenciada.md` com header "DO NOT QUOTE EXTERNALLY"
- **Owner:** Pax (auto-aplicar como parte deste relatório, ver §6 next steps)
- **Quando:** imediato (este SCP)

### 🟡 MINOR (4)

**m-01 — LCP target inconsistency: plano 1.8s vs NFR1 2.0s.**
- **Impacto:** Plano é mais agressivo que NFR — pode levar a over-engineering (preload demais, lazy-load conservador)
- **Mitigação:** ou alinhar plano com NFR1 (2.0s) ou Aria atualiza NFR1 para 1.8s no architecture.md (recomendado: alinhar para 2.0s, deixar 1.8s como "stretch goal" não-blocking)
- **Owner:** @architect (Aria)
- **Quando:** parte do SCP v1.2.3

**m-02 — Story 5.7 audit ≥600 palavras × 9.325 páginas-prestador não é exhaustivo.**
- **Impacto:** Helpful Content penalty risk em cauda (1-prestador-em-cidade-pequena)
- **Mitigação:** plano novo precisa AC: "Story 5.7 expand escopo — audit por amostragem estratificada (top-50 cidades, top-10 redes, mid-tier 30 cidades, tail 20 cidades aleatórias) = ~110 páginas auditadas representando ~80% do tráfego potencial"
- **Owner:** @sm (River) durante drafting de 5.7 expansion
- **Quando:** antes de Wave 2

**m-03 — Snapshot histórico do dataset não previsto (NFR16 DR/RTO).**
- **Impacto:** Se Amil mudar/desligar Power BI público, perdemos histórico
- **Mitigação:** AC nova em Story 6.6: "snapshot mensal do dataset commit em git como `data/rede-credenciada/snapshots/2026-MM.json` (gz)"
- **Owner:** @sm (River) durante drafting de 6.6 expansion
- **Quando:** parte do SCP v1.2.3

**m-04 — FE Spec Screen 7 desatualizado vs plano novo.**
- **Impacto:** Drift entre design e dataset real (memória registra que FE spec já estava em "drift crítico" no report v1.2.2 — agravar não ajuda)
- **Mitigação:** patch FE spec Screen 7: substituir "9.325 prestadores em 26 UFs" + remover menção a "especialidade" + adicionar componente `<NetworkSearch />` com index pré-built
- **Owner:** @ux-design-expert (Uma)
- **Quando:** paralelo ao SCP v1.2.3

---

## Seção 5 — Recomendações de modificação ao plano

### Modificações OBRIGATÓRIAS (precisam estar no SCP v1.2.3)

| # | Modificação | Onde |
|---|---|---|
| O-1 | Re-tamanhar Story 6.5b para M (4-5d) com AC explícita de rewrite + tipos novos | §4.2 do plano |
| O-2 | Adicionar Story 6.5z "Decisão SSOT do dataset (hub vs site vs write-twice)" como pre-flight paralela a 6.5a | §4.2 do plano |
| O-3 | Adicionar Story 6.5y "Decisão URL-as-trademark (slugs neutros vs canônicos)" com input de advogado | §4.2 do plano |
| O-4 | Mover Seção 1.3 (taxas de conversão) para `docs/_internal/conversion-hypotheses-rede-credenciada.md` | §1.3 do plano |
| O-5 | Atualizar ADR-005 → v2 com novo volumetria; OR criar ADR-006 referenciando override | docs/decisions/ |
| O-6 | Considerar mover stories 6.5a-g + 6.5 + 6.6 para Epic 7 separado (decisão Morgan) | §4.1 do plano |

### Modificações RECOMENDADAS (não bloqueantes do SCP)

| # | Modificação | Onde |
|---|---|---|
| R-1 | Alinhar LCP target para 2.0s (NFR1) ou atualizar NFR1 para 1.8s | §2.7 do plano e/ou architecture.md |
| R-2 | Adicionar AC de snapshot mensal histórico do dataset (NFR16) | §3.4 do plano e Story 6.6 |
| R-3 | Adicionar AC para FE spec Screen 7 patch v1.0→v1.1 | §2.2 do plano |
| R-4 | Story 5.7 audit por amostragem estratificada (não exhaustivo) | §3.5 do plano e Story 5.7 |
| R-5 | Adicionar interface TypeScript `PrestadorAmil` no plano §3.3 (não só em Story 6.5b) | §3.3 do plano |

---

## Seção 6 — Decisão e Next Steps

### Decisão

**APROVADO COM CONDIÇÕES** para gerar **Sprint Change Proposal v1.2.3** com endereçamento dos 1 BLOCKER + 4 MAJOR + 5 MINOR-recomendações.

### Sequence diagram do GO

```
Hoje (2026-04-26):
  Pax aprova com condições → SCP v1.2.3 entra em queue

SCP v1.2.3 owners (sequência):
  1. Aria (Architect): ADR-005 v2 OR ADR-006 (recalibração)              [4-6h]
  2. Aria (Architect): decisão URL-as-trademark com advogado revisor      [1-3 dias úteis com legal]
  3. Morgan (PM): decisão Epic 6 vs Epic 7 split + decisão SSOT dataset  [2-4h]
  4. Pax (PO): mover §1.3 do plano para docs/_internal/                  [15min — auto-aplicado]
  5. Uma (UX): patch FE spec Screen 7 v1.0→v1.1                          [30-45min]

Após SCP v1.2.3 publicado:
  River (@sm): drafts Story 6.5a (pre-flight 11 vs 49 redes + mapping ↔ tabela preço) [2-3h]
  River (@sm): drafts Story 6.5b (loader rewrite — M 4-5d)                            [3-4h]
  Dex (@dev): implementa 6.5a → 6.5b sequencial                                       [Sprint X+0]
```

### Next agent

**@aios-master (Orion)** assume após este gate para gerar Sprint Change Proposal v1.2.3 formal — comando `*correct-course` (delegado a aios-master conforme command-authority-matrix.md).

Caminho alternativo: **@pm (Morgan)** assume se SCP for considerado "PRD update" em vez de "course correction". Pax recomenda Orion porque envolve recalibração de ADR + redistribuição entre Epic 6 e potencial Epic 7 — escopo cross-agent.

### Conventional Commits sugeridos (durante SCP)

```
docs(adr): update ADR-005 to v2 with dataset 9325 recalibration
docs(adr): add ADR-006 url-as-trademark decision (network slugs)
docs(prd): update Story 6.5/6.6 ACs for SSOT dataset + sub-stories 6.5a-g
docs(po): commit po-revalidation-rede-credenciada-integration.md
docs(_internal): move conversion hypotheses to internal-only doc
docs(fe-spec): patch Screen 7 to reflect 9325 prestadores [Story 6.5]
chore(scope): split Epic 6 → Epic 7 for Programmatic SEO Rede Credenciada
```

---

## Seção 7 — Persistência das decisões

**Este relatório:** `C:\Users\benef\planoamilempresas\docs\po-revalidation-rede-credenciada-integration.md` (este arquivo).

**Sequence de commits sugerido (após validação @pm + @architect):**
1. `docs(po): add re-validation report for rede-credenciada integration plan`
2. `docs(_internal): isolate conversion hypotheses (Pax M-04 mitigation)`
3. `docs(adr): ADR-005 v2 recalibration` (Aria)
4. `chore(prd): SCP v1.2.3 update Story 6.5/6.6 + sub-stories 6.5a-g` (Morgan/Orion)

---

## Apêndice A — Evidências citadas

### A.1 Loader/dataset incompatibility (BLOCKER B-01)

**Loader atual** (`data/rede-credenciada/rede-amil.ts` linhas 62-79):
```typescript
export interface PrestadorAmilRaw {
  _idx: string
  Prestador: string                              // "codigo - nome" combinado
  UF: string
  'Município': string
  Bairro: string
  'REDE 300 NACIONAL BLUE': boolean             // 10 booleanos
  'REDE 200 NACIONAL BLUE': boolean
  'AMIL ONE S6500 BLACK QP': boolean
  'AMIL ONE S2500 QP': boolean
  BLACK: boolean
  'PLATINUM MAIS': boolean
  'PLATINUM QP': boolean
  'AMIL S750 QP': boolean
  'AMIL S580 QP': boolean
  'AMIL S450 QP': boolean
}
```

**Dataset novo** (`planodesaudepj/src/data/operadoras/amil/rede-credenciada.json`):
```json
{
  "geradoEm": "2026-04-26T02:21:13.770Z",
  "fonte": "powerbi-amil-public",
  "totalRedes": 49,
  "totalPrestadores": 9325,
  "redes": [...49 strings...],
  "prestadores": [
    {
      "codigo": "10000020",
      "nome": "INSTITUTO DE OLHOS DE TAGUATINGA",
      "uf": "DF",
      "municipio": "BRASILIA",
      "bairro": "TAGUATINGA NORTE",
      "redes": ["AMIL ONE S6500 BLACK QP", "AMIL S750 QP", "BLACK", ...]
    }
  ]
}
```

### A.2 Delta de redes — 5 sumiram, 6 apareceram

**Sumiram do enum antigo (não estão no dataset novo como redes ativas):**
- `REDE 300 NACIONAL BLUE`
- `REDE 200 NACIONAL BLUE`
- `AMIL ONE S2500 QP`
- `PLATINUM MAIS`
- `PLATINUM QP`

**Apareceram no dataset novo (não estão no enum atual):**
- `ADESÃO OURO MAIS` (4.980 prestadores)
- `AMIL S380 QP` (4.969)
- `AMIL S380 QC` (4.969)
- `AMIL S450 QC` (4.956)
- `ADESÃO BRONZE RJ` (1.142)
- `ADESÃO BRONZE SP` (937)

### A.3 ADR-005 volume citation

```
docs/decisions/adr-005-programmatic-seo-depth-strategy.md linha 41:
| Rede prestador | L4 | `/rede/[uf]/[municipio]/[prestador-slug]` | 2.071 |

docs/decisions/adr-005-programmatic-seo-depth-strategy.md linha 43:
**Total estimado: ~5.000–6.500 URLs SEO no MVP.**
```

vs `rede-credenciada-integration-plan.md` §0:
> potencial de ~12.700 URLs SEO (vs ~3.500-4.500 do plano atual)

### A.4 README data/rede-credenciada citation (SSOT ambiguidade)

```
data/rede-credenciada/README.md linhas 86-90:
**Fonte primária**
- Hub `planodesaudepj` mantém o scraper canônico em `C:\Users\benef\scrape_powerbi_amil.js`
- Dataset oficial em `C:\Users\benef\planodesaudepj\src\data\operadoras\amil\rede-credenciada.json`
```

vs `rede-credenciada-integration-plan.md` §0:
> Single source of truth: dataset vive em planoamilempresas/data/rede-credenciada/rede-credenciada.json; hub planodesaudepj consome ou cópia

**Conflito direto.** Decisão pendente.

---

— Pax, equilibrando prioridades 🎯
