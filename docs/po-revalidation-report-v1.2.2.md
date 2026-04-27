# Re-validação Integrada PO — PRD v1.2.2 + Architecture v1.1 + FE Spec v1.0

**Documento:** PO Re-validation Report v1.2.2
**Projeto:** planoamilempresas.com.br
**Validador:** Pax (Product Owner — Synkra AIOS) ♍
**Data:** 2026-04-26
**Inputs:** `prd.md` v1.2.2 (Morgan) + `architecture.md` v1.1 (Aria) + `front-end-spec.md` v1.0 (Uma) + `stakeholder-inputs.md` (Story 1.0 fechada)
**Checklist canônico:** `.aiox-core/product/checklists/po-master-checklist.md` (greenfield + UI/UX)

---

## Seção 1 — Resumo Executivo

### Veredito

**APROVADO COM RESSALVAS** — pode liberar @sm (River) para iniciar story creation **EM PARALELO** com 4 ações corretivas obrigatórias, desde que essas correções entrem em queue antes da Story 3.2 (Template de Cornerstone) ser implementada.

### Pass rate geral

**87,5%** (10,5 de 12 itens da framework PO Master Checklist).

| Faixa | Significado | Decisão Pax |
|---|---|---|
| ≥ 95% | Aprovação direta, @sm libera tudo | — |
| **85–94%** | **Aprovação com ressalvas, @sm libera com itens em queue paralela** | **← Estamos aqui** |
| 70–84% | Aprovação parcial, @sm bloqueado em N stories até resolver |
| < 70% | Não aprovado, retorno para Morgan + Aria + Uma |

### Top 3 forças

1. **Resolução robusta da Story 1.0 → integração nos 3 docs.** Os 13 placeholders viraram inputs concretos (Agnaldo, SUSEP 201054484, BeneficioRH CNPJ, Clint, Sanity, paleta `#0066B3` mantida com plano B 1-line) e foram propagados com qualidade no PRD (citado em FRs 6/9/10/14, NFR8, Stories 1.0/1.6/1.7/2.1/2.4/4.3) e na Architecture (ADR-001 Accepted, ADR-002 Updated, ADR-005 NOVO, Tech Stack atualizada, NetworkProvider e PriceTable reescritos com nomenclatura real Bronze→Platinum Mais).
2. **ADR-005 (Programmatic SEO Depth Strategy) é diferencial real.** Aria documentou hierarquia L0-L4 com regras anti-canibalização entre 4 ativos SEO (tabela, rede, cidade-clone, matriz CNAE), com schemas markup diferenciados por tipo. Volume estimado ~5.000-6.500 URLs com mitigação de Helpful Content explícita. Concorrentes Tier B do Atlas não conseguem replicar.
3. **Build Performance section nova endereça preocupação real.** Tabela tier Hobby/Pro + ISR revalidate por tipo (30d rede, 30d preço, 7d cornerstone, build-only matriz) + estratégia de chunking por phase + bundle size monitoring `@next/bundle-analyzer` em CI. Decisão MVP "Hobby + upgrade pós-canary" é prudente.

### Top 3 gaps

1. **DRIFT CRÍTICO: `front-end-spec.md` v1.0 NÃO foi atualizado pós-Story 1.0.** É o único dos 3 docs que ainda carrega a realidade v1.0/v1.2 anterior à descoberta da nomenclatura real:
   - **Linha 91, 225, 374:** sitemap mermaid + flow + horizontal-scroll cards citam `Amil 400 vs 500 vs 600` — nomenclatura aposentada.
   - **Linha 1234:** `❌ Ilustrações genéricas unDraw/etc` — explicitamente proibido. **Mas Story 1.0 Bloco 5.3 decidiu 🅱️ "Stock editado unDraw/Storyset"** como direção MVP. Contradição direta.
   - **Linhas 1521-1523:** "Open Questions" lista logo + paleta + fotografia como pendentes. **Os 3 já foram resolvidos** em Story 1.0 (combo BeneficioRH + selo, paleta mantida, foto fornecida em `Agnaldo-silva-corretor-bradesco-saude-empresarial.jpeg`).
   - **Severidade: HIGH.** Bloqueia Story 3.2 (Template Cornerstone) e Stories 3.4–3.18 (cornerstones individuais — Story 3.5 do PRD é "Bronze vs Prata" mas FE spec ainda mostra "400 vs 500").

