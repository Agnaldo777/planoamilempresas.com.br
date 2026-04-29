# ADR-009: Estratégia de ecossistema hub-and-spoke (BeneficioRH)

**Status:** ✅ **Accepted** — co-signed pelo stakeholder em 2026-04-28
**Data:** 2026-04-28
**Autor:** Aria (Architect) — Synkra AIOS
**Decisores:** Aria (Architect) · Pax (PO) · Agnaldo Silva (stakeholder)
**Co-sign:** Agnaldo Silva (stakeholder) — 2026-04-28 via decisão registrada em chat
**Estende:** ADR-006 (URL-as-Trademark Policy) — adiciona regras de linkagem inter-domínios

---

## Context

O portfólio digital BeneficioRH (Agnaldo Silva — SUSEP 201054484 — CNPJ 14.764.085/0001-99) está crescendo de site único para ecossistema multi-domínio:

| Papel | Domínio | Status | Observação |
|---|---|---|---|
| **Hub master** | `planodesaudepj.com.br` | PRD v1.0 pronto, 131 páginas | Multi-operadora (10 ops) |
| **Satélite Bradesco** | `bradescosaudeempresas.com.br` | No ar | Next.js + Vercel + Cloudflare |
| **Satélite Amil Fase 1** | `planoamilempresas.com.br` | ~80% pronto (este projeto) | PJ exclusivo |
| **Satélite Amil Fase 2** | `planosaudeamil.com.br` | Planejado (ADR-008) | PJ + PF + adesão + dental |

Esse modelo levanta três riscos arquiteturais que precisam de decisão formal antes de Fase 2 entrar em build:

1. **Risco de classificação como PBN (Private Blog Network)** pelo Google. Múltiplos sites do mesmo dono linkando entre si com conteúdo similar é padrão clássico de spam — penalização manual ou algorítmica destruiria o portfólio inteiro.
2. **Tensão autoridade vs especialização:** hub deve concentrar autoridade (backlinks externos, brand search) mas satélites devem ranquear para keywords específicas por operadora. Sem regra clara, autoridade se dilui ou satélites brigam com hub em head terms.
3. **Canibalização entre satélites Amil** (Fase 1 PJ × Fase 2 amplo) onde escopo se sobrepõe — especialmente `/empresarial/` na Fase 2 vs raiz da Fase 1. Sem regra de canonical, Google escolhe arbitrariamente e ambas perdem.

`docs/ecosystem-link-strategy.md` v1.0 propõe um modelo formal hub-and-spoke. Este ADR registra a decisão arquitetural correspondente para que vire constitution do portfólio, não só guideline solto.

## Decision

**Adoção formal do modelo hub-and-spoke conforme `docs/ecosystem-link-strategy.md` v1.0**, com 7 regras explícitas:

### 1. Hub recebe backlinks externos

`planodesaudepj.com.br` é o destino preferencial de qualquer outreach, parceria, guest post, citação em mídia. Satélites NÃO recebem outreach direto coordenado pelo BeneficioRH (recebem backlinks orgânicos genuínos quando ranqueiam, mas não são alvo de campanha).

### 2. Hub linka satélites via páginas de operadora

Páginas `/operadoras/[op]/` no hub linkam para o satélite correspondente como "site especializado da operadora X". Anchor text natural variado (não exato-match repetido). Link `dofollow`, sem `nofollow` artificial.

### 3. Satélites linkam de volta ao hub via footer global

Footer global obrigatório em todos os satélites contém link "Comparar com outras operadoras → planodesaudepj.com.br". Único link cross-domain de saída no satélite (exceto canais oficiais de operadora — ANS, etc.). `dofollow`.

### 4. Cross-domain canonical entre satélites de mesma operadora

Quando há sobreposição de escopo entre satélites da mesma operadora (Fase 2 Amil amplo × Fase 1 Amil PJ em `/empresarial/`), aplicar `<link rel="canonical">` cross-domain apontando para a versão mais especializada:

```html
<!-- planosaudeamil.com.br/empresarial/sao-paulo -->
<link rel="canonical" href="https://www.planoamilempresas.com.br/sao-paulo" />
```

A Fase 1 (mais especializada em PJ) ganha o canonical quando o conteúdo é equivalente. Casos específicos definidos por revisão obrigatória em PR (ver Consequences).

### 5. Satélites de operadoras DIFERENTES não linkam entre si

`bradescosaudeempresas.com.br` NÃO linka para `planoamilempresas.com.br` diretamente, e vice-versa. Tráfego cross-operadora passa pelo hub. Mantém topologia hub-and-spoke pura — evita malha que classificaria como PBN.

### 6. Schema.org `Organization` com `parentOrganization`

