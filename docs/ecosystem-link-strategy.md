# Estratégia de Ecossistema e Link Building — BeneficioRH

**Versão:** v1.0
**Data:** 2026-04-28
**Owner:** Aria (Architect) + Pax (PO)
**Status:** Proposed → aguarda ADR-009

---

## 1. Visão Geral

O portfólio digital da corretora BeneficioRH (SUSEP 201054484, CNPJ 14.764.085/0001-99) opera como um **ecossistema hub-and-spoke** com 1 hub master multi-operadora e N satélites especializados por operadora.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│       HUB MASTER (autoridade do portfólio)              │
│       planodesaudepj.com.br                             │
│       Multi-operadora • PJ • 131 páginas                │
│       Recebe backlinks orgânicos externos               │
│                                                         │
└──────────┬───────────┬─────────────┬────────────────────┘
           │           │             │
           ▼           ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌─────────────────┐
│  bradesco    │ │ planoamil    │ │  planosaude     │
│  saude       │ │ empresas     │ │  amil           │
│  empresas    │ │ .com.br      │ │  .com.br        │
│  .com.br     │ │              │ │                 │
│              │ │ Amil PJ      │ │ Amil amplo      │
│ Bradesco PJ  │ │ Fase 1       │ │ Fase 2          │
│              │ │              │ │ PJ+PF+adesão    │
│ NO AR        │ │ ~80% pronto  │ │ +dental         │
└──────────────┘ └──────────────┘ └─────────────────┘
```

---

## 2. Princípios

### 2.1 Hub concentra autoridade
O hub `planodesaudepj.com.br` é o destino primário de backlinks orgânicos externos (parcerias, guest posts, citações em portais de saúde, comparadores). Recebe a maior parte do investimento em link building.

### 2.2 Satélites recebem juice do hub
Cada satélite é linkado a partir do hub via página da operadora correspondente:
- `planodesaudepj.com.br/operadoras/amil/` → `planoamilempresas.com.br` (CTA "Site especializado em Amil")
- `planodesaudepj.com.br/operadoras/bradesco/` → `bradescosaudeempresas.com.br`

### 2.3 Satélites linkam de volta ao hub
Cada satélite tem no footer ou em `/sobre/` um link para o hub como "Para outras operadoras, visite [hub]".

### 2.4 Diferenciação obrigatória
Cada site tem conteúdo, design e dataset próprios. Não há cookie-cutter entre eles. Cada satélite ranqueia por mérito próprio em long-tail por operadora.

---

## 3. Mapa de Linkagem

### 3.1 HUB → SATÉLITES (link out)

| Origem (hub) | Destino (satélite) | Anchor sugerido | Posição |
|--------------|--------------------|-----------------| --------|
| `/operadoras/amil/` | `planoamilempresas.com.br` | "Conheça nosso site especializado em Amil empresarial" | CTA in-content |
| `/operadoras/amil/` | `planosaudeamil.com.br` | "Plano Amil para pessoa física, adesão ou dental" | CTA in-content |
| `/operadoras/bradesco/` | `bradescosaudeempresas.com.br` | "Site especializado em Bradesco Saúde empresarial" | CTA in-content |
| `/operadoras/[outras]/` | (futuros satélites) | — | — |

### 3.2 SATÉLITES → HUB (link back)

| Origem (satélite) | Destino (hub) | Anchor | Posição |
|-------------------|---------------|--------|---------|
| Cada satélite | `planodesaudepj.com.br` | "Plano de Saúde para PJ — comparar 10 operadoras" | Footer global |
| Cada satélite | `planodesaudepj.com.br/sobre/` | "Sobre a corretora BeneficioRH" | Página /sobre/ + footer |

### 3.3 SATÉLITE ↔ SATÉLITE (mesma operadora)

Os 2 satélites Amil têm escopo parcialmente sobreposto (`/empresarial/` aparece em ambos). Estratégia anti-canibalização:

| Caso | Solução |
|------|---------|
| `planoamilempresas.com.br/empresarial/` (Fase 1) e `planosaudeamil.com.br/planos/empresarial/` (Fase 2) | `<link rel="canonical">` da Fase 2 → Fase 1 (especialização vence) |
| `planoamilempresas.com.br/individual/` NÃO existe (foco PJ) | Sem conflito |
| `planosaudeamil.com.br/individual/` é exclusivo da Fase 2 | Sem conflito |

**Regra:** quando há sobreposição, o site **especializado** (mais focado) recebe canonical; o site **amplo** referencia o especializado.

### 3.4 SATÉLITE ↔ SATÉLITE (operadoras diferentes)

**NÃO** linkar diretamente. Bradesco e Amil não linkam entre si. Se for necessário, vai pelo hub (`bradescosaudeempresas.com.br` → `planodesaudepj.com.br/operadoras/amil/` → `planoamilempresas.com.br`).

**Motivo:** evitar aparência de PBN; cada operadora vive em seu silo de autoridade.

---

## 4. Estratégia Anti-PBN

Google penaliza redes de sites do mesmo dono que se linkam artificialmente. Mitigações:

| Mitigação | Implementação |
|-----------|---------------|
| **Conteúdo genuinamente diferente** | Cada site tem PRD, dataset, blog editorial e copy próprios. Auditoria periódica para evitar duplicate content cross-site |
| **Disclaimers visíveis** | Footer global em todos: "Operado por BeneficioRH (CNPJ 14.764.085/0001-99 • SUSEP 201054484). Outros sites: [hub] [bradesco] [amil empresas]" |
| **Backlinks externos genuínos** | Cada satélite recebe pelo menos 5-10 backlinks/mês de domínios independentes (guest posts, parcerias, citações). Não dependentes de links inter-portfólio |
| **Anchor text natural** | "Plano Amil empresarial" ✅ vs "click aqui para amil empresarial" ❌. Variar anchors. Evitar exact-match excessivo |
| **Hosting distribuído** | Cloudflare DNS distribui — sites não compartilham IP do mesmo data center Vercel |
| **Volumes próprios** | Cada satélite ranqueia por mérito (long-tail por operadora). Sem dependência total do hub |
| **Cross-domain canonical** | Apenas onde há sobreposição real (regra 3.3). Não usar canonical para "passar autoridade" |
| **NoFollow seletivo** | Footer "outros sites" pode usar `rel="nofollow"` se a contagem de links inter-portfólio ficar alta |

---

## 5. Compliance e Disclaimers

### 5.1 Em TODOS os sites

Footer global obrigatório:

```html
<footer>
  <p>
    Operado por <strong>BeneficioRH</strong> — corretor autorizado.<br>
    CNPJ 14.764.085/0001-99 · SUSEP 201054484<br>
    Site independente. Não substitui canais oficiais da operadora.
  </p>
  <nav>
    <a href="https://planodesaudepj.com.br" rel="me">Hub multi-operadora</a> ·
    <a href="https://bradescosaudeempresas.com.br" rel="me">Bradesco Saúde</a> ·
    <a href="https://planoamilempresas.com.br" rel="me">Amil Empresarial</a>
  </nav>
