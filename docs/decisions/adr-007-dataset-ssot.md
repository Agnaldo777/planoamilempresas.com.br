# ADR-007: Dataset Single-Source-of-Truth (Amil Rede Credenciada)

**Status:** ✅ **Accepted**
**Data:** 2026-04-26 (Sprint Change Proposal v1.2.3 §3.1)
**Autor:** Aria (Architect) — Synkra AIOS
**Co-sign:** Pax (PO) · Orion (aios-master) — via SCP v1.2.3

---

## Context

O dataset Amil Rede Credenciada precisa ser sincronizado entre dois projetos:

- `planodesaudepj` — hub multi-operadora onde o scraper Playwright `scrape_powerbi_amil.js` vive e gera o JSON canônico
- `planoamilempresas` — site SEO específico de Amil que consome o dataset para SSG/ISR de ~10.500 URLs

Sem decisão formal, há risco real de drift (dois JSONs divergindo, schema versions inconsistentes, builds diferentes em diferentes timestamps). O `data/rede-credenciada/README.md` (linhas 86-90) deixava ambiguidade entre "hub é canon" vs "site é canon".

## Decision

**Hub `planodesaudepj` é canon.** `planoamilempresas` consome via mirror automatizado (Story 7.10).

### Implementação

1. **Scraper canônico** roda em ambiente do hub:
   - `scrape_powerbi_amil.js` (Playwright) escreve em `planodesaudepj/src/data/operadoras/amil/rede-credenciada.json`
2. **Mirror automatizado** (Story 7.10):
   - GitHub Actions workflow (cron dia 1 mês 03:00 BRT)
   - `cp` canon → `planoamilempresas/data/rede-credenciada/rede-credenciada.json`
3. **Snapshot histórico** (mitigação NFR16 DR/RTO):
   - Cada execução salva snapshot compactado em `planoamilempresas/data/rede-credenciada/snapshots/2026-MM.json.gz`
4. **Validação automática:**
   - Diff vs mês anterior; alerta WhatsApp ao stakeholder se Δ > 20% em qualquer campo
   - CI fail se schema raiz mudar inesperadamente (validar `geradoEm`, `prestadores[].codigo`, etc.)

## Consequences

### Positivas

- ✅ **Audit trail claro**: scraper sempre escreve no hub primeiro; mirror é sempre downstream
- ✅ **Multi-operadora pronto**: hub é design multi-operadora (Bradesco, SulAmérica, Unimed); centralizar canon escala
- ✅ **Preserva commits do hub**: memória `project_planodesaudepj_pending_github.md` registra commits Amil prontos no hub master local — não invalidados
- ✅ **Reduzido cost cognitivo**: 1 source of truth, não 2
- ✅ **Snapshot histórico** mitiga NFR16 (RTO 4h / RPO 24h) caso Amil descontinue Power BI público

### Negativas / Mitigações

- ⚠️ **Dependência operacional do hub**: se hub fica offline, mirror não atualiza
  - **Mitigação**: workflow GH Actions roda em runner Linux independente; falha de hub local não afeta automação
- ⚠️ **Story 7.10 depende de hub ter remote configurado**: memória `project_planodesaudepj_pending_github.md` registra que isso ainda é pendente
  - **Mitigação**: gating Story 7.10 — não bloqueia 7.0-7.9; manual sync OK até remote configurado
- ⚠️ **Mudança de schema requer coordenação**: scraper output muda → loader mirror precisa atualizar
  - **Mitigação**: type guard runtime no loader (Story 7.1 AC); CI fail dispara revisão

## Alternatives Considered

| Opção | Veredito | Por quê |
|---|---|---|
| **A) Hub é canon, site é mirror** | ✅ **Escolhido** | Scraper já vive no hub; multi-operadora design; preserva commits pendentes |
| B) Site é canon, hub consome | ❌ Rejeitado | Inverte autoridade do scraper; quebra arquitetura multi-operadora; invalida 3 commits Amil prontos no hub |
| C) Write-twice (scraper escreve nos 2) | ❌ Rejeitado | Race condition; sem ordem clara; conflito em commits paralelos |

## References

- `docs/sprint-change-proposal-v1.2.3.md` §3.1 — decisão original
- `docs/prd.md` v1.2.3 Story 7.10 — implementação pipeline mensal
- `data/rede-credenciada/README.md` — documentação operacional do mirror
- Memory `project_planodesaudepj_pending_github.md` — pendência hub remote
- Memory `project_amil_rede_credenciada_powerbi.md` — pipeline scraper + gaps
