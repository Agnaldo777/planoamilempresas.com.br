# Sprint Change Proposal v1.2.3 — Recalibração Rede Credenciada Amil (Dataset 9.325 prestadores)

**Documento:** Sprint Change Proposal v1.2.3
**Projeto:** planoamilempresas.com.br
**Facilitador:** Orion (AIOS Master — Orchestrator ♌) — Synkra AIOS
**Escalonado por:** Pax (PO — Balancer ♎) via `po-revalidation-rede-credenciada-integration.md`
**Data:** 2026-04-26
**Task:** `*correct-course`
**Checklist:** `change-checklist.md` — execução em modo focado-em-recalibração
**Status:** ✅ **Accepted** — Pax + Aria + Morgan + Uma co-signed 2026-04-26
**Predecessores:** SCP v1.0 (2026-04-16, pivot Astro→Next.js), implícita SCP v1.2.2 (2026-04-26, recalibrações pós-Story 1.0)

---

## 1. Sumário Executivo

### 1.1 O que mudou

Dataset Power BI Amil sofreu evolução significativa entre o snapshot original do PRD v1.2.2 (**2.071 prestadores · 23 UFs · 14 colunas booleanas**) e o snapshot atual em `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json` (**9.325 prestadores · 26 UFs · schema raiz redesenhado com `prestadores[].redes: string[]`**). A descoberta vem da orquestração Orion documentada em `docs/rede-credenciada-integration-plan.md` (2026-04-26) e foi re-validada por Pax em `docs/po-revalidation-rede-credenciada-integration.md` com veredito **APROVADO COM CONDIÇÕES** (pass rate 81,5%).

### 1.2 Por quê

A Story 6.5 e o ADR-005 foram dimensionados sobre o snapshot anterior. O dataset novo é **4,5× maior em prestadores** (impacto direto: ~5.000-6.500 → ~10.500 URLs SEO, +60-100%), tem **schema raiz incompatível** (loader `rede-amil.ts` é rewrite, não update), e expõe **5 redes que sumiram + 6 redes novas no enum `RedeAmilNome`**. Não é incremento marginal — é recalibração estrutural que demanda atualização formal de PRD + ADR antes de qualquer story chegar ao @sm.

### 1.3 Impacto

Este SCP v1.2.3 entrega: **(a)** PRD v1.2.2 → v1.2.3 com Story 6.5/6.6 reescritas e Epic 7 novo; **(b)** ADR-005 v2 (recalibração) e ADR-006 novo (URL-as-trademark policy); **(c)** Patches em `architecture.md` Build Performance + Workflow 4 + storage decision; **(d)** Patch em `front-end-spec.md` Screen 7; **(e)** Movimento editorial concluído (`docs/_internal/conversion-hypotheses-rede-credenciada.md`); **(f)** Decisões explícitas em 3 trade-offs travados — SSOT do dataset, slugs canônicos vs neutros, Epic 6 vs Epic 7. Após co-sign de 4 agentes, @sm libera para draft das stories Epic 7.

---

## 2. Origem da Mudança

### 2.1 Triggering Event

Usuário pediu na sessão de 2026-04-26: "façam um trabalho grandioso focado em SEO para o topo do Google" usando o dataset disponível em `planodesaudepj`. Orion orquestrou multi-agent analysis (Alex/Uma/Aria/Morgan internos) e produziu integration plan recomendando GO. Pax executou re-validation com PO Master Checklist e identificou **1 BLOCKER + 4 MAJOR + 4 MINOR**.

### 2.2 Nature of the Change

**Tipo:** Recalibração quantitativa + estrutural de stories aprovadas (NÃO scope creep, NÃO falha de story, NÃO mudança de requisitos funcionais).

- **NÃO é:** novo escopo, mudança de stack, mudança de FRs
- **É:** input de dados real desafiando volumes-target previamente assumidos + descoberta de incompatibilidade estrutural no loader

### 2.3 Rationale for Review Formal

A profundidade da mudança — schema do dataset, recalibração de ADR aceito, decisões legais novas (URL-as-trademark), reorganização de epic — extrapola o que pode ser absorvido em "story refinement" pelo @sm. Demanda SCP formal com co-sign de 4 agentes e atualização versionada de 4 documentos canônicos.

---

## 3. Decisões Críticas Travadas (Veredito Orion)

> Pax flagou 3 decisões que precisavam veredito antes do SCP avançar. Esta seção fecha as 3.

### 3.1 Decisão M-01 — Single-Source-of-Truth do dataset

**🎯 VEREDITO: Caminho A — Hub `planodesaudepj` é canon; `planoamilempresas` é mirror via Story 7.10 (pipeline mensal automatizado).**

**Justificativa:**

1. O scraper canônico vive em `C:\Users\benef\scrape_powerbi_amil.js` e gravando em `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json`. Mover essa autoridade implicaria refatorar o scraper, o que não traz valor.
2. Memória `project_planodesaudepj_pending_github.md` registra que o hub tem **3 commits Amil prontos no master local** (`b37630b`, `69d628f`, `2b6cada`). Quebrar a cadeia de canon agora invalida esses commits.
3. Hub é multi-operadora por design — em algum momento Bradesco/SulAmérica/Unimed terão o mesmo padrão. Centralizar canon no hub é arquitetura coerente.
4. `planoamilempresas` consome via `cp` ou git-submodule; loader em `src/lib/operadoras/amil/rede-credenciada-loader.ts` lê do mirror local (sem chamada de rede em build-time).

**Implementação:** Story 7.10 AC novas:
- AC X: workflow GitHub Actions roda Playwright dia 1 do mês 03:00 BRT em runner Linux
- AC X+1: scraper escreve em `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json` (canon)
- AC X+2: workflow segundo-stage faz `cp` para `planoamilempresas/data/rede-credenciada/rede-credenciada.json` (mirror)
- AC X+3: snapshot histórico mensal em `planoamilempresas/data/rede-credenciada/snapshots/2026-MM.json` (compactado gz; mitigação m-03)
- AC X+4: validação automática diff vs mês anterior; alerta WhatsApp se Δ > 20%

### 3.2 Decisão M-02 — URL-as-trademark (slugs canônicos vs neutros)

**🎯 VEREDITO: Caminho B — Slugs canônicos com prefix "amil-" + disclaimer agressivo + ADR-006 + plano de contingência ADR-004.**

**Justificativa:**

