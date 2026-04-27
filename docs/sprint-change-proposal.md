# Sprint Change Proposal — Pivot Arquitetural Astro → Next.js via Fork de Codebase Existente

**Documento:** Sprint Change Proposal v1.0
**Projeto:** planoamilempresas.com.br
**Facilitador:** Orion (AIOS Master — Orchestrator ♌) — Synkra AIOS
**Escalonado por:** Pax (PO — Balancer ♎)
**Data:** 2026-04-16
**Task:** `*correct-course`
**Checklist:** `change-checklist.md` — executada em modo batch/YOLO
**Status:** Draft para aprovação do stakeholder

---

## 1. Analysis Summary

### 1.1 Triggering Event

Durante handoff do PRD v1.1 (aprovado pela @po Pax) para ativação paralela de @ux-design-expert (Uma) e @architect (Aria), o stakeholder revelou a existência de um **codebase Next.js 14 pré-existente e funcional** em `/c/Users/benef/Desktop/amil-saude/` (nome enganoso — o projeto interno é `bradesco-saude-empresarial`):

- **Stack:** Next.js 14.2.29 + React 18 + TypeScript + Tailwind + Radix UI + Upstash Redis + Zod + React Hook Form + Vitest
- **Hosting:** Vercel (`vercel.json`)
- **Escala:** **1.005 páginas programáticas indexáveis** (27 estados × 742 cidades × 149 segmentos PDV × 44 segmentos Bradesco × 15 produtos)
- **SEO:** Audit automatizado — 83% OK, 16% alerta, 0% crítico
- **Documentação:** Estratégia SEO por segmento já escrita (`docs/estrategia-seo-segmentos.md`), tracking de conversões, Lighthouse report
- **Infraestrutura técnica madura:** rate limiting edge (Upstash), sitemap/robots dinâmicos, validação zod, route groups organizados `(landing)` + `(marketing)` + `api/`, config centralizado (`config/brand.ts`)

### 1.2 Informações Críticas Confirmadas pelo Stakeholder

1. **Site Bradesco NÃO está indexado** — go-live previsto para **2026-04-17** (amanhã). Risco de duplicate content entre Bradesco e Amil é **controlável** via conteúdo 100% original por operadora.
2. **Stakeholder é autor único do clone** — sem questões de propriedade intelectual ou licenciamento. Fork livre e legal.
3. **Sem apego ao Next.js** — stakeholder explicitamente busca "o melhor para os projetos", abrindo a decisão arquitetural.

### 1.3 Nature of the Change

**Tipo:** Pivot arquitetural estratégico (Architectural Pivot)

- **NÃO é:** falha de story, bug, limitação técnica, ou mudança de requisitos funcionais
- **É:** oportunidade de aproveitar ativo técnico pré-existente do stakeholder para acelerar time-to-market em 4-8 semanas, sem prejudicar os requisitos não-funcionais do PRD v1.1

### 1.4 Rationale for Review

Decisão de mudar stack técnica (Astro → Next.js) e provedor de hosting (Cloudflare Pages → Vercel) é uma **alteração substancial** do PRD v1.1 (seção "Technical Assumptions") e da Story 1.1 do Epic 1. Tal alteração demanda:
- Atualização formal do PRD (v1.1 → v1.2)
- Re-validação do @po sobre o PRD atualizado
- Ajuste na sequência de stories do Epic 1
- Comunicação clara aos próximos agentes na cadeia (@architect, @ux-design-expert, @dev, @devops)

---

## 2. Change-Checklist Analysis

### ✅ Section 1 — Understand the Trigger & Context

- **[x] Triggering Story:** Não há story específica — trigger ocorreu durante handoff pós-PRD, antes do Epic 1 iniciar
- **[x] Define the Issue:**
  - [ ] Limitação técnica — **Não**, Astro é viável
  - [ ] Novo requisito — **Não**, requisitos funcionais inalterados
  - [ ] Misunderstanding — **Não**
  - [x] **Pivot baseado em nova informação** — descoberta de ativo pré-existente que justifica mudança
  - [ ] Failed story — **Não**
- **[x] Initial Impact:**
  - Bloqueio temporário do handoff para Uma/Aria
  - Decisão binária: aproveitar clone (economia 4-8 sem) vs descartar e reafirmar Astro
- **[x] Evidence:**
  - Análise de `package.json`, estrutura `src/`, `docs/estrategia-seo-segmentos.md`, `seo-audit-summary.txt`
  - Confirmação de 3 fatos pelo stakeholder (site não indexado, autoria própria, sem apego à stack)

### ✅ Section 2 — Epic Impact Assessment

#### Current Epic (Epic 1 — Foundation): MODIFICATION REQUIRED

- [x] **Salvage possível:** Sim, com modificações significativas nas Stories 1.1, 1.2, 1.3
- **Stories afetadas:**
  - Story 1.0 (Kickoff): **sem alteração** — placeholders e contas externas ainda necessários
  - Story 1.1 (Setup Astro): **substituir** por "Fork do clone Next.js + strip Bradesco + rebranding Amil"
  - Story 1.2 (Cloudflare Pages): **substituir** por "Vercel Project Setup + Preview Deployments"
  - Story 1.3 (CI/CD GitHub Actions): **manter conceito**, adaptar configuração (Vercel em vez de Cloudflare Pages deploy target)
  - Story 1.4 (Canary): **substituir** por "Valida fork limpo + homepage placeholder no novo domínio"
  - Story 1.5 (Analytics stack): **sem alteração**
  - Story 1.6 (LGPD Consent): **sem alteração**
  - Story 1.7 (Rodapé legal): **sem alteração**
  - Story 1.8 (robots.txt + sitemap.xml): **trivial** — clone já tem `robots.ts` e `sitemap.ts` dinâmicos em Next.js App Router

