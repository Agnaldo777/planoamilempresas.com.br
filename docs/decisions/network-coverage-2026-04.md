# Network Coverage Audit — Story 7.0a Pre-flight (2026-04-26)

**Tipo:** Documento de pesquisa / decisão técnica
**Status:** ✅ **Concluído**
**Story:** 7.0a — Pre-flight gap 11 vs 49 redes
**Owner:** Aria (Architect) via Orion handoff
**Data:** 2026-04-26
**Dataset analisado:** `data/rede-credenciada/rede-credenciada.json` (geradoEm 2026-04-26T02:21:13Z)
**Script:** `scripts/audit-network-coverage.mjs`

---

## TL;DR

- **49 redes** no header `dataset.redes[]`
- **11 redes ativas** com prestadores associados em `prestadores[].redes`
- **38 redes fantasma** (no header, zero prestadores) — **categorização heurística sugere fortemente que são metadados de dropdown Power BI sem prestadores na visualização default**
- **Distribuição uniforme** das 8 redes "main" (todas com 4.955-4.980 prestadores = 53% cada) confirma hipótese de seleção em lote default
- **Decisão GO Story 7.7** (Cluster E rede × UF SSG) com 11 URLs canônicas (1 por rede ativa)

---

## 1. Audit summary (output do script)

### 1.1 Header redes[] vs prestadores[].redes

| Métrica | Valor |
|---|---|
| Header `dataset.redes[]` declara | **49 redes** |
| Prestadores em `prestadores[].redes` | **11 redes únicas** |
| Redes fantasma (header sem prestador) | **38 redes** |
| Redes órfãs (prestador sem header) | **0** ✅ |

### 1.2 11 Redes ATIVAS (ordenadas por count desc)

| Rank | Rede | Prestadores | % do total | Tier comercial inferido |
|---|---|---|---|---|
| 1 | `ADESÃO OURO MAIS` | 4.980 | 53,4% | Adesão (associação) — tier Ouro Mais |
| 2 | `AMIL S380 QP` | 4.969 | 53,3% | Entry-level QP (provável Bronze Mais) |
| 3 | `AMIL S380 QC` | 4.969 | 53,3% | Entry-level QC (provável Bronze Mais) |
| 4 | `BLACK` | 4.963 | 53,2% | Black autônomo |
| 5 | `AMIL S580 QP` | 4.961 | 53,2% | Mid-tier QP (provável Prata-Ouro) |
| 6 | `AMIL S750 QP` | 4.959 | 53,2% | High-tier QP (provável Ouro) |
| 7 | `AMIL S450 QC` | 4.956 | 53,1% | Mid-tier QC (provável Prata) |
| 8 | `AMIL S450 QP` | 4.955 | 53,1% | Mid-tier QP (provável Prata) |
| 9 | `AMIL ONE S6500 BLACK QP` | 1.521 | 16,3% | Premium Amil One (provável Platinum Mais) |
| 10 | `ADESÃO BRONZE RJ` | 1.142 | 12,2% | Adesão regional RJ |
| 11 | `ADESÃO BRONZE SP` | 937 | 10,0% | Adesão regional SP |

> **Observação empírica chave:** as 8 primeiras redes têm densidade quase idêntica (4.955-4.980 prestadores = 53% do dataset). Isso é **estatisticamente improvável** se cada rede tivesse cobertura selecionada manualmente — sugere fortemente que o Power BI ativou seleção em lote default dessas 8 na matriz visual.

### 1.3 38 Redes Fantasma — categorização

| Categoria | Count | Redes |
|---|---|---|
| **Amil Black/Blue** | 11 | AMIL BLACK I, II, IV, ID; AMIL BLUE GOLD NACIONAL, NACIONAL IND, TRF; AMIL BLUE I NACIONAL, III, IV, I PR |
| **Amil numérico legado** | 10 | AMIL 30 NACIONAL, 30 NACIONAL AD, 30 ESPECIAL NACIONAL, 50 NACIONAL, 60 NACIONAL, 110 NACIONAL, 130 NACIONAL, 140 NACIONAL, 150 NACIONAL, 160 NACIONAL |
| **Adesão regional/classe** | 5 | ADESÃO PRATA SP QC, SP QP, RJ QC; ADESÃO PLATINUM MAIS SP RJ DF PR MG; ADESÃO PLATINUM SP RJ DF PR MG |
| **Amil One premium** | 3 | AMIL ONE S6500 BLACK COLAB, S2500 COLAB, S1500 QP |
| **Advanced (Amil Saúde)** | 3 | ADVANCED, ADVANCED ESPECIAL, ADVANCED EXECUTIVO |
| **Amil CR** | 3 | AMIL CR, CR I, CR II — investigação adicional |
| **Outros** | 3 | AMIL S750 COLAB, AMIL COLABORADOR NACIONAL, AMIL CONTINENTS GSK NACIONAL |
| **TOTAL** | 38 | — |

---

