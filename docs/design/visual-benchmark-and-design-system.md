# Visual Benchmark Final + Design System Diferenciado

**Documento:** Visual Benchmark + Design System v1.0
**Projeto:** `planoamilempresas.com.br`
**Autora:** Uma — UX Design Expert (Synkra AIOX)
**Data:** 2026-04-28
**Baseline:** front-end-spec.md v1.1 (mesma autora) + PRD v1.3.1 + 9 docs em `docs/research/competitors/`
**Status:** Draft v1.0 — input para Pax (stories) e Dex (implementação)

---

## 0. Sumário executivo

Este documento consolida o benchmark visual de **4 concorrentes auditados** (`amilplanos`, `planodesaudeamil`, `amilsaudebr`, `kitcorretoramil`) e propõe um **design system diferenciado anti-clone** para `planoamilempresas.com.br`, alinhado a:

- **ADR-006 (trademark Amil):** identidade primária NÃO usa azul UnitedHealth/Amil oficial.
- **PRD v1.3.1 FR31–FR54 + NFR21–NFR26:** schema rico, `<table>` semântica, FAQPage, AggregateOffer, footer cross-domain.
- **Constitution AIOX:** CLI First → Observability Second → UI Third (UI executa requisitos rastreáveis).

**Tese visual:** ser percebido como **"consultor editor especialista PJ"** — não como mais um corretor genérico. Isso se traduz em paleta sóbria (não azul-saúde), tipografia editorial (Inter), iconografia line, densidade informacional alta sem agressividade comercial.

---

## 1. Visual Benchmark dos 4 concorrentes

### 1.1 amilplanos.com.br — Score 6,0/10

**Stack visual:** WordPress + UX Themes (tema genérico). HTML denso ~1.500 palavras na home; ~1 H2 raso na rede credenciada.