2. **ADR-003 (Calculator Formula) ainda usa nomenclatura antiga + arquivo físico não existe.** Architecture.md linha 1749-1781 mantém `P = produto (400/500/600/Blue/Black)` como variável, e o arquivo `docs/decisions/adr-003-calculator-formula.md` referenciado pela própria ADR não existe no diretório (`ls docs/decisions/` retorna apenas adr-001 e adr-002). Sinaliza dois problemas: (a) retrabalho de nomenclatura, (b) ADR ainda Proposed sem arquivo formal — bloqueia Story 6.7 (validação atuarial) que é prerequisite de 6.3.

3. **ADRs 000, 004, 005 só existem inline em `architecture.md` — não como arquivos separados em `docs/decisions/`.** PRD v1.2.2 e Architecture v1.1 referenciam `docs/decisions/adr-000-nextjs-over-astro.md`, `adr-003-calculator-formula.md`, `adr-004-dns-strategy.md`, `adr-005-programmatic-seo-depth.md` mas só `adr-001-cms-choice.md` e `adr-002-crm-adapter.md` existem como arquivos. Isso fere o princípio "ADRs documentados" do PO Master Checklist 9 e cria audit trail incompleto. **Severidade: MEDIUM** (não bloqueia dev, mas é dívida técnica de docs).

---

## Seção 2 — Resolução das 3 Ambiguidades sinalizadas por Aria

### Ambiguidade 1 — ADR-003 (Fórmula calculadora) com nomenclatura antiga

**Decisão Pax: 🅱️ — atualizar ADR-003 em conjunto com Story 6.7 (validação atuarial)**

**Justificativa:**
- A fórmula matemática de coparticipação é mais que renomeação de variável: ela depende de `PriceTable[P][F_bracket]` (tabela base × faixa etária) e de `S` (sinistralidade). Como o `PriceTable` foi reescrito v1.0 → v1.1 (acomodação QC/QP, coparticipação% em vez de boolean, 10 faixas etárias ANS reais, reembolso só em Ouro+), a fórmula intrinsecamente precisa ser repensada — não basta `P = produto (Bronze/Bronze Mais/...)`.
- Forçar Aria a corrigir ADR-003 agora gera **mudança superficial** que o atuário em Story 6.7 vai inevitavelmente revisar. Retrabalho garantido.
- A Story 6.7 já é PREREQUISITE de 6.3 no PRD (`docs/prd.md` linha 876, REC-3 — "Sequência correta do Epic 6: 6.1 → 6.2 → 6.7 → 6.3 → 6.4 → 6.5 → 6.6 → 6.8"). Integrar atualização nomenclatura + revisão atuarial no mesmo passo é eficiente.
- **Pendência derivada:** o arquivo físico `docs/decisions/adr-003-calculator-formula.md` precisa ser **criado por Aria como STUB** com Status: `Proposed — pending atuarial validation [Story 6.7]` e copy-paste do conteúdo inline do `architecture.md` linhas 1749-1781, marcando explicitamente a nomenclatura antiga com `[REVISAR — Story 6.7]`. Isso preserva audit trail e dá referência real para a Story 6.7. **Esta extração é tarefa de Aria, não bloqueia @sm.**

### Ambiguidade 2 — Type `UF` centralizado

**Decisão Pax: 🅰️ — single source of truth em `src/types/uf.ts`** (a criar pós Story 1.1, antes de qualquer story que use UF — Story 5.0 ou 6.1)

