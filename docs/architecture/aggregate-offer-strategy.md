# AggregateOffer Strategy — Schema Per-Estado

> Story 3.23 (FR51 PRD v1.3.1) | ADR-006 + ADR-008 + ADR-009

## Por que per-estado vence nacional

Concorrente `amilsaudebr.com.br` declara `AggregateOffer` schema apenas **nacional**
(R$ 102 — R$ 3.500), sinalizando ao Google range único válido para qualquer query.
A SERP "preço plano amil são paulo" e "preço plano amil minas gerais" deveriam
mostrar ranges diferentes, refletindo a realidade tabular Amil PME (que varia por
UF devido coparticipação 30% vs 40% e ajustes regionais).

Nossa estratégia: declarar `AggregateOffer` **por UF**, derivado dinamicamente do
dataset `data/tabelas-amil.ts`. Resultado:

- 14+ páginas estaduais com schema rich, granularidade que o Google premia
- Captura de SERP "preço plano amil [estado]" com ranges específicos
- Moat de diferenciação difícil de replicar (concorrentes precisam de tabelas
  similares por UF + dataset compatível)

## API do helper

```ts
import { buildAggregateOfferNode } from '@/lib/schema/aggregate-offer';

const node = buildAggregateOfferNode({
  uf: 'SP',
  lowPrice: 111.15,
  highPrice: 2717.28,
  offerCount: 80,
});
// → { "@type": "AggregateOffer", priceCurrency: "BRL", ... }
```

### Caller: integração com `buildSchemaGraph`

```ts
import { buildSchemaGraph } from '@/lib/schema/build-graph';
import sp from '@/data/aggregate-offers/sp.json';

const graph = buildSchemaGraph({
  type: 'plano',
  breadcrumb: [...],
  aggregateOffer: { uf: 'SP', lowPrice: sp.lowPrice, highPrice: sp.highPrice, offerCount: sp.offerCount },
});
```

`buildSchemaGraph` injeta o nó AggregateOffer ao lado de Organization + WebSite,
mantendo um único `@graph` por página.

## Pipeline de fixtures

`scripts/seed-aggregate-offer-fixtures.mjs` parseia `data/tabelas-amil.ts` e gera
`data/aggregate-offers/[uf].json` com `lowPrice`, `highPrice`, `offerCount` e
`planoCount`. Rodar quando:

1. Após atualização mensal de `tabelas-amil.ts` (Story 6.6 pipeline)
2. Antes de build SSG das pages estaduais `/precos/[uf]/`

```bash
node scripts/seed-aggregate-offer-fixtures.mjs
```

## Renovação anual

`priceValidUntil` é calculado dinamicamente via `getCurrentYear()` (Story 3.22).
Ao bumpar `NEXT_PUBLIC_CURRENT_YEAR` em Vercel + redeploy, o ano rola automático
em todos os schemas. Zero edição manual.

`validFrom`/`validThrough` quando necessário podem ser derivados do mesmo helper.

## Compliance

- **FR51:** lowPrice/highPrice/offerCount/BRL/InStock derivados do dataset ✓
- **FR54:** `seller` é referência `@id` à Organization (BeneficioRH), não duplica nó ✓
- **NFR17:** `priceCurrency: BRL` único + `addressCountry: BR` ✓
- **NFR21:** schema coverage mínima — toda página estadual indexável tem AggregateOffer
- **ADR-006:** Amil é trademark — só aparece em `Product.brand`, nunca em `seller`
- **NFR6:** schema NÃO substitui disclaimer "Valores sujeitos a análise..."

## Validação

1. **Schema.org Rich Results Test** (manual, DoD): screenshot 3 UFs (SP, RJ, MG)
   mostrando "Product / AggregateOffer detected"
2. **CI** `scripts/audit-schema-organization.mjs` mantém 0 violações
3. **Tests unitários** `lib/schema/__tests__/aggregate-offer.test.mjs` cobrem 18+
   cenários incluindo edge cases (UF inválida, range invertido, offerCount ≤ 0)

## Out of scope desta story

- AggregateOffer per-cidade (granularidade extrema, não justifica schema overhead)
- AggregateOffer cross-operadora (escopo Amil)
- Real-time price update via API (dataset estático mensal — Story 6.6)
- Promoções temporárias com `validThrough` curto (não MVP)

## Quando excluir AggregateOffer de uma página

- UF sem dataset em `tabelas-amil.ts` (6 UFs ainda pendentes)
- Página master `/precos/` (nacional) — AggregateOffer agregado nacional como
  fallback (FR51 NFR21)
- Páginas onde produtos premium (Black, Amil One) não têm price público —
  `<PrecoSobConsulta>` exclui esses do offerCount

## Referências

- Story 3.23 (FR51): `docs/stories/3.23.aggregate-offer-schema-per-estado.story.md`
- Story 3.22 (currentYear): `lib/seo/title.ts`
- Story 3.26 (Organization BeneficioRH): `lib/schema/organization.ts`
- Story 6.1 (PriceTable + tabelas-amil.ts): `data/tabelas-amil.ts`
- ADR-006 (URL-as-Trademark): brand = Amil, Organization = BeneficioRH
