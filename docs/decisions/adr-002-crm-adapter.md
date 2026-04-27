# ADR-002: CRM Adapter Pattern + Implementação Primária

**Status:** ✅ **Updated** (atualizado em 2026-04-26 — incorpora decisão Story 1.0 Bloco 3.1)
**Decisão:** **`ClintAdapter` como implementação primária** (vertical brasileiro corretoras de seguros) com adapter pattern preservando flexibilidade futura para RD Station / HubSpot / Pipedrive
**Owners:** Morgan (PM) · Aria (Architect) · Agnaldo (stakeholder)
**Última atualização:** 2026-04-26 (PRD v1.2.2)

---

## Contexto

O site precisa enviar leads do formulário de cotação (Story 4.3) e da calculadora (Story 6.3) para o CRM do corretor, com:

- Latência baixa (≤2s p95 incluindo API externa)
- Fallback resiliente (queue + retry exponencial via Vercel Cron + Upstash Redis) se CRM falhar
- Tagging padronizado para atribuição de origem (organic, whatsapp, calculadora) + porte + CNAE
- Trocabilidade futura sem refatoração massiva (CRM provider pode mudar em Phase 2 conforme escala)

A Story 1.0 (2026-04-24) fechou a decisão do stakeholder Agnaldo Silva: ele já usa **Clint CRM** (vertical brasileiro especializado em corretoras de seguros) — manter o que ele já opera reduz fricção operacional e curva de aprendizado.

## Opções Consideradas

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **Clint CRM** | Stakeholder já opera, vertical para corretoras (tags pré-definidas para apólice, segurado, etc.), suporte BR | API menos documentada publicamente; ecossistema menor que players globais | ✅ **Primária (MVP)** |
| RD Station | Maduro no BR, API bem documentada, free tier | Não-vertical para corretoras; mais marketing-centric | Backup futuro |
| HubSpot | Ecossistema enorme, integrações abundantes | Pricing escala rápido; over-engineered para MVP | Backup futuro |
| Pipedrive | Sales-pipeline focado, API simples | Sem vertical seguros; curva de migração se trocar | Backup futuro |

## Decisão

**Adapter pattern com `ClintAdapter` como implementação primária do MVP**, preservando interface comum para troca futura.

### Arquitetura

```
src/lib/crm/
├── types.ts              # CRMAdapter interface + Lead type
├── index.ts              # factory(provider) — aceita CRM_PROVIDER=clint (default)
├── clint.ts              # ClintAdapter — implementação primária MVP
├── rd-station.ts         # RDStationAdapter (stub para futuro)
├── hubspot.ts            # HubSpotAdapter (stub para futuro)
└── pipedrive.ts          # PipedriveAdapter (stub para futuro)
```

### Status de implementações

| Adapter | Status | Quando |
|---|---|---|
| `ClintAdapter` | **primária — MVP** | Story 4.3 |
| `RDStationAdapter` | stub (backup futuro) | Phase 2 se necessário |
| `HubSpotAdapter` | stub (backup futuro) | Phase 2 se necessário |
| `PipedriveAdapter` | stub (backup futuro) | Phase 2 se necessário |

### Factory

```ts
// src/lib/crm/index.ts
export function getCRM(): CRMAdapter {
  const provider = process.env.CRM_PROVIDER ?? 'clint';
  switch (provider) {
    case 'clint': return new ClintAdapter();
    case 'rd-station': return new RDStationAdapter();
    case 'hubspot': return new HubSpotAdapter();
    case 'pipedrive': return new PipedriveAdapter();
    default: throw new Error(`Unknown CRM provider: ${provider}`);
  }
}
```

`factory.ts` aceita `CRM_PROVIDER=clint` (default), permitindo override por env var em casos de teste/staging.

### Spike técnico Clint API (Story 1.0c — pendente)

Antes de @dev (Dex) implementar `ClintAdapter`, @architect (Aria) precisa coletar do stakeholder (Adendum 3 do `docs/stakeholder-inputs.md`):

1. URL da instância Clint (`https://<empresa>.clint.com.br` ou similar)
2. Documentação da API Clint (link/PDF)
3. API token gerado (guardar em Vercel Environment Variable `CLINT_API_TOKEN`)
4. Tags específicas para leads do site (`origem-site`, `plano-amil`, `porte-pme`) — confirmar ou definir em Story 4.3

### Tags padrão a enviar ao Clint

- `plano-amil-empresarial` (sempre)
- Porte: `porte-2-10`, `porte-11-30`, `porte-31-100`, `porte-101-200`
- Origem: `source-organic`, `source-whatsapp`, `source-direct`, `source-calculadora`
- CNAE quando disponível (via auto-CNPJ Story 4.2)

## Consequências

**Positivas:**
- Stakeholder já opera Clint — zero curva de aprendizado operacional
- Adapter pattern preserva opcionalidade futura sem refatoração massiva
- Vertical brasileiro corretoras = tags pré-definidas alinhadas com workflow real

**Negativas / Mitigações:**
- API Clint menos documentada publicamente → spike técnico em Story 1.0c mitiga
- Vendor lock-in operacional → adapter pattern + stubs para 3 alternativas reduzem risco

## Referências

- `docs/stakeholder-inputs.md` Bloco 3.1 + Adendum 3 — decisão + spike pendente
- `docs/prd.md` v1.2.2 Story 4.3 — implementação
- `docs/prd.md` v1.2.2 FR6 — requirement