1. **SEO moat é real:** abandonar `/rede/amil-s750-qp/sp` para `/rede/premium-s750/sp` perde sinal de match exato em "amil s750 são paulo" — pesquisa mais qualificada do Cluster E (CR mais alto, ver `_internal/conversion-hypotheses-rede-credenciada.md`).
2. **Precedente de mercado:** corretoras autorizadas concorrentes (`amilbhsaude`, `amilsa`, `simetriaplanosdesaude`) já usam "amil" em domínio inteiro. Risco trademark é **conhecido, mitigável, e não inviabilizante**.
3. **NFR8 já assume risco:** PRD v1.2.2 Story 1.0 escolheu opção 🅲️ "assumir risco com 5 mitigações" para uso da marca "Amil". Estender essa decisão para URL slugs é coerente.
4. **ADR-004 contingência existe:** domínio-ponte `planosaudeempresas.com.br` está documentado e DNS configurado (Story 1.2a). Em caso de cease & desist, redirect 301 mass em ≤24h.
5. **Caminho A (slugs neutros) destrói o moat sem evidência de risk superior** — não há precedente legal público de cease & desist contra corretor autorizado por uso de nome de produto Amil em URL.
6. **Caminho C (híbrido sem prefix "AMIL")** mistura o pior dos dois — perde sinal SEO E adiciona ambiguidade ("s750" sem contexto).

**Implementação:** ADR-006 novo (`docs/decisions/adr-006-url-as-trademark-policy.md`):
- Status: Proposed (até advogado revisor co-signar)
- Decision: slugs canônicos `/rede/amil-s750-qp/sp`, `/rede/black/rj`, `/rede/adesao-ouro-mais/df`
- Mitigation 1: disclaimer obrigatório em footer + topo de cada página: "Corretor autorizado a intermediar planos da Amil Assistência Médica Internacional S.A."
- Mitigation 2: schema markup `Organization` aponta para `https://www.amil.com.br` em `sameAs` (atribuição clara)
- Mitigation 3: nenhum logo Amil; só texto
- Mitigation 4: plano de contingência ADR-004 acionável em ≤24h (redirect 301 mass para domínio-ponte)
- Mitigation 5: pre-emptive outreach Amil Compliance opcional (decisão stakeholder pós-Story 2.4)

**Gating:** Story 7.7 (Cluster E `/rede/[rede-slug]/[uf]`) bloqueada até ADR-006 ter Status `Accepted` (advogado revisor co-sign — Story 2.4 deliverable). Outras stories de rede (7.1-7.6, 7.8-7.10) seguem sem este gate, pois usam UF/município/bairro (não rede) na URL primária.

### 3.3 Decisão Process — Epic 6 vs Epic 7 split

**🎯 VEREDITO: SPLIT — criar Epic 7 "Programmatic SEO Rede Credenciada Amil" com Stories 7.0 a 7.10. Epic 6 fica focado em "Price Intelligence & Calculator + Library" com 6.1-6.4 + 6.7 + 6.8.**

**Justificativa:**

1. **Foco semântico:** Epic 6 atual mistura dois conceitos — (a) tools de moat (calculadora, tabela, biblioteca) e (b) SEO programático (rede). Splitting esclarece responsabilidade.
2. **Volume de stories:** Epic 6 com 6.5a-g + 6.5y/z + 6.6 vira 15 stories — perde foco. Epic 7 dedicado aos 10-11 itens de rede credenciada é cirúrgico.
3. **Owners distintos:** Epic 6 é tools (Aria/Dex/Quinn focus); Epic 7 é content + dataset (Alex pesquisa + Uma UI + Dex SSG). Reporting fica mais limpo.
4. **Roadmap:** Epic 6 e Epic 7 podem rodar em paralelo após Stories 7.0a/b/c (pre-flights) fecharem. Aria livre para tools, Dex pode iniciar Epic 7 enquanto Quinn audita Epic 6 prior.

---

## 4. Mudanças no PRD v1.2.2 → v1.2.3

### 4.1 Estrutura de Epics atualizada

| Epic | Antes (v1.2.2) | Agora (v1.2.3) | Mudança |
|---|---|---|---|
| 1 | Foundation, Compliance, Observability | (sem mudança) | — |
| 2 | Trust & Authority (E-E-A-T) | (sem mudança) | — |
| 3 | Content Engine — Pillar + 15 Cornerstones | (sem mudança) | — |
| 4 | Conversion Engine | (sem mudança) | — |
| 5 | Programmatic SEO — Matrix CNAE × Cidade | (sem mudança) | — |
| **6** | Price Intelligence & Calculator + Rede Credenciada (5 ataques SEO) | **Price Intelligence & Calculator + Library** | Stories 6.5/6.6 movidas para Epic 7 |
| **7** | (não existia) | **Programmatic SEO — Rede Credenciada Amil** | NOVO; 11 stories |

### 4.2 Story 6.5 → Movida para Epic 7 (re-numerada e expandida)

**Decisão de migração:** Story 6.5 original deixa de existir como single-story. Substituída por **Epic 7 com 11 stories abaixo**. Referências cruzadas no PRD a "Story 6.5" devem ser substituídas por "Epic 7 / Story 7.X".

### 4.3 Epic 7 — stories detalhadas (NOVAS)

#### Story 7.0a — Pre-flight: gap 11 vs 49 redes do dataset (XS, 1d)

**Como** @architect (Aria) **quero** validar se o dataset Power BI realmente tem 11 redes ativas ou se as 38 restantes do header `redes[]` foram capturadas incompletamente, **para** decidir GO/HOLD em Story 7.7 (Cluster E rede × UF).

**Acceptance Criteria:**
1. Rodar `scrape_powerbi_amil.js` em modo verbose e enumerar `dataset.prestadores[].redes` set-difference com `dataset.redes[]`
2. Documentar achado em `docs/decisions/network-coverage-2026-04.md`
3. Output 1 (38 redes são metadados sem prestadores): GO Story 7.7 com 11 URLs Cluster E
4. Output 2 (38 redes têm prestadores não capturados): HOLD Story 7.7 + criar Story 7.0a-bis para scraper rerun com filtro all-redes
5. Cross-referenciar com `data/tabelas-amil.ts` mapeamento Bronze→Platinum Mais — qual das 11 redes do dataset corresponde a qual segmentação de preço

**Owner:** @architect (Aria)
**Bloqueia:** 7.7 (Cluster E rede × UF). Não bloqueia 7.1-7.6, 7.8-7.10.

#### Story 7.0b — Decisão SSOT do dataset (XS, 0,5d)

**Como** @aios-master (Orion) **quero** formalizar a decisão "hub canon, planoamilempresas mirror" em ADR + atualizar Story 7.10 ACs, **para** evitar drift entre os dois projetos.

**Acceptance Criteria:**
1. Criar `docs/decisions/adr-007-dataset-ssot.md` com Status: Accepted
2. Atualizar Story 7.10 ACs (workflow GH Actions copia hub→mirror; snapshot mensal; alerta diff >20%)
3. Atualizar `data/rede-credenciada/README.md` removendo ambiguidade (linhas 86-90)

