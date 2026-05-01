# Migração `app/globals.css` — Paleta Opção A

**Data:** 2026-04-29
**Autor:** Uma (UX Design Expert) + Dex (Senior Full-Stack Developer) — Synkra AIOS
**Escopo:** P0 débito visual — fechar gap entre Design System v1.0 (canonical) e código produtivo
**Compliance:** ADR-006 (anti-trademark Amil) + FR54 (Schema Organization BeneficioRH)

---

## TL;DR

Removemos os tokens legacy `--color-amil-blue*` (azul Amil/UnitedHealth oficial `#0066B3` / `#0066CC`) do design system global e os substituímos pela **Paleta Opção A** definida em `docs/design/visual-benchmark-and-design-system.md` v1.0.

A paleta nova posiciona o site BeneficioRH como **editorial / independente**, não como afiliado visual da Amil.

---

## O que mudou

### `app/globals.css` (antes)

```css
@import "tailwindcss";

@theme {
  --color-amil-blue: #0066CC;
  --color-amil-blue-dark: #1A237E;
  --color-amil-blue-light: #E3F2FD;
  --color-cta-green: #00C853;
  /* ...demais tokens utilitários... */
}
```

### `app/globals.css` (depois)

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #0F172A;     /* slate-900 — identidade BeneficioRH */
  --color-cta: #0D9488;               /* teal-600 — botões/CTAs primários */
  --color-accent: #B45309;            /* amber-700 — destaques/avisos */
  --color-link: #0284C7;              /* sky-600 — links/refs */

  --color-cta-green: #00C853;         /* legacy compat — preservado */
  /* ...demais tokens utilitários preservados... */
}
```

> Tailwind 4 já fornece nativamente as escalas `slate-*`, `teal-*`, `amber-*` e `sky-*`. Os 4 tokens semânticos novos (`brand-primary`, `cta`, `accent`, `link`) servem como aliases para uso futuro em componentes que prefiram nomenclatura semântica em vez de utilitárias.

---

## Por quê

| Risco identificado | Mitigação |
|---|---|
| **Trademark Amil** — `#0066B3` é a cor exata da identidade visual Amil/UnitedHealth. Manter como brand primary cria risco de notificação extrajudicial. ADR-006 mandou sair. | Migração para `slate-900` + accent `teal-600`, distantes da paleta Amil. |
| **Dissonância marca↔schema (FR54)** — Schema Organization vai dizer ao Google que a empresa é BeneficioRH. Mas se o usuário aterra com paleta Amil, há ruído sinal-marca. | Paleta neutra editorial reforça narrativa "corretora independente". |
| **Posicionamento competitivo** — Concorrentes diretos (`amilplanos.com.br` etc) usam mesmo azul Amil. Diferenciamos via paleta editorial. | Slate/teal nos posiciona como "publicação editorial autorizada", não clone visual. |

---

## Componentes refatorados

Todos os hits de `bg-amil-blue*`, `text-amil-blue*`, `border-amil-blue*`, `hover:border-amil-blue*`, `focus:border-amil-blue*` foram substituídos:

### Layout / chrome

| Arquivo | Antes | Depois |
|---|---|---|
| `components/layout/Header.tsx` | `text-amil-blue` (logo), `hover:text-amil-blue` (nav) | `text-slate-900`, `hover:text-sky-600` |
| `components/layout/Footer.tsx` | `bg-amil-blue-dark` | `bg-slate-900` |
| `components/seo/BreadcrumbNav.tsx` | `hover:text-amil-blue` | `hover:text-sky-600` |

### UI primitives

| Arquivo | Antes | Depois |
|---|---|---|
| `components/ui/ComparisonTable.tsx` | `text-amil-blue`, `text-amil-blue-dark`, `bg-amil-blue-light` | `text-slate-900`, `bg-slate-50` |
| `components/ui/BlogCard.tsx` | `bg-amil-blue` (categoria badge), `text-amil-blue` (link) | `bg-slate-900`, `text-sky-600` |
| `components/ui/TestimonialCard.tsx` | `bg-amil-blue` (avatar) | `bg-slate-900` |
| `components/ui/StatsCounter.tsx` | `text-amil-blue` (ícones) | `text-slate-700` |
| `components/ui/PlanCard.tsx` | `bg-amil-blue`, `bg-amil-blue-dark` (linhas Saúde/One), CTA `bg-amil-blue` | `bg-slate-900`, `bg-slate-800`; CTA `bg-teal-600 hover:bg-teal-500` |
| `components/ui/LocalHero.tsx` | `bg-amil-blue` (hero), `text-amil-blue-light` | `bg-slate-900`, `text-slate-200` |

### Forms

| Arquivo | Antes | Depois |
|---|---|---|
| `components/forms/QuoteForm.tsx` | `bg-amil-blue` (steps), `border-amil-blue bg-amil-blue-light` (selected), `text-amil-blue` (icons), `focus:border-amil-blue` (inputs), CTA `bg-amil-blue hover:bg-amil-blue-dark` | `bg-slate-900` (steps), `border-slate-900 bg-slate-50` (selected), `text-slate-700` (icons), `focus:border-teal-600` (inputs), CTA `bg-teal-600 hover:bg-teal-500` |