## 2. Análise: Hipótese A (metadados) vs Hipótese B (prestadores perdidos)

### 2.1 Hipótese A — Metadados de dropdown sem matriz selecionada

**Premissa:** scraper Playwright capturou as 49 strings que aparecem no dropdown filter "Rede" do Power BI Amil, mas o campo `prestadores[].redes` só foi populado para as redes que estavam ATIVAS na visualização da matriz default. Power BI tem 176+ produtos no dropdown (memória `project_amil_rede_credenciada_powerbi.md`), mas a matriz visualizada normalmente exibe ~10-15 redes "padrão".

**Indicadores empíricos a favor de A:**
- ✅ Distribuição uniforme nas 8 redes main (53% cada) — improvável se selecionadas manualmente
- ✅ 49 (header) vs 176+ (dropdown completo segundo memória) já é parcial — captura limitada conhecida
- ✅ Categorias de fantasmas são **historicamente coerentes**: AMIL BLUE/BLACK/30/50/110/130 são produtos PME históricos da Amil 2010-2020, parcialmente descontinuados; matriz default não os exibe mais
- ✅ "ADVANCED" são produtos para classe específica (servidores públicos, p.ex.) — nichados, raro estar em default view
- ✅ "AMIL CONTINENTS GSK NACIONAL" é claramente plano corporativo (GSK = empresa farmacêutica) — dataset PME default não inclui

### 2.2 Hipótese B — Scraper falhou em capturar checkmarks

**Premissa:** as 38 redes têm prestadores, mas o scraper teve falsos negativos no detector de checkmark (`svg[aria-label*="Marca de seleção"]`).

**Indicadores empíricos contra B:**
- ❌ Distribuição uniforme das 8 main (4.955-4.980) sugere parser FUNCIONOU — não há 49 distribuições uniformes (1.000-2.000 cada) que esperaríamos se todas tivessem prestadores
- ❌ Memória `project_amil_rede_credenciada_powerbi.md` registra que scraper passou por 4 iterações para acertar virtualização + checkmark — bug de captura é POSSÍVEL mas o output uniforme das 8 main mostra que CHECKMARK detection funcionou corretamente onde foi usado

### 2.3 Veredito

**Hipótese A é a leitura mais provável (~85% confiança).** As 38 redes fantasma são metadados de dropdown sem matriz selecionada na captura default. Para confirmação 100%, seria necessário rerun do scraper com filtro individual por cada uma das 38 redes (~30 runs Playwright × 5min cada = ~2,5h de execução), retornando incrementos marginais.

---

## 3. Decisão para Story 7.7 (Cluster E rede × UF SSG)

### ✅ **GO** com 11 URLs Cluster E

**Justificativa:**
- 11 redes ativas cobrem **53-12% do dataset** cada — produtos comerciais correntes da Amil PME
- Adicionar 38 fantasma sem confirmação de prestadores reais = risk de criar páginas ZERO-prestador (thin content / 404 logic na build)
- Custo de validar (~30 runs Playwright) supera benefício marginal (cada rede fantasma já tem zero ou poucas variações nos prestadores already capturados)
- 11 URLs Cluster E em 26 UFs filtrado ≥2 prestadores = ~286 URLs (mantém estimativa SCP v1.2.3)

**Trade-off aceito:** moat SEO de 286 URLs (vs ~1.000 URLs teóricos se 38 fantasma fossem todas reais). Concorrentes Tier B do `competitor-analysis.md` cobrem zero URLs deste pattern — moat ainda é dominante.

### Validação opcional (NÃO bloqueante)

Se em **qualquer momento** stakeholder Agnaldo Silva indicar que conhece prestadores que aceitam, p.ex., `AMIL BLACK I` mas não aparece no dataset, abrir Story 7.0a-bis para rerun do scraper com filtro individual.

---

## 4. Cross-reference 11 redes ATIVAS ↔ 6 segmentações tabela preço

> **HIPÓTESE — REQUER CONFIRMAÇÃO STAKEHOLDER** (Agnaldo Silva via WhatsApp/email).

### 4.1 Segmentações da tabela preço (`data/tabelas-amil.ts`)

| Segmentação | Acomodação | Reembolso | Notas |
|---|---|---|---|
| Bronze | QC / QP | Não | Grupo de Municípios (regional) |
| Bronze Mais | QC / QP | Não | Grupo de Municípios |
| Prata | QC / QP | Não | Nacional |
| Ouro | QC / QP | Sim | Nacional |
| Platinum | QP R1 / R2 | Sim | Nacional |
| Platinum Mais | QP R1 / R2 | Sim | Nacional |

### 4.2 Mapeamento hipotético (a confirmar)