</footer>
```

### 5.2 Disclaimer ANS por operadora

Toda página de produto cita `Amil Assistência Médica Internacional S.A. (registro ANS nº 326305)` ou equivalente para Bradesco. Conforme NFR6 do PRD.

### 5.3 Disclaimer SUSEP

Conforme NFR7 do PRD. Em rodapé global.

### 5.4 Trademark

Conforme ADR-006 (URL-as-Trademark). Sem uso de logos oficiais. Identidade visual própria por satélite.

---

## 6. Schema.org `Organization` por site

Cada site declara `Organization` própria mas com `parentOrganization` apontando ao hub:

### Hub (planodesaudepj.com.br)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BeneficioRH",
  "url": "https://planodesaudepj.com.br",
  "alternateName": "Plano de Saúde PJ",
  "subOrganization": [
    { "@type": "Organization", "name": "BeneficioRH Bradesco", "url": "https://bradescosaudeempresas.com.br" },
    { "@type": "Organization", "name": "BeneficioRH Amil Empresas", "url": "https://planoamilempresas.com.br" },
    { "@type": "Organization", "name": "BeneficioRH Amil Saúde", "url": "https://planosaudeamil.com.br" }
  ],
  "identifier": [
    { "@type": "PropertyValue", "name": "CNPJ", "value": "14.764.085/0001-99" },
    { "@type": "PropertyValue", "name": "SUSEP", "value": "201054484" }
  ]
}
```