### Pages (marketing)

| Arquivo | Antes | Depois |
|---|---|---|
| `app/(marketing)/amil-dental/page.tsx` | hero `bg-amil-blue`, `text-amil-blue-light`, h2 `text-amil-blue` | `bg-slate-900`, `text-slate-200`, `text-slate-900` |
| `app/(marketing)/empresarial/page.tsx` | hero `bg-amil-blue`, `text-amil-blue-light`, h3 `text-amil-blue` | `bg-slate-900`, `text-slate-200`, `text-slate-900` |
| `app/(marketing)/portal-empresa/page.tsx` | callout `border-amil-blue bg-amil-blue-light`, btn `bg-amil-blue hover:bg-amil-blue-dark` | `border-slate-900 bg-slate-50`, `bg-teal-600 hover:bg-teal-500` |
| `app/(marketing)/planos/page.tsx` | label linha `text-amil-blue`, seta `text-amil-blue` | `text-sky-600` |
| `app/(marketing)/contato-empresas\page.tsx` | item `hover:border-amil-blue hover:bg-amil-blue-light`, ícone `text-amil-blue`, tel `text-amil-blue` | `hover:border-slate-900 hover:bg-slate-50`, `text-teal-600` (ícone), `text-sky-600` (tel) |

---

## Mapping rules aplicados

| Token legacy | Substituto Opção A | Justificativa |
|---|---|---|
| `bg-amil-blue` (background hero/cards primários) | `bg-slate-900` | Brand primary canonical |
| `bg-amil-blue-dark` (footer, dark overlay) | `bg-slate-900` ou `bg-slate-800` | Mesma família, contraste preservado |
| `bg-amil-blue-light` (subtle/selected backgrounds) | `bg-slate-50` | Tom claro neutral |
| `text-amil-blue` (links, ícones decorativos) | `text-sky-600` (link) ou `text-slate-700` (ícones) | Distinção semântica link vs ícone |
| `text-amil-blue-dark` (titles em fundo claro) | `text-slate-900` | Brand primary text |
| `border-amil-blue` (selected state, focus) | `border-slate-900` ou `border-teal-600` | Slate para seleção neutra; teal para focus CTA |
| `focus:border-amil-blue` (form inputs) | `focus:border-teal-600` | Verde-azulado de foco; AAA contrast em fundo branco |
| CTA primário `bg-amil-blue hover:bg-amil-blue-dark` | `bg-teal-600 hover:bg-teal-500` | CTA semântico (teal) — diferenciado de brand primary |

---

## Tokens preservados (não migrados)

| Token | Motivo |
|---|---|
| `--color-cta-green: #00C853` | CTA verde-claro complementar (botão "Cotação Grátis"); contraste WCAG AA OK em texto branco. Não conflita com paleta Amil. |
| `--color-whatsapp: #25D366` | Cor oficial WhatsApp (uso restrito a CTA WhatsApp). |
| `--color-urgency: #D32F2F` | Vermelho de urgência (notícias, alertas). |
| `--color-gray-*` | Escala de cinza neutra. |
| `--font-sans: Inter` | Tipografia canonical do design system. |

---

## Próximos passos

1. **Monitorar bug visual em produção** após deploy: `bg-slate-900` em viewport mobile pode parecer pesado em modo claro — coletar feedback NPS de 5 testadores nos primeiros 7 dias.
2. **Aria (Architect)** — atualizar `docs/architecture.md` §Design Tokens se houver referência inline a `--color-amil-blue*`.
3. **Pax (PO)** — atualizar Story 1.0 referência `#0066B3` para refletir decisão Opção A; arquivar nota de risco trademark.
4. **Quinn (QA)** — incluir test e2e Playwright que valida `data:image/png` snapshot de `/` não contém pixels `#0066CC` (regressão visual).
5. **Atlas (Editor)** — `data/tabelas-visual.html` (debug-only, não servido) ainda usa `#0066B3` em estilos inline. Como é arquivo standalone de QA visual, baixa prioridade. Recomendação: refatorar em sprint dedicado.

---

## Validação aplicada

```bash
# Confirma zero menções em código (excluindo comentários/docstrings)
grep -rn "amil-blue\|0066CC\|0066B3" app/ components/ lib/
# → Sai com 3 hits residuais em comentários docstring (auto-referencial)

# Tests
node --test components/ui/__tests__/global-tokens.test.mjs
node --test components/ui/__tests__/PriceTable.test.mjs
node --test components/ui/__tests__/PlanComparison.test.mjs
node --test components/ui/__tests__/CarenciaCalculator.test.mjs

# TypeScript
npx tsc --noEmit

# Lint
npx eslint .
```

---

**Single source of truth da paleta:** `docs/design/visual-benchmark-and-design-system.md` v1.0. Quando este doc divergir do `docs/front-end-spec.md`, **o design system prevalece** — o FE Spec deve ser atualizado, não o contrário.
