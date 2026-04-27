# Legal Review Packet — ADR-006 URL-as-Trademark Policy

**Destinatário:** Advogado revisor da Story 2.4
**Solicitante:** Agnaldo Silva (corretor SUSEP 201054484, BeneficioRH) via projeto `planoamilempresas.com.br`
**Data:** 2026-04-26
**Tempo estimado de review:** ≤1h
**Output esperado:** assinatura formal (Status `Accepted` ou `Rejected`) do `docs/decisions/adr-006-url-as-trademark-policy.md`
**Pacote auto-contido:** este documento + 3 anexos referenciados no final

---

## 1. Contexto executivo (5 minutos de leitura)

### 1.1 O projeto

`planoamilempresas.com.br` é site SEO operado por corretor autorizado Amil (SUSEP 201054484, BeneficioRH) com objetivo de captar leads PJ para planos de saúde Amil empresariais via:

- 15 cornerstones editoriais
- 600 landing pages programáticas (CNAE × cidade × porte)
- 742 páginas-cidade simples
- **~10.500 URLs SEO de rede credenciada Amil** (9.325 prestadores em 26 UFs)

### 1.2 O ponto que requer parecer jurídico

Dentro do volume de 10.500 URLs de rede credenciada, ~286 URLs seguem o padrão:

```
/rede/[slug-de-produto-amil]/[uf]
```

Exemplos:

```
/rede/amil-s750-qp/sp
/rede/amil-one-s6500-black-qp/rj
/rede/black/df
/rede/adesao-ouro-mais/sp
```

**Pergunta:** o uso de **slug com nome específico de produto Amil em URL pública** por corretor autorizado constitui:

- (a) Uso descritivo de boa-fé permitido pela Lei 9.279/96 (LPI)?
- (b) Uso comercial não autorizado de marca registrada?
- (c) Híbrido — depende de contexto, disclaimers e mitigações?

### 1.3 O que já está decidido (NÃO objeto de parecer)

- ✅ Uso do termo "Amil" em **texto** (PRD NFR8, Story 1.0 — opção 🅲️ "assumir risco com 5 mitigações documentadas; sem parecer prévio")
- ✅ Uso do termo "amil" em **domínio** (`planoamilempresas.com.br` — NFR8 + paralelo com `amilbhsaude.com.br`, `amilsa.com.br`, etc.)
- ✅ Plano de contingência de domínio-ponte (ADR-004 — `planosaudeempresas.com.br` registrado)

### 1.4 O que está sendo solicitado (objeto do parecer)

- Parecer formal sobre **slug específico de produto Amil em URL** (granularidade nova)
- Co-sign do ADR-006 ou rejeição com modificação sugerida
- Validação das 5 mitigações propostas
- Recomendação sobre pre-emptive outreach Amil Compliance (sim/não)

---

## 2. Sumário das 5 mitigações propostas (ADR-006 §Decision)

1. **Disclaimer agressivo em footer + topo:** "Corretor autorizado a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº 326305). Este site é independente; não substitui canais oficiais Amil."

2. **Schema.org JSON-LD com `Organization.sameAs: ["https://www.amil.com.br"]`** — atribuição de origem inequívoca no rich snippet do Google.

3. **Sem trade dress** — nenhum logo Amil oficial; apenas texto. Mantém marca visual Amil intacta.

4. **Plano de contingência ADR-004 acionável em ≤24h:** redirect 301 mass do `planoamilempresas.com.br` para domínio-ponte `planosaudeempresas.com.br`.

5. **Pre-emptive outreach Amil Compliance (opcional):** carta formal notificando atividade de corretor + uso de URL — cria audit trail de boa-fé.

---

## 3. Precedentes empíricos (resumo executivo)

> Detalhes completos em `docs/decisions/legal-precedents-corretoras-amil.md`.

### O que JÁ é precedente sólido no mercado brasileiro

| Tipo de uso | Casos verificados | Risk inerente |
|---|---|---|
| "amil" em domínio (`amilbhsaude.com.br`, `amilsa.com.br`, etc.) | **8+ corretoras** | Baixo — mainstream desde 2018-2020 |
| "amil-empresarial" ou variações em path (`garantiaseg/amil-empresarial/`, etc.) | **10+ corretoras** | Baixo — padrão consolidado |
| Conteúdo descritivo com nomes de produto Amil (S380, S450, S750, Black, Bronze, etc.) | **~30+ corretoras** | Muito baixo — universal |
| Cease & desist Amil → corretora autorizada (público) | **ZERO encontrados** | — |

### O que é PIONEIRISMO (sem precedent direto)

⚠️ Slug canônico com **nome específico de produto Amil em path** (ex: `/rede/amil-s750-qp/sp`).

Mercado de corretoras brasileiro NÃO tem casos análogos identificados — é granularidade nova.

### Doutrina aplicável

**Uso descritivo de boa-fé** (Lei 9.279/96 — Lei de Propriedade Industrial).

> Permite uso de marca registrada de terceiros em contexto **descritivo** (não como atribuição de origem) para identificar produto comercializado legitimamente.

**Precedente análogo:** revendedoras autorizadas Apple usam "iPhone 15 Pro Max" em URL pública (ex: `revenda.com.br/apple/iphone-15-pro-max/`) sem aparente disputa pública.