### Cada satélite
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BeneficioRH Amil Empresas",
  "url": "https://planoamilempresas.com.br",
  "parentOrganization": {
    "@type": "Organization",
    "name": "BeneficioRH",
    "url": "https://planodesaudepj.com.br"
  },
  "identifier": [
    { "@type": "PropertyValue", "name": "CNPJ", "value": "14.764.085/0001-99" },
    { "@type": "PropertyValue", "name": "SUSEP", "value": "201054484" }
  ]
}
```

---

## 7. Posicionamento por Site

| Site | Foco SEO primário | Keywords core | Público-alvo |
|------|-------------------|---------------|--------------|
| **planodesaudepj.com.br** (hub) | Head terms PJ multi-operadora | "plano de saúde PJ", "plano empresarial", "comparar planos PJ" | RH, sócios, comparadores, head-of-procurement |
| **bradescosaudeempresas.com.br** | Head + cauda Bradesco PJ | "bradesco saúde empresarial", "plano bradesco PJ", "bradesco empresas" | Decisores fiéis a Bradesco, ticket alto |
| **planoamilempresas.com.br** (Fase 1) | Head + cauda Amil PJ | "amil empresarial", "plano amil PJ", "amil PME", "amil empresarial [cidade]" | RH/sócios fiéis a Amil PJ |
| **planosaudeamil.com.br** (Fase 2) | Head + long-tail Amil amplo | "plano de saúde amil", "tabela amil", "amil [cidade]", "amil one", "amil black", "amil por adesão" | PF + PJ + adesão; mobile-heavy |

---

## 8. Cronograma de Ativação

### Atual (2026-04-28)
- ✅ `bradescosaudeempresas.com.br` no ar
- ⏳ `planodesaudepj.com.br` em desenvolvimento (hub)
- ⏳ `planoamilempresas.com.br` em desenvolvimento (Fase 1, Story 1.1 concluída)
- 🔮 `planosaudeamil.com.br` planejado (Fase 2, fork da Fase 1)

### 60 dias
- ✅ `planoamilempresas.com.br` no ar (MVP Fase 1)
- ⏳ Hub linka para Bradesco + Amil PJ
- ⏳ Bradesco e Amil PJ linkam de volta para hub

### 120 dias
- ✅ `planosaudeamil.com.br` em dev (Fase 2)
- ⏳ Schema cross-site `parentOrganization` ativo
- ⏳ Backlinks externos para hub (R$ 8-15k/mês iniciado)

### 180 dias
- ✅ Todo ecossistema interligado
- ✅ Disclaimers, compliance, anti-PBN auditado
- ⏳ Avaliar ROI por site (GSC + GA4)

---

## 9. KPIs do Ecossistema

> **Sem inventar % de conversão.** Conforme `feedback_claims_metricas.md` em memória — preferir A/B test e honestidade.

Indicadores qualitativos a monitorar:
- Posições GSC por keyword core de cada site
- Páginas indexadas por site
- Backlinks externos genuínos (Ahrefs/SEMRush)
- CTR em SERPs
- Core Web Vitals
- Leads por satélite × leads pelo hub
- Origem do lead (qual site converteu)

Definir baselines após 30 dias de cada lançamento. Não claimar metas sem base.

---

## 10. Próximos Passos

| # | Ação | Owner | Prazo |
|---|------|-------|-------|
| 1 | Registrar **ADR-009** confirmando esta estratégia | Aria | 1 semana |
| 2 | Atualizar PRD v1.2.4 → v1.3 com integração ecossistema | Morgan | 2 semanas |
| 3 | Atualizar Story 1.4 (canary) para incluir disclaimer cross-site | Pax | 2 semanas |
| 4 | Implementar footer global com schema `parentOrganization` | Dex | Story 1.5 |
| 5 | Configurar Cloudflare DNS para hub + 2 satélites Amil | Gage | Story 1.2 |
| 6 | Auditoria anti-duplicate content periódica (mensal) | Quinn | contínuo |

---

## Referências

- `docs/decisions/adr-006-url-as-trademark-policy.md`
- `docs/research/competitors/06-tabela-comparativa-concorrentes.md`
- `docs/research/competitors/08-acertos-erros-detalhado.md`
- Memória `project_satelites_amil_caminho_c.md`
- Memória `project_plano_saude_pj_hub.md`
- Memória `project_bradesco_saude_site.md`
