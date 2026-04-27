# ADR-006: URL-as-Trademark Policy (Network Slugs)

**Status:** 📝 **Proposed** — pending advogado revisor co-sign (Story 2.4 deliverable)
**Data:** 2026-04-26 (Sprint Change Proposal v1.2.3 §3.2)
**Última atualização:** 2026-04-26 (refinamento Story 7.0c com precedentes empíricos)
**Autor:** Aria (Architect) — Synkra AIOS
**Co-sign pendente:** advogado revisor (Story 2.4) · Agnaldo (stakeholder)
**Anexo:** `docs/decisions/legal-precedents-corretoras-amil.md` — pesquisa empírica de precedentes
**Legal review packet:** `docs/legal/legal-review-packet-adr-006.md` — pacote auto-contido para advogado

---

## Context

O Epic 7 (Programmatic SEO Rede Credenciada) propõe ~286 URLs no padrão `/rede/[rede-slug]/[uf]` para Cluster E (rede × UF — busca de pre-purchase qualificado, ex: "amil one s750 onde aceita SP"). Essas URLs incluem nomes de produto Amil canônicos:

- `/rede/amil-s750-qp/sp` (AMIL S750 QP)
- `/rede/black/rj` (BLACK)
- `/rede/adesao-ouro-mais/df` (ADESÃO OURO MAIS)
- ... (11 redes ativas no dataset 2026-04-26)

Combinado com URLs UF/município/bairro (~10.000+ URLs), o site terá **uso massivo de marca Amil em URLs**, expandindo a superfície já estabelecida pelo NFR8 (uso do termo "Amil" em texto). Isso levanta risk legal:

- Marca registrada Amil pode ser interpretada como uso comercial não autorizado
- Mesmo sendo corretor autorizado a intermediar, "uso de marca em URL" tem precedente legal mais ambíguo que "uso em texto"

## Decision

**Caminho B: slugs canônicos (`amil-s750-qp`) + 5 mitigações + plano de contingência ADR-004.**

### Slug rules

```ts
// src/lib/operadoras/amil/slugs.ts (a ser criado em Story 7.1)
export const REDE_SLUGS: Record<RedeAmilNome, string> = {
  'AMIL ONE S6500 BLACK QP': 'amil-one-s6500-black-qp',
  'AMIL S750 QP': 'amil-s750-qp',
  'AMIL S580 QP': 'amil-s580-qp',
  'AMIL S450 QP': 'amil-s450-qp',
  'AMIL S450 QC': 'amil-s450-qc',
  'AMIL S380 QP': 'amil-s380-qp',
  'AMIL S380 QC': 'amil-s380-qc',
  'BLACK': 'black',
  'ADESÃO OURO MAIS': 'adesao-ouro-mais',
  'ADESÃO BRONZE RJ': 'adesao-bronze-rj',
  'ADESÃO BRONZE SP': 'adesao-bronze-sp',
}
```

Slugs preservam nome canônico do produto Amil → match exato em busca SEO. Cluster E mantém moat.

### 5 Mitigações obrigatórias

1. **Disclaimer em footer + topo de cada página de rede:**
   > Corretor autorizado a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº 326305). Este site é independente; não substitui canais oficiais Amil.