#### Future Epics Impact

- **Epic 2 (Trust & Authority):** ✅ Sem alteração — componentes serão novos para Amil
- **Epic 3 (Content Engine):**
  - Story 3.1 (CMS setup): **refinar** — CMS deve integrar com Next.js App Router (Sanity ou Payload são mais naturais que Decap aqui); ADR-001 ajusta
  - Story 3.2 (Template cornerstone): **manter conceito**, substituir sintaxe Astro por Next.js + MDX (clone já tem pattern via `@next/mdx` ou similar a verificar)
  - Stories 3.3-3.18: **sem alteração** (conteúdo independe da stack)
  - Story 3.19 (pipeline atualização): **sem alteração**
- **Epic 4 (Conversion Engine):**
  - Story 4.1 (formulário): ✅ **Acelerado massivamente** — clone já tem `react-hook-form` + zod + componentes Radix
  - Story 4.2 (auto-CNPJ): substituir Cloudflare Workers por Next.js API Route / Edge Runtime
  - Story 4.3 (CRM integration): **pattern transferível** — clone tem `src/lib/` com integrações
  - Story 4.4 (WhatsApp button): **trivial** — portável
  - Story 4.5 (tracking): clone já tem `src/components/tracking/` com base
  - Story 4.6 (anti-spam): clone já tem Upstash rate limiting
- **Epic 5 (Programmatic SEO):**
  - Story 5.1 (keyword research): **sem alteração** — trabalho externo
  - Story 5.2 (template programático): ✅ **Drasticamente acelerado** — clone tem 1005 páginas programáticas funcionando, template é reusable após rewrite de conteúdo
  - Stories 5.3-5.5 (Waves 1/2/3): ✅ **Estrutura pronta**, só conteúdo a redigir
  - Story 5.6 (internal linking): ✅ **Lógica existente** no clone, adaptar
- **Epic 6 (Price Intelligence & Calculator):**
  - Story 6.1 (PriceTable): **novo componente** (clone provavelmente não tem, mas padrão de tabela existe)
  - Story 6.2 (página tabela): similar
  - Story 6.3 (calculadora): **novo** — padrão de form validation reaproveitável
  - Story 6.5 (rede credenciada): **novo** — padrão de busca/filtro reaproveitável
  - Story 6.6 (pipeline mensal): ajustar para Next.js + Vercel Cron Jobs
  - Story 6.7 (validação atuarial): **sem alteração** — trabalho jurídico/atuarial
  - Story 6.8 (biblioteca contratos): **sem alteração**

#### Epic Impact Summary

- **0 epics invalidados**
- **1 epic com mudanças significativas nas stories fundacionais** (Epic 1)
- **5 epics com aceleração substancial** de execução (Epics 3, 4, 5, 6 ganham patterns e componentes prontos)
- **0 epics novos necessários**
- **Nenhum reordenamento de sequência**

### ✅ Section 3 — Artifact Conflict & Impact Analysis

#### PRD v1.1

Seções com conflito que precisam atualização → **PRD v1.2:**

| Seção | Alteração |
|-------|-----------|
| Technical Assumptions > Service Architecture | Astro 4+ SSG → **Next.js 14 App Router + RSC + SSG** (com `output: 'export'` onde aplicável ou ISR via Vercel) |
| Technical Assumptions > Hosting | Cloudflare Pages → **Vercel** |
| Technical Assumptions > Backend/APIs | Cloudflare Workers → **Next.js API Routes + Edge Runtime** |
| Technical Assumptions > Database/KV | Cloudflare KV → **Upstash Redis** (já usado pelo clone) |
| Technical Assumptions > CDN | Cloudflare CDN → **Vercel Edge Network** |
| Technical Assumptions > Domain DNS | Cloudflare DNS → **Vercel DNS** ou Cloudflare DNS apontando para Vercel (Cloudflare-as-DNS-provider ainda viável) |
| NFR1 | Adjust target: Lighthouse ≥**92** (vs. ≥95 Astro; 92 é realista para Next + tuning; ainda acima dos concorrentes) |
| NFR2 | Ajustar limite de JS: ~60-100KB (vs. 40KB Astro) — ainda muito abaixo dos concorrentes (tipicamente 300KB+ em WordPress) |
| NFR4 | Adjust — Vercel Edge Config em vez de Cloudflare env vars |
| NFR13 (Escalabilidade) | Vercel limits (12s timeout serverless, 25s streaming Edge) — aceitável para MVP |
| Epic 1 story 1.1 | Fork clone + strip (novo AC set) |
| Epic 1 story 1.2 | Vercel setup (novo AC set) |
| Epic 1 story 1.3 | GitHub Actions → Vercel (novo AC set) |
| Epic 1 story 1.4 | Canary page em Next.js não Astro |

#### architecture.md (ainda não produzido)

- Aria (@architect) ainda não começou. **Benefício**: começará com stack definitiva já decidida, sem retrabalho.

#### front-end-spec.md (ainda não produzido)