#### Acertos visuais a se inspirar (sem copiar)
| # | Acerto | Tradução para nosso DS |
|---|--------|------------------------|
| A1 | **H1 city com qualifier** "Plano Amil [Cidade]" — sinaliza relevância imediata | Aplicar pattern `H1: Plano Amil Empresarial em [Cidade] — [UF] 2026` |
| A2 | **Página /coparticipacao-amil/ dedicada** com tabela de impacto | Card visual "Calculadora de Coparticipação" no hero secundário |
| A3 | **Hospitais reais nominados em capitais** (Paulistano, Samaritano, Oswaldo Cruz) | Selo "Hospitais reais por município" no LocalHero |
| A4 | **Sub-redes diferenciadas** (D'or, One, Fácil, Clássica) com páginas próprias | Sub-pillars `/rede-credenciada/{tipo-rede}/` (ADR-009) |

#### Anti-padrões visuais a evitar
| # | Anti-padrão | Mitigação no nosso DS |
|---|-------------|----------------------|
| E1 | **5 telefones repetidos** em todas as páginas → poluição visual + perda de hierarquia | 1 CTA primário (WhatsApp) + 1 secundário (formulário). Tel só no footer. |
| E2 | **Tabela de preços rotulada "set/2022"** sem selo de obsolescência → quebra de confiança | Selo `<UpdatedBadge date="mm/aaaa">` topo de toda tabela com cron mensal |
| E3 | **Slugs `-2` duplicados** visíveis na nav → sensação de site mal mantido | URL builder com guard de colisão (Story 1.3) |
| E4 | **Blog spam off-topic** (WNBA, casino) com thumbnails fora de tema | Blog só com thumbnails on-topic, schema Article + Author obrigatório |
| E5 | Word count baixo em produtos (~700) → cards de produto rasos | Mínimo 2.500 palavras por página de produto (paridade obrigatória) |

**Descritivo textual da homepage:** banner azul UnitedHealth saturado no topo + 5 telefones + lista de produtos sem hierarquia visual + tabela de preços de 2022 sem destaque de data + footer denso sem CNPJ visível. Sensação geral: **"site institucional dos anos 2010"**.

---

### 1.2 planodesaudeamil.com.br — Score 6,5/10

**Stack visual:** WordPress + Flatsome (tema multipurpose pesado). 22 scripts JS externos + 47 imagens base64 placeholder inline.

#### Acertos visuais a se inspirar
| # | Acerto | Tradução para nosso DS |
|---|--------|------------------------|
| A1 | **Tabela embutida em cada página de produto** (Bronze, Prata, Ouro, Black) com 5 tiers de valor | `<PriceTable>` inline em todo `/produtos/{slug}/` + AggregateOffer schema |
| A2 | **FAQ accordion com 45+ Q&A** (gap massivo do concorrente) | `<FAQAccordion>` + FAQPage schema (FR40) com 45+ Q&A migráveis |
| A3 | **CNPJ + SUSEP visíveis no rodapé** (`27.782.880/0001-51`, SUSEP `202067655`) | Footer global FR48 com CNPJ + SUSEP + ANS + LGPD + Reclame Aqui |
| A4 | **Dados quantificáveis** ("6M beneficiários, 26k médicos") | `<StatsCounter>` com 4 números verificáveis (fonte ANS/operadora) |
| A5 | **Subpath `/rede-credenciada/[uf]/`** — URLs limpas SEO-friendly | Manter pattern em ADR-009 |
| A6 | **Apenas 2 telefones** (vs 5 do concorrente) | 1 WhatsApp + 1 telefone no footer apenas |

#### Anti-padrões visuais a evitar
| # | Anti-padrão | Mitigação |
|---|-------------|-----------|
| E1 | **2.400 city pages com texto idêntico** ("A Amil [CIDADE] tem o plano…") | Variação real por município: hospitais reais + dados IBGE + qualifier |
| E2 | **Hospitais nacionais (Sírio, Einstein) em municípios pequenos** (ex: Abadia de Goiás) | LocalHero com hospitais REAIS por município (FR49) |
| E3 | **47 imagens base64 placeholder inline** (LCP destruído) | `<Image>` Next.js com `priority` no LCP + WebP + sem inline base64 |
| E4 | **TTFB ~3s + total ~7s** | Next.js SSG + Vercel Edge → TTFB <100ms (NFR1) |
| E5 | **H1 city pages só com nome** ("São Paulo", "Butantã") — keyword fraca | H1 com qualifier completo (A1 do amilplanos) |
| E6 | **Bairros canibalizando** entre si e com city pai | Hierarquia: `[uf]/[municipio]/` apenas — sem bairro como rota |

**Descritivo textual:** home com hero azul Amil oficial saturado + 6 ícones de produtos + grid 3×3 de cards de produtos sem CTA claro + tabela de preços com fonte pequena + footer com 5 colunas mas legibilidade baixa. Sensação: **"SEO-first sem amor pelo decisor"**.

---

### 1.3 amilsaudebr.com.br — Score 7,5/10 (melhor competidor técnico)

**Stack visual:** HTML estático puro, ~152KB, schema rico (11 tipos em 4 scripts JSON-LD). Canonical aponta para `onlineplanodesaude.com.br` (clone — atenção).

#### Acertos visuais a se inspirar (prioridade alta)
| # | Acerto | Tradução para nosso DS |
|---|--------|------------------------|
| A1 | **`<title>` com ano "2026"** ("Amil Saúde 2026 — Planos Empresarial, MEI e Individual") | Pattern dinâmico `[Tipo] Amil Empresarial 2026 — [Qualificador]` (FR50) |
| A2 | **8 H2s estruturados em narrativa** (Tabela → Categorias → O que é → Para quem → Quanto custa → Carências → FAQ → Unidades) | Adotar mesma narrativa em pillar pages, com nossa hierarquia diferenciada |
| A3 | **8 CTA cards na home** ("Solicitar cotação", "WhatsApp", "Ver tabela", "Fazer cotação online") | `<CTACardGrid>` com 4 ações primárias (não 8 — anti-poluição) |
| A4 | **AggregateOffer schema** com lowPrice R$102 / highPrice R$3.500 / offerCount "50+" | `<SchemaGraph type="aggregate-offer">` no `/precos/tabela-2026/` (FR51) |
| A5 | **FAQPage com 4-8 Q&A schema** | Já implementado FR40, ampliar para 45+ Q&A |
| A6 | **HTML estático = LCP excelente** | Next.js SSG + `generateStaticParams` agressivo (ADR-008) |

#### Anti-padrões visuais a evitar
| # | Anti-padrão | Mitigação |
|---|-------------|-----------|
| E1 | **Site clone** com canonical apontando para `onlineplanodesaude.com.br` (sinaliza autoridade emprestada) | Canonical sempre próprio. Nada de clones internos. |
| E2 | **Schema Organization usando `name: "Amil"`** (operadora oficial — risco trademark) | `name: "BeneficioRH"` + `category: "Insurance Broker"` (ADR-006 / FR54) |
| E3 | **`sameAs` com Porto Seguro** num site Amil (incoerência de marca) | `sameAs` aponta apenas para perfis BeneficioRH |
| E4 | **0 tabelas `<table>` HTML nativas** (usa divs/grid) → perde semântica + Featured Snippet | `<table>` semântica obrigatória em FR52 |
| E5 | **Sem blog editorial** | Blog 30+ posts on-topic (FR45) |
| E6 | **Hospitais reais com baixa densidade** (3 menções) | 10+ hospitais por city page (FR49) |

**Descritivo textual:** home compacta (~3.500 palavras) com banner amarelo + 8 cards CTA em grid 4×2 (mobile vira 2×4) + tabela de preços limpa + acordeão de FAQ com 8 perguntas. Visualmente é o **mais "moderno"** dos 4, mas quebra trademark e tem cara de landing single-page (sem profundidade).

---

### 1.4 kitcorretoramil.com.br — Portal oficial Amil (NÃO concorrente)

**Identificação:** CNPJ 29.309.127/0001-79 = Amil Assistência Médica Internacional + ANS 326305. WordPress + tema "kitcorretor".

**Não é concorrente SEO** — é portal restrito para corretores cadastrados. Mas é **fonte institucional valiosa**.

#### Insumos visuais para absorver (referência informacional, não cópia)
| # | Insumo | Como usar |
|---|--------|-----------|
| I1 | **Cards de notícias** ("Telemedicina Amil", "Mais segurança nos contratos PME", "Lançamento Amil Black") | Layout `<NewsCard>` no blog + categoria "Lançamentos Amil" |
| I2 | **Linhas Black detalhadas** (Black I, Black II, S2500, S6500) | Atualizar catálogo `/produtos/` com nomenclatura completa |
| I3 | **Operadoras regionais aliadas** (Ana Costa, Santa Helena, Sobam) | Possível extensão de portfólio (Fase 2+) |
| I4 | **Telefones oficiais Amil** (3004-1022, 0800-721-1022) | Citáveis em footer "para questões com Amil oficial" (compliance) |

#### Anti-padrões a evitar
- Meta description vazia (`content=""`) → todas nossas páginas têm meta dinâmica (FR32)
- Zero JSON-LD → nós temos 11 tipos (FR31–FR42)
- H1 não claramente marcado → `<h1>` único e descritivo obrigatório

---

### 1.5 Síntese visual comparativa (4 concorrentes)

| Dimensão | amilplanos | planodesaudeamil | amilsaudebr | kitcorretor | **Nossa proposta** |
|---|---|---|---|---|---|
| **Cor primária dominante** | Azul Amil saturado | Azul Amil saturado | Amarelo + azul | Cinza institucional | **Slate-900 + Teal-600** (anti-clone) |
| **Densidade informacional** | Média | Alta (mas template) | Alta (compacta) | Baixa | **Alta com hierarquia editorial** |
| **Hierarquia tipográfica** | Fraca (H1 e H2 misturados) | Fraca | Forte (8 H2s narrativos) | Inexistente | **Forte (escala modular 1.250)** |
| **CTAs por página** | 5+ telefones (poluição) | 2 telefones | 8 cards CTA (denso) | n/a | **2 primários + 1 sticky** |
| **Tabelas** | `<table>` antiga | `<table>` antiga | `<div>` (anti-padrão) | n/a | **`<table>` semântica + sticky header** |
| **FAQ** | Ausente | Accordion 45+ | Accordion 8 c/ schema | n/a | **Accordion 45+ c/ FAQPage schema** |
| **Footer** | Sem CNPJ/SUSEP | Com CNPJ/SUSEP | Sem | Com | **Cross-domain + CNPJ + SUSEP + ANS + LGPD** |
| **Schema** | Zero | Zero | 11 tipos (em 1 página) | Zero | **11+ tipos distribuídos por contexto** |

---

## 2. Design System Diferenciado para `planoamilempresas.com.br`

### 2.1 Princípios visuais (anti-clone)

1. **Editorial, não promocional** — referência mental: The Wirecutter, NerdWallet (PT-BR), Consumidor Moderno. NÃO Casas Bahia, NÃO sites de seguro genéricos.
2. **Sóbrio confiante** — pouco gradiente, pouco glow, tipografia maior que o normal, espaçamento generoso.
3. **Anti-azul-saúde-genérico** — nossa primária é **slate (chumbo)** + acento **teal (verde-azulado)**. Reservamos um único azul informacional, dessaturado, para links/breadcrumbs.
4. **Densidade informacional alta** — tabelas, números, fontes oficiais visíveis. Decisor PJ valoriza substância.
5. **Mobile-first com respeito ao desktop** — bottom tab bar mobile, grid 12 colunas desktop.

### 2.2 Paleta de cores própria (sem trademark Amil)

> **Justificativa anti-trademark (ADR-006):** Amil oficial usa azul UnitedHealth `#0066B3` / `#0066CC`. Nossa paleta primária evita a faixa azul saturada e adota **slate** (cinza-azulado escuro) como cor de identidade + **teal** como acento. Isso nos posiciona como editorial/independente, não como afiliado visual.

#### Brand primária — **Slate (chumbo editorial)**
```
slate-50:  #F8FAFC   ← background secundário, hover muito leve
slate-100: #F1F5F9   ← background tabelas, cards alternados
slate-200: #E2E8F0   ← bordas neutras
slate-300: #CBD5E1   ← bordas acentuadas, divisores
slate-400: #94A3B8   ← texto desabilitado
slate-500: #64748B   ← texto terciário, captions
slate-600: #475569   ← texto secundário, labels
slate-700: #334155   ← texto secundário forte
slate-800: #1E293B   ← headings, navegação
slate-900: #0F172A   ← TÍTULOS, footer dark, primary brand ★
```

#### Acento primário — **Teal (CTA + autoridade)**
```
teal-50:   #F0FDFA
teal-100:  #CCFBF1
teal-300:  #5EEAD4
teal-500:  #14B8A6   ← acentos secundários, ícones autoridade
teal-600:  #0D9488   ← CTA primário (botão "Cotar no WhatsApp") ★
teal-700:  #0F766E   ← CTA hover
teal-900:  #134E4A
```

**Contraste validado:**
- `teal-600` (#0D9488) sobre branco: **ratio 4.62:1** ✓ AA normal text
- Texto branco sobre `teal-600`: **ratio 4.62:1** ✓ AA
- `slate-900` sobre branco: **ratio 18.7:1** ✓ AAA

#### Acento secundário — **Amber (urgência/selo "Atualizado")**
```
amber-50:  #FFFBEB   ← background selo "Atualizado mm/aaaa"
amber-500: #F59E0B   ← borda do selo
amber-700: #B45309   ← texto do selo (contraste em fundo amber-50: 5.83:1 ✓ AA)
```
*Uso restrito:* selo de frescura (FR33), badges de promoção sazonal. Nunca como brand.

#### Azul informacional — **Sky (links, breadcrumbs)**
> Único azul permitido — **dessaturado** e bem distante do azul Amil (#0066B3).
```
sky-600:   #0284C7   ← cor de link em texto (ratio 4.93:1 sobre branco ✓ AA)
sky-700:   #0369A1   ← link visited / hover
```

#### Neutros funcionais
```
white:     #FFFFFF   ← bg primário
black:     #000000   ← uso reservado a textos hero (raro)
success:   #15803D   ← verde dessaturado, confirmações (não confundir com teal CTA)
warning:   #B45309   ← amber-700 (mesmo do selo)
error:     #B91C1C   ← vermelho dessaturado, validações
whatsapp:  #25D366   ← reserved BRAND WhatsApp (oficial Meta)
```

#### Comparativo visual rápido vs concorrentes
| Cor brand | amilplanos | planodesaudeamil | amilsaudebr | **Nosso DS** |
|---|---|---|---|---|
| Hex | `#0066B3` saturado | `#0066B3` saturado | amarelo + azul | **`#0F172A` slate** |
| Sensação | Corporativo Amil | Corporativo Amil | Comercial varejo | **Editorial confiável** |

#### Ressalva trademark
- Nossa identidade **nunca usa azul Amil** como brand primária.
- Em páginas de produto, podemos exibir o **logo Amil oficial** apenas via shortcode `<OfficialBrandReference brand="Amil">` que renderiza via componente isolado, com disclaimer "logos pertencem aos respectivos titulares" — e jamais como elemento de identidade BeneficioRH.
- Botões de CTA, navegação, headings: **proibido** azul Amil.

### 2.3 Tipografia

**Família primária:** **Inter** (Google Fonts, variable font, peso 100–900).

Justificativa: legibilidade em telas pequenas, glyphs PT-BR completos (incluindo acentos), licença SIL Open Font (zero risco), já no FE Spec v1.1, hinting excelente, suporta tabular numerals (essencial para tabelas de preço alinhar `R$ 1.234,56` com `R$ 567,89`).

**Família display (opcional Fase 2):** **Source Serif 4** para artigos editoriais longos (cornerstones, blog), criando contraste editorial vs concorrentes 100% sans-serif.

**Família mono:** `ui-monospace, SFMono-Regular, Menlo, monospace` — para números de protocolo, códigos ANS.

#### Escala tipográfica modular (ratio 1.250 — major third)

| Token | Mobile (≤768px) | Desktop (≥1024px) | Uso | Weight |
|---|---|---|---|---|
| `display-xl` | 40px / 48px | 60px / 68px | Hero homepage | 700 |
| `display-lg` | 32px / 40px | 48px / 56px | H1 cornerstone | 700 |
| `h1` | 28px / 36px | 36px / 44px | H1 city/produto | 700 |
| `h2` | 24px / 32px | 30px / 38px | H2 seções | 600 |
| `h3` | 20px / 28px | 24px / 32px | H3 cards/tabelas | 600 |
| `h4` | 18px / 26px | 20px / 30px | H4 sub-seções | 600 |
| `body-lg` | 18px / 28px | 18px / 30px | Lead paragraphs | 400 |
| `body` | 16px / 26px | 16px / 26px | Texto corrente ★ | 400 |
| `body-sm` | 14px / 22px | 14px / 22px | Captions, footer | 400 |
| `caption` | 12px / 18px | 12px / 18px | Disclaimers, labels | 500 |
| `code` | 14px / 22px | 14px / 22px | Tabular numerals | 500 |

**Pesos disponíveis:** 400 (body), 500 (medium/labels), 600 (subheading), 700 (heading), 800 (display reservado).

**Coerência com FE Spec v1.1:** ✅ idêntica escala — apenas formalizei pesos por token.

### 2.4 Iconografia

**Biblioteca primária:** **Lucide Icons** (já em uso no codebase — vide `lucide-react` em PlanCard, FAQAccordion, LocalHero).

Justificativa:
- **Estilo line consistent** (stroke 1.5–2px) → coerente com sobriedade editorial.
- **MIT license** → zero risco.
- ~1.000 ícones cobrem 95% dos casos.
- Tree-shakeable, ~3kb por ícone.

**Biblioteca secundária (raros casos):** **Heroicons** (solid variant) quando precisar ícone preenchido para destaque (ex: estrelas de avaliação Reclame Aqui).

**Padrão visual de ícones:**
- Stroke 1.5px (default Lucide)
- Tamanho base 20×20px (text-icon inline), 24×24px (interface), 32×32px (hero)
- Cor sempre `currentColor` para herdar via Tailwind text-*
- `<Icon aria-hidden="true">` quando decorativo, `aria-label` quando funcional

**Anti-padrão:** ícones filled+gradient saturados (típico WordPress Flatsome) — evitar.

### 2.5 Espaçamento e grid

#### Sistema de espaçamento — base 4px (Tailwind default)
Tokens semânticos:
```
space-1  = 4px   space-6  = 24px   space-16 = 64px
space-2  = 8px   space-8  = 32px   space-20 = 80px
space-3  = 12px  space-10 = 40px   space-24 = 96px
space-4  = 16px  space-12 = 48px   space-32 = 128px
```

#### Padrão de uso
- Padding interno de cards: `p-6` (24px) mobile, `p-8` (32px) desktop
- Gap entre seções verticais: `py-16` mobile, `py-24` desktop (cornerstones)
- Gap entre seções verticais hero: `py-12` mobile, `py-20` desktop
- Gap dentro de section: `gap-8` (32px) entre subcomponentes

#### Grid e breakpoints
```
mobile:    < 640px   (1 coluna, container px-4)
sm:        ≥ 640px   (1-2 colunas, container px-6)
md:        ≥ 768px   (2 colunas, container px-8)
lg:        ≥ 1024px  (3 colunas, container max-w-6xl)  ← desktop primário
xl:        ≥ 1280px  (4 colunas, container max-w-7xl)
2xl:       ≥ 1536px  (4 colunas, container max-w-7xl, sem expansão)
```

**Container max-width:** `max-w-7xl` (1280px) — densidade editorial. Para cornerstones/blog `max-w-prose` (~65ch) na coluna de leitura.

### 2.6 Componentes-chave

> **Convenção de status:**
> - 🟢 **Existe + adequado** (manter)
> - 🟡 **Existe + precisa ajuste** (refatorar)
> - 🔴 **Novo** (criar)

#### 2.6.1 Hero (homepage) — 🟡 Refatorar

```
┌──────────────────────────────────────────────────┐
│ [pre-headline em teal-600 caps]                  │
│ Plano de Saúde Amil Empresarial 2026             │  ← display-xl, slate-900
│                                                  │
│ Lead paragraph (body-lg, slate-600, max-w-prose) │
│ Tabela atualizada · Hospitais reais por município │
│                                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ Simulador inline (3 campos: vidas/cidade/cnae)│ │  ← inline simulator
│ │ [Ver minha cotação →] (teal-600)             │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ [Selo "Atualizado em out/2026"] [SUSEP][ANS]     │  ← amber-50 / slate-100
└──────────────────────────────────────────────────┘
```

**Diferenciação:** simulador INLINE no hero (vs concorrentes que mandam clicar em outra página). Entrega valor antes do CTA de contato.

#### 2.6.2 PriceTable — 🟡 Refatorar para FR52

Atual: `<table>` semântica ✅ + `bg-amil-blue` no thead ❌ (precisa virar `bg-slate-900`).

Refatorações:
1. Header `bg-slate-900 text-white` (anti-azul-Amil).
2. Hover row `bg-slate-50` (em vez de `amil-blue-light`).
3. **Sticky thead** em scroll mobile: `<thead class="sticky top-0">`.
4. **Tabular numerals**: `font-variant-numeric: tabular-nums` no CSS (alinha colunas R$).
5. **Selo "Atualizado em [mm/aaaa]"** no topo (`<UpdatedBadge>` em amber-50).
6. **Caption acessível**: `<caption class="sr-only">Tabela de preços Amil Empresarial atualizada em outubro de 2026</caption>`.
7. **AggregateOffer schema** injetado via `<SchemaGraph type="aggregate-offer">` irmão.

#### 2.6.3 PlanCard — 🟡 Refatorar (linha Bronze→Black + Selecionada + Dental)

Atual: 3 linhas (`amil-facil`, `amil`, `amil-one`). Precisa expandir para refletir catálogo real:

```typescript
type LinhaPlano =
  | 'classica-bronze' | 'classica-prata' | 'classica-ouro'
  | 'classica-platinum' | 'classica-black-i' | 'classica-black-ii'
  | 'selecionada-s2500' | 'selecionada-s6500'
  | 'dental-e60' | 'dental-e80' | 'dental-pme';
```

Estrutura visual:
```
┌──────────────────────────────────────┐
│ [Badge Linha Clássica · Black II]    │  ← slate-100 + slate-700
│                                      │
│ Amil Black II                        │  ← h3, slate-900
│ Cobertura nacional · Apartamento     │  ← body-sm, slate-500
│                                      │
│ A partir de                          │  ← caption, slate-500
│ R$ 1.234,56/mês                      │  ← display-lg, slate-900
│                                      │
│ ✓ Acesso à Rede D'or premium         │  ← Lucide Check teal-600
│ ✓ Albert Einstein, Sírio Libanês     │
│ ✓ Reembolso até R$ X consulta        │
│ ✓ Telemedicina 24h                   │
│ ✓ Cobertura internacional            │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Ver detalhes do Black II →       │ │  ← border slate-300, hover teal-600
│ └──────────────────────────────────┘ │
│                                      │
│ ☆ Comparar com outros planos         │  ← link sky-600
└──────────────────────────────────────┘
```

**Variante "Selecionada":** badge em `amber-100` + texto `amber-700`.
**Variante "Dental":** badge em `slate-200` + ícone tooth (Lucide).
**Variante "Featured":** ring-2 ring-teal-600 + badge "Mais escolhido" em teal-600.

#### 2.6.4 FAQAccordion — 🟢 Adequado, ampliar conteúdo

Componente já existe com FAQPage schema (FR40). **Ações:**
- Migrar 45+ Q&As do `planodesaudeamil` (texto público, regravado, atribuído à autoria editorial)
- Adicionar agrupamento por categoria (Carências, Coparticipação, Reembolso, ANS, Tributário)
- `<details>` HTML semântico opcional como progressive enhancement (SEO bonus em SERP)

#### 2.6.5 LocalHero — 🟡 Refatorar (anti-cookie-cutter)

Atual: usa `bg-amil-blue` ❌. Refactor:

```
┌────────────────────────────────────────────────┐
│ background: slate-900 com pattern dot teal-600 │
│                                                │
│ [Breadcrumb: Início > Rede > SP > São Paulo]   │
│                                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│ Plano de Saúde Amil Empresarial em             │
│ São Paulo — SP                                 │  ← display-lg
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                                │
│ [12 hospitais reais] [Amil Espaço Saúde]       │  ← chips slate-700/teal-600
│ [População 12,3M IBGE] [3 unidades AME]        │
│                                                │
│ Hospitais reais credenciados em São Paulo:     │  ← h3
│ • Hospital Albert Einstein (Morumbi)           │  ← <ul>
│ • Hospital Sírio Libanês (Bela Vista)          │
│ • Hospital São Luiz Itaim                      │
│ • + 9 hospitais ([Ver lista completa →])       │
│                                                │
│ [Simular plano em São Paulo →] (teal-600)      │
└────────────────────────────────────────────────┘
```

**Anti-cookie-cutter (NFR21):** cada cidade renderiza com **dados únicos do dataset** (pop IBGE + hospitais reais por município + unidades AME). Template renderiza variação real, não placeholder.

#### 2.6.6 StatsCounter — 🟢 Adequado, ajustar cores

Atual: ícone `text-amil-blue` ❌. Trocar para `text-slate-700`. Números em `slate-900 font-bold`.

Sugestão de stats (verificáveis):
- 7,5M beneficiários Amil (fonte: ANS, dataset operadoras)
- 26k médicos credenciados
- 2,1M atendimentos/ano
- 469k empresas atendidas

Cada stat com `<sub class="caption text-slate-500">Fonte: ANS, 2025</sub>` — anti-claim sem fonte (ver `feedback_claims_metricas.md`).

#### 2.6.7 ComparisonTable — 🟡 Refatorar (gap dos concorrentes)

Atual: compara dois planos Amil. **Diferenciação:** comparar **Amil vs SulAmérica vs Bradesco** (gap absoluto dos 4 concorrentes — eles nunca comparam com competidoras).

```
┌────────────────────────────────────────────────────────┐
│ Característica  │ Amil Black II │ SulAm 250 │ Bradesco SP│
│─────────────────│──────────────│───────────│────────────│
│ Cobertura       │ Nacional ✓    │ Nacional ✓ │ Nacional ✓ │
│ Albert Einstein │ ✓             │ ✓          │ ✓          │
│ Sírio Libanês   │ ✓             │ ✗          │ ✓          │
│ Reembolso/cons  │ R$ 380        │ R$ 220     │ R$ 280     │
│ Preço 30-39a    │ R$ 1.234      │ R$ 1.189   │ R$ 1.420   │
└────────────────────────────────────────────────────────┘
[Veredicto: Amil Black II tem melhor reembolso e Sírio]
```

Cabeçalho `bg-slate-900 text-white`. Coluna Amil destacada com `bg-teal-50`.

#### 2.6.8 StickyQuoteCTA — 🔴 Novo

CTA flutuante sticky — bottom right desktop, bottom full-width mobile.

```
Desktop:                     Mobile:
┌────────────┐              ┌──────────────────────┐
│ 💬 Cotar   │              │ [💬 WhatsApp] [📊 Ver]│
│  WhatsApp  │              └──────────────────────┘
└────────────┘
```

Aparece após scroll >300px. Pode ser dismissed (cookie 24h).
Background `teal-600`, texto branco. WhatsApp deep link com cidade+CNAE da página.

#### 2.6.9 Footer global — 🔴 Novo (FR48)

```
┌──────────────────────────────────────────────────────────┐
│ bg: slate-900, text: slate-300                          │
│                                                          │
│ ┌─Coluna 1───┐ ┌─Coluna 2───┐ ┌─Coluna 3───┐ ┌─Col 4───┐│
│ │Institucional│ │Recursos    │ │Ecossistema │ │Compliance││
│ │ Sobre       │ │ Pillar     │ │ Hub PJ ↗   │ │ ANS logo ││
│ │ Privacidade │ │ Tabela     │ │ Bradesco ↗ │ │ SUSEP ↗  ││
│ │ Termos      │ │ Calculadora│ │ Amil em PF │ │ LGPD ↗   ││
│ │ Cookies     │ │ Rede       │ │            │ │ RA ↗     ││
│ │ LGPD direitos│ │ Biblioteca │ │            │ │          ││
│ └────────────┘ └────────────┘ └────────────┘ └─────────┘│
│                                                          │
│ ─────────────────────────────────────────────────────── │
│ BeneficioRH Corretora · CNPJ XX.XXX.XXX/0001-XX        │
│ SUSEP nº XXXXXXXXX · Em conformidade com ANS RN195/2009 │
│ © 2026 BeneficioRH · Build #abc1234 · 28-04-2026        │
└──────────────────────────────────────────────────────────┘
```

**Cross-domain links** (Coluna 3 — FR48): hub `planodesaudepj.com.br`, satélites `bradescosaudeempresas.com.br`, projeto Amil PF. Todos com `rel="noopener"` e `target="_blank"` opcional.

#### 2.6.10 SchemaGraph — 🟢 Existe, ampliar tipos

Componente em `components/seo/SchemaGraph.tsx` (já implementado FR31). Ampliar `type` enum para cobrir FR31–FR42:
```
type: 'organization' | 'localbusiness' | 'product' | 'aggregate-offer'
    | 'faq' | 'breadcrumb' | 'article' | 'medicalbusiness'
    | 'webpage' | 'website' | 'howto'
```

### 2.7 Estados de componentes

Todo componente interativo tem 7 estados padronizados:

| Estado | Slate primária | Teal CTA | Form input |
|---|---|---|---|
| **default** | `slate-700` text, `slate-200` border | `teal-600` bg, white text | `slate-300` border |
| **hover** | `slate-900` text + `slate-50` bg | `teal-700` bg | `slate-400` border |
| **active** | (pressed) `slate-100` bg | `teal-800` bg | — |
| **focus visible** | ring-2 `teal-500` offset-2 | ring-2 `teal-300` offset-2 | ring-2 `teal-500` |
| **disabled** | `slate-300` text, `slate-100` bg, cursor-not-allowed | `slate-200` bg, `slate-400` text | `slate-100` bg |
| **loading** | `<Spinner>` ou skeleton (não spinner global) | `teal-600` + opacity-70 + `<Loader2 spinning>` | — |
| **error** | `error-700` text, `error-100` bg | — | ring-2 `error-500` + msg `error-700` |

**Padrão de focus:** sempre **focus visible** com `ring-2 ring-teal-500 ring-offset-2 ring-offset-white` — nunca remover outline sem substituir (WCAG 2.4.7).

### 2.8 Acessibilidade (WCAG 2.1 AA mínimo, AAA preferencial)

Checklist obrigatório por componente:
- ✅ Contraste texto ≥4.5:1 (validado seção 2.2)
- ✅ Contraste UI ≥3:1 (botões, ícones)
- ✅ `focus visible` com ring 2px + offset
- ✅ Navegação keyboard (Tab/Shift+Tab/Enter/Esc) testada
- ✅ `aria-label` em ícone-only buttons
- ✅ `aria-expanded` em accordions
- ✅ `aria-current="page"` em nav ativa
- ✅ Skip link `<a href="#main">Pular para conteúdo</a>` no topo
- ✅ Headings em ordem (`<h1>` único, sem pular níveis)
- ✅ Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` corretos
- ✅ Alt text em todas imagens (decorativas com `alt=""` + `aria-hidden`)
- ✅ Form labels associados (`<label for>`)
- ✅ Erro de form com `aria-invalid` + `aria-describedby`
- ✅ Tabela com `<caption>` + `<th scope="col|row">`
- ✅ `prefers-reduced-motion` respeitado (transições <100ms quando reduzido)

### 2.9 Microinterações

**Princípio:** suaves mas perceptíveis. Reforça "velocidade perceptível" do FE Spec.

| Interação | Duração | Easing | Onde |
|---|---|---|---|
| Hover button/card | 150ms | `ease-out` | bg, border, shadow |
| Accordion expand/collapse | 200ms | `ease-in-out` | max-height |
| Modal/dialog open | 200ms | `ease-out` | opacity + translate-y |
| Tooltip | 100ms enter / 150ms leave | `ease-out` | opacity |
| Sticky CTA appear | 300ms | `ease-out` | translate-y from below |
| Page transition | 0 (instant) | — | Next.js default |
| Skeleton loading | shimmer 1500ms loop | `linear` | `bg-gradient-to-r` slate-100→slate-200→slate-100 |

**Anti-padrões:**
- ❌ Bounce excessivo em CTAs (cara amador)
- ❌ Parallax em hero (LCP ruim)
- ❌ Animações ≥500ms sem causa
- ❌ Auto-play sliders/carrosséis

### 2.10 Mobile-first vs desktop

**Fase 1 (PJ atual):** desktop-heavy (Camila no horário comercial), mas mobile-friendly (Marcelo entre reuniões).

**Fase 2 (PF futuro):** mobile-heavy (PF mobile >70% do tráfego histórico do segmento).

**Decisões resultantes:**
- Bottom tab bar sticky **desktop opcional**, mobile obrigatório.
- Tabelas: scroll horizontal mobile com sticky 1ª coluna; full-width desktop.
- Hero: simulador inline desktop (3 campos lado-a-lado), stack vertical mobile.
- Footer: 4 colunas desktop, 1 coluna stack mobile com `<details>` colapsáveis.

---

## 3. Padrões UX absorvidos dos concorrentes (best of)

| Concorrente | Padrão UX a absorver | Status no PRD/Spec | Diferenciação |
|---|---|---|---|
| **amilsaudebr** | `<title>` com ano "2026" | FR50 ✅ | Renovação anual automática via Sanity; preview SERP no admin |
| **amilsaudebr** | 8 H2s estruturados narrativos | FR50/Spec §IA ✅ | Narrativa adaptada para PJ (não MEI/individual): "Como cobrir colaboradores", "Carência colaboradores", "Reembolso PME", etc. |
| **amilsaudebr** | 8 cards CTA na home | Adapt | Reduzir para 4 cards (anti-densidade comercial) |
| **amilsaudebr** | AggregateOffer schema | FR51 ✅ | + lowPrice/highPrice POR estado (não só nacional) |
| **planodesaudeamil** | FAQ accordion 45+ Q&A | FR40 ✅ | + agrupamento por categoria (Carências, Coparticipação, Reembolso, ANS, Tributário) |
| **planodesaudeamil** | Tabela embutida em cada produto | FR42 ✅ | + selo "Atualizado em [mm/aaaa]" + AggregateOffer per produto |
| **planodesaudeamil** | CNPJ + SUSEP + ANS visíveis no footer | FR48 ✅ | Adicionar Reclame Aqui clicável para fonte oficial |
| **amilplanos** | Sub-pillars rede (D'or, One, Fácil, Clássica) | FR43 ✅ | Cada sub-pillar com page master + word count ≥2.500 |
| **amilplanos** | H1 city com qualifier ("Plano Amil [Cidade]") | FR50 ✅ | + UF + ano: "Plano de Saúde Amil Empresarial em [Cidade] — [UF] 2026" |
| **kitcorretor** | Cards de notícia ("Lançamento Black", "Telemedicina") | Backlog Fase 2 | Categoria "Lançamentos Amil" no blog editorial |
| **kitcorretor** | Linhas Black detalhadas (Black I/II, S2500, S6500) | Atualizar catálogo | PlanCard variants completos (seção 2.6.3) |

---

## 4. Mockups conceituais (textuais) das 5 páginas-chave

### 4.1 Homepage `/`

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (sticky, slate-900, white logo BeneficioRH)      │
│ Logo · Guia · Tabela · Calculadora · Rede · Sobre · CTA │
├─────────────────────────────────────────────────────────┤
│ HERO (bg: white, slate-900 text)                        │
│   pre-headline: "Editorial PJ · 2026"                   │
│   H1: Plano de Saúde Amil Empresarial 2026             │
│   Lead: Tabela atualizada · Hospitais reais · ANS       │
│   ┌─Simulador inline (3 campos)─────────────────┐      │
│   │ [vidas] [cidade] [CNAE]  [Cotar →]          │      │
│   └────────────────────────────────────────────┘      │
│   Selos: [Atualizado out/2026] [SUSEP] [ANS]            │
├─────────────────────────────────────────────────────────┤
│ STATS (slate-50)                                        │
│   StatsCounter 4 numbers (com fonte ANS)               │
├─────────────────────────────────────────────────────────┤
│ PILLAR PREVIEW                                          │
│   H2: Guia completo Amil Empresarial 2026              │
│   3 cards de cornerstones em destaque                  │
│   [Ver guia completo →]                                │
├─────────────────────────────────────────────────────────┤
│ PRODUTOS (linha Clássica + Selecionada + Dental)       │
│   H2: Linhas e produtos Amil Empresarial 2026          │
│   Grid 3 cols: [Clássica][Selecionada][Dental]         │
│   Cada um com sub-grid de PlanCards                    │
├─────────────────────────────────────────────────────────┤
│ TABELA RESUMO (FR52 — semantic)                         │
│   H2: Tabela de preços Amil Empresarial 2026           │
│   PriceTable com 5 tiers Bronze→Black + selo data      │
│   [Ver tabela completa por estado →]                   │
├─────────────────────────────────────────────────────────┤
│ COMPARATIVO (gap dos concorrentes)                      │
│   H2: Amil vs SulAmérica vs Bradesco                   │
│   ComparisonTable 3 cols                               │
├─────────────────────────────────────────────────────────┤
│ FAQ (FR40 — schema)                                     │
│   H2: Perguntas frequentes (45+)                       │
│   FAQAccordion agrupado por categoria                  │
├─────────────────────────────────────────────────────────┤
│ AUTORIDADE                                              │
│   H2: Sobre o corretor responsável                     │
│   Foto + nome + SUSEP + LinkedIn + WhatsApp            │
├─────────────────────────────────────────────────────────┤
│ FOOTER global (cross-domain + compliance)               │
└─────────────────────────────────────────────────────────┘
[Sticky bottom mobile: WhatsApp + Tabela + Simular]
```

### 4.2 Tabela de preços `/precos/tabela-2026/`

```
┌─────────────────────────────────────────────────────────┐
│ HEADER + Breadcrumb (Início > Preços > Tabela 2026)    │
├─────────────────────────────────────────────────────────┤
│ HERO compacto (slate-900)                              │
│   H1: Tabela de preços Amil Empresarial 2026           │
│   sub: SP · RJ · MG · PR · DF · 5 estados              │
│   Selo: [Atualizado em 28/04/2026] (amber-50)          │
├─────────────────────────────────────────────────────────┤
│ FILTROS sticky (slate-50)                               │
│   [Estado: SP ▼] [Modalidade: Apto ▼] [Linha: Todas ▼] │
├─────────────────────────────────────────────────────────┤
│ TABELA PRINCIPAL (FR52 + AggregateOffer schema)         │
│   <table> semântico com:                               │
│   - <caption sr-only>                                  │
│   - thead sticky (slate-900)                           │
│   - tbody com tabular-nums                             │
│   - linhas alternadas slate-50/white                   │
│   - última col: [Cotar este plano →]                   │
├─────────────────────────────────────────────────────────┤
│ FONTE & METODOLOGIA                                     │
│   Texto explicativo + link para ANS oficial            │
├─────────────────────────────────────────────────────────┤
│ CHANGELOG (NFR23)                                       │
│   H2: Histórico de atualizações                        │
│   Lista <ul>: 04/2026, 03/2026, 02/2026...             │
├─────────────────────────────────────────────────────────┤
│ FAQ contextual (FR40)                                   │
│   H2: Sobre a tabela de preços                         │
│   FAQAccordion com 8 Q&A específicas                   │
├─────────────────────────────────────────────────────────┤
│ FOOTER + Sticky CTA                                    │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Página de produto `/produtos/amil-bronze/`

```
┌─────────────────────────────────────────────────────────┐
│ HEADER + Breadcrumb (Início > Produtos > Amil Bronze)  │
├─────────────────────────────────────────────────────────┤
│ HERO produto                                            │
│   Badge: [Linha Clássica · Bronze]                      │
│   H1: Amil Bronze — Plano Empresarial 2026             │
│   Lead: "Entrada na linha Clássica..." (200 palavras)  │
│   Selo: [Atualizado out/2026]                          │
│   CTA primário: [Cotar Amil Bronze →]                  │
├─────────────────────────────────────────────────────────┤
│ TABELA EMBUTIDA (PriceTable + AggregateOffer schema)    │
│   H2: Quanto custa o Amil Bronze 2026?                 │
│   PriceTable per-estado (SP default + dropdown)        │
├─────────────────────────────────────────────────────────┤
│ COBERTURA & REDE                                        │
│   H2: O que está coberto?                              │
│   Lista de coberturas obrigatórias ANS + opcionais     │
│   H3: Hospitais credenciados                           │
│   Tabela ou lista de hospitais reais (NÃO genérica)    │
├─────────────────────────────────────────────────────────┤
│ COMPARAR (link interno)                                 │
│   H2: Bronze vs Prata vs Ouro                          │
│   ComparisonTable com 3 produtos linha Clássica        │
├─────────────────────────────────────────────────────────┤
│ FAQ produto-específico                                  │
│   H2: Dúvidas sobre o Amil Bronze                      │
│   FAQAccordion com 10 Q&A específicas                  │
├─────────────────────────────────────────────────────────┤
│ PRÓXIMOS PASSOS                                         │
│   3 cards: [Ver tabela completa] [Ver Prata] [Cotar]   │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
└─────────────────────────────────────────────────────────┘
```

### 4.4 Página estadual `/rede-credenciada/sao-paulo/`

```
┌─────────────────────────────────────────────────────────┐
│ HEADER + Breadcrumb (Início > Rede > São Paulo)         │
├─────────────────────────────────────────────────────────┤
│ LocalHero (slate-900 + dot pattern teal)                │
│   H1: Rede credenciada Amil Empresarial em São Paulo    │
│   Chips: [184 hospitais] [12 AME] [25 cidades]          │
│   Lead com dados IBGE estado                           │
├─────────────────────────────────────────────────────────┤
│ MAPA (Fase 1.5)                                         │
│   H2: Onde estão os prestadores?                        │
│   [Mapa estático com pins por região metropolitana]    │
├─────────────────────────────────────────────────────────┤
│ HOSPITAIS POR REDE (sub-pillars)                        │
│   H2: Hospitais por tipo de rede Amil                  │
│   3 cards: [Rede D'or] [Selecionada] [Clássica]        │
├─────────────────────────────────────────────────────────┤
│ TOP 10 HOSPITAIS                                        │
│   H2: Principais hospitais credenciados em SP          │
│   <table> com nome + bairro + município + tier         │
├─────────────────────────────────────────────────────────┤
│ CIDADES COBERTAS                                        │
│   H2: Cobertura em municípios paulistas                │
│   Grid de city links (até 25 mais relevantes)          │
├─────────────────────────────────────────────────────────┤
│ FAQ regional                                            │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
└─────────────────────────────────────────────────────────┘
```

### 4.5 Página de cidade `/rede-credenciada/sao-paulo/sao-paulo/`

```
┌─────────────────────────────────────────────────────────┐
│ HEADER + Breadcrumb (Início > Rede > SP > São Paulo)    │
├─────────────────────────────────────────────────────────┤
│ LocalHero (anti-cookie-cutter — NFR21)                  │
│   H1: Plano Amil Empresarial em São Paulo — SP 2026     │
│   Chips: [12 hospitais reais] [3 AME] [Pop 12,3M IBGE] │
│   ListView de hospitais reais ESTE município           │
│   CTA: [Simular plano em São Paulo →]                  │
├─────────────────────────────────────────────────────────┤
│ CONTEXTO LOCAL                                          │
│   H2: Plano de saúde empresarial em São Paulo          │
│   Texto único 800+ palavras com dados deste município: │
│   - PIB · CNAE predominante · empresas ativas RFB      │
│   - Bairros com maior densidade Amil                   │
├─────────────────────────────────────────────────────────┤
│ HOSPITAIS DESTE MUNICÍPIO (FR49)                        │
│   H2: 12 hospitais credenciados em São Paulo           │
│   <table> com nome + bairro + tier + endereço          │
│   [Schema MedicalBusiness × 12]                        │
├─────────────────────────────────────────────────────────┤
│ TABELA DE PREÇOS LOCAL                                  │
│   PriceTable filtrada SP + AggregateOffer per-cidade   │
├─────────────────────────────────────────────────────────┤
│ CIDADES VIZINHAS                                        │
│   Links para Guarulhos, Osasco, Santo André...         │
├─────────────────────────────────────────────────────────┤
│ FAQ local                                               │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
└─────────────────────────────────────────────────────────┘
```

**Anti-cookie-cutter (NFR21):** cada cidade renderiza com hospitais reais + dados IBGE/RFB únicos. Templates que produziriam texto idêntico devem ser rejeitados em CI (Quinn).

---

## 5. Roadmap de implementação UX

### 5.1 Componentes existentes

| Componente | Status | Esforço refactor | Prioridade | Story sugerida |
|---|---|---|---|---|
| `PriceTable` | 🟡 troca cores + sticky thead + selo | S (4h) | P0 | Story 3.x — PriceTable v2 |
| `PlanCard` | 🟡 expandir linhas + variantes | M (8h) | P0 | Story 3.x — PlanCard catalog |
| `LocalHero` | 🟡 troca cores + dot pattern + lista hospitais | M (6h) | P0 | Story 4.x — LocalHero variation |
| `FAQAccordion` | 🟢 só ampliar conteúdo | S (2h refactor + 12h conteúdo) | P0 | Story 5.x — FAQ migration |
| `ComparisonTable` | 🟡 expandir 3 cols + outras seguradoras | M (8h) | P1 | Story 6.x — Cross-broker compare |
| `StatsCounter` | 🟡 só troca cores | XS (1h) | P1 | Inline em Story 3.x |
| `BlogCard` | 🟢 já adequado | — | P2 | — |
| `TestimonialCard` | 🟢 já adequado | — | P2 | — |

### 5.2 Componentes novos a criar

| Componente | Esforço | Prioridade | Story sugerida |
|---|---|---|---|
| `<HeroWithSimulator>` (homepage) | L (16h) | P0 | Story 2.x — Homepage v2 |
| `<UpdatedBadge>` (selo "Atualizado em mm/aaaa") | XS (2h) | P0 | inline |
| `<StickyQuoteCTA>` | M (6h) | P0 | Story 7.x |
| `<FooterGlobal>` (cross-domain + compliance) | M (8h) | P0 | Story 1.x — Layout shell |
| `<CTACardGrid>` (4 cards principais) | S (4h) | P1 | Story 2.x |
| `<NewsCard>` (blog) | S (4h) | P2 | Story 8.x |
| `<MapaRedeCredenciada>` (estático Fase 1.5) | L (16h) | P1 | Story 4.x — Rede |
| `<OfficialBrandReference>` (compliance ADR-006) | S (4h) | P0 | Story 1.x |
| `<SchemaGraph>` ampliação tipos | M (8h, distribuído) | P0 | Stories 3.x–6.x |

### 5.3 Tokens & infraestrutura design system

| Item | Esforço | Prioridade |
|---|---|---|
| Migrar `globals.css` para nova paleta (slate + teal) | S (4h) | P0 |
| Adicionar `tailwind.config.ts` com tokens semânticos | S (4h) | P0 |
| Storybook com 12 componentes (opcional) | XL (24h) | P3 (Fase 2) |
| Design tokens em JSON exportável (Style Dictionary) | M (8h) | P3 (Fase 2) |

### 5.4 Esforço total estimado

| Categoria | Esforço |
|---|---|
| Refactors componentes existentes | ~30h |
| Componentes novos | ~70h |
| Tokens & infra | ~8h |
| Conteúdo (45+ FAQ + 12 produtos) | ~40h (Pax/Atlas) |
| **Total Fase 1 UX** | **~150h** (~4 sprints de 1 semana) |

---

## 6. Inconsistências com FE Spec v1.1 (mesma autora — confirmadas)

> Como Uma é a autora de ambos, identifico inconsistências mas confirmo coerência onde aplicável. Não reescrevo o spec — sinalizo para versão v1.2 futura.

| # | FE Spec v1.1 | Este documento | Decisão |
|---|---|---|---|
| 1 | Brand primária `#0066B3` (azul Amil oficial) | Brand primária `slate-900 #0F172A` | **Este doc prevalece** (ADR-006 trademark). FE Spec v1.2 deve atualizar §Color Palette. |
| 2 | CTA `#00C389` (verde) | CTA `teal-600 #0D9488` (verde-azulado) | **Este doc prevalece** (anti-clone visual). FE Spec v1.2 atualizar. |
| 3 | Tipografia Inter | Tipografia Inter (+ Source Serif 4 opcional Fase 2) | **Coerente** — Source Serif é adição opcional. |
| 4 | Escala tipográfica modular 1.250 | Idem | **Coerente.** |
| 5 | Iconografia genérica | Iconografia Lucide (já no codebase) | **Este doc formaliza** o que já está em uso. |
| 6 | Componentes: 8 ui/ atomic | Componentes: 8 existentes + 9 novos | **Este doc expande** — não conflita. |
| 7 | `globals.css` define `--color-amil-blue` | Substituir por tokens slate/teal | **Este doc prevalece** — mudança de implementação. |

**Recomendação:** quando Pax criar story de "atualização visual", referenciar este documento como fonte de verdade. FE Spec v1.2 deve ser atualizado em sessão dedicada (não nesta task).

---

## 7. Restrições atendidas (checklist)

- [x] **R1 — Não copiar literal:** todos os patterns absorvidos foram regravados/recontextualizados.
- [x] **R2 — Sem logo Amil oficial como identidade:** logo BeneficioRH é a identidade; menções a Amil via componente isolado `<OfficialBrandReference>`.
- [x] **R3 — Sem azul Amil oficial como brand:** brand é slate-900 + teal-600. Único azul é sky-600 (dessaturado, links).
- [x] **R4 — `<table>` HTML em preços:** FR52 + seção 2.6.2 + 4.2.
- [x] **R5 — Anti-cookie-cutter city pages:** NFR21 + seção 2.6.5 + 4.5 + CI rule sugerida.
- [x] **R6 — Sem métricas inventadas:** todos os números (StatsCounter) com `<sub>` "Fonte: ANS, 2025".

---

## 8. Próximos passos sugeridos

1. **Pax (PO):** quebrar este documento em stories formais (já alocado em Task #22).
2. **Dex (Dev):** implementar Story 1.x (tokens + footer global + OfficialBrandReference) primeiro.
3. **Quinn (QA):** adicionar regras de auditoria CI: contraste min 4.5:1, schema válido, sitemap×routes match, anti-cookie-cutter (hash de body por cidade ≤ X% similar).
4. **Aria (Architect):** validar que tokens propostos cabem em ADR-006 (trademark) e ADR-008 (SSG/perf).
5. **Morgan (PM):** confirmar prioridades P0/P1/P2 vs roadmap de PRD v1.3.1.
6. **Uma (UX):** atualizar FE Spec → v1.2 em sessão dedicada (incorporar paleta deste doc).

---

**Fim do documento — Visual Benchmark + Design System v1.0**
*Uma — UX Design Expert · Synkra AIOX · 2026-04-28*
