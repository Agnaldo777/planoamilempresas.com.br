# PriceTable — HTML Semântico (Story 3.24 / FR52)

> Story 3.24 (FR52 PRD v1.3.1) | NFR9 WCAG 2.1 AA | Featured Snippet target

## Por que HTML semântico

Featured Snippet do Google para queries "plano amil tabela", "tabela amil 2026"
prefere `<table>` HTML nativo. Markup div/Grid não é parseado como tabela pelo
crawler. Concorrente `amilsaudebr.com.br` usa div/CSS Grid sem semântica — gap
explorável.

Acessibilidade (NFR9) também depende de markup semântico: screen readers anunciam
"tabela 6 colunas 10 linhas" e permitem navegação cell-by-cell apenas em
`<table>` real.

## Estrutura semântica obrigatória

```html
<table>
  <caption>Tabela Amil PME São Paulo — Atualizada em 04/2026</caption>
  <thead>
    <tr>
      <th scope="col">Plano</th>
      <th scope="col">00 a 18</th>
      <th scope="col">19 a 23</th>
      <!-- ... -->
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Bronze QC</th>
      <td>R$ 111,15</td>
      <td>R$ 150,94</td>
      <!-- ... -->
    </tr>
  </tbody>
  <tfoot>
    <tr><td colspan="N">Valores sujeitos a alteração.</td></tr>
  </tfoot>
</table>
```

### Regras

- `<caption>` SEMPRE — descritivo, primeiro filho do `<table>`
- `<th scope="col">` em todas as colunas do `<thead>`
- `<th scope="row">` no primeiro `<td>` de cada linha do `<tbody>` (identifica
  o plano)
- `<tfoot>` opcional para nota de rodapé (data atualização, disclaimer)
- NUNCA `<div role="table">`, NUNCA `display: grid` para emular tabela

## API do componente

```tsx
import { PriceTable, type PriceTableData } from '@/components/ui/PriceTable';

const data: PriceTableData = {
  caption: 'Tabela Amil PME São Paulo — Atualizada em 04/2026',
  faixaEtarias: ['00 a 18', '19 a 23', '24 a 28', /* ... */],
  planos: [
    {
      id: 'sp-bronze-qc',
      nome: 'Bronze QC',
      precos: { '00 a 18': 111.15, '19 a 23': 150.94, /* ... */ },
    },
    // ...
  ],
  footnote: 'Valores sujeitos a análise da operadora.',
};

<PriceTable data={data} />
```

### Backward compat (Story 6.1 legacy)

A signature antiga ainda funciona (deprecated, remoção planejada v2):

```tsx
<PriceTable
  planoNome="Bronze QC"
  precos={[
    { faixa_etaria: '00 a 18', preco: 111.15 },
    // ...
  ]}
/>
```

Internamente convertido para `PriceTableData` matriz.

## Estado vazio graceful

Se `data` ausente ou `data.planos` vazio:

```html
<div role="status">Tabela de preços indisponível no momento.</div>
```

A11y: `role="status"` permite screen reader anunciar mudança quando carregar.

## Responsividade

- **Desktop:** tabela tradicional zebra-striping (`hover:bg-sky-50`)
- **Mobile (≤768px):** wrapper `overflow-x-auto` permite scroll horizontal,
  markup permanece `<table>` (não muda HTML, apenas CSS)
- **Padrão CSS-only** (futuro): `display: block` no `<tbody>`/`<tr>` + `data-label`
  via `::before` para layout card-like — mantém markup semântico

Decisão atual: scroll horizontal é suficiente para MVP; pattern card-like fica
para Story 6.1 / 7.X quando UX (Uma) decidir.

## Paleta (Opção A)

- Header: `bg-teal-600 text-white`
- Linha header (row): `text-slate-900` + `bg-slate-50`
- Hover: `hover:bg-sky-50`
- Footer: `bg-slate-50 text-slate-600`
- Border: `border-slate-200`

NÃO usar `amil-blue` (legacy global removido).

## Zero JS client

Componente é **RSC** (server component) — não declara `'use client'`, sem
`useState`, sem `onClick`. Filtros/sort interativos serão escopo Story 6.1
extensão (com `'use client'` wrapper separado).

## Featured Snippet validation

DoD desta story: screenshot `Rich Results Test` mostrando "Table detected"
para uma página `/precos/[uf]/` quando integrada.

## Schema Table JSON-LD (opcional)

`mainEntity: { @type: "Table", about: "Tabela de preços Amil PME [Estado] [Ano]" }`
no `@graph` — implementação fica para integração com Story 3.23 quando pages
estaduais existirem.

## Referências

- Story 3.24: `docs/stories/3.24.tabelas-html-semanticas.story.md`
- Story 3.23 (AggregateOffer): `docs/architecture/aggregate-offer-strategy.md`
- Story 6.1 (PriceTable origem): `data/tabelas-amil.ts`
- WCAG 2.1 AA Tables: https://www.w3.org/WAI/tutorials/tables/