- Uma (@ux-design-expert) ainda não começou. **Benefício**: o design system do clone (Radix UI + Tailwind) é um **starting point** concreto que acelera sua discovery. Uma pode avaliar se mantém a direção do clone ou customiza (recomendado: manter Radix + Tailwind, ajustar paleta/tipografia para Amil).

#### brief.md + competitor-analysis.md + market-research.md + keyword-strategy-research-prompt.md + brainstorming-session-results.md

- **0 alterações** — research é stack-agnostic. Personas, market sizing, positioning, gaps competitivos, estratégia de keywords — tudo aplicável.

#### pm-handoff.md

- Atualização leve: decisão de stack (item 3 da lista de "Decisões já tomadas") muda de Astro para Next.js + referenciar Sprint Change Proposal como fonte.

#### po-validation-report.md

- Re-validação light necessária após PRD v1.2 (~15min, já que só seção Technical Assumptions + Epic 1 stories foram afetadas).

#### Outros artefatos externos ao projeto

- **Site Bradesco (`amil-saude/`):** precisa **permanecer intacto** — é um projeto separado do stakeholder. Nosso fork é uma **nova cópia**, não edit in-place.

#### Summary of Artifact Impact

| Artefato | Status | Ação |
|----------|--------|------|
| `prd.md` v1.1 → v1.2 | ✅ Update necessário | Morgan (@pm) aplica diffs listados |
| `po-validation-report.md` | 🔄 Re-validate | Pax (@po) re-roda check focado |
| `pm-handoff.md` | ✅ Update leve | 1 linha ajustar |
| `architecture.md` | ⏭ Produzir já com Next.js | Aria (@architect) |
| `front-end-spec.md` | ⏭ Produzir referenciando Radix+Tailwind do clone | Uma (@ux-design-expert) |
| `brief.md`, research docs | ✅ Sem alteração | — |
| Memória `project_plano_amil_empresas.md` | ✅ Update stack | Auto-atualizar |

### ✅ Section 4 — Path Forward Evaluation

#### Option A — Pivot para Next.js via Fork do Clone **[✅ RECOMENDADO]**

**Escopo:**
- Fork do repositório `amil-saude/` para novo repo `planoamilempresas`
- Strip total de conteúdo/branding Bradesco em 3-5 dias
- Atualização do PRD para v1.2 refletindo stack
- Reescrita de PRD Epic 1 stories 1.1-1.4

**Effort:**
- Sprint Change Proposal + PRD v1.2: 2-3h (Orion + Morgan)
- Story 1.1 reescrita em Next.js (fork + strip): 3-5 dias (@dev + @devops)
- Bradesco → Amil adaptation: 2-3 semanas (conteúdo + segmentos)

**Throw-away:**
- Nenhum código (Epic 1 ainda não iniciou)
- Nenhum documento de research
- Custo de refactor do PRD: mínimo (~1h)

**Risks:**
- Next.js CWV: mitigável com RSC + App Router + static export onde aplicável → meta Lighthouse ≥92 (vs ≥95 Astro)
- Vendor lock-in Vercel: baixo — Next.js roda em outros providers (Netlify, Cloudflare com adapter, self-host)
- Dependência de Upstash (rate limit): baixa — substituível se necessário
- Contaminação Bradesco: mitigável via strip rigoroso + Copyscape antes de cada publish

**Timeline impact:**
- **Economia de 4-6 semanas** vs. Option B (greenfield Astro)
- Time-to-first-content: ~2 semanas após Story 1.0 concluída (vs. 5-6 semanas em Astro)

**Sustainability long-term:**
- ✅ Next.js é mainstream, comunidade grande, fácil de contratar
- ✅ Stakeholder já conhece o codebase — reduz bus factor
- ✅ Vercel hosting é confiável, tier pago se escalar

#### Option B — Manter Astro conforme PRD v1.1

**Escopo:**
- Seguir plano original, ignorar clone
- Começar do zero em Astro

**Effort:**
- 6-8 semanas adicionais de dev vs. Option A
- Curva de aprendizado do stakeholder em Astro (ainda não usou)

**Throw-away:**
- 1.005 páginas programáticas funcionais
- Audit script
- Rate limiting funcional
- Form patterns validados
- Design system Radix

**Risks:**
- CWV ceiling melhor (Lighthouse 100 vs 92) — marginal benefício em ranking
- Stack mais enxuta

**Timeline impact:**
- **+4-6 semanas** no time-to-market
- Janela competitiva de 12-18 meses fica mais apertada

**Sustainability:**
- ✅ Astro é stack moderna, crescendo rapidamente
- ⚠️ Stakeholder precisa aprender nova stack

#### Option C — Hybrid: scripts SEO + Astro greenfield

**Escopo:**
- Portar `seo-audit-report` script do clone para Astro
- Portar `estrategia-seo-segmentos.md` como input para Atlas
- Resto do código: zero reuso, Astro do zero

**Effort:**
- Similar ao Option B para código (6-8 sem) + 2-3 dias para portar scripts

**Throw-away:**
- 99% do clone

**Risks:**
- Combina desvantagens das duas opções (atrasa vs B mínimo, descarta ativo vs A)

**Timeline:** similar ao Option B

#### Comparative Decision Matrix