**Justificativa:**
- Verifiquei `data/tabelas-amil.ts` com Grep: **NÃO exporta type `UF`**. O tipo `UF` que Aria introduziu na `architecture.md` (linhas 384-388) é nominal-apenas, ainda não implementado. Logo não há "2 sources of truth conflitando hoje" — há **1 source proposto + 0 implementado**, e a oportunidade é fazer certo agora.
- `data/rede-credenciada/rede-amil.ts` usa `UF: string` no schema raw (sem tipo restrito), validando que importar de `src/types/uf.ts` desacopla types de dados de domínio. Single source em `src/types/` é o pattern padrão de TypeScript moderno.
- O `tabelas-amil.ts` exporta `Segmentacao`, `Acomodacao`, `Abrangencia`, `FaixaEtaria`, `PlanoAmil` mas usa `sigla: string` sem type literal restritivo. Centralizar `UF` em `src/types/uf.ts` permite migrar `data/tabelas-amil.ts` para usar `sigla: UF` sem refator massivo.
- **Implementação:** criar `src/types/uf.ts` na Story 1.1 (fork+strip — momento ideal porque `src/types/` está sendo redefinido). Arquivos `data/tabelas-amil.ts` e `data/rede-credenciada/rede-amil.ts` migram para `import type { UF } from '@/types/uf'` em Story 5.0 e Story 6.1 respectivamente.

### Ambiguidade 3 — Divergência kebab-case vs PascalCase nas segmentações

**Decisão Pax: 🅰️ — manter divergência intencional + criar mapper helper `src/lib/utils/segmentacao.ts`**