**Owner:** Orion (auto-aplicar como parte deste SCP — feito na §3.1 acima; ADR-007 a ser escrito por Aria como follow-up)
**Bloqueia:** Story 7.10 (Pipeline mensal). Não bloqueia outras.

#### Story 7.0c — Decisão URL-as-trademark policy (XS, 1d + advogado)

**Como** @architect (Aria) + advogado revisor **quero** ADR-006 publicado com decisão B (slugs canônicos + 5 mitigações), **para** desbloquear Story 7.7 (Cluster E).

**Acceptance Criteria:**
1. Criar `docs/decisions/adr-006-url-as-trademark-policy.md` com Status: Proposed (Orion)
2. Advogado revisor (Story 2.4 deliverable) co-sign — Status: Accepted ou Rejected
3. Se Rejected: pivotar para Caminho C (híbrido sem prefix AMIL); criar Story 7.0c-bis para refactor de slugs
4. Se Accepted: GO Story 7.7

**Owner:** @architect (Aria) + Agnaldo (stakeholder fornece advogado) — gating depende de Story 2.4 fechar
**Bloqueia:** Story 7.7. Não bloqueia outras.

#### Story 7.1 — Schema + Loader Reescrito (M, 4-5d)

**Como** @dev (Dex) **quero** implementar tipos novos + loader novo compatível com schema redesenhado do dataset, **para** que todas as stories 7.2-7.10 tenham fundação confiável.

**Acceptance Criteria:**
1. Novo arquivo `src/types/rede-credenciada-amil.ts` com:
   - `interface PrestadorAmil { codigo, nome, uf, municipio, bairro, redes: string[], tipoInferido }`
   - `interface DatasetRedeAmil { geradoEm, fonte, totalRedes, totalPrestadores, redes: string[], prestadores: PrestadorAmilRaw[] }`
   - Type guard runtime para validar shape de JSON parseado
2. Novo arquivo `src/lib/operadoras/amil/rede-credenciada-loader.ts` com:
   - Cache em memória (Map por slug, por UF, por município, por bairro, por rede, por tipo)
   - 13+ helpers: `getAllPrestadores`, `getMunicipios`, `getMunicipioBySlug`, `getPrestadoresPorMunicipio`, `getPrestadoresPorBairro`, `getMunicipiosByUf`, `getTopMunicipios`, `getBairrosDoMunicipio`, `getPrestadoresPorRede`, `getPrestadoresPorTipo`, `getEstatisticasRede`, `getEstatisticasByUF`, `prestadorSlug`
   - `inferTipoAtendimento(nome)` regex helper preservando 8 categorias do loader antigo
3. Deprecar `data/rede-credenciada/rede-amil.ts` com header `@deprecated — ver src/lib/operadoras/amil/rede-credenciada-loader.ts (Story 7.1)` — remover em Story 7.2
4. Tests unitários (Vitest) cobrindo: parse de prestador real, slug determinístico (idempotente), filtros por UF/município/bairro/rede, count de estatísticas (validar `totalPrestadores === 9325`)
5. Imports absolutos `@/types/rede-credenciada-amil` e `@/lib/operadoras/amil/rede-credenciada-loader` (NFR14 + code-standards.md)
6. Build local com `pnpm build` passa sem erro TypeScript
7. NFR8 reforço: nenhum literal "Bradesco" em código novo

**Owner:** @dev (Dex)
**Bloqueia:** TODAS as stories 7.2-7.10

#### Story 7.2 — Hub `/rede-credenciada` + `<NetworkSearch />` + Ataque 1 (M, 4-5d)

**Como** decisor avaliando cobertura **quero** página hub com busca filtrável + 8 FAQs + estatísticas dataset-driven.

**Acceptance Criteria:**
1. Rota `app/(marketing)/rede-credenciada/page.tsx` (RSC + ISR 7d)
2. Component `<NetworkSearch />` Client Component com index pré-built MiniSearch (≤30KB)
3. Filtros progressivos: busca livre primário (Radix `Command`), depois Accordion com tipo + rede
4. Atalhos por estado (chips horizontais top-5 por densidade)
5. FAQPage schema com 8 perguntas
6. Stats dataset-driven (9.325 prestadores · 26 UFs · 438 municípios · 11 redes ativas)
7. Disclaimer compliance ANS + corretor SUSEP
8. Lighthouse ≥92, LCP ≤2.0s (NFR1, alinhado em §6.1 deste SCP)
9. WCAG AA: aria-autocomplete, live region announce de count, foco visível

**Owner:** @dev (Dex) + @ux-design-expert (Uma) handoff
**Bloqueado por:** 7.1

#### Story 7.3 — Templates editoriais por tipo (M, 5-7d)

**Como** stakeholder **quero** 4 templates editoriais variantes (Hospital / Laboratório / Clínica / Outro) gerando ≥600 palavras únicas por página-prestador.

**Acceptance Criteria:**
1. 4 arquivos de template em `src/components/templates/prestador-content/`:
   - `HospitalContent.tsx` (menciona pronto-socorro, internação, maternidade)
   - `LaboratorioContent.tsx` (menciona horários, exames, jejum)
   - `ClinicaContent.tsx` (menciona consulta eletiva, especialidades comuns)
   - `OutroContent.tsx` (template genérico com nome+bairro+UF interpolados)
2. Cada template renderiza ≥600 palavras (validar via Story 5.7 audit)
3. Variação contextual: nome+bairro+UF interpolados em pelo menos 8 pontos do texto (não copy-paste literal)
4. CTA WhatsApp + link "Confirmar no app oficial Amil" + disclaimer "Rede sujeita a alterações"
5. Componente `<PrestadoresProximos />` listando 3 cards do mesmo bairro (helper `getPrestadoresPorBairro` do loader)

**Owner:** @ux-design-expert (Uma) escreve copy + @dev (Dex) integra
**Bloqueado por:** 7.1

#### Story 7.4 — Páginas-prestador SSG por região chunking (L, 6-8d)

**Como** SEO programmatic **quero** 9.325 páginas `/rede/[uf]/[municipio]/[prestador-slug]` geradas via SSG por chunking (Sudeste primeiro), **para** distribuir build time e indexar massivamente.