| Critério | Option A (Next.js fork) | Option B (Astro greenfield) | Option C (Hybrid Astro) |
|----------|-------------------------|------------------------------|--------------------------|
| Time-to-market | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Aproveitamento de ativo | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| Conhecimento tácito | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| CWV ceiling | ⭐⭐⭐⭐ (92-95) | ⭐⭐⭐⭐⭐ (95-100) | ⭐⭐⭐⭐⭐ |
| Custo de hosting (escala) | ⭐⭐⭐ (Vercel paid) | ⭐⭐⭐⭐⭐ (Cloudflare free) | ⭐⭐⭐⭐⭐ |
| Risco de contaminação Bradesco | ⭐⭐⭐ (mitigável) | ⭐⭐⭐⭐⭐ (zero) | ⭐⭐⭐⭐⭐ |
| Ecosystem maturity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **TOTAL (soma)** | **30/35** | **24/35** | **25/35** |

**Decisão recomendada:** **Option A — Pivot para Next.js via Fork do Clone**

### ✅ Section 5 — Sprint Change Proposal Components (este documento)

- [x] Identified Issue Summary → Section 1
- [x] Epic Impact Summary → Section 2
- [x] Artifact Adjustment Needs → Section 3
- [x] Recommended Path Forward → Section 4 (Option A)
- [x] PRD MVP Impact → Section 6 (abaixo)
- [x] High-Level Action Plan → Section 7 (abaixo)
- [x] Agent Handoff Plan → Section 8 (abaixo)

### ✅ Section 6 — Final Review & Handoff

- [x] Checklist reviewed: todas as 4 sections analíticas cobertas
- [ ] **Sprint Change Proposal review:** pendente (este documento apresentado ao stakeholder)
- [ ] **User approval:** pendente
- [x] Next steps listados em Sections 7-8 abaixo

---

## 3. PRD MVP Impact Assessment

### Requisitos Funcionais (FRs)

- **0 de 30 FRs impactados funcionalmente** — todos os FRs permanecem válidos
- FR5 (formulário ≤6 campos), FR6 (CRM), FR8 (calculadora), FR24 (anti-spam): **implementação acelerada** pelos patterns do clone

### Requisitos Não-Funcionais (NFRs)

- **NFR1 (CWV):** target ajustado de Lighthouse ≥95 para ≥92 (ainda acima dos concorrentes que ficam em 40-70)
- **NFR2 (JS size):** target ajustado de ≤40KB para ≤100KB (Next.js + RSC minimiza, mas ainda maior que Astro)
- **NFR4 (security):** secrets agora via Vercel Environment Variables (equivalente a Cloudflare env vars)
- **NFR13 (escalabilidade):** Vercel serverless limits são adequados para MVP
- **Outros NFRs (LGPD, ANS, SUSEP, a11y, SEO crawl/index, observability):** **sem alteração** — independentes da stack

### Epics

- **Epic 1 (Foundation):** **stories 1.1, 1.2, 1.3, 1.4 reescritas** — substância preservada, implementação muda
- **Epics 2-6:** **0 alterações estruturais**, apenas aceleração

### MVP Scope

- **Sem alteração de escopo**
- Pode haver **upside de velocidade**: features marcadas como "Phase 1.5" (FR19 busca, FR25 dashboard, FR26 A/B testing) podem migrar para MVP se economia de tempo se materializar

### MVP Success Criteria

- **Sem alteração**

---

## 4. Specific Proposed Edits — PRD v1.1 → v1.2

Abaixo estão os **diffs concretos** que Morgan (@pm) deve aplicar ao `prd.md`:

### Edit 1 — Change Log (adicionar entrada v1.2)

**Adicionar após linha atual da entrada v1.1:**

```
| 2026-04-16 | 1.2 | Pivot arquitetural Astro → Next.js via fork de clone pré-existente; hosting Cloudflare → Vercel; Upstash Redis como KV layer; ajustes em NFR1, NFR2, NFR4, NFR13; Epic 1 Stories 1.1-1.4 reescritas. Conforme Sprint Change Proposal aprovada em 2026-04-16. | Orion (Master) + Morgan (PM) |
```

### Edit 2 — Technical Assumptions > Service Architecture

**Substituir:**

```
**Arquitetura Serverless / JAMstack:**
- **Frontend:** Astro 4+ (SSG predominante) com ilhas React 18 para interatividade (formulário, calculadora, busca de rede)
- **Backend/APIs:** Cloudflare Workers (edge functions) para: [...]
- **CMS:** Headless [PENDENTE: decisão Decap / Sanity / Payload / Strapi]. Recomendação MVP: **Decap CMS** [...]
- **Hosting:** **Cloudflare Pages** (preferencial) [...]
- **CDN:** Cloudflare global [...]
- **Domain & DNS:** Cloudflare DNS [...]
```

**Por:**