---

## 4. Perguntas estruturadas para parecer

> Por favor, responda cada uma com Sim/Não/Parcial + justificativa breve. Tempo estimado: 30-45 minutos para responder todas.

### Q1. Lei 9.279/96 (LPI) — uso descritivo de boa-fé

> O uso de slug com nome específico de produto Amil (ex: `/rede/amil-s750-qp/sp`) por corretor autorizado SUSEP constitui uso descritivo de boa-fé permitido pela LPI?

**Resposta:** ___________________________________________

### Q2. Contrato de corretagem Amil

> O contrato padrão Amil ↔ corretor autorizado (registro 326305) contém cláusula explícita sobre uso de marca em **URL/digital**? Se sim, qual o teor?

**Resposta:** ___________________________________________

> Se não há cláusula explícita, há orientação implícita ou uso e costume aplicável?

**Resposta:** ___________________________________________

### Q3. Risk concreto cease & desist

> Considerando (a) ausência de precedente público, (b) mainstream do mercado de corretagem, (c) 5 mitigações ADR-006, qual a probabilidade real de Amil mover ação contra `planoamilempresas` por uso de slug com nome de produto?

**Sua avaliação:** Baixa / Média / Alta — justificar:

**Resposta:** ___________________________________________

### Q4. 5 mitigações são suficientes?

> As 5 mitigações listadas em §2 deste documento conferem defesa robusta caso questionamento? Alguma adicional deve ser incluída?

**Resposta:** ___________________________________________

### Q5. Pre-emptive outreach Amil Compliance

> Notificar pre-emptivamente Amil Compliance (Mitigação 5) é estrategicamente recomendado? Ou pode acelerar conflito desnecessariamente?

**Sua recomendação:** Sim, recomendo / Não recomendo / Indiferente — justificar:

**Resposta:** ___________________________________________

### Q6. ADR-004 contingência

> Redirect 301 mass para domínio-ponte `planosaudeempresas.com.br` em ≤24h é mitigação adequada para cease & desist? Há etapas adicionais a documentar (resposta jurídica formal, prazo de cumprimento, etc.)?

**Resposta:** ___________________________________________

### Q7. Recomendação final

> Dado o conjunto de evidência empírica + 5 mitigações + ADR-004 contingência, você co-assinaria ADR-006 como **Status: Accepted**?

- [ ] **Sim, co-assino sem modificações**
- [ ] **Sim, co-assino com modificações** (especificar abaixo)
- [ ] **Rejeito** (especificar mudança que tornaria aceitável)

**Modificações ou justificativa:** ___________________________________________

---

## 5. Considerações finais

### 5.1 Caso o parecer seja **Accepted (sem modificações)**

- Status do ADR-006 muda para `Accepted` com co-sign do advogado revisor
- Story 7.7 (Cluster E rede × UF SSG) é desbloqueada para implementação
- Conventional Commit sugerido: `docs(adr): legal review accepts ADR-006 [Story 7.0c, 2.4]`

### 5.2 Caso o parecer seja **Rejected ou Accepted with modifications**

- Status do ADR-006 muda para `Rejected` ou `Accepted (revised)`
- Story 7.7 fica em hold até modificação aceita ser implementada
- Caminho alternativo C (slugs sem prefix "AMIL") está documentado como fallback no SCP v1.2.3 §3.2

### 5.3 Honorários e prazo

> A combinar diretamente com o stakeholder Agnaldo Silva. Pacote estruturado para review em ≤1h, mas advogado tem liberdade de aprofundar conforme entender necessário.

### 5.4 Confidencialidade

Este pacote contém informações operacionais do projeto `planoamilempresas`. Tratar como **confidencial** entre advogado revisor, stakeholder Agnaldo, e equipe AIOS. Não compartilhar publicamente.

---

## 6. Anexos

### 6.1 ADR-006 (decisão arquitetural)

`docs/decisions/adr-006-url-as-trademark-policy.md` — documento principal a co-assinar.

### 6.2 Precedentes empíricos completos

`docs/decisions/legal-precedents-corretoras-amil.md` — 8+ corretoras com "amil" em domínio, 10+ com path, etc.

### 6.3 ADR-004 (DNS contingência)

`docs/decisions/adr-004-dns-strategy.md` — domínio-ponte e redirect 301.

### 6.4 PRD NFR8 (uso de marca)

`docs/prd.md` v1.2.4 NFR8 — decisão prévia Story 1.0 sobre uso da marca em texto + 5 mitigações documentadas.

### 6.5 Sprint Change Proposal v1.2.3

`docs/sprint-change-proposal-v1.2.3.md` §3.2 — contexto da decisão M-02 de URL-as-trademark.

---

## Assinaturas

**Solicitante:** Agnaldo Silva (corretor BeneficioRH SUSEP 201054484)
Data: 2026-04-______

Assinatura: ___________________________

---

**Advogado revisor:**
Nome: ___________________________________________
OAB: ___________________________________________
Data do parecer: 2026-04-______

Assinatura: ___________________________

---

**Co-sign do ADR-006:**
- [ ] Status: **Accepted**
- [ ] Status: **Rejected**
- [ ] Status: **Accepted with modifications** (anexar)

— Aria, modelando o sistema 🏛 (via Orion handoff — Story 7.0c)