**Acceptance Criteria:**
1. Rota `app/(marketing)/rede/[uf]/[municipio]/[prestadorSlug]/page.tsx` com `generateStaticParams`
2. Chunking por phase: Phase 1 (Sudeste = RJ+SP+MG+ES = 7.166 prestadores), Phase 2 (Sul+CO+NE+Norte ≤2.159)
3. Schema markup por tipo: `Hospital`, `MedicalClinic`, `MedicalLaboratory`, `EmergencyService`, `MedicalOrganization` fallback (Outro)
4. ISR revalidate 30d
5. NoIndex em prestador único quando município total < 5 prestadores (filtro anti-thin)
6. Sitemap shard `sitemap-prestadores.xml` com `<lastmod>` real
7. Build time alvo: ≤25min Phase 1 (Hobby tier viável)

**Owner:** @dev (Dex)
**Bloqueado por:** 7.1, 7.3

#### Story 7.5 — Páginas-cidade SSG `/rede/[uf]/[municipio]` (M, 4-5d)

**Como** decisor pesquisando cidade **quero** 438 páginas-cidade com lista filtrada + estatísticas + bairros mais cobertos.

**Acceptance Criteria:**
1. Rota `app/(marketing)/rede/[uf]/[municipio]/page.tsx` com `generateStaticParams`
2. Top-100 municípios SSG full + cauda (~338) ISR 30d
3. Stats por município (total prestadores, distribuição por tipo, top-5 bairros)
4. Lista paginada (25/página) com filtros de tipo/rede client-side
5. ItemList schema + BreadcrumbList
6. Sitemap shard `sitemap-rede-municipios.xml`

**Owner:** @dev (Dex)
**Bloqueado por:** 7.1, 7.3

#### Story 7.6 — Páginas-bairro SSG (M, 4-5d)

**Como** SEO long-tail extremo **quero** ~700-800 páginas `/rede/[uf]/[municipio]/[bairro]` filtradas (≥3 prestadores), **para** capturar busca hyper-geo.

**Acceptance Criteria:**
1. Rota `app/(marketing)/rede/[uf]/[municipio]/[bairro]/page.tsx` com `generateStaticParams`
2. Filtro anti-thin: só publicar bairros com ≥3 prestadores (~700-800 viáveis vs 1.687 brutos)
3. Bairros com 1-2 prestadores → noindex + canonical para `/rede/[uf]/[municipio]`
4. Lista de prestadores + 3 FAQs específicos do bairro
5. Sitemap shard `sitemap-rede-bairros.xml`

**Owner:** @dev (Dex)
**Bloqueado por:** 7.1, 7.3

#### Story 7.7 — Cluster E `/rede/[rede-slug]/[uf]` (M, 4-5d) [BLOQUEADA até ADR-006 aceito]

**Como** decisor pre-purchase qualificado **quero** ~286 páginas rede × UF com lista de prestadores agrupada por município + 400 palavras editoriais.

**Acceptance Criteria:**
1. Rota `app/(marketing)/rede/[redeSlug]/[uf]/page.tsx` com `generateStaticParams`
2. Filtro: combinações com ≥2 prestadores (descarta cauda extrema)
3. Stats: contagem de Hospitais/Labs/Clínicas + top-5 cidades
4. Schema `HealthInsurancePlan` + `ItemList` de prestadores + FAQPage + BreadcrumbList
5. 400 palavras editoriais variáveis por rede (template referenciando faixa de preço da `data/tabelas-amil.ts`)
6. CTA: cotação para esta rede (form pre-fill com produto)
7. Sitemap shard `sitemap-rede-produto.xml`

**Owner:** @dev (Dex)
**Bloqueado por:** 7.0c (ADR-006 aceito), 7.1, 7.3

#### Story 7.8 — Páginas Tipo × UF × Município (S, 3d)

**Como** busca por urgência ("hospital amil são paulo") **quero** ~250-350 páginas filtradas (≥3 prestadores classificados por tipo).

**Acceptance Criteria:**
1. Rota `app/(marketing)/[tipo]/[uf]/[municipio]/page.tsx` com `generateStaticParams`
2. Tipos válidos: hospital, laboratorio, clinica, diagnostico-imagem, maternidade, pronto-socorro, odontologia, centro-instituto
3. Filtro: combinações com ≥3 prestadores (~250-350 viáveis vs 994 brutos)
4. Lista de prestadores do tipo dentro do município
5. Schema `MedicalOrganization` (subtipo correspondente) + `ItemList`
6. Sitemap shard `sitemap-tipos.xml`

**Owner:** @dev (Dex)
**Bloqueado por:** 7.1, 7.3

#### Story 7.9 — Schemas JSON-LD Aplicados Transversalmente (S, 3d)

**Como** rich snippet seeker **quero** schemas JSON-LD validados em todas as páginas de rede do Epic 7.

**Acceptance Criteria:**
1. Component `<NetworkSchemaJsonLd />` em `src/components/schema/` com props discriminated union por tipo de página
2. Validação automática via Schema.org validator + Google Rich Results Test em CI (Story 1.4 canary baseline)
3. Cobertura: hub, prestador (5 subtipos), município, bairro, rede×UF, tipo×UF×municipio
4. Test unitário: parse JSON-LD output → validar shape

**Owner:** @dev (Dex)
**Bloqueado por:** 7.2, 7.4, 7.5, 7.6, 7.7, 7.8 (qualquer um pode rodar primeiro; este consolida)

#### Story 7.10 — Pipeline Mensal Automatizado + SSOT (S, 3d)

**Como** @pm (Morgan) **quero** workflow GitHub Actions automatizando scrape→canon→mirror→snapshot→deploy, **para** garantir freshness mensal sem intervenção manual.

**Acceptance Criteria:**
1. Workflow `.github/workflows/rede-credenciada-monthly.yml` (cron dia 1 mês 03:00 BRT)
2. Step 1: roda Playwright em runner Linux + escreve canon em `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json` (depende de `planodesaudepj` ter remote — ver memory `project_planodesaudepj_pending_github.md`)
3. Step 2: copy canon → mirror em `planoamilempresas/data/rede-credenciada/rede-credenciada.json`
4. Step 3: snapshot mensal `planoamilempresas/data/rede-credenciada/snapshots/2026-MM.json.gz` (compactado, mitigação m-03)
5. Step 4: validação diff vs anterior; alerta WhatsApp ao stakeholder se Δ > 20% em qualquer campo
6. Step 5: auto-PR com Conventional Commit `feat(data): atualiza rede credenciada Amil [Mês]/2026`
7. Step 6: auto-merge se diff <5% e CI verde; senão hold para review humano
8. Step 7: Vercel deploy + ping sitemap.xml ao GSC
9. Changelog público em `/rede-credenciada/changelog`

**Owner:** @devops (Gage) + @architect (Aria) coordenação
**Bloqueado por:** 7.1; depende externamente de `planodesaudepj` ter remote configurado

### 4.4 Story 5.7 — AC nova (audit por amostragem estratificada)

