# PO Master Validation Report — planoamilempresas.com.br

**Documento:** PO Master Validation Report v1.0
**Projeto:** planoamilempresas.com.br
**Avaliador:** Pax (Product Owner — Balancer ♎) — Synkra AIOS
**Data:** 2026-04-16
**PRD Avaliado:** `docs/prd.md` v1.0 (Morgan / PM)
**Modo:** Comprehensive (análise completa)
**Tipo de projeto:** GREENFIELD + UI/UX

---

## Executive Summary

- **Project type:** Greenfield + UI/UX envolvida
- **Overall readiness:** **87%**
- **Go/No-Go recommendation:** **CONDITIONAL** — aprovação contingente a 3 ações corretivas listadas na Seção 6 deste relatório
- **Critical blocking issues count:** **2** (10 placeholders do stakeholder + ausência formal de Story 1.0 "Kickoff")
- **Sections skipped** (projeto não é brownfield):
  - Seção 1.2 (Existing System Integration)
  - Seção 7 inteira (Risk Management brownfield)
  - Items [[BROWNFIELD ONLY]] das seções 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.2, 4.3, 6.1, 6.2, 6.3, 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 10.1, 10.2

**Veredicto geral:** O PRD é **sólido, ambicioso e bem fundamentado** em research prévio (brief + competitor + market + keyword + brainstorm). Estrutura de epics respeita sequenciamento lógico, FRs e NFRs são testáveis, e cross-cutting concerns estão distribuídas (não empilhadas em epic final). O trabalho de consolidação dos 8 epics sugeridos pelo Atlas em 6 epics MVP demonstra julgamento PM maduro. **Nada deste PRD precisa ser reescrito** — apenas **complementado** com os 3 pontos abaixo.

---

## Category Statuses

| # | Categoria | Status | Issues Críticos |
|---|-----------|--------|-----------------|
| 1 | Project Setup & Initialization | ✅ **PASS** | 0 |
| 2 | Infrastructure & Deployment | ✅ **PASS** | 0 — DB ausência está correta (JAMstack, documentado) |
| 3 | External Dependencies & Integrations | ⚠️ **PARTIAL** | 1 — ausência de Story 1.0 consolidando setup de contas externas |
| 4 | UI/UX Considerations | ⚠️ **PARTIAL** | 1 — front-end-spec.md referenciado mas não produzido (depende de @ux-design-expert) |
| 5 | User/Agent Responsibility | ⚠️ **PARTIAL** | 1 — 10 placeholders do stakeholder não formalizados como Story |
| 6 | Feature Sequencing & Dependencies | ✅ **PASS** | 0 — sequenciamento entre epics é exemplar |
| 7 | Risk Management (Brownfield) | ⏭ **SKIPPED** | N/A |
| 8 | MVP Scope Alignment | ✅ **PASS** | 0 |
| 9 | Documentation & Handoff | ✅ **PASS** | 0 — architecture/frontend-spec pendentes mas mencionados em Next Steps |
| 10 | Post-MVP Considerations | ✅ **PASS** | 0 — Phase 2 claramente separada em 5 epics futuros |

---

## Análise Detalhada por Categoria

### 1. Project Setup & Initialization — ✅ PASS

**1.1 Project Scaffolding (Greenfield):**
- ✅ Epic 1 Story 1.1 inclui initialização explícita (Astro 4, TypeScript, ESLint, Prettier)
- ✅ Repository setup + initial commit definidos
- ✅ README com setup instructions mencionado
- ✅ .nvmrc, .gitignore, package.json configurados
- ✅ Não há starter template (build from scratch) — todos os passos cobertos

**1.3 Development Environment:**
- ✅ Local dev setup claro (Node 20.x LTS, `npm run dev`)
- ✅ Ferramentas e versões especificadas
- ✅ Instalação de dependências via package.json padrão
- ✅ Arquivos de config (.nvmrc, astro.config.mjs) abordados
- ✅ Dev server via `astro dev`