```
**Arquitetura Serverless / JAMstack via Next.js 14 App Router:**
- **Frontend:** Next.js 14 com App Router + React Server Components (RSC) + SSG/ISR conforme necessidade. Static export para a maioria das páginas (pillar, cornerstones, programmatic, landings); ISR revalidate mensal para tabelas de preço. React 18 client components apenas para ilhas interativas (formulário, calculadora, busca rede, WhatsApp button)
- **Backend/APIs:** Next.js API Routes + Edge Runtime para:
  - Proxy anti-abuso do formulário de cotação
  - Consulta CNPJ (proxy BrasilAPI/ReceitaWS com cache)
  - Endpoint da calculadora (cálculo server-side + PDF generation)
  - Integração com CRM via adapter pattern
- **CMS:** Headless [PENDENTE: decisão Sanity / Payload / Contentful / Markdown+MDX via Git]. Recomendação MVP atualizada: **Sanity** (free tier generoso, melhor integração com Next.js App Router, já usada em ~30% dos projetos Next.js com Vercel) OU **MDX via Git** (simplicidade máxima, sem servidor adicional — similar espírito do Decap)
- **Database/KV:** **Upstash Redis** (serverless, já validado no clone, oferece rate limiting + cache de CNPJ + queue para leads com CRM falhando). Phase 2 pode introduzir Supabase/Neon se necessário
- **Hosting:** **Vercel** (host nativo do Next.js, edge network global, preview deploys automáticos, analytics nativos, tier Pro se ultrapassar free quota)
- **CDN:** Vercel Edge Network (280+ PoPs globais, HTTP/2, HTTP/3 parcial, compressão Brotli)
- **Domain & DNS:** Cloudflare DNS apontando para Vercel (best-of-both — DDoS protection Cloudflare + hosting Vercel) OU Vercel DNS direto

**Por que Next.js via fork do clone (pivot documented in Sprint Change Proposal 2026-04-16):**
- Stakeholder tem codebase Next.js 14 pré-existente e funcional com 1.005 páginas programáticas (originalmente para Bradesco Saúde Empresarial; conteúdo será 100% reescrito para Amil; fork autorizado — stakeholder é autor)
- Economia de 4-8 semanas no time-to-market
- Patterns maduros já implementados: rate limiting (Upstash), form validation (zod + react-hook-form), route groups, SEO audit automation, sitemap/robots dinâmicos
- Stakeholder conhece a codebase — reduz risco de bugs em edge cases
- Next.js 14 + RSC + App Router alcançam CWV target (Lighthouse ≥92) com tuning adequado
- Alinhamento com moat competitivo mantido (velocidade + SEO técnico)
```

### Edit 3 — Additional Technical Assumptions and Requests

**Adicionar na lista:**

```
- **Origem do codebase:** fork do repositório pré-existente `amil-saude/` (autor: stakeholder; originalmente Bradesco Saúde Empresarial) com strip total de conteúdo/branding Bradesco em Story 1.1
- **Stack principal confirmada:** Next.js 14.2+ (App Router), React 18, TypeScript 5, Tailwind CSS 3, Radix UI primitives, React Hook Form 7 + Zod 3, Upstash Redis (via @upstash/ratelimit), Vitest + Testing Library
- **Deploy target:** Vercel (substituindo Cloudflare Pages do PRD v1.1) — Next.js é nativo Vercel
- **Secrets:** Vercel Environment Variables (substituindo Cloudflare env vars)
- **ReceitaWS/BrasilAPI integration:** via Next.js API Route com Edge Runtime (substituindo Cloudflare Workers)
- **Rate limiting:** @upstash/ratelimit (já implementado no clone) — mantido
- **Edge functions timeouts:** Vercel serverless 10s (default) / 60s (pro) / Edge Runtime 25s streaming — adequado para calculadora e proxies
- **CMS decision:** ADR-001 reconsidera opções priorizando integração Next.js (Sanity ganha peso; Payload também forte em Next.js; MDX+Git como fallback simples)
- **Astro reserva:** caso pivot se mostre inviável por qualquer razão futura, plano B é Astro conforme PRD v1.1 (documento preservado)
```

### Edit 4 — NFR1 (Performance Core Web Vitals)

**Substituir:**

```
- **NFR1:** **Performance — Core Web Vitals:** 95% das páginas com LCP < 1,8s, CLS < 0,05, INP < 200ms (medido via CrUX field data). Lighthouse Performance ≥95 em todos os templates. TTFB < 200ms servidor edge.
```

**Por:**

```
- **NFR1:** **Performance — Core Web Vitals:** 95% das páginas com LCP < 2,0s, CLS < 0,05, INP < 200ms (medido via CrUX field data). Lighthouse Performance ≥92 em todos os templates (target revisto para Next.js + App Router + RSC; ainda muito acima dos concorrentes que ficam em 40-70). TTFB < 300ms (Vercel Edge Network).
```

### Edit 5 — NFR2 (JS size)

**Substituir:**

```
- **NFR2:** **Performance — Recursos:** JavaScript entregue ao cliente ≤40KB comprimido por página (Astro zero-JS por padrão, ilhas pontuais) [...]
```

**Por:**

```
- **NFR2:** **Performance — Recursos:** JavaScript entregue ao cliente ≤100KB comprimido por página (Next.js App Router com RSC minimiza client JS; target maior que Astro compensado pelo ganho de pattern reuse). Imagens servidas em AVIF (fallback WebP) via `next/image`, com lazy loading automático abaixo do fold. Fontes self-hosted via `next/font` com font-display: swap e subset reduzido.
```

### Edit 6 — NFR4 (Security)

**Substituir:**

```
- **NFR4:** [...] secrets gerenciados via Cloudflare environment variables (nunca no código).
```

**Por:**

```
- **NFR4:** [...] secrets gerenciados via Vercel Environment Variables (separados por environment — development/preview/production; nunca no código).
```

### Edit 7 — NFR13 (Escalabilidade)

**Substituir:**