**AC nova adicionada (mitigação m-02):**
- AC X: Audit por amostragem estratificada — top-50 cidades + top-10 redes + 30 cidades mid-tier + 20 cidades cauda aleatória = ~110 páginas auditadas, representando ≥80% do tráfego potencial. Audit exhaustivo de 9.325 páginas-prestador é descartado por inviabilidade.
- AC X+1: Critério ≥600 palavras + variação contextual (≥8 interpolações nome+bairro+UF) verificado por amostragem
- AC X+2: Resultado registrado em `docs/audit-content-rede-2026-MM.md` mensalmente

### 4.5 NFR1 — Atualização de target

**Mudança:** LCP target permanece em **2.0s** (sem alteração — plano original do integration plan citava 1.8s, mas era stretch goal não-blocking; alinhar para evitar over-engineering).

**AC herdada por todas stories Epic 7:** "Lighthouse Performance ≥92 OK; LCP ≤2.0s OK; INP ≤200ms OK; CLS ≤0.05 OK em amostra de 10 páginas-prestador aleatórias."

---

## 5. Mudanças nos ADRs

### 5.1 ADR-005 v2 — Recalibração Volumes (UPDATE)

**Owner:** @architect (Aria)
**ETA:** 4-6h
**Path:** `docs/decisions/adr-005-programmatic-seo-depth-strategy.md`

**Mudanças:**
- Status header: `Accepted (v1) — Updated v2 2026-04-26` + Change Log adicionado
- Tabela Decision: `/rede/[uf]/[municipio]/[prestador-slug]` linha — atualizar de "2.071" para "9.325 (filtrados ~7.500 indexados após noindex anti-thin)"
- Total estimado: atualizar de "5.000-6.500 URLs" para "~10.500 URLs após filtros (~12.700 teóricos)"
- Adicionar UFs Norte (RR, AC, AM, AP) cobertas — mudar nota "23 UFs" para "26 UFs"
- Adicionar nota: "Recalibração disparada por SCP v1.2.3 após dataset 2026-04-26 (9.325 prestadores)"
- Co-sign: Aria (author) + Pax (PO)

### 5.2 ADR-006 — URL-as-Trademark Policy (NOVO)

**Owner:** @architect (Aria) + advogado revisor (Story 2.4)
**ETA:** 1-3 dias úteis (depende disponibilidade legal)
**Path:** `docs/decisions/adr-006-url-as-trademark-policy.md`

**Conteúdo:** decisão B com 5 mitigações (ver §3.2 deste SCP); referência a NFR8 + ADR-004 contingência; status inicial Proposed.

### 5.3 ADR-007 — Dataset Single-Source-of-Truth (NOVO)

**Owner:** @architect (Aria)
**ETA:** 2h
**Path:** `docs/decisions/adr-007-dataset-ssot.md`

**Conteúdo:** decisão Caminho A (hub canon, mirror via Story 7.10); referência a Story 7.10 ACs; status Accepted.

### 5.4 Resumo dos ADRs após este SCP

| ADR | Status | Owner | ETA |
|---|---|---|---|
| ADR-000 | ✅ Accepted | Aria | (publicado) |
| ADR-001 | ✅ Accepted | Aria | (publicado) |
| ADR-002 | ✅ Updated | Aria | (publicado) |
| ADR-003 | 📝 Proposed | Aria | bloqueado por Story 6.7 |
| ADR-004 | 📝 Proposed | Aria | (publicado) |
| ADR-005 | 🔄 **Updated v2** | Aria | 4-6h após este SCP |
| ADR-006 | 📝 **Proposed novo** | Aria + advogado | 1-3 dias após este SCP |
| ADR-007 | ✅ **Accepted novo** | Aria | 2h após este SCP |

---

## 6. Mudanças no `architecture.md`

### 6.1 Build Performance — recalibração

**Seção atual (linha ~1297):** "Estimativa de build time" cita 5.000-6.500 URLs em ~30-40min Hobby.

**Substituir por:**

> **Volume revisado pós-SCP v1.2.3:** ~10.500 URLs SSG após filtros anti-thin (de 12.700 teóricos do dataset 9.325 prestadores). Hobby tier não comporta sem chunking — adotar híbrido SSG+ISR:
> - SSG full: top-50 cidades + top-1000 prestadores Sudeste + Cluster E completo (286 URLs) + tipo×UF×município filtrado (~250) ≈ **~2.500 URLs**
> - ISR sob demanda (revalidate 30d): demais ~7.500 URLs (cauda de cidades, prestadores Sul/CO/NE/Norte, bairros)
> - Build time projetado: ~25min Hobby (viável); upgrade Pro $20/mês permanece como contingência

### 6.2 Workflow 4 (Atualização Mensal) — incluir SSOT

**Adicionar passo:** "Step 0: scraper escreve em `planodesaudepj` (canon SSOT — ADR-007); cp para `planoamilempresas` (mirror)"

### 6.3 Storage Decision — explicitar (não mudança, formalização)

**Adicionar subseção "Storage Decisions":**
- Dataset Amil: **JSON estático** em `src/data/operadoras/amil/rede-credenciada.json` (NÃO Upstash Redis — overkill para build-time only)
- Upstash Redis: reservado para rate limiting (form, BrasilAPI), KV de leads, queue de retry (CRM fallback)
- Sanity v3: conteúdo editorial (cornerstones, FAQs, disclaimers); dataset cru fica fora do CMS

---

## 7. Mudanças no `front-end-spec.md`

**Owner:** @ux-design-expert (Uma)
**ETA:** 30-45min

### 7.1 Screen 7 patch v1.0 → v1.1

**Linhas 732-764:** substituir wireframe pelo wireframe ajustado da Seção 2.2 do `rede-credenciada-integration-plan.md`:
- H1: "Rede Credenciada Amil — 9.325 prestadores"
- Stats dataset-driven (não hardcoded)
- Busca livre primária com Radix `Command` (em vez de filtros frontais 4-dropdown)
- Atalhos por estado (chips top-5 densidade)
- Filtros avançados em Accordion (tipo + rede; SEM "especialidade" — gap conhecido)
- FAQs schema FAQPage no rodapé
- Component `<NetworkSearch />` referenciado

### 7.2 Componente `<NetworkResultCard />` (linha ~929)

Remover menção a "especialidades" (não há no dataset). Manter: nome + bairro + município + UF + tipo inferido + lista de redes (chips).

### 7.3 Adicionar Screen 7b — Página-Prestador

**Novo wireframe** baseado na Seção 2.3 do integration plan: hero + cobertura Amil (lista de 11 redes marcadas/não) + mapa aproximado (centroide bairro) + "como usar" + prestadores próximos + FAQ + disclaimer.

### 7.4 Adicionar Screen 7c — Página-Rede × UF