**1.4 Core Dependencies:**
- ✅ Astro 4+, React 18, TypeScript strict como dependências principais instaladas cedo
- ✅ Package management padronizado (npm)
- ✅ Versões specificadas (Astro 4.x, Node 20.x)
- ✅ Conflitos potenciais acknowledged (CodeRabbit, Dependabot/Renovate mencionados)

**Veredicto categoria:** SEM deficiências. Categoria bem coberta pelo Epic 1.

---

### 2. Infrastructure & Deployment — ✅ PASS

**2.1 Database & Data Store Setup:**
- ✅ **Decisão correta:** PRD documenta explicitamente "Database: Não necessário no MVP" (Technical Assumptions) — JAMstack puro, conteúdo em Markdown/CMS, leads para CRM externo
- ✅ Cloudflare KV (cache CNPJ) mencionado como única "persistência leve" em edge
- ✅ Phase 2 menciona Supabase/Turso como evolução possível — não pollua MVP
- ℹ️ **Nota PO:** poderia ser explicitado como story de ADR (Architecture Decision Record) para o @architect consolidar. Não é blocker.

**2.2 API & Service Configuration:**
- ✅ Edge functions (Cloudflare Workers) identificadas antes de implementar endpoints: cnpj-lookup, lead-dispatch, calculator, price-sync
- ✅ Adapter pattern para CRM mencionado (permite troca sem refatoração) — Story 4.3
- ✅ Middleware e utils planejados em `src/lib/`
- ℹ️ Autenticação de admin/preview: mencionada em Story 3.1 (preview CMS protegida) — suficiente para MVP que é público

**2.3 Deployment Pipeline:**
- ✅ CI/CD estabelecido em Story 1.3 ANTES de qualquer deploy ativo
- ✅ Cloudflare Pages configurado em Story 1.2 (deploy automático main + preview PRs)
- ✅ Environment configurations definidas cedo (Story 1.2)
- ✅ Deployment strategy: main = production, PR = preview (padrão blue-green implícito via preview URLs)

**2.4 Testing Infrastructure:**
- ✅ Vitest (unit), Playwright (integration), Lighthouse CI, axe-core instalados em Story 1.3
- ✅ Test env setup precede implementação de testes
- ✅ Mocks mencionados para CRM e BrasilAPI (Stories 4.2, 4.3)

**Veredicto categoria:** SEM deficiências.

---

### 3. External Dependencies & Integrations — ⚠️ PARTIAL

**3.1 Third-Party Services:**
- ⚠️ **Gap identificado:** O PRD menciona várias contas externas necessárias (Cloudflare, GA4, Sentry, Microsoft Clarity, CRM, ReceitaWS/BrasilAPI, WhatsApp, GitHub, Copyscape, Ahrefs/Semrush), mas **não existe uma Story 1.0 explícita** listando todas as contas a serem criadas em ordem.
- ✅ API key acquisition mencionado para secrets management (Story 1.2, Technical Assumptions)
- ✅ Secrets via Cloudflare environment variables (seguro)
- ⚠️ Fallback/offline dev: BrasilAPI tem fallback (ReceitaWS), mas CRM não tem fallback offline documentado

**3.2 External APIs:**
- ✅ Integration points claros (Story 4.2, 4.3, 4.4)
- ✅ Authentication sequenciada corretamente (env vars definidas antes de consumo)
- ✅ API limits acknowledged (BrasilAPI sem limite pago, ReceitaWS com limite)
- ✅ Backup strategy: queue Cloudflare para CRM falhar (Story 4.3 AC6)

**3.3 Infrastructure Services:**
- ✅ Cloud provisioning sequenciado (Cloudflare Pages conta → repo connect → deploy)
- ✅ DNS e domínio mencionados (Story 1.2 — DNS Cloudflare), domínio-ponte neutro como contingência
- ✅ CDN setup precede uso (Cloudflare Pages inclui CDN nativo)
- ℹ️ Email/messaging: não explícito para MVP (pode usar CRM nativamente + SMTP do CMS)