```
- **NFR13:** **Escalabilidade:** capacidade de servir 100K sessões/mês em edge CDN sem degradação; 99% das respostas ≤500ms mesmo com carga pico de 10x média.
```

**Por:**

```
- **NFR13:** **Escalabilidade:** capacidade de servir 100K sessões/mês em Vercel Edge Network sem degradação; 99% das respostas HTML estático ≤300ms e 99% das respostas API ≤1500ms (incluindo calls externas a BrasilAPI/CRM); Vercel Pro se volume ultrapassar tier gratuito (~100GB bandwidth/mês).
```

### Edit 8 — Epic 1 Story 1.1

**Substituir título e conteúdo de Story 1.1:**

```
### Story 1.1: Fork do Codebase Existente + Strip Bradesco
Como **@dev** e **@devops**, quero **forkar o repositório pré-existente `amil-saude/` (stakeholder = autor), remover todo conteúdo e branding Bradesco, e criar novo repositório `planoamilempresas` limpo**, para **aproveitar 1.005 páginas programáticas e patterns maduros sem carregar qualquer referência à operadora anterior**.

**Acceptance Criteria:**
1. Novo repositório git `planoamilempresas` criado no GitHub (org ou conta pessoal do stakeholder — definir em Story 1.0)
2. Fork do codebase `amil-saude/` importado como primeiro commit (baseline preservada para auditoria)
3. **Strip completo de conteúdo Bradesco:**
   - `/src/data/` (se existir): esvaziado ou substituído por dados Amil
   - `/src/content/` (se existir): esvaziado
   - `/src/components/`: remover strings hardcoded "Bradesco" → temporariamente "TBD" até Epic 2/3 substituir por "Amil"
   - `/public/`: remover logos/imagens Bradesco; colocar placeholder até assets Amil serem fornecidos
4. **Strip de branding e meta:**
   - `src/config/brand.ts`: reescrever para `planoamilempresas` (título, descrição, URL base, cores como placeholder até front-end-spec.md de Uma)
   - `package.json`: `name: "planoamilempresas"`, remover referências Bradesco, atualizar version para `0.1.0`
   - `layout.tsx`: meta tags título/descrição genéricas temporárias
   - `sitemap.ts` + `robots.ts`: gerados dinamicamente — sem hardcode Bradesco
5. **Strip de analytics e integrações:**
   - Remover IDs GA4/GSC/Sentry/Clarity Bradesco; placeholders via env vars até Story 1.5 aplicar os novos
   - Remover conexões Upstash Bradesco (placeholders novos via env vars)
   - Remover webhook/API keys CRM Bradesco
6. **Strip de segmentos:**
   - `segment-redirects.mjs`: limpar todas as entradas Bradesco; será repopulado em Epic 5 com segmentos Amil/CNAEs
   - Arquivos de dados de segmentos (estados/cidades): preservar apenas estrutura; conteúdo vai para Epic 3/5
7. **Auditoria final de strip:**
   - Grep recursivo por `bradesco` (case-insensitive) deve retornar 0 matches em `src/`, `public/`, `docs/`, `config`
   - Grep por `amil-saude` deve retornar 0 matches fora de `.git/` (histórico preservado)
8. TypeScript strict mode mantido; `npm run typecheck` passa
9. `npm run build` gera build limpo sem erros
10. `npm run test` passa (testes podem ser ajustados mas não removidos)
11. Commit inicial Conventional Commits: `feat: initial fork of codebase with Bradesco stripped, ready for Amil rebranding [Story 1.1]`
12. README.md reescrito explicando origem do fork, purpose do projeto, comandos principais
13. `.gitignore` mantém exclusões (node_modules, .next, .env, etc.)
```

### Edit 9 — Epic 1 Story 1.2

**Substituir título e conteúdo de Story 1.2:**

```
### Story 1.2: Configuração de Hosting (Vercel) e DNS
Como **@devops**, quero **conectar o repositório forkado a Vercel com preview automático em PRs e DNS configurado**, para que **o site esteja em URL estável e cada mudança seja deployada em preview isolado**.

**Acceptance Criteria:**
1. Conta Vercel criada (ou org existente do stakeholder) e projeto Vercel conectado ao repositório GitHub
2. Deploy automático do `main` para produção (URL `*.vercel.app` até domínio ser apontado)
3. Preview automático para cada PR com URL única comentada no PR
4. Environment variables placeholder configuradas em 3 environments (development / preview / production): GA4_ID, GSC_VERIFICATION, SENTRY_DSN, CLARITY_ID, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, CRM_API_KEY, RECEITA_API_KEY (valores reais aplicados em Story 1.5)
5. Branch protection: PRs obrigatórios para `main`, ao menos 1 approval, CI verde
6. DNS (Cloudflare DNS ou Vercel DNS — definir em ADR-004): `planoamilempresas.com.br` apontando para Vercel (quando Story 1.0 fornecer domínio)
7. HTTPS forçado, HSTS habilitado (Vercel nativo)
8. Preview deploys protegidos por password (opcional, Vercel Pro feature) ou abertos conforme preferência
9. Edge Config / Redis KV (Upstash) provisionado e testado — rate limiting funcionando em endpoint de teste
10. Vercel Analytics habilitado (gratuito)
```

### Edit 10 — Epic 1 Story 1.3

**Substituir:**