**Novo wireframe** baseado na Seção 2.4 do integration plan (Cluster E): H1 "Onde o plano [Rede] é aceito em [UF]" + stats rápidos + mapa por cidade + 400 palavras editoriais + lista agrupada por município + CTA cotação.

---

## 8. Mudanças em Código (delta de arquivos)

### 8.1 Novos arquivos

```
src/types/rede-credenciada-amil.ts                  [Story 7.1]
src/lib/operadoras/amil/rede-credenciada-loader.ts  [Story 7.1]
src/lib/operadoras/amil/__tests__/loader.test.ts    [Story 7.1]
src/components/templates/prestador-content/
  HospitalContent.tsx                                [Story 7.3]
  LaboratorioContent.tsx                             [Story 7.3]
  ClinicaContent.tsx                                 [Story 7.3]
  OutroContent.tsx                                   [Story 7.3]
src/components/schema/NetworkSchemaJsonLd.tsx       [Story 7.9]
src/components/network/NetworkSearch.tsx            [Story 7.2]
src/components/network/NetworkResultCard.tsx        [Story 7.2]
src/components/network/PrestadoresProximos.tsx     [Story 7.3]
app/(marketing)/rede-credenciada/page.tsx           [Story 7.2]
app/(marketing)/rede/[uf]/page.tsx                   [Story 7.5]
app/(marketing)/rede/[uf]/[municipio]/page.tsx       [Story 7.5]
app/(marketing)/rede/[uf]/[municipio]/[bairro]/page.tsx     [Story 7.6]
app/(marketing)/rede/[uf]/[municipio]/[prestadorSlug]/page.tsx [Story 7.4]
app/(marketing)/rede/[redeSlug]/[uf]/page.tsx        [Story 7.7]
app/(marketing)/[tipo]/[uf]/[municipio]/page.tsx     [Story 7.8]
app/sitemap.ts (split em shards)                     [Story 7.2-7.8]
.github/workflows/rede-credenciada-monthly.yml       [Story 7.10]
data/rede-credenciada/snapshots/.gitkeep             [Story 7.10]
docs/decisions/adr-005-programmatic-seo-depth-strategy.md (UPDATE) [§5.1]
docs/decisions/adr-006-url-as-trademark-policy.md   [§5.2]
docs/decisions/adr-007-dataset-ssot.md              [§5.3]
```

### 8.2 Arquivos modificados

```
docs/prd.md                          (v1.2.2 → v1.2.3 — Story 6.5/6.6 movida, Epic 7 novo, Story 5.7 AC nova)
docs/architecture.md                 (Build Performance recalibrado, Workflow 4, Storage Decisions)
docs/front-end-spec.md               (v1.0 → v1.1 — Screen 7 patch + 7b/7c novos)
data/rede-credenciada/README.md      (atualizar SSOT linhas 86-90 com ADR-007)
data/rede-credenciada/rede-amil.ts   (header @deprecated; remover em Story 7.2)
```

### 8.3 Arquivos deprecados (remover em Story 7.2)

```
data/rede-credenciada/rede-amil.ts   (substituído por src/lib/operadoras/amil/rede-credenciada-loader.ts)
```

---

## 9. Movimentos Editoriais (auto-aplicados neste SCP)

### 9.1 Mitigação M-04 — APLICADA ✅

**Action 1:** Criado `docs/_internal/README.md` com regras de uso e disclaimer "DO NOT QUOTE EXTERNALLY".

**Action 2:** Criado `docs/_internal/conversion-hypotheses-rede-credenciada.md` com hipóteses de CR por cluster + disclaimer interno + histórico de origem.

**Action 3:** `docs/rede-credenciada-integration-plan.md` Seção 1.3 substituída por pointer para o arquivo interno + warning para leitores.

**Estado pós-SCP:** taxas de CR estão fisicamente isoladas em `_internal/`, reduzindo risk de leak para copy público.

---

## 10. Roadmap Atualizado

### Sprint X+0 (semana 1-2)

- [ ] Aria: ADR-005 v2 + ADR-006 (Proposed) + ADR-007 (Accepted)
- [ ] Morgan: PRD v1.2.2 → v1.2.3 patches (Story 6.5/6.6 movidas, Epic 7 novo, Story 5.7 AC nova)
- [ ] Uma: front-end-spec v1.0 → v1.1 (Screen 7 patch + 7b/7c)
- [ ] Pax: co-sign final do SCP + atualizar `stakeholder-inputs.md` com nota Recal 2026-04-26

### Sprint X+1 (semana 3-4)

- [ ] Story 7.0a (Aria): pre-flight gap 11 vs 49 redes
- [ ] Story 7.0c (Aria + advogado): aguardar Story 2.4 deliverable + ADR-006 review
- [ ] Story 7.1 (Dex): loader rewrite + tipos novos + tests

### Sprint X+2 (semana 5-6)

- [ ] Story 7.2 (Dex + Uma): hub + NetworkSearch
- [ ] Story 7.3 (Uma + Dex): templates editoriais
- [ ] Story 7.5 (Dex): páginas-cidade SSG

### Sprint X+3 (semana 7-8)

- [ ] Story 7.4 (Dex): prestadores SSG Phase 1 (Sudeste)
- [ ] Story 7.6 (Dex): páginas-bairro SSG (filtradas ≥3)
- [ ] Story 7.8 (Dex): tipo×UF×município (filtradas ≥3)

### Sprint X+4 (semana 9-10)

- [ ] Story 7.4 Phase 2 (Dex): prestadores SSG Sul/CO/NE/Norte
- [ ] Story 7.7 (Dex): Cluster E rede × UF [BLOQUEADA até ADR-006 aceito]
- [ ] Story 7.9 (Dex): schemas JSON-LD transversal

### Sprint X+5 (semana 11-12)

- [ ] Story 7.10 (Gage + Aria): pipeline mensal automatizado
- [ ] Story 5.7 expansão (Quinn + Uma): audit por amostragem estratificada

**Total estimado:** 12 semanas para Epic 7 completo. Cabe no budget 14-18 semanas do PRD.

---

## 11. Riscos e Mitigações (Consolidados)