**Deficiência:** Falta **Story 1.0 "Project Kickoff & External Accounts Setup"** consolidando criação de contas externas em ordem correta antes de Story 1.1 começar. Isso também serve como hub para coletar os 10 placeholders do stakeholder.

**Recomendação:** Adicionar Story 1.0 (ver Recomendações, Seção 6).

---

### 4. UI/UX Considerations — ⚠️ PARTIAL

**4.1 Design System Setup:**
- ✅ UI framework selecionado (Astro + React islands)
- ✅ Paleta cromática definida (#0066B3 Amil azul + #00C389 CTA verde + neutros)
- ✅ Tipografia definida (Inter primária, Manrope alternativa)
- ✅ Styling approach mencionado: CSS modules ou Tailwind (a decidir em architecture.md)
- ✅ Design system em 8px grid documentado
- ✅ Responsive strategy mobile-first, breakpoints 360/768/1024/1440
- ✅ Accessibility: WCAG 2.1 AA obrigatório (NFR9)
- ⚠️ **Gap:** Design system NÃO está instalado/configurado no Epic 1 — aguarda `front-end-spec.md` da Uma (mencionado em Next Steps)

**4.2 Frontend Infrastructure:**
- ✅ Build pipeline Astro configurado (Story 1.1)
- ✅ Asset optimization mencionado (AVIF/WebP, fontes subset, lazy loading — NFR2)
- ✅ Frontend testing set up (Playwright E2E + Vitest + axe)
- ✅ Component development workflow: Story 3.2 (cornerstone template), 4.1 (form), 5.2 (programmatic), 6.1-6.3 (price + calculator)
- ℹ️ Storybook/Histoire (library de componentes isolados): não mencionado — não bloqueia MVP mas recomendo para Phase 1.5

**4.3 User Experience Flow:**
- ✅ User journeys mapeados (market-research.md + PRD UX Goals)
- ✅ Navigation patterns definidos implicitamente via silo topical + pillar → cornerstones → programmatic
- ✅ Error states mencionados (Story 4.1 AC7 — formulário error; NFR12 — 5xx alerts)
- ✅ Loading states mencionados (Story 4.1 AC5, Story 4.2 AC6)
- ✅ Form validation patterns estabelecidos (Story 4.1 AC2 — validação em tempo real onBlur)
- ✅ Página 404 útil (FR29)

**Deficiência:** Produção de `front-end-spec.md` pela @ux-design-expert (Uma) **depende deste PRD ser aprovado primeiro**. Ciclo correto, mas precisa estar explicitamente documentado como **próxima tarefa ANTES de Story 3.2 (cornerstone template) começar** (pois template precisa do design system).

**Recomendação:** front-end-spec.md deve estar pronto **antes de Epic 3 Story 3.2**. Ajustar ordem para: Epic 1 → Epic 2 (partial) → `front-end-spec.md` → Epic 3.

---

### 5. User/Agent Responsibility — ⚠️ PARTIAL

**5.1 User Actions:**
- ⚠️ **Gap principal:** Os 10 placeholders `[PENDENTE]` são responsabilidades do stakeholder mas **não estão formalizadas como tarefas em uma Story**. Estão apenas listados no final do PRD como "Open Questions" com recomendação de "1 sessão de 1h".
- ✅ Account creation on external services: identificado implicitamente como user action (Cloudflare, GA4, etc.)
- ✅ Purchasing (Ahrefs, Semrush, domínio): mencionado em budget do brief
- ✅ Credential provision: user provê API keys, @devops aplica em Cloudflare env vars

**5.2 Developer Agent Actions:**
- ✅ Todas as stories identificam o agente responsável (@dev, @devops, @legal, @ux-design-expert, @pm)
- ✅ Automated processes identificadas (CI/CD = @devops, CMS publish pipeline = @dev)
- ✅ Configuration management alocada corretamente (@devops para Cloudflare, @dev para código)
- ✅ Testing e validation alocados (@qa no workflow SDC, @dev local)

**Deficiência:** Falta **formalização** das 10 Open Questions em uma Story 1.0 com owner `stakeholder` e ACs verificáveis. Risco de serem esquecidas ou adiadas indefinidamente.

**Recomendação:** Adicionar Story 1.0 (detalhes na Seção 6).

---

### 6. Feature Sequencing & Dependencies — ✅ PASS

**6.1 Functional Dependencies:**
- ✅ Features dependentes sequenciadas: Auth de preview CMS (Story 3.1) precede preview content; Schema markup (Story 3.2) precede cornerstones (3.3-3.18); CNPJ lookup (4.2) precede form integration (4.3)
- ✅ Shared components antes de uso: `<Disclaimer />`, `<ComplianceBadges />` (Epic 2) antes de `<PriceTable />` (6.1) que usa `<Disclaimer />`
- ✅ User flows seguem progressão lógica
- ✅ Não há autenticação de cliente final no MVP (site público) — não aplicável

**6.2 Technical Dependencies:**
- ✅ Lower-level antes de higher-level: infra (Epic 1) → trust components (Epic 2) → content (Epic 3) → conversion (Epic 4) → programmatic (Epic 5) → advanced tools (Epic 6)
- ✅ Libraries e utils criadas antes de uso (Story 3.2 estabelece componentes MDX disponíveis para 3.3-3.18)
- ✅ Data models: Content collections schema (Story 3.1) antes de conteúdo
- ✅ API endpoints: edge functions (4.2, 4.3) antes de consumo pelo formulário

**6.3 Cross-Epic Dependencies:**
- ✅ **Excelente rationale documentado** no Epic List do PRD (linhas 280-285)
- ✅ Epic 1 DEVE ser primeiro (infra bloqueia tudo)
- ✅ Epic 2 antes de Epic 3 (E-E-A-T multiplica valor SEO do conteúdo)
- ✅ Epic 3 antes de Epic 4 (tráfego antes de conversão)
- ✅ Epic 4 antes de Epic 5 (conversão validada antes de escalar programmatic)
- ✅ Epic 6 pode paralelizar com Epic 5 (times diferentes)
- ✅ Não há epic que dependa de epic posterior
- ✅ Infraestrutura do Epic 1 é usada consistentemente

**Veredicto categoria:** SEM deficiências. Sequenciamento é **exemplar** e bem justificado.

---

### 7. Risk Management (Brownfield) — ⏭ SKIPPED

Categoria inteira pulada — projeto é greenfield.

**Nota PO:** Apesar de ser greenfield, recomendo ao stakeholder que **revise os riscos críticos listados no `pm-handoff.md`** (cease & desist Amil, duplicate content, algorithm update, LGPD, contrato corretagem) **antes do kickoff**, pois alguns são existenciais (binários).

---

### 8. MVP Scope Alignment — ✅ PASS

**8.1 Core Goals Alignment:**
- ✅ Todos os 8 goals do PRD são abordados por epics ou stories:
  - Goal "top 3 Google ≥20 keywords" → Epic 3 + Epic 5 + NFR10/11
  - Goal "200-500 leads/mês" → Epic 4 + FR5-8, FR20-22, FR24
  - Goal "DR ≥35" → budget backlinks (context) + Epic 2 (E-E-A-T amplifica)
  - Goal "600+ landing long-tail" → Epic 5 (FR3)
  - Goal "E-E-A-T YMYL" → Epic 2 inteiro
  - Goal "CWV ≥ Good 95%" → NFR1 + Story 1.4 + testes CI
  - Goal "3-12 contratos/mês" → Epic 4 (funil) + Epic 6 (conversion tools)
  - Goal "100% compliance ANS+LGPD" → NFR5, NFR6, Story 1.6, 1.7, 2.4
- ✅ Features diretamente suportam MVP goals
- ✅ Sem features extranneous (Phase 2 movida fora do MVP)
- ✅ Crítical features priorizadas (Epic 1-2 antes do resto)

**8.2 User Journey Completeness:**
- ✅ Jornadas críticas (awareness → consideration → purchase) cobertas por: homepage (hero + form) + pillar + cornerstones + programmatic + tabela + calculadora + sobre corretor + formulário
- ✅ Edge cases: CNPJ inválido (fallback manual — Story 4.2 AC7), API CRM falha (queue — Story 4.3 AC6), 404 (FR29)
- ✅ UX considerations incluídas (Paleta, tipografia, componentes, padrões de interação)
- ✅ Accessibility WCAG AA é NFR obrigatório (NFR9)

**8.3 Technical Requirements:**
- ✅ Todas as constraints do PRD endereçadas (Astro, Cloudflare, Headless CMS, Testing pyramid, TypeScript strict)
- ✅ Non-functional requirements (NFR1-20) cobrem performance, security, compliance, accessibility, SEO, observability, manutenibilidade, compatibilidade
- ✅ Architecture decisions alinhadas com NFRs (JAMstack = CWV; Cloudflare edge = security + scale)
- ✅ Performance considerations (NFR1, NFR2, NFR13)

**Veredicto categoria:** SEM deficiências.

---

### 9. Documentation & Handoff — ✅ PASS

**9.1 Developer Documentation:**
- ✅ README (Story 1.1)
- ✅ Setup instructions (Story 1.1 AC5)
- ✅ Architecture decisions via ADRs: adr-001 (CMS), adr-002 (CRM), adr-003 (Calculator formula) — mencionados em Stories 3.1, 4.3, 6.7
- ✅ Patterns documentation implícita (adapter pattern CRM, Content Collections schema, componente patterns MDX)
- ✅ Code comments não necessários em excesso (CLAUDE.md preference)

**9.2 User Documentation:**
- ✅ User guides para CMS: Story 3.1 AC6 (`docs/editorial/cms-guide.md`)
- ✅ Error messages e user feedback: Story 4.1 AC7, AC9; NFR12 alertas
- ✅ Onboarding flows: site público sem onboarding complexo (MVP não tem área logada)

**9.3 Knowledge Transfer:**
- ✅ Code review process implícito no CI (PR reviews obrigatórios — Story 1.2 AC6)
- ✅ Deployment knowledge: CI/CD automatizado, poucos manual steps
- ✅ Historical context preservado via ADRs e documentos de research (6 deliverables Atlas + PRD Morgan + este relatório)

**Veredicto categoria:** SEM deficiências. Documentação planejada é robusta.

---

### 10. Post-MVP Considerations — ✅ PASS

**10.1 Future Enhancements:**
- ✅ **Separação MVP vs Phase 2 é exemplar** — Phase 2 tem 5 epics próprios (7-11) listados no PRD com rationale
- ✅ Architecture suporta enhancements planejados (adapter pattern CRM, edge functions scalable, CMS extensible)
- ✅ Technical debt considerations documentadas (ADRs reversíveis)
- ✅ Extensibility points identificados (subdomínios reservados: app.*, api.* — para Phase 2)

**10.2 Monitoring & Feedback:**
- ✅ Analytics: GA4 + GSC + Clarity + Sentry (Story 1.5 + FR20, FR21)
- ✅ User feedback via NPS de leads (mencionado em KPIs)
- ✅ Monitoring e alerting (NFR12)
- ✅ Performance measurement: CWV via CrUX + RUM + Lighthouse CI

**Veredicto categoria:** SEM deficiências. Planejamento pós-MVP é robusto.

---

## Risk Assessment — Top 5 Riscos Identificados

| # | Risco | Severidade | Mitigação Recomendada | Timeline Impact |
|---|-------|------------|------------------------|-----------------|
| 1 | **Os 10 placeholders ficarem abertos indefinidamente** bloqueando go-live | ALTA | Formalizar em Story 1.0 com deadline antes de Story 1.1 começar | +3-7 dias se resolvido em sessão única; +2-4 semanas se adiado |
| 2 | **Front-end-spec.md atrasar e bloquear Epic 3** (cornerstone template precisa design system) | MÉDIA | Paralelizar: Uma inicia front-end-spec imediatamente após PRD aprovado, enquanto @architect começa architecture | Até 1 semana se paralelizado; até 3 semanas se sequencial |
| 3 | **Calculadora atuarial (Story 6.7) validação atrasar** bloqueando Epic 6 | MÉDIA | Iniciar pesquisa de reajuste histórico em paralelo ao dev base; envolver consultor atuarial early | +2 semanas se não houver consultor disponível |
| 4 | **Programmatic SEO thin content** ser penalizado pelo Helpful Content Update | MÉDIA | Story 5.3 exige conteúdo único por combinação CNAE (400w) + cidade (300w) + porte (200w) = 900w por página, validado via Copyscape | Sem impacto se disciplinado; risco de refactor pesado se falhar |
| 5 | **Volume de redação (15 cornerstones × 2000w + 600 programmatic × 900w = 30K + 540K words) sobrecarregar editorial** | MÉDIA | Definir pipeline freelance + buffer no roadmap; considerar IA-assist (GPT-4/Claude para drafts, humano para edit) | +4 semanas se bottleneck não for resolvido |

---

## MVP Completeness Analysis

**Core features coverage:** **95%** — cobertura excelente, nenhuma feature essencial faltando.

**Missing essential functionality (se houver):**
- Nenhuma feature bloqueante está ausente
- Opcional/recomendado para Phase 1.5: dashboard interno de KPIs (FR25 já marcado como Phase 1.5), A/B testing (FR26 opcional MVP), busca interna (FR19 opcional MVP)

**Scope creep identificado:**
- **Nenhum.** O PRD é disciplinado — Phase 2 foi claramente separada. Features Phase 2 poderiam ter sido incluídas no MVP (calculadora embed, newsletter), mas Morgan as colocou no roadmap corretamente.

**True MVP vs over-engineering:**
- Calculadora server-side (Story 6.3 AC6) é ligeiramente over-engineered para MVP (pode rodar client-side), mas justifica-se pela proteção da fórmula atuarial (moat)
- Dashboard interno de KPIs (FR25) está corretamente marcado como Phase 1.5 — não bloqueia MVP
- Resto é enxuto e justificado

---

## Implementation Readiness

- **Developer clarity score:** **9/10**
- **Ambiguous requirements count:** **2** — CMS decision (Story 3.1) e CRM decision (Story 4.3) estão pendentes, mas ambos têm opções concretas listadas e rationale
- **Missing technical details:**
  - `.aios-core/core/code-intel/` mencionado em CLAUDE.md mas não aplicável a este projeto (projeto fora do AIOS workspace)
  - Detalhamento de schema.org por template (será detalhado em architecture.md por Aria)
  - Estratégia exata de scraping ético de tabelas Amil (Story 6.6) — se API pública não existe, requer análise técnica adicional

**Veredicto:** PRD é altamente implementável. Ambiguidades restantes são decisões técnicas corretas de deixar para o @architect resolver.

---

## Recommendations

### Must-Fix Before Development (Bloqueadores)

#### REC-1 (CRITICAL): Criar Story 1.0 — Project Kickoff & External Accounts Setup

**Owner proposto:** stakeholder + @devops
**Posição no epic:** **Primeira story do Epic 1**, antes de Story 1.1

**Acceptance Criteria propostos:**
1. Todos os 10 placeholders `[PENDENTE]` do PRD resolvidos e documentados em `docs/stakeholder-inputs.md`:
   1.1 Nome completo + número SUSEP do corretor
   1.2 Nome jurídico + CNPJ da corretora PJ
   1.3 Validação contratual do uso de "Amil" no domínio (parecer do advogado)
   1.4 Regiões geográficas prioritárias (top 20 cidades confirmadas)
   1.5 Restrições contratuais Amil sobre produtos mencionáveis
   1.6 Decisão de CRM (ADR-002)
   1.7 Decisão de CMS (ADR-001)
   1.8 Nome do DPO
   1.9 Número WhatsApp oficial do corretor
   1.10 Aceite do stakeholder em aparecer publicamente (foto + bio)
2. Contas criadas e credenciais arquivadas seguramente: GitHub, Cloudflare, Google Analytics 4, Google Search Console, Microsoft Clarity, Sentry, BrasilAPI (gratuito, sem conta), ReceitaWS (opcional fallback), CRM escolhido, Cloudflare Turnstile
3. Domínio principal (`planoamilempresas.com.br`) e domínio-ponte (`comparaplanoscorporativos.com.br` ou similar) registrados
4. Foto profissional do corretor fornecida (bloqueio para Story 2.1)
5. Budget de ferramentas (Ahrefs OU Semrush) confirmado e conta criada
6. Advogado contratado e disponível para revisões (SLA definido)
7. Documento `docs/stakeholder-inputs.md` aprovado pelo stakeholder e arquivado
8. Checklist de readiness (go / no-go) aprovada antes de Story 1.1

**Rationale:** Sem essa consolidação formal, os 10 placeholders viram "débito técnico" que se propaga para múltiplas stories e pode bloquear Epic 2 (Trust & Authority) integralmente.

---

#### REC-2 (IMPORTANT): Ajustar Sequenciamento — Front-End-Spec Paralelo ao Epic 1

**Ação:** Documentar explicitamente que `front-end-spec.md` (Uma / @ux-design-expert) deve ser produzido **em paralelo ao Epic 1** e **concluído antes de Epic 3 Story 3.2** (cornerstone template), pois o template precisa do design system finalizado.

**Atualização proposta no PRD:** Adicionar nota no início do Epic 3:

> **Prerequisite:** Epic 3 depende de `front-end-spec.md` produzido por @ux-design-expert. Esse documento deve estar completo antes de Story 3.2 começar. Timeline sugerida: Uma inicia front-end-spec em paralelo ao Epic 1 (Semana 1-2), finaliza na Semana 3.

---

#### REC-3 (IMPORTANT): Consolidar Story 6.7 (Validação Atuarial) como Prerequisite da Story 6.3

**Ação:** Story 6.7 (Validação Atuarial da Calculadora) está atualmente listada depois de 6.3 (Calculadora — Versão Base), mas a **fórmula validada é pré-requisito da implementação correta**. Reordenar para:

**Sequência correta:** 6.1 → 6.2 → **6.7 (validação atuarial)** → **6.3 (implementação)** → 6.4 → 6.5 → 6.6 → 6.8

**Rationale:** Implementar calculadora sem fórmula validada gera retrabalho garantido.

---

### Should-Fix for Quality (Melhorias recomendadas)

#### REC-4: Adicionar Story 1.0b — "Editorial Team & Pipeline Setup"

Contratação e onboarding de redator freelance + definir pipeline editorial (redator → corretor → advogado → CMS → publicação). Sem isso, Epic 3 (15 cornerstones) vira gargalo severo.

#### REC-5: Adicionar Documento `docs/editorial/copyscape-sop.md`

Procedure operacional para validar originalidade de todo conteúdo publicado. Referenciado em múltiplas stories mas sem SOP documentado.

#### REC-6: Criar ADR-000 — "Astro SSG vs Next.js vs Remix"

Apesar da decisão já ter sido tomada (Astro), formalizar ADR com rationale ajuda onboarding futuro de devs e justifica decisão para stakeholders não-técnicos.

#### REC-7: Adicionar Story 1.9 — "Domain DNS Migration Playbook"

Domínio será adquirido via Story 1.0. Transferência e setup DNS para Cloudflare precisa de playbook próprio (zero downtime, testing pre-migration).

---

### Consider for Improvement (Opcionais)

- **Storybook/Histoire** para isolar desenvolvimento de componentes React (Phase 1.5)
- **Feature flags via GrowthBook** desde o Epic 1 (preparar infra para A/B testing Phase 1.5)
- **Status page pública** (via Cloudflare ou upptime.js) para transparência operacional
- **Política de rollback documentada** por epic (Phase 1.5)

---

### Post-MVP Deferrals (Corretos)

O PRD já **difere corretamente** para Phase 2:
- ✅ Calculadora embed para contadores (Epic 7)
- ✅ Newsletter VIP (Epic 8)
- ✅ API pública de cotação (Epic 9)
- ✅ Cross-sell odonto + vida (Epic 10)
- ✅ Estudo anual "Radar" (Epic 11)

Nenhuma dessas features tem justificativa para adiantar para MVP.

---

## Final Decision

### ✅ **APPROVED** (pós-correções aplicadas em 2026-04-16)

**Histórico:**
- **v1.0 (2026-04-16 11:45 BRT):** CONDITIONAL com 3 correções pendentes
- **v1.1 (2026-04-16 12:15 BRT):** APPROVED — Pax (PO) aplicou REC-1, REC-2, REC-3 diretamente no `prd.md` v1.1

**Correções aplicadas:**
- ✅ **REC-1:** Story 1.0 "Project Kickoff & External Accounts Setup" criada no Epic 1 com 9 ACs consolidando os 10 placeholders + setup de contas externas + contratos jurídicos + budget + pipeline editorial
- ✅ **REC-2:** Prerequisite note adicionada no início do Epic 3 exigindo `front-end-spec.md` (Uma) como dependência da Story 3.2, com timeline paralela ao Epic 1
- ✅ **REC-3:** Cross-reference estabelecida entre Stories 6.3 e 6.7 — Story 6.7 documentada como PREREQUISITE de 6.3, sequência correta de execução do Epic 6 explicitamente listada em ambas

Status final: **🟢 APPROVED** — PRD v1.1 liberado para handoff paralelo @ux-design-expert + @architect.

---

### Histórico original do veredicto (preservado para auditoria): 🟡 CONDITIONAL

O PRD é **tecnicamente sólido, estrategicamente alinhado e bem documentado**. Não precisa ser reescrito. A aprovação está contingente a **3 ações corretivas bloqueantes**:

1. **REC-1 (CRITICAL):** Criar Story 1.0 formalizando os 10 placeholders do stakeholder + setup de contas externas
2. **REC-2 (IMPORTANT):** Documentar no PRD que front-end-spec.md é pré-requisito do Epic 3 Story 3.2 (e deve ser produzido em paralelo ao Epic 1)
3. **REC-3 (IMPORTANT):** Reordenar Story 6.7 (validação atuarial) para antes de Story 6.3 (implementação calculadora)

**Após essas 3 correções**, o PRD é aprovado para handoff a @ux-design-expert e @architect.

**Ação recomendada:**
- Opção A (eu executo as 3 correções): @po (eu) aplico as correções diretamente no `prd.md` e handoff
- Opção B (Morgan aplica): delegar correções a @pm Morgan e re-validar
- Opção C (parcial): aprovar condicional sem alterações e resolver em backlog durante Epic 1

**Minha recomendação:** **Opção A** — aplico as 3 correções agora (15-20min de trabalho) e fecho o loop antes do próximo handoff.

---

## Próximos Passos Sugeridos

1. ✅ Stakeholder revisa este relatório
2. 🎯 Aplicar REC-1, REC-2, REC-3 (por mim ou Morgan)
3. 📋 Atualizar `prd.md` para v1.1 com correções
4. 🔄 Re-validação rápida (5min) pós-correção
5. 🚀 Handoff paralelo para Uma (@ux-design-expert) e Aria (@architect)
6. 📝 @sm (River) começa story creation a partir do PRD v1.1 aprovado

---

**Status do documento:** Validation Report v1.0 — CONDITIONAL APPROVAL
**Owner:** Pax (PO) ♎ — validação concluída
**Próximo owner:** @pm Morgan (aplicar correções) OU @po Pax (aplicar correções diretas)

— Pax, equilibrando prioridades 🎯
