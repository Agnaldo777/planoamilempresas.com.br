# `_archive/from-amil-empresarial/` — Audit Trail Pré-Consolidação

> 📦 **Conteúdo arquivado em 2026-04-26 durante Story 1.1** (consolidação Caminho A — SCP v1.2.3)

## Origem

Este diretório contém os documentos do projeto paralelo `C:\Users\benef\amil-empresarial\` (autoria do stakeholder Agnaldo Silva), que foi consolidado em `planoamilempresas/` durante a execução da Story 1.1.

## Por que está aqui (em vez de descartado)

Quando a consolidação Caminho A foi escolhida, decidimos **arquivar** (não descartar) a documentação do projeto paralelo porque:

1. Contém **MASTER-PLAN-SITE-AMIL** — visão estratégica do stakeholder com keyword research, Wave 1-4 plan
2. Contém **PRD-001-amil-empresarial-site** — versão alternativa do PRD com ângulos próprios
3. Contém **EPIC-001-EXECUTION.yaml** — execution plan estilo Wave 1-4
4. Contém **13 stories** Wave 1-4 com numeração 1.1-4.1 (diferente do AIOS canon 1.0-1.4 + 7.x)
5. Contém **TECH-VALIDATION-001** — análise de stack do @architect (referente ao codebase Next 16 + React 19)

Mesmo descartando como source de truth, o conteúdo é **referência valiosa** para:

- Validar lacunas do PRD AIOS (Story 5.7 não definida formalmente é exemplo)
- Importar copy/conteúdo editorial pronto
- Consultar análise de keywords SEMrush (ADDENDUM-SEO-KEYWORDS-STRATEGY)
- Reconstruir contexto histórico se necessário

## NÃO usar este diretório para

- ❌ Source of truth de stories ativas — o canon é `docs/stories/` (raiz)
- ❌ ACs de implementação — usar PRD AIOS v1.2.4+ (`docs/prd.md`)
- ❌ Architecture decisions — usar `docs/architecture.md` + `docs/decisions/adr-*.md`
- ❌ Roadmap — Epic 7 + Stories 7.x são canon (não Wave 1-4)

## Quando consultar este diretório

- ✅ Pesquisa de keywords / SEMrush data — `from-amil-empresarial/prd/ADDENDUM-SEO-KEYWORDS-STRATEGY.md`
- ✅ Análise de Wave 1-4 estratégico — `from-amil-empresarial/prd/MASTER-PLAN-SITE-AMIL.md`
- ✅ Audit de tech stack original — `from-amil-empresarial/architecture/TECH-VALIDATION-001.md`
- ✅ Importar template/prompt de stories — `from-amil-empresarial/stories/`

## Mapping de stories

| Story AIOS canon | Story `from-amil-empresarial/` (referência) | Notas |
|---|---|---|
| Story 1.0 (Project Kickoff) | (sem equivalente direto) | AIOS-only |
| Story 1.1 (Fork+Strip) | (consolidação executada nesta sessão) | **CONCLUÍDA** |
| Story 1.2 (Vercel + DNS) | story 4.1 (Deploy + GSC + Link Building) | parcialmente coberta |
| Story 1.3 (CI/CD) | (sem equivalente) | AIOS-only |
| Story 1.4 (Canary) | (sem equivalente) | AIOS-only |
| Story 1.5 (Analytics) | story 1.5 (SEO Engine) | escopos diferentes |
| Stories Epic 3 (15 cornerstones) | story 2.1, 2.2, 2.3 | Wave 2 do projeto original |
| Stories Epic 5 (programmatic) | story 3.1 (Local + 300 cidades) | escopo similar |
| Story 7.x (Rede Credenciada) | (sem equivalente — descoberta nova) | AIOS-only — dataset 9325 |

## Estado dos documentos arquivados

| Arquivo | Status |
|---|---|
| `prd/MASTER-PLAN-SITE-AMIL.md` | Arquivo (referência keyword/strategy) |
| `prd/PRD-001-amil-empresarial-site.md` | Arquivo (alternative PRD view) |
| `prd/ADDENDUM-SEO-KEYWORDS-STRATEGY.md` | Arquivo (SEMrush data) |
| `architecture/TECH-VALIDATION-001.md` | Arquivo (validação stack) |
| `epics/EPIC-001-EXECUTION.yaml` | Arquivo (Wave 1-4 plan) |
| `stories/1.1-1.5, 2.1-2.3, 3.1-3.2, 4.1.story.md` | Arquivo (templates de referência) |
| `README-original.md` | Arquivo (README original do projeto) |

## Limpeza eventual (Phase 2)

Quando o canon AIOS estiver totalmente estabilizado e este diretório não for consultado por 6 meses, considerar:

- Compactar em `_archive/from-amil-empresarial.tar.gz`
- Mover compacto para `_archive/snapshots/` ou Vercel Blob Storage
- Remover do repositório principal (preserva git history)

— Orion, orquestrando o sistema 🎯 (Story 1.1 consolidação 2026-04-26)