Todos os satélites declaram em JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BeneficioRH — Plano Amil Empresas",
  "parentOrganization": {
    "@type": "Organization",
    "name": "BeneficioRH",
    "url": "https://www.planodesaudepj.com.br"
  },
  "taxID": "14.764.085/0001-99"
}
```

Sinaliza ao Google relação legítima de portfólio corporativo (não rede oculta).

### 7. Footer global obrigatório

Todos os sites do portfólio (hub + satélites) renderizam footer global com:

- CNPJ 14.764.085/0001-99
- SUSEP 201054484
- Lista pública dos sites do portfólio (transparência anti-PBN)
- Disclaimer de corretor (alinhado ADR-006 mitigação 1)

### Anti-PBN — pilares de defesa

| Pilar | Implementação |
|---|---|
| Conteúdo único genuíno | Cada satélite tem ângulo editorial próprio; zero copy-paste cross-site |
| Anchor texts naturais | Variação obrigatória; nunca exato-match repetido em bulk |
| Backlinks externos genuínos por site | Outreach concentrado no hub, mas satélites podem captar links orgânicos próprios |
| Hosting/IPs distribuídos | Cloudflare DNS + Vercel edge — IPs distribuídos por design |
| Transparência | Footer global lista todos os sites do portfólio publicamente |

## Consequences

### Positivas

- ✅ **Hub concentra autoridade** (backlinks + brand search + outreach) e distribui via internal links para satélites — modelo PageRank clássico.
- ✅ **Satélites ranqueiam para long-tail por operadora** (`amil empresas sp`, `bradesco saúde rj`, etc.) sem brigar com hub em head terms (`plano de saúde empresarial`).
- ✅ **Compliance forte:** disclaimers + CNPJ + SUSEP + ANS por operadora visíveis em todos os sites — defesa em profundidade frente a questionamento regulatório ou de operadora.
- ✅ **Schema.org `parentOrganization`** sinaliza portfólio legítimo ao Google — diferencia de PBN oculta.
- ✅ **Cross-domain canonical resolve canibalização Amil** sem perda de URL especializada — Fase 2 amplo segue indexável em escopo próprio (PF, adesão, dental), Fase 1 PJ segue dona do `/empresarial/`.
- ✅ **Pattern reproduzível:** quando entrar 4º, 5º satélite (SulAmérica, Unimed, etc.), as 7 regras se aplicam idênticas.

### Negativas / Mitigações

- ⚠️ **Manutenção de footer global compartilhado** — sincronizar em N sites é fricção operacional e fonte de drift.
  - **Mitigação:** package monorepo `@benef/footer-global` versionado + GitHub Actions auto-PR para atualizações cross-repo. Decisão de empacotamento deferida para Story de implementação (post-ADR).
- ⚠️ **Auditoria periódica de duplicate content cross-site** necessária — drift de conteúdo entre Fase 1 e Fase 2 Amil pode reintroduzir canibalização que canonical não cobre.
  - **Mitigação:** Quinn (QA) executa auditoria mensal cross-domain; ferramentas: Screaming Frog list mode + comparação manual em páginas-chave.
- ⚠️ **Cross-domain canonical exige rigor** — canonical errado = perda de juice irrecuperável a curto prazo.
  - **Mitigação:** revisão obrigatória em PR de qualquer página com canonical cross-domain; checklist no template de PR; CI lint regra simples (canonical externo só para domínios do portfólio whitelist).
- ⚠️ **Risco residual de classificação como PBN** persiste até Google validar empiricamente o portfólio.
  - **Mitigação:** os 5 pilares anti-PBN acima + monitoramento Search Console mensal por site (queda anômala de impressões = sinal de revisão manual).
- ⚠️ **Decisão depende de stakeholder co-sign** antes de virar política vinculante para Fase 2.
  - **Mitigação:** status Proposed; Story 1.x de Fase 2 fica gated até este ADR ir para Accepted.

## Alternatives Considered

| Opção | Veredito | Por quê |
|---|---|---|
| **A) Hub-and-spoke formal (7 regras)** | ✅ **Escolhido (Proposed)** | Topologia limpa; resolve PBN/canibalização/dilution; pattern reproduzível para futuros satélites |
| B) Sites totalmente isolados (sem cross-link) | ❌ Rejeitado | Desperdiça oportunidade de fluxo de autoridade hub→satélite; satélites começam do zero em PageRank |
| C) Malha total (todos linkam todos) | ❌ Rejeitado | Padrão clássico de PBN; risk de penalização manual alto; viola princípio de topologia |
| D) Hub-only (sem satélites) | ❌ Rejeitado | Perde moat de especialização por operadora; concorrentes com domínios de match exato (`amilempresas`, `bradescosaude*`) ganham long-tail por default |
| E) Consolidar tudo no hub via subdomínios (`amil.planodesaudepj.com.br`) | ❌ Rejeitado | Perde valor de domínio de match exato (URL-as-trademark — ADR-006); Bradesco satélite já no ar com domínio próprio inviabiliza retroativamente |

## Gating

- **Fase 2 (`planosaudeamil.com.br`)** não inicia build até este ADR ir para Status `Accepted` (stakeholder co-sign).
- **Footer global package** depende deste ADR Accepted para definir escopo final do conteúdo compartilhado.
- **Fase 1 (`planoamilempresas`)** não bloqueia — já implementa items #6 e #7 nativamente; #3 e #4 entram em Story dedicada pós-ADR.

## Não substitui — estende

Este ADR **estende** ADR-006 (URL-as-Trademark Policy) com regras de linkagem inter-domínios que ADR-006 não cobria (ADR-006 trata de uso de marca em URL do mesmo domínio; ADR-009 trata de relação entre domínios do portfólio). Não revoga ADR-006.

## References

- `docs/ecosystem-link-strategy.md` v1.0 — documento operacional detalhado das 7 regras
- `docs/decisions/adr-006-url-as-trademark-policy.md` — base estendida (mitigação 1 alinha com regra #7)
- `docs/decisions/adr-008-stack-unificada-nextjs-satelites-amil.md` — Fase 2 stack (consumidor direto deste ADR)
- Memória global `project_plano_saude_pj_hub.md` — hub master
- Memória global `project_bradesco_saude_site.md` — satélite Bradesco no ar (caso de teste das regras)
- Memória global `project_satelites_amil_caminho_c.md` — Fase 2 contexto (stack já decidida em ADR-008)
- Memória global `feedback_claims_metricas.md` — diretriz de não claim de métricas sem fonte (aplicada neste ADR — sem números de tráfego/ranking inventados)