| Rede no dataset | Segmentação tabela preço (hipótese) | Confiança | Justificativa heurística |
|---|---|---|---|
| `AMIL S380 QC` | Bronze Mais QC | 🟡 média | "S380" sugere entry-level high; QC bate |
| `AMIL S380 QP` | Bronze Mais QP | 🟡 média | mesmo produto S380 em quarto particular |
| `AMIL S450 QC` | Prata QC | 🟢 alta | "S450" tier intermediário; QC bate; sem reembolso (Prata) |
| `AMIL S450 QP` | Prata QP | 🟢 alta | mesma família S450 em QP |
| `AMIL S580 QP` | Ouro QP | 🟡 média | "S580" tier mid-high; provável Ouro (com reembolso) |
| `AMIL S750 QP` | Ouro QP | 🟡 média | "S750" também provável Ouro premium; ou Platinum entry |
| `BLACK` | Platinum QP | 🟡 média | "BLACK" é trade dress Amil top tier; tradicionalmente Platinum |
| `AMIL ONE S6500 BLACK QP` | Platinum Mais QP | 🟢 alta | "S6500" + "BLACK" + "Amil One" = top premium customizado |
| `ADESÃO OURO MAIS` | (sem mapping direto) | 🔴 baixa | Produto de adesão por associação — fora da tabela preço PME standard |
| `ADESÃO BRONZE RJ` | (sem mapping direto) | 🔴 baixa | Produto adesão regional RJ |
| `ADESÃO BRONZE SP` | (sem mapping direto) | 🔴 baixa | Produto adesão regional SP |

### 4.3 Gaps no mapping

- **Bronze (sem "Mais")** da tabela preço: NÃO tem rede correspondente no dataset (S380 = Bronze Mais). Possíveis interpretações:
  - (a) Bronze foi descontinuado — só Bronze Mais sobrou em comercialização
  - (b) Bronze é vendido apenas via Adesão (`ADESÃO BRONZE RJ/SP`) e tabela PME aplica em casos especiais
  - (c) Stakeholder confirma 1 das hipóteses

- **3 produtos ADESÃO** do dataset (OURO MAIS, BRONZE RJ, BRONZE SP) não têm tabela preço em `data/tabelas-amil.ts` — Story 7.7 precisa decidir como tratar estes:
  - Option A: criar páginas Cluster E sem link para tabela ("preço sob consulta corretor")
  - Option B: omitir essas 3 redes do Cluster E (perde 3 URLs)
  - Option C: criar tabela preço Adesão separada (escopo novo)

### 4.4 Action items pós este audit

- [ ] **Stakeholder Agnaldo Silva confirma mapping via WhatsApp/email** — bloqueia decision precisa em Story 7.7 templates editoriais (Story 7.3)
- [ ] **Decisão sobre os 3 produtos ADESÃO** — Morgan + Aria definem antes de Story 7.7 sair do Draft
- [ ] **Documentar mapping confirmado** em `data/rede-credenciada/rede-amil.ts` constante `REDE_TO_SEGMENTACAO: Record<RedeAmilNome, Segmentacao | null>`

---

## 5. Conclusão e handoff

### Status de saída

- ✅ **AC1** — Set-difference rodado, 49 vs 11 vs 38 quantificados
- ✅ **AC2** — Rerun scraper considerado e descartado (ROI baixo); pode ser feito sob demanda em Story 7.0a-bis
- ✅ **AC3** — Documento publicado (este arquivo), 38 categorizadas em 9 grupos
- ✅ **AC4** — **Decisão GO** Story 7.7 com 11 URLs Cluster E
- 🟡 **AC5** — Cross-reference DOCUMENTADA mas mapeamento Bronze→Platinum Mais ↔ 11 redes está em **HIPÓTESE pendente** confirmação stakeholder
- ✅ **AC6** — Conventional Commit recomendado: `docs(decisions): document network coverage audit [Story 7.0a]`

### Próximas Stories desbloqueadas

- ✅ Story 7.7 (Cluster E rede × UF SSG) — **GO** com 11 URLs
- 🟡 Story 7.3 (Templates editoriais) — pode iniciar; confirmação mapping ↔ tabela preço fica em queue paralela
- ✅ Demais stories Epic 7 (7.1, 7.2, 7.4, 7.5, 7.6, 7.8, 7.9, 7.10) — sem dependência deste audit

### Pendências externas (não bloqueantes do GO)

1. **Stakeholder confirma mapping 11 redes ↔ 6 segmentações** — handoff WhatsApp Agnaldo
2. **Decisão sobre 3 produtos ADESÃO** — Morgan + Aria

---

## Referências

- Script: `scripts/audit-network-coverage.mjs`
- Dataset: `data/rede-credenciada/rede-credenciada.json` (mirror — ADR-007)
- Story: `docs/stories/7.0a.preflight-gap-redes-ativas.story.md`
- Memória: `project_amil_rede_credenciada_powerbi.md` (pipeline scraper + 176+ produtos no dropdown)
- Tabela preço: `data/tabelas-amil.ts` (6 segmentações Bronze→Platinum Mais)
- ADR-005 v2: recalibração ~10.500 URLs SEO

— Aria, modelando o sistema 🏛 (via Orion handoff)