| Risco | Severidade | Probabilidade | Mitigação | Owner |
|---|---|---|---|---|
| Helpful Content penalty (thin content em ~9.325 prestadores) | 🔴 Alta | Média | Templates ≥600 palavras + filtros noindex (≥3 prestadores/bairro, ≥3 tipos/cidade) + Story 5.7 audit estratificado | Quinn + Uma |
| Build time excede tier Hobby | 🟡 Média | Alta sem chunking | Híbrido SSG+ISR conforme §6.1; Pro tier $20/mês contingência | Aria + Gage |
| Cease & desist Amil por uso de marca em URL | 🔴 Alta | Baixa-Média | ADR-006 + 5 mitigações + ADR-004 contingência domínio-ponte | Aria + advogado |
| Dataset desincroniza entre hub e site | 🟡 Média | Alta sem automação | ADR-007 SSOT + Story 7.10 pipeline automatizado | Gage |
| Inferência de tipo (75% "Outro") gera schema impreciso | 🟢 Baixa | Alta | Fallback `MedicalOrganization` quando "Outro"; melhorar regex em iteração | Dex |
| Gap 11 vs 49 redes invalida Cluster E | 🟡 Média | Média | Story 7.0a pre-flight bloqueante para 7.7 | Aria |
| Mudança Amil descontinua dataset Power BI público | 🔴 Alta | Baixa | Snapshot histórico mensal `data/rede-credenciada/snapshots/2026-MM.json.gz` (m-03 mitigation) | Gage |
| Concorrente replica dataset em 60d | 🟡 Média | Baixa | Moat = dataset + tabela + matriz CNAE + cornerstones; não replicável em 60d | (sem mitigation além do moat existente) |
| FE Spec drift continua (já flag em report v1.2.2) | 🟢 Baixa | Média | Patch Screen 7 + 7b/7c em §7 deste SCP | Uma |
| Leak de hipóteses de conversão para copy público | 🟢 Baixa | Baixa após M-04 | Isolamento físico em `docs/_internal/` + README disclaimer + dependência de A/B test | Pax |
| Story 7.10 depende de `planodesaudepj` ter remote | 🟡 Média | Alta hoje | Memory `project_planodesaudepj_pending_github.md` aguarda decisão; NÃO bloqueia 7.0-7.9 | Stakeholder + Gage |

---

## 12. Approval Matrix

| Owner | Responsabilidade | Status atual | Co-sign necessário antes de @sm criar Stories Epic 7 |
|---|---|---|---|
| **Orion** (aios-master) | Author do SCP | ✅ Submitted | — (autor) |
| **Pax** (@po) | Re-validation original + co-sign final SCP | ✅ **Approved 2026-04-26** | ✅ Hard requirement (concedido) |
| **Aria** (@architect) | ADRs 005 v2, 006, 007 + Architecture patches | ✅ **Approved 2026-04-26** | ✅ Hard (concedido) |
| **Morgan** (@pm) | PRD patches v1.2.2 → v1.2.4 | ✅ **Approved 2026-04-26** | ✅ Hard (concedido) |
| **Uma** (@ux-design-expert) | Front-end-spec patches Screen 7 + 7b/7c | ✅ **Approved 2026-04-26** | ⚠️ Soft (concedido) |
| **Quinn** (@qa) | Acknowledge audit by sampling | ⏳ Pending | ⚠️ Soft (quality gate não-bloqueante) |
| **Gage** (@devops) | Acknowledge Story 7.10 pipeline | ⏳ Pending | ⚠️ Soft (Story 7.10 fica em queue até remote do hub configurado) |
| **Stakeholder** (Agnaldo) | Aprovação final + advogado revisor | ⏳ Pending | ✅ Hard para Story 7.7 (Cluster E)|

**Critério GO para @sm:** Pax + Aria + Morgan co-sign.
**Critério GO para Story 7.7:** + ADR-006 Status: Accepted (advogado revisor).

---

## 13. Action Items por Owner

### Aria (Architect)
1. Escrever ADR-005 v2 (recalibração) — ETA 4-6h
2. Escrever ADR-006 (URL-as-trademark, Status Proposed) — ETA 2h
3. Escrever ADR-007 (Dataset SSOT, Status Accepted) — ETA 1h
4. Patch architecture.md (Build Performance, Workflow 4, Storage Decisions) — ETA 2h
5. Coordenar com advogado revisor (Story 2.4) para ADR-006 review — ETA 1-3 dias

### Morgan (PM)
1. PRD v1.2.2 → v1.2.3 patch — Epic 7 novo, Story 6.5/6.6 movidas, Story 5.7 AC nova — ETA 2-4h
2. Atualizar Change Log do PRD com nota deste SCP

### Uma (UX Design Expert)
1. Front-end-spec v1.0 → v1.1 — Screen 7 patch + Screen 7b + Screen 7c — ETA 30-45min
2. Copy de templates editoriais por tipo (Story 7.3) — preparar drafts para ETA Sprint X+2

### Pax (PO)
1. Co-sign final deste SCP após Aria + Morgan + Uma entregarem
2. Atualizar `stakeholder-inputs.md` com seção "🔍 Re-validação Pax — SCP v1.2.3 (2026-04-26)"
3. Re-validar PRD v1.2.3 quando Morgan publicar (~1 dia)

### Dex (Dev)
1. Aguardar Story 7.1 ser draftada por @sm
2. Spike inicial: validar shape do dataset novo + criar interface raw em local-dev (não compromete) — ETA 2h opcional

### Gage (DevOps)
1. Acknowledge Story 7.10 — pipeline mensal automatizado
2. Coordenar com stakeholder para resolver pendência GitHub remote do `planodesaudepj`
3. Setup de cron Vercel + GitHub Actions (já em backlog)

### Quinn (QA)
1. Acknowledge AC nova de Story 5.7 (audit por amostragem estratificada)
2. Preparar checklist amostragem para auditar ~110 páginas representativas

### Stakeholder (Agnaldo)
1. Aprovação geral deste SCP
2. Confirmar advogado revisor (Story 2.4) está disponível para review de ADR-006 — ETA 1-3 dias úteis

### Orion (próximo)
1. Auto-aplicar M-04 — ✅ FEITO neste SCP
2. Esperar co-sign de Aria + Morgan + Pax
3. Após co-sign, dispatch para @sm com `*draft Story 7.0a`

---

## 14. Approval Signatures

### ✅ Pax (PO) — 2026-04-26

> **Co-sign concedido.** Os 3 vereditos (M-01 SSOT Caminho A, M-02 URL trademark Caminho B, Process Epic 7 split) endereçam fielmente os 1 BLOCKER + 4 MAJOR + 4 MINOR do `po-revalidation-rede-credenciada-integration.md`. Mitigação M-04 foi auto-aplicada com isolamento físico em `docs/_internal/` — preocupação de leak resolvida. Story 7.1 corretamente re-tamanhada para M (4-5d) com AC explícita de rewrite + tipos novos em `src/types/`. Story 7.7 corretamente gated por ADR-006 antes de Cluster E ir para SSG.
>
> Recomendação adicional não-bloqueante: que Morgan inclua referência cruzada explícita a `feedback_claims_metricas.md` e `_internal/conversion-hypotheses-rede-credenciada.md` no PRD v1.2.3 Story 5.8 (GSC Cluster Report) para fechar o loop de calibração.
>
> — Pax, equilibrando prioridades 🎯