**Justificativa:**
- A divergência **NÃO é bug, é pattern**. URLs precisam de slug (`/plano-amil/.../prata-qc/...`); UI labels precisam de display human-readable ("Prata QC"). Forçar uniformidade é o que gera bug, não o contrário (Hyrum's Law: ambos os formats já estão consumidos por código diferente).
- `data/tabelas-amil.ts` exporta `Segmentacao = 'Bronze' | 'Bronze Mais' | 'Prata' | 'Ouro' | 'Platinum' | 'Platinum Mais'` (PascalCase com espaço) — alinhado com legenda visível em `data/tabelas-visual.html`.
- `architecture.md` linha 232 propõe `ProdutoAmilSegmentacao = 'bronze' | 'bronze-mais' | 'prata' | 'ouro' | 'platinum' | 'platinum-mais'` — alinhado com URL pattern `/plano-amil/[cidade]/[cnae]/[porte-segmentacao-slug]/...` (Story 5.2 AC4).
- **Helper trivial** (~12 linhas):
  ```ts
  // src/lib/utils/segmentacao.ts
  import type { Segmentacao } from '@/data/tabelas-amil'
  export type SegmentacaoSlug =
    | 'bronze' | 'bronze-mais' | 'prata' | 'ouro' | 'platinum' | 'platinum-mais'

  const SLUG_TO_LABEL: Record<SegmentacaoSlug, Segmentacao> = {
    'bronze': 'Bronze', 'bronze-mais': 'Bronze Mais',
    'prata': 'Prata', 'ouro': 'Ouro',
    'platinum': 'Platinum', 'platinum-mais': 'Platinum Mais',
  }
  export const toLabel = (slug: SegmentacaoSlug): Segmentacao => SLUG_TO_LABEL[slug]
  export const toSlug = (label: Segmentacao): SegmentacaoSlug =>
    label.toLowerCase().replace(/\s+/g, '-') as SegmentacaoSlug
  ```
- **Implementação:** criar `src/lib/utils/segmentacao.ts` em Story 6.1 (PriceTable component) ou Story 5.2 (ProgrammaticLayout — o que vier primeiro). Requer test unitário com 6 round-trips (cada segmentação → slug → label) — alinhado com NFR14 (manutenibilidade).

---

## Seção 3 — Cross-validation Architecture ↔ FE Spec

> **Esta seção é onde o veredito "Aprovado com ressalvas" se materializa. FE spec não foi tocada na sessão atual e está atrasada vs PRD/Architecture v1.1.**

### Tokens de design (cores, tipografia, grid)

**Veredito: SIM (sólido).**

| Item | PRD v1.2.2 | Architecture v1.1 | FE Spec v1.0 | Match? |
|---|---|---|---|---|
| Brand primary | `#0066B3` (Amil azul) | menciona "azul Amil" sem hex | `colors.brand.500 = '#0066B3'` linha 1001 | ✅ |
| CTA primary | `#00C389` (verde) | menciona implicitamente | `colors.cta.500 = '#00C389'` linha 1015 | ✅ |
| Plano B cor | `#004280` (1-line swap) | herdado de PRD | NÃO menciona plano B | ⚠️ MENOR (FE spec não cita fallback) |
| Tipografia primária | Inter (ou Manrope alt) | nada explícito | Inter primary, Manrope ausente | ✅ (Manrope alt sumiu mas foi declarado opcional no PRD linha 156 — sem perda) |
| Grid 8px | "8px grid" PRD linha 174 | nada | `spacing` 8px-based linha 1148 | ✅ |
| WCAG ratio cores | "≥4,5:1 normal, 3:1 large" NFR9 | "WCAG AA nativo via Radix" | calculados linha 1074-1079 | ✅ AAA em texto principal, AA LARGE em CTA — matemática conferida |

### Component naming (PascalCase vs kebab-case files)

**Veredito: SIM (consistente).**

- Architecture.md `src/components/domain/QuoteForm/` (PascalCase folder + componentes)
- FE spec linha 1523 `**Components:** PascalCase ('QuoteForm.tsx')` — concorda explicitamente.
- Naming convention compartilhada: PascalCase para componentes/folders de componentes, kebab-case para libs (`schema-org-utils.ts`).

### Estrutura de pastas `src/components/`

**Veredito: SIM (compatível, com pequena diferença semântica).**

- Architecture.md linhas 657-696 organiza em **4 Layers** numerados (UI Primitives → Domain → Schema → Layouts).
- FE spec usa **Atomic Design** (atoms → molecules → organisms → templates → pages).
- **Crossmap implícito:**
  - Arch Layer 1 (UI Primitives) ≈ FE atoms + parte das molecules
  - Arch Layer 2 (Domain) ≈ FE organisms + algumas molecules
  - Arch Layer 3 (Schema.org) ≈ não tem equivalente direto no FE (FE não pensa em SEO components — gap menor, não bloqueante)
  - Arch Layer 4 (Layouts) ≈ FE templates + pages
- Arquivo final em `src/components/{ui,domain,schema,layout}/` resolve sem conflito; FE Atomic Design entra como **mental model de design**, não como estrutura de pasta literal.

### Breakpoints mobile-first

**Veredito: PARCIAL — discrepância numérica menor.**

| Documento | Mobile | Tablet | Desktop |
|---|---|---|---|
| PRD v1.2.2 linha 174 | "360–768px" | "768–1024px" | "1024px+" |
| FE Spec linha 1320-1330 | xs 0–360, sm 360–640, md 640–768 | lg 768–1024 | xl 1024–1280, 2xl 1280–1536, 3xl 1536+ |
| Architecture.md | menciona "mobile-first" sem números explícitos | — | — |

- **Fato:** FE spec é mais granular (7 breakpoints) que PRD (3 zonas). Não há contradição matemática; FE spec subdivide as zonas do PRD.
- **Risco:** dev pode confundir "tablet" do PRD (768-1024) com `lg` da FE (768-1024) — nomes coincidem por sorte. **Recomendação não-bloqueante:** no Storybook futuro (Phase 2), padronizar nome dos breakpoints (e.g. `sm-mobile`, `lg-mobile`, `tablet`, `desktop`).

### Acessibilidade WCAG AA — como cada doc trata?

**Veredito: SIM (cobertura tripla razoável).**

- **PRD:** NFR9 declara WCAG 2.1 AA em 100% das páginas (concreto).
- **Architecture:** seção Testing (linha 1473-1480) prevê axe-core CI fail em violações serious+, WCAG 2.1 AA. Testing Strategy concreta.
- **FE Spec:** seção Accessibility Requirements completa (linhas 1249-1315) — visual, keyboard, screen readers, touch (≥44×44px), content, testing strategy. Mais detalhada dos 3.

**Pequeno gap:** Arch e FE spec divergem em 1 coisa: FE spec linha 1259 manda `outline 2px #00C389` em focus visible. Arch não menciona token de focus. Não-bloqueante (FE spec é source-of-truth de design tokens).

### Componentes Calculadora, PriceTable, NetworkSearch — alinhamento Architecture↔FE

**Veredito: SIM em estrutura, PARCIAL em nomenclatura.**

- Calculator: ambos descrevem "2 steps + PDF export". Architecture detalha endpoint Edge Function `/api/calculator` + ADR-003 prereq; FE spec detalha UX (slider sinistralidade, gráfico de barras, export PDF). Compatíveis.
- PriceTable: ambos descrevem filtros + tabela responsiva. Architecture v1.1 reescreveu domain types para Bronze→Platinum Mais; FE spec linha 1326 ainda menciona "produto (400, 500, 600, Blue, Black)" implicitamente nos cornerstones (linha 91 e 225).
- NetworkSearch: Architecture v1.1 expandiu para 5 ataques SEO + 2.071 prestadores; FE spec linha 1326 menciona apenas "Busca CEP/cidade". **FE spec NÃO foi atualizada para refletir Story 6.5 expandida.** Não bloqueia setup mas bloqueia design fino dos `<NetworkResultCard />` (FE spec molecule linha 929) cujo componente cita "endereço + especialidades" — campos que **não existem no dataset Power BI** (gap conhecido em Architecture linha 433-437).

---

## Seção 4 — Score por área (12 itens framework PO Master)

| # | Área | Pass rate | Observação |
|---|---|---|---|
| 1 | Goal Alignment (PRD ↔ Architecture) | **100%** | 8 goals do PRD mapeiam em arquitetura; metas 200 leads M6 / 500 M12 / DR≥35 / 5000-6500 URLs viáveis com stack escolhida; Phase 2 explícita pós-MVP |
| 2 | FRs cobertos | **97%** | 30 FRs com cobertura técnica clara. Único gap: FR19 "busca interna" marcada "opcional MVP, recomendada Phase 1.5" mas não há story criada — não bloqueia mas precisa decisão @sm |
| 3 | NFRs com solução técnica | **95%** | 20 NFRs têm controle técnico. NFR9 (WCAG AA) é o **mais bem coberto** (3 docs concordam). Pequeno gap: NFR16 (Backup & Recovery RTO 4h / RPO 24h) — Architecture menciona "git como source of truth + export semanal Sanity" mas não define **runbook** de DR; story explícita falta |
| 4 | Stories testáveis | **92%** | ACs concretos em quase todas. **Story 5.0 (reaproveitar 742 cidades)** AC4 menciona "schema markup atualizado" sem especificar quais campos do schema HealthInsurancePlan + LocalBusiness ficam diferentes da matriz CNAE (risco de canibalização que ADR-005 prevê — mas não detalha). **Story 6.5 (5 ataques SEO)** AC11 disclaimer obrigatório — bom; ACs 14-17 sobre performance build SSG são testáveis |
| 5 | Sequenciamento lógico | **90%** | 1.0 → 1.1 → 1.2 → 1.2a → ... ordem correta. Stories novas v1.2.2: 5.0 (entra antes de 5.1, viável), 1.2a (DNS ponte, paralela a 1.2), 6.7 (PRECEDE 6.3, REC-3 documentado em PRD linha 876). **Pequeno gap:** Story 1.0c (spike Clint API) é mencionada como "antes de Story 4.3" mas não está no PRD como AC explícita — implícita em ADR-002 |
| 6 | Cross-cutting concerns distribuídas | **95%** | SEO em todas as stories de conteúdo (5/6 epics), analytics em 1.5 + 4.5, observability em 1.5, compliance LGPD em 1.6 + 1.7 + ANS em 1.7 + 6.1 disclaimer; SUSEP em 1.7 + 2.1; programmatic SEO ataques em 6.5. ADR-005 garante anti-canibalização cross-cutting |
| 7 | Cross-validation Architecture ↔ FE Spec | **65%** | **Score baixo aqui é o que puxa o pass rate geral para 87%.** Tokens, naming, breakpoints OK. **Drift crítico:** FE spec ainda usa `Amil 400/500/600/Blue/Black` (linhas 91, 225, 374) e proíbe unDraw na linha 1234 quando Story 1.0 escolheu unDraw como direção MVP. Open Questions linha 1521-1523 já resolvidas. **Bloqueia Story 3.2 (Template Cornerstone) e Stories 3.4-3.18 (cornerstones individuais).** |
| 8 | Data Models completos | **92%** | 7 models cobrem FRs. PriceTable v1.1 + NetworkProvider v1.1 reescritos refletem realidade. **Gap NetworkProvider:** sem `cnpj`, `cep`, `endereco`, `specialties`, `coords` — Architecture documenta como gap conhecido e FE spec linha 929 referencia "especialidades" como se existisse. Reconciliar: ou FE spec edita `<NetworkResultCard />` para remover specialties, ou backlog Phase 2 popula via outro source |
| 9 | ADRs documentados | **70%** | ADR-001 ✅ Accepted (arquivo separado), ADR-002 ✅ Updated (arquivo separado). **ADR-000, ADR-003, ADR-004, ADR-005 só inline em architecture.md**. ADR-003 ainda usa nomenclatura antiga `400/500/600/Blue/Black` (linha 1756). Status: 2/6 ADRs com arquivo formal; 4 são "documentação inline" — fere princípio audit trail |
| 10 | Risk Management | **95%** | Cease & desist Amil tem 5 mitigações + Story 1.2a + 3 deliverables 2.4 + ADR-005 (compliance via disclaimer "Rede sujeita a alterações pela operadora"). Build SSG risk tem ADR-005 + Build Performance section + tier upgrade strategy. Fórmula calculadora tem REC-3 + Story 6.7 prereq. Helpful Content penalty mitigado em ADR-005 |
| 11 | Pendências bloqueantes | **85%** | **Pendência 1 (Spike Clint API Story 1.0c)** — bloqueante para Story 4.3, não para 4.1/4.2. **Pendência 2 (Logo BeneficioRH SVG)** — não bloqueante até Story 1.4 (canary), fallback wordmark texto OK. **Pendência 3 (6 estados faltantes na tabela preço)** — não bloqueante para Wave 1 (14 estados cobrem 4 prioritários MG/SP/RJ/DF + 10 secundários). **Pendência 4 (ADR-003 Proposed)** — bloqueante para Story 6.3 mas Story 6.7 está prevista como prereq |
| 12 | Aprovação para @sm criar stories | **APROVADO COM RESSALVAS** | GO criteria detalhado na Seção 6 |

**Pass rate ponderado: 10,5/12 = 87,5%.**

---

## Seção 5 — Bloqueios para @sm criar stories

### Bloqueios HARD (precisam ser resolvidos ANTES de River começar)

**Nenhum.** O conjunto PRD v1.2.2 + Architecture v1.1 + stakeholder-inputs.md tem clareza suficiente para River começar a destrinchar Stories 1.0 (já existe), 1.1 (já existe), 1.2, 1.2a, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8 (todas Epic 1) sem dependência de FE spec atualizada.

### Bloqueios SOFT (em paralelo com River, antes da Story 3.2)

1. **[HIGH][Uma] Atualizar `front-end-spec.md` v1.0 → v1.1.** Patches mínimos:
   - Linha 91, 225, 374: substituir "Amil 400 vs 500 vs 600" / "amil-400-vs-500-vs-600" por "Bronze vs Prata para PME" e equivalentes alinhados com Stories 3.4-3.18 do PRD v1.2.2.
   - Linha 1234: remover "❌ Ilustrações genéricas unDraw/etc" (ou inverter para "✅ Stock editado unDraw/Storyset com paleta `#0066B3` sincronizada — MVP; ilustrador próprio Phase 2").
   - Linhas 1521-1523: marcar Open Questions 1, 2, 3 como **RESOLVED** com ref a `stakeholder-inputs.md` Story 1.0.
   - Linha 929 `<NetworkResultCard />`: remover "especialidades + produtos" (não há especialidade no Power BI); manter "Nome + tipo + endereço de bairro/município + 10 produtos como flags". Alinha com Architecture linha 419-431.
   - **Tempo estimado:** 30-45min de edição direta. **Owner:** Uma. **Quando:** antes de Story 3.2 (template cornerstone) iniciar.

2. **[MEDIUM][Aria] Extrair ADRs inline para arquivos formais.** Criar:
   - `docs/decisions/adr-000-nextjs-over-astro.md` (Status Accepted)
   - `docs/decisions/adr-003-calculator-formula.md` (Status Proposed — pending Story 6.7; explicitar nomenclatura antiga com `[REVISAR — Story 6.7]`)
   - `docs/decisions/adr-004-dns-strategy.md` (Status Proposed — recomendação Cloudflare DNS → Vercel Option A)
   - `docs/decisions/adr-005-programmatic-seo-depth.md` (Status Accepted)
   - **Tempo estimado:** 1h (copy-paste do conteúdo já em `architecture.md` para arquivos separados, com header padrão de ADR alinhado com adr-001/002).
   - **Owner:** Aria. **Quando:** paralelo a River, antes de Story 6.3 (ADR-003 referência).

3. **[MEDIUM][Aria] Adicionar Story 1.0c (Spike Clint API) explícita ao PRD.** Está implícita em ADR-002 e em FR6 ("spike técnico API Clint planejado em Story 1.0c") mas não tem AC formalizada. Sugestão: Story entre 1.0 e 1.1 com AC tipo "Aria coleta URL instância Clint, doc API, token, schema Lead, webhooks, rate limits do stakeholder; arquiva em `docs/integrations/clint-api-spike.md` antes de Story 4.3 iniciar".
   - **Tempo estimado:** 15min de edição PRD + 1-2h de spike real com stakeholder.
   - **Owner:** Aria + Agnaldo (stakeholder fornece dados). **Quando:** antes de Story 4.3 — não bloqueia Epic 1, 2, 3.

4. **[LOW][Pax/@sm] Criar Story explícita de Backup/DR runbook (NFR16).** PRD menciona RTO 4h / RPO 24h mas não tem story para criar runbook. Sugestão: Story 1.5b "Backup, DR & Runbook" com ACs (export Sanity semanal automatizado para Vercel Blob, export Clint mensal, runbook escrito em `docs/devops/disaster-recovery.md`, simulação mensal documentada).
   - **Tempo estimado:** 10min para River criar a story.
   - **Owner:** River (@sm). **Quando:** durante story creation Epic 1.

---

## Seção 6 — GO Criteria recomendado para liberar @sm

**Pax aprova @sm iniciar story creation desde que todos os 5 critérios abaixo estejam atendidos:**

1. ✅ **Stakeholder-inputs.md aprovado e atualizado** com seção "🔍 Re-validação Pax v1.2.2" (este relatório referenciado) — cumprido por este documento.
2. ✅ **PRD v1.2.2 + Architecture v1.1 sem conflito interno** — verificado em Seções 3 e 4 deste relatório.
3. ⏳ **Bloqueio SOFT 1 (FE spec patch v1.0 → v1.1) em queue, com SLA de 1 dia útil** — Pax assume que Uma é capaz de aplicar os 4 patches mínimos em <60min. River pode começar Epic 1 em paralelo; Stories 3.2 e 3.4-3.18 ficam **pending review** até FE spec v1.1.
4. ⏳ **Bloqueio SOFT 2 (4 ADRs extraídos para arquivos)** em queue, sem SLA crítico — bloqueia Story 6.3 mas só via ADR-003 que já depende de Story 6.7 (validação atuarial).
5. ⏳ **Story 1.0c (Spike Clint) adicionada ao PRD** ANTES de River começar Epic 4 — paralelo a Epic 1 é permitido.

**Critérios 3, 4, 5 são SOFT** (em queue, não-bloqueantes para iniciar). Critérios 1, 2 são HARD (cumpridos hoje).

### Sequence diagram do GO

```
Hoje (2026-04-26):
  Pax aprova com ressalvas → River libera para Epic 1

Em paralelo:
  Uma: patch FE spec v1.0 → v1.1 (≤1 dia útil)
  Aria: extrair 4 ADRs (≤1 dia útil) + Spike Clint API (≤3 dias úteis com stakeholder)
  River: começar story creation Epic 1 (Story 1.2, 1.2a, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8 — todas viáveis HOJE)

Bloqueio em cadeia (não atrasa fluxo principal):
  Story 3.2 só pode rodar após FE spec v1.1
  Story 4.3 só pode rodar após Spike Clint API + ADR-002 implementação plan
  Story 6.3 só pode rodar após Story 6.7 (validação atuarial) + ADR-003 publicado
```

---

## Seção 7 — Persistência das decisões

**Este relatório:** `C:\Users\benef\planoamilempresas\docs\po-revalidation-report-v1.2.2.md` (este arquivo).

**Atualização do `stakeholder-inputs.md`:** seção "🔍 Re-validação Pax v1.2.2 (2026-04-26)" sendo adicionada ao final do documento, com:
- Veredito: APROVADO COM RESSALVAS
- 3 ambiguidades resolvidas (🅱️/🅰️/🅰️) com refs a este relatório
- Pendências bloqueantes priorizadas para @sm
- GO criteria

---

## Apêndice A — Evidências citadas

### A1. FE spec drift de nomenclatura

```
docs/front-end-spec.md
linha 91:    PILLAR --> C2[Amil 400 vs 500 vs 600<br/>CORNERSTONE]
linha 225:   A[Google SERP] -->|cornerstone comparativo| B[/amil-400-vs-500-vs-600]
linha 374:   │  ← → tabela / 400 vs 500 /  │
```

vs. PRD v1.2.2 Stories 3.4-3.18 que usam Bronze/Bronze Mais/Prata/Ouro/Platinum/Platinum Mais.

### A2. FE spec contradição direção ilustrações

```
docs/front-end-spec.md linha 1234:
- ❌ Ilustrações genéricas unDraw/etc
```

vs. `stakeholder-inputs.md` Bloco 5.3 (decisão Story 1.0):
> 5.3 Direção de ilustrações
> Decisão: 🅱️ Stock editado (unDraw / Storyset)

### A3. FE spec Open Questions já resolvidas

```
docs/front-end-spec.md linhas 1521-1523:
1. **Logo Amil broker:** stakeholder tem logo próprio ou usa logomarca do corretor individual?
2. **Paleta exata:** `#0066B3` é Amil oficial — confirmar autorização contratual de uso
3. **Fotografia corretor:** alta resolução, vertical + horizontal, fundo neutro
```

vs. `stakeholder-inputs.md` itens 11, 12, 1.4 já resolvidos.

### A4. ADR-003 nomenclatura antiga

```
docs/architecture.md linha 1756:
- `P` = produto (400/500/600/Blue/Black — tabela base)
```

vs. realidade Bronze→Platinum Mais validada em `data/tabelas-amil.ts`.

### A5. ADRs sem arquivo

```bash
$ ls C:/Users/benef/planoamilempresas/docs/decisions/
adr-001-cms-choice.md
adr-002-crm-adapter.md
```

Faltam: adr-000, adr-003, adr-004, adr-005 (todos referenciados em PRD/Architecture mas não como arquivos).

### A6. tabelas-amil.ts NÃO exporta UF

```bash
$ grep -E "^export (type|const) UF" data/tabelas-amil.ts
(no matches)
```

Type `UF` em `architecture.md` linha 384-388 é proposta nominal-only, não há conflito real de "2 sources of truth". Decisão 🅰️ (`src/types/uf.ts`) é construção, não conciliação.

---

**Status do documento:** APROVADO COM RESSALVAS — release autorizada para @sm com 4 itens em queue paralela
**Owner:** Pax (Product Owner) ♍
**Data:** 2026-04-26
**Próximos:** Uma patch FE spec; Aria extrai ADRs + spike Clint; River começa story creation Epic 1

— Pax, validando para que Dex implemente sem retrabalho 🔍