```
### Story 1.3: CI/CD com GitHub Actions
[...]

**Acceptance Criteria:**
1. Workflow `ci.yml` rodando em PR: install deps, lint, typecheck, test unit, build
2. Workflow `lighthouse.yml` rodando Lighthouse CI em PRs com threshold Performance ≥90
3. Workflow `accessibility.yml` rodando axe-core, falhando em violações WCAG AA
[...]
```

**Por:**

```
### Story 1.3: CI/CD com GitHub Actions + Vercel Integration
Como **@devops**, quero **GitHub Actions rodando lint, typecheck, testes unitários, Lighthouse CI e axe-core em cada PR, com deploy automatizado via Vercel GitHub Integration**, para que **qualidade, performance e acessibilidade sejam garantidas antes do merge e deploy seja zero-friction**.

**Acceptance Criteria:**
1. Workflow `ci.yml` rodando em PR: install deps, lint (eslint-config-next), typecheck (`tsc --noEmit`), test unit (vitest), build (`next build`)
2. Workflow `lighthouse.yml` rodando Lighthouse CI em PRs com threshold Performance ≥90, rodado contra URL de preview do Vercel
3. Workflow `accessibility.yml` rodando axe-core em componentes isolados + páginas-chave, falhando em violações WCAG AA
4. Workflow `schema-validation.yml` validando schema.org via Google Rich Results Test (stories futuras de conteúdo se beneficiarão)
5. Vercel GitHub Integration ativa: deploy automático preview em cada PR; deploy production em merge para main
6. Status checks bloqueando merge: CI, Lighthouse, Accessibility, Vercel Preview Deploy, CodeRabbit (se usar)
7. Badges de CI no README.md
8. Cache de node_modules via `actions/setup-node@v4` com `cache: 'npm'` para builds <2min
9. Secret management: GitHub Actions secrets sincronizados com Vercel env vars
```

### Edit 11 — Epic 1 Story 1.4

**Substituir:**

```
### Story 1.4: Página Canary / Health (Primeira Deploy Funcional)
[...]
**Acceptance Criteria:**
1. Rota `/` renderiza página com título "Em breve — planoamilempresas.com.br", tagline do projeto e data da última build
2. Rota `/healthz` retorna JSON [...]
```

**Por:**

```
### Story 1.4: Canary Page + Health Endpoint (Primeira Deploy Funcional em Next.js)
Como **stakeholder**, quero **acessar uma página canary "coming soon" no domínio deployado que confirma fork limpo + pipeline end-to-end funcionando**, para **validar que a fundação está operacional antes de investir em conteúdo**.

**Acceptance Criteria:**
1. Rota `/` renderiza página server-rendered (RSC) com título "Em breve — planoamilempresas.com.br", tagline, data da última build (via `process.env.VERCEL_GIT_COMMIT_SHA` ou similar)
2. Rota `/api/healthz` (Next.js API Route Edge Runtime) retorna JSON `{ status: "ok", version: "<git-sha>", timestamp, environment }` — verificável via curl
3. Página 404 custom (`not-found.tsx` do clone, limpa) com link para `/`
4. Página de erro (`error.tsx`) com logging Sentry (se configurado em Story 1.5) ou fallback
5. Meta tags básicas (title, description, viewport, charset, og:title, og:image placeholder)
6. Favicon placeholder
7. HTTPS ativo com cadeado no browser
8. Lighthouse Performance ≥95 nesta página simples (target facilmente atingido em página com pouco JS)
9. CWV: LCP < 1s, CLS 0, INP < 100ms
10. Grep reverso confirma: zero strings `Bradesco` / zero referências a `amil-saude` original
```

### Edit 12 — Status final do documento

**Substituir:**

```
**Status do documento:** **v1.1 — APPROVED pós-correções @po** [...]
```

**Por:**

```
**Status do documento:** **v1.2 — APPROVED pós Sprint Change Proposal (Pivot Next.js)** em 2026-04-16
**Histórico:**
- v1.0 (2026-04-16): Draft Morgan (PM)
- v1.1 (2026-04-16): Correções @po (Pax) REC-1/REC-2/REC-3
- v1.2 (2026-04-16): Pivot arquitetural Astro→Next.js via fork de clone pré-existente (Sprint Change Proposal executado por Orion)

[...]
```

---

## 5. Agent Handoff Plan

Após aprovação deste Sprint Change Proposal, a execução segue:

| Ordem | Agente | Ação | SLA |
|-------|--------|------|-----|
| 1 | **Morgan (@pm)** | Aplicar os 12 Edits ao `prd.md` → v1.2 | 1-2h |
| 2 | **Pax (@po)** | Re-validação leve do PRD v1.2 (foco em Technical Assumptions + Epic 1) | 30min |
| 3 | **Orion (@aios-master)** | Atualizar memória `project_plano_amil_empresas.md` com novo stack | 10min |
| 4 (paralelo) | **Aria (@architect)** | Criar `architecture.md` com Next.js + Vercel + Upstash como baseline | 1-2 dias |
| 4 (paralelo) | **Uma (@ux-design-expert)** | Criar `front-end-spec.md` aproveitando Radix + Tailwind do clone como baseline | 1-2 dias |
| 5 | **River (@sm)** | Story creation formal em `docs/stories/` a partir do PRD v1.2 | 1 dia |
| 6 | **Pax (@po)** | `*validate-story-draft` para cada story criada | contínuo |
| 7 | **Dex (@dev)** | Executar Story 1.0 → 1.1 → 1.2... em sequência | 6-8 semanas totais |
| 8 | **Quinn (@qa)** | QA gate em cada story implementada | contínuo |
| 9 | **Gage (@devops)** | Setup Vercel, push para main, deploy production | no momento apropriado |