2. **Schema markup `Organization` com atribuição clara:**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Organization",
     "name": "BeneficioRH (corretor)",
     "sameAs": ["https://www.amil.com.br"]
   }
   ```
   Rich snippet no Google deixa explícito que `amil.com.br` é o canal oficial.

3. **Sem logo Amil oficial em qualquer página** (já em NFR8); só texto "Amil" sem trade dress.

4. **Plano de contingência ADR-004 acionável em ≤24h:**
   - Domínio-ponte `planosaudeempresas.com.br` registrado e DNS configurado (Story 1.2a)
   - Em caso de cease & desist: redirect 301 mass do `planoamilempresas.com.br` para domínio-ponte
   - Conteúdo permanece indexável; só URL canônica muda
   - Resposta pré-aprovada com advogado em `docs/legal/domain-contingency-plan.md` (Story 2.4 deliverable)

5. **Pre-emptive outreach Amil Compliance (opcional, decisão stakeholder pós-Story 2.4):**
   - Carta formal ao departamento de Compliance Amil notificando atividade de corretor + uso de URL
   - Cria audit trail de boa-fé caso questionamento futuro
   - Decisão de Agnaldo após advogado revisor avaliar risk

## Consequences

### Positivas

- ✅ **SEO moat preservado**: slug canônico permite match exato em pesquisas qualificadas (Cluster E é ~5-8% CR estimado em hipóteses internas — ver `_internal/conversion-hypotheses-rede-credenciada.md`)
- ✅ **Precedente de mercado** (verificado empiricamente em `legal-precedents-corretoras-amil.md`):
  - 8+ corretoras autorizadas usam "amil" em domínio inteiro (`amilbhsaude.com.br`, `amilsa.com.br`, `amilsauderj.com.br`, `corretoresamil.com.br`, `planosamilempresarial.com.br`, etc.)
  - 10+ corretoras usam "amil-empresarial" ou variações em path (`garantiaseg.com.br/plano-de-saude/amil-empresarial/`, `simetriaplanosdesaude.com.br/amil-planos-de-saude/`, etc.)
  - ZERO precedentes públicos de cease & desist Amil → corretora autorizada
  - Slug com nome ESPECÍFICO de produto (`/rede/amil-s750-qp/sp`) é pioneirismo — moat SEO mais forte; risk marginal mitigado pelas 5 medidas
  - Doutrina aplicável: uso descritivo de boa-fé (Lei 9.279/96 LPI); precedente análogo de revendedoras Apple usando "iPhone 15 Pro Max" em URL
- ✅ **NFR8 coerente**: PRD v1.2.2 já assumiu risk de uso de marca em texto (opção 🅲️ + 5 mitigações Story 1.0); estender para URL slug é continuidade lógica
- ✅ **ADR-004 contingência existe**: domínio-ponte minimiza dano em ≤24h se necessário

### Negativas / Mitigações

- ⚠️ **Risk legal real** (cease & desist Amil): Severidade Alta, Probabilidade Baixa-Média
  - **Mitigação**: 5 mitigações acima; advogado revisor co-sign antes de Story 7.7 ir para SSG
- ⚠️ **Decisão depende de Story 2.4 (validação jurídica)**: bloqueia Story 7.7 indiretamente
  - **Mitigação**: outras 10 stories Epic 7 (UF/município/bairro/prestador/tipo) **NÃO** dependem deste ADR — podem rodar em paralelo
- ⚠️ **Pre-emptive outreach pode acelerar conflito**: notificar Amil pode disparar cease & desist preventivo
  - **Mitigação**: decisão deferida ao stakeholder + advogado revisor; default é NÃO notificar até Amil questionar

## Alternatives Considered

| Opção | Veredito | Por quê |
|---|---|---|
| **B) Slugs canônicos + 5 mitigações + ADR-004** | ✅ **Escolhido** | Preserva SEO moat (Cluster E + match exato); precedente de mercado; NFR8 coerência; contingência viável |
| A) Slugs neutros (`/rede/premium-s750/sp`) | ❌ Rejeitado | Destrói match exato em "amil s750 SP"; perde Cluster E sem evidência de risk superior; rebrand sem ROI |
| C) Híbrido sem prefix "AMIL" (`/rede/s750-qp/sp`) | ❌ Rejeitado | Misturar pior dos dois — perde sinal SEO E adiciona ambiguidade ("s750" sem contexto) |
| D) Bloquear /rede/[rede-slug]/[uf] do MVP, esperar autorização Amil formal | ❌ Rejeitado | Atrasa moat por 6+ meses; precedente de mercado mostra que autorização raramente é dada antes de tração; risk de zero produto |

## Gating

- **Story 7.7 (Cluster E rede × UF SSG)** está **bloqueada** até este ADR ter Status `Accepted` (advogado revisor co-sign).
- **Outras stories Epic 7 (7.1-7.6, 7.8-7.10)** não dependem deste ADR — podem rodar em paralelo.

## References

- `docs/sprint-change-proposal-v1.2.3.md` §3.2 — decisão original
- `docs/decisions/legal-precedents-corretoras-amil.md` — **pesquisa empírica de precedentes** (anexo deste ADR)
- `docs/legal/legal-review-packet-adr-006.md` — **pacote auto-contido para advogado revisor**
- `docs/prd.md` v1.2.4 Story 7.7 — implementação Cluster E
- `docs/prd.md` v1.2.4 Story 2.4 — validação jurídica + advogado revisor (deliverable de mitigation 4)
- `docs/decisions/adr-004-dns-strategy.md` — domínio-ponte contingência
- PRD v1.2.2 NFR8 — uso de marca Amil (texto)
- Lei nº 9.279/96 (LPI) — uso descritivo de boa-fé
- INPI: https://busca.inpi.gov.br/pePI/ (verificação de marca Amil)
- ANS: registro operadora 326305 (Amil)
- Memory `project_amil_rede_credenciada_powerbi.md` — gap conhecido + 11 redes ativas