### ✅ Aria (Architect) — 2026-04-26

> **Co-sign concedido.** ADR-005 v2 (recalibração 5.000-6.500 → ~10.500 URLs com filtros), ADR-006 (URL-as-trademark policy, Status Proposed pendente advogado revisor), ADR-007 (Dataset SSOT — hub canon, Status Accepted) publicados. Architecture patches aplicados em Build Performance (estratégia híbrida SSG+ISR documentada), Workflow 4 (cobre 2 datasets com SSOT), Storage Decisions (formalização explícita JSON estático vs Upstash vs Sanity). Story 7.1 ACs explicitam type guard runtime + cache em memória + 13+ helpers + tests Vitest com `totalPrestadores === 9325`. Build time projetado de ~25min Hobby (viável); Pro tier $20/mês permanece como contingência se Story 1.4 canary reportar >30min.
>
> — Aria, modelando o sistema 🏛

### ✅ Morgan (PM) — 2026-04-26

> **Co-sign concedido.** PRD bumpado para v1.2.4 (não 1.2.3 — slot já usado por Spike Clint API em outra sessão). Epic List atualizado: Epic 6 fica focado em "Price Intelligence & Calculator + Library" (Stories 6.5/6.6 movidas); Epic 7 NOVO "Programmatic SEO Rede Credenciada Amil" com 13 stories (7.0a/b/c → 7.10). Stories 6.5 e 6.6 marcadas como ARQUIVADO no PRD para audit trail; conteúdo original preservado mas direcionado para Epic 7. Story 5.7 flagada como Open Question (referenciada por ADR-005 mas sem definição formal — @sm criar antes de Wave 1 deploy). AC nova de amostragem estratificada documentada na nota Story 5.7.
>
> — Morgan, gerenciando o produto 🚀

### ✅ Uma (UX Design Expert) — 2026-04-26

> **Co-sign concedido.** FE spec v1.0 → v1.1 patches aplicados: Screen 7 (Rede Credenciada hub) reescrita com busca livre primária + atalhos por estado + filtros avançados em accordion (sem campo "especialidade" — gap dataset Power BI honrado); Screen 7b (Página-Prestador) NOVO com cobertura de 11 redes (marcadas/não), mapa aproximado por centroide, sem inventar conteúdo (telefone/endereço); Screen 7c (Cluster E rede × UF) NOVO com stats por tipo + lista agrupada por município + 400 palavras editoriais + CTA cotação pre-fill. Component library implícita: `<NetworkSearch />`, `<NetworkResultCard />` (sem especialidade), `<UfShortcutChips />`, `<NetworkAdvancedFilters />`, `<RedeCredenciadaFAQ />`. SEO copy rule reforçada: nenhuma promessa absoluta sem disclaimer "rede sujeita a alterações" no mesmo viewport.
>
> — Uma, desenhando experiências 🎨

---

## 15. Change Log

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 1.2.3 | 2026-04-26 | Orion | Recalibração rede credenciada para dataset 9.325 prestadores; Epic 7 novo; ADR-005 v2; ADR-006 + 007 novos; FE spec Screen 7 patch; Story 5.7 AC nova; M-04 mitigação aplicada (movimento `_internal/`) |
| 1.2.2 | 2026-04-26 (manhã) | Morgan | 11 correções pós Story 1.0 (Bronze→Platinum Mais, Clint, Sanity v3, Story 5.0 742 cidades-clone, etc.) |
| 1.2 | 2026-04-16 | Orion | Pivot Astro→Next.js via fork de codebase existente |
| 1.1 | 2026-04-16 | Morgan | PRD inicial pós research Atlas |

---

## Conventional Commits Sugeridos (sequência de aplicação deste SCP)

```bash
# Fase 1 — Documentação canônica (paralela, sem dependência entre commits)
docs(scp): add SCP v1.2.3 — recalibration rede credenciada dataset 9325
docs(_internal): add internal working notes directory + conversion hypotheses
docs(integration-plan): isolate conversion rates to _internal (M-04)
docs(adr): add ADR-007 dataset SSOT (Accepted)
docs(adr): add ADR-006 url-as-trademark policy (Proposed)
docs(adr): update ADR-005 to v2 — recalibration to ~10500 URLs
docs(arch): patch Build Performance + Workflow 4 + Storage Decisions
docs(prd): bump to v1.2.3 — Epic 7 + Story 5.7 AC + 6.5/6.6 moved
docs(fe-spec): patch Screen 7 + add 7b 7c (network detail + cluster E)

# Fase 2 — Co-sign formal (após Fase 1 completa)
docs(po): co-sign SCP v1.2.3 (Pax)
docs(scp): mark v1.2.3 Accepted with all approvals

# Fase 3 — Story drafting (River assume)
docs(stories): add Story 7.0a — preflight gap 11 vs 49 redes
docs(stories): add Story 7.0b — SSOT decision (consolidates SCP §3.1)
docs(stories): add Story 7.0c — URL trademark policy (consolidates SCP §3.2)
docs(stories): add Story 7.1 — schema + loader rewrite
# ... continua para 7.2-7.10
```

---

## Próximo Agente

**Sequência sugerida (3 caminhos paralelizáveis após este SCP):**

### Caminho A — Co-sign formal (dependency root)
1. **@po (Pax)** — co-sign final do SCP via `*execute-checklist-po` light review (≤30min)

### Caminho B — Documentação canônica (paralela)
2. **@architect (Aria)** — escrever ADR-005 v2 + ADR-006 + ADR-007 (~6-8h total)
3. **@pm (Morgan)** — patch PRD v1.2.3 (~2-4h)
4. **@ux-design-expert (Uma)** — patch front-end-spec Screen 7 + 7b/7c (~30-45min)

### Caminho C — Início de implementação (após Caminho A + B fecharem)
5. **@sm (River)** — `*draft Story 7.0a` (pre-flight) e `*draft Story 7.1` (loader rewrite)
6. **@dev (Dex)** — implementação Story 7.0a → 7.1 sequencial em Sprint X+1

### Recomendação Orion

Iniciar Caminho A imediatamente (Pax co-sign) e Caminho B em paralelo. Caminho C **GO** apenas após ambos concluídos. **NÃO** liberar @sm antes de PRD v1.2.3 + ADR-005 v2 + ADR-007 estarem com Status Accepted.

ADR-006 (Status Proposed → Accepted) é único bloqueador específico para Story 7.7 — outras stories Epic 7 podem prosseguir sem.

---

— Orion, orquestrando o sistema 🎯