---

## 6. Success Criteria para a Mudança

Esta mudança é considerada bem-sucedida se, **em M3 após lançamento** (vs. M3 original do PRD v1.1):

- ✅ Time-to-first-cornerstone-published: **≤10 semanas** (vs. 12 semanas previsto) = economia de ≥2 semanas materializada
- ✅ Lighthouse Performance: ≥92 em 95% das páginas
- ✅ Zero strings "Bradesco" encontradas no site deployado (validado por grep + manual review + Copyscape)
- ✅ CWV "Good" em 95% das páginas
- ✅ 100 páginas programáticas (Wave 1) indexadas em 30 dias pós-publicação
- ✅ Autoridade do Bradesco não transferida (verificar via Ahrefs backlink audit — ambos sites separados)
- ✅ 0 incidentes legais/regulatórios (cease & desist Amil, denúncia Bradesco sobre reuso, etc.)

**Critério de rollback** (se tudo der errado):
- Se em M2 o CWV estiver significantemente pior que target (<85 consistente), avaliar retorno a Astro (PRD v1.1 preservado como fallback documentado)
- Se estratégia editorial falhar em produzir conteúdo original suficiente (risco Bradesco contamination), revisar política editorial e pipeline

---

## 7. Approval Request

**Stakeholder, preciso da sua decisão formal sobre:**

### Pergunta 1 — Aprovar o Sprint Change Proposal?

1. ✅ **APPROVE** — Morgan aplica os 12 Edits no PRD, @po re-valida, e seguimos com Option A (pivot Next.js + fork)
2. ❌ **REJECT** — Mantemos PRD v1.1 (Astro greenfield) e ignoramos o clone
3. 🔄 **REVISE** — Aprovo com ajustes (especifique quais dos 12 Edits revisar)

### Pergunta 2 — Handoff subsequente (se APPROVE)

1. **Parallel**: Morgan aplica PRD v1.2 → eu (Orion) atualizo memória → Aria e Uma começam docs em paralelo (mais rápido)
2. **Sequential**: Morgan → @po re-valida → Aria → Uma → @sm (mais conservador, +1-2 dias)
3. **Stakeholder review intermediate**: pause após Morgan aplicar PRD v1.2 para você revisar antes de handoffs

Minha recomendação: **1 (APPROVE) + 1 (Parallel)** — economiza 1-2 dias sem perda de qualidade.

---

## 8. Annex: Analysis of Existing Clone

Para audit trail e referência futura, resumo do que foi analisado no clone:

**Clone inspecionado:** `C:\Users\benef\Desktop\amil-saude\`
**Data da análise:** 2026-04-16
**Nome interno do projeto (package.json):** `bradesco-saude-empresarial`
**Versão:** 0.1.0
**Stack confirmada:**
- Next.js 14.2.29 (App Router)
- React 18 + TypeScript 5
- Tailwind CSS 3.4 + Radix UI primitives (Accordion, Slot, etc.)
- React Hook Form 7.54 + Zod 3.24
- Upstash Redis + @upstash/ratelimit 2.0
- Vitest 4.1 + Testing Library 16
- Next.js integrations: ESLint config Next 14.2, Sharp (image optimization)

**Estrutura `src/`:**
- `app/` (App Router) — route groups `(landing)` + `(marketing)` + `api/` + layout, globals, robots.ts, sitemap.ts, error, not-found
- `components/` — blog, layout, sections, tracking, ui
- `config/` — brand.ts (centralizado), README.md
- `data/` — camada de dados (inferido para programmatic)
- `lib/` — utils
- `test/` — setup de testes
- `types/` — TypeScript types compartilhados

**Documentação existente:**
- `DEPLOY-STRATEGY.md` (7,8KB) — estratégia de deploy Vercel
- `docs/estrategia-seo-segmentos.md` — estratégia SEO por segmento (OKRs 12 meses, silo topology, URL patterns, tabelas detalhadas de segmentos)
- `docs/tracking-conversoes.md` — tracking de funil
- `docs/materiais/` — diretório de materiais

**Arquivos de configuração críticos:**
- `next.config.mjs` (28KB — extensivo, provavelmente com redirects/rewrites)
- `segment-redirects.mjs` (25KB — lógica de redirecionamento por segmento)
- `vercel.json` (deploy config)
- `tailwind.config.ts`
- `tsconfig.json`
- `vitest.config.ts`

**SEO metrics do clone:**
- 1.005 páginas auditadas
- 83% OK (835 páginas)
- 16% alerta (170 páginas) — questões menores de densidade de keywords
- 0% crítico
- Estrutura: 27 estados + 742 cidades + 149 segmentos PDV + 44 segmentos BS + 15 produtos

**Conclusão do audit:** codebase é maduro, bem-estruturado, com patterns reutilizáveis em escala. Descarte seria perda significativa de investimento prévio.

---

**Status do documento:** Draft aguardando aprovação do stakeholder
**Owner:** Orion (AIOS Master) ♌
**Próximo owner após aprovação:** Morgan (PM) para aplicar os 12 Edits

— Orion, orquestrando o sistema 🎯
