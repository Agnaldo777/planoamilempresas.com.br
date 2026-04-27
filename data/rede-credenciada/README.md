# Rede Credenciada Amil — Pipeline de Dados

Dados oficiais Amil consumidos pelas páginas SEO do site `planoamilempresas.com.br`:

- `/rede-credenciada` — busca filtrável (component `<NetworkSearch />`)
- `/rede/[uf]` — 23 páginas-pai por estado
- `/rede/[uf]/[municipio]` — ~300-500 páginas por município
- `/rede/[uf]/[municipio]/[prestador-slug]` — 2.071 páginas-prestador individuais
- `/rede/[uf]/[municipio]/[bairro]` — ~800-1.500 páginas por bairro (hyper-long-tail)
- `/rede/[rede-slug]/[uf]` — 230 páginas por produto × estado (ex: `/rede/platinum-mais/sp`)
- `/[tipo]/[uf]/[municipio]` — ~200-400 páginas por tipo de atendimento (Hospital, Clínica, etc.)

**Volume estimado total: ~3.500-4.500 URLs SEO geradas só desta pasta.**

## Arquivos (atualizados 2026-04-26 pós SCP v1.2.3)

| Arquivo | Descrição | Status |
|---|---|---|
| `rede-credenciada.json` (1,84 MB) | Dataset bruto Amil v2 — **9.325 prestadores · 26 UFs · schema raiz `prestadores[].redes: string[]`** | ✅ atualizado (mirror do hub canon — ADR-007) |
| `rede-amil.ts` | Tipos TypeScript + loader v2 + 13+ helpers (cache em memória) — schema novo compatível | ✅ rewrite aplicado |
| `smoke-test.mjs` | Validação pós-sync (shape v2 + cross-check REDE_KEYS) | ✅ passing |
| `README.md` | Este guia | ✅ |
| `snapshots/2026-MM.json.gz` | Snapshot histórico mensal (Story 7.10 — pipeline automatizado) | ⏳ pendente Story 7.10 |

## Estrutura real do dataset

### Cobertura (v2 — 2026-04-26)

- **9.325 prestadores** únicos (4,5× a versão v1 de 2.071)
- **26 UFs** — Norte parcialmente coberto (AM 8, AP 4, RR 1 — falta AC)
- **438 municípios** distintos
- **1.687 combinações** UF × Município × Bairro (filtros ≥3 prestadores → ~700-800 viáveis para SSG)
- **11 redes ATIVAS** (header anuncia 49 — Story 7.0a investiga gap)
- **Snapshot diário** — Amil atualiza ~03:30 BRT

### Campos disponíveis (schema v2)

Por prestador (`prestadores[]`):
- `codigo` — string identificadora (ex: `"10000020"`)
- `nome` — nome do prestador (ex: `"INSTITUTO DE OLHOS DE TAGUATINGA"`)
- `uf` — sigla 2 chars (`SP`, `RJ`, `MG`...)
- `municipio` — nome em maiúsculo (`BRASILIA`, `SAO PAULO`)
- `bairro` — nome do bairro (`TAGUATINGA NORTE`, `ASA SUL`)
- `redes: string[]` — array de redes Amil aceitas (~11 valores possíveis)

Cabeçalho do dataset:
- `geradoEm: ISO 8601` — timestamp da execução do scraper
- `fonte: "powerbi-amil-public"`
- `totalPrestadores: 9325`
- `totalRedes: 49` (header anuncia; **apenas 11 ativas** em prestadores — Story 7.0a)
- `redes: string[]` — header com 49 strings

### 11 redes/produtos Amil ATIVAS (snapshot 2026-04-26)

| Rede | Prestadores | Slug URL | Mapeamento provável tabela preço |
|---|---|---|---|
| `ADESÃO OURO MAIS` | 4.980 | adesao-ouro-mais | _Adesão Ouro Mais_ |
| `AMIL S380 QP` | 4.969 | amil-s380-qp | _provável Bronze Mais_ |
| `AMIL S380 QC` | 4.969 | amil-s380-qc | _provável Bronze Mais (QC)_ |
| `BLACK` | 4.963 | black | _produto Black autônomo_ |
| `AMIL S580 QP` | 4.961 | amil-s580-qp | _provável Prata-Ouro_ |
| `AMIL S750 QP` | 4.959 | amil-s750-qp | _provável Ouro_ |
| `AMIL S450 QC` | 4.956 | amil-s450-qc | _provável Prata (QC)_ |
| `AMIL S450 QP` | 4.955 | amil-s450-qp | _provável Prata_ |
| `AMIL ONE S6500 BLACK QP` | 1.521 | amil-one-s6500-black-qp | _Amil One — Black premium_ |
| `ADESÃO BRONZE RJ` | 1.142 | adesao-bronze-rj | _Adesão Bronze (RJ)_ |
| `ADESÃO BRONZE SP` | 937 | adesao-bronze-sp | _Adesão Bronze (SP)_ |

> ⚠️ **5 redes do enum v1 SUMIRAM em v2:** `REDE 300 NACIONAL BLUE`, `REDE 200 NACIONAL BLUE`, `AMIL ONE S2500 QP`, `PLATINUM MAIS`, `PLATINUM QP`. Causa pode ser: (a) Amil descontinuou esses produtos; (b) renomeou para AMIL S380/S580/S750 family; (c) gap de captura no scraper (Story 7.0a investiga).

⚠️ **AÇÃO NECESSÁRIA (Story 7.0a AC5):** stakeholder Agnaldo confirma mapeamento exato entre 11 redes ativas ↔ 6 segmentações `data/tabelas-amil.ts` (Bronze/Bronze Mais/Prata/Ouro/Platinum/Platinum Mais).

### Tipo de atendimento — INFERIDO via regex no nome

O Power BI **não exporta** o campo "Tipo de Atendimento" (filtro existe na UI, mas não vem na export). O loader implementa inferência via regex no nome do prestador:

| Padrão regex no nome | Tipo |
|---|---|
| `PRONTO SOCORRO`, `PS` | Pronto-Socorro |
| `MATERNIDADE` | Maternidade |
| `HOSPITAL`, `HOSP` | Hospital |
| `LABORATORIO`, `LAB`, `ANALISES CLINICAS`, `PATOLOGIA` | Laboratório |
| `IMAGEM`, `RADIOLOG`, `RAIO X`, `TOMOGR`, `RESSON`, `ULTRASSOM` | Diagnóstico por Imagem |
| `CLINICA` | Clínica |
| `INSTITUTO`, `CENTRO`, `FUNDACAO` | Centro/Instituto |
| _(nenhum match)_ | Outro |

Precisão estimada: ~85-90% (boa para SEO, declarar disclaimer de margem de erro).

### Gaps conhecidos

| Gap | Impacto | Mitigação |
|---|---|---|
| ❌ Sem **Especialidade médica** | Filtro "cardiologia, pediatria..." impossível | Adiar para Phase 2 ou scrape complementar (workload pesado, ~30 runs filtrando por especialidade × UF) |
| ❌ Sem **endereço completo** | Só bairro + cidade — schema incompleto | Schema `address` parcial mas válido (Google aceita) |
| ❌ Sem **telefone, CEP, coordenadas** | Sem mapa preciso, sem clique-para-ligar | Mapa Leaflet usa centroide do município/bairro como aproximação |
| ❌ Sem **Norte (4 UFs)** | AC, AM, AP, RR sem dados | Página de UF mostra "rede em expansão na região Norte" |
| ❌ **Snapshot diário** | Pode ter dessincronia até 24h vs Amil real | Disclaimer "Atualizado em [data]; rede sujeita a alterações pela operadora" |

## Pipeline de atualização (Story 6.6)

### Single Source of Truth (formalizado em ADR-007 — SCP v1.2.3)

- **Canon:** `C:\Users\benef\planodesaudepj\src\data\operadoras\amil\rede-credenciada.json` (hub multi-operadora)
- **Mirror:** `C:\Users\benef\planoamilempresas\data\rede-credenciada\rede-credenciada.json` (este arquivo)
- **Scraper canônico:** `C:\Users\benef\scrape_powerbi_amil.js` (escreve no canon)
- **Pipeline mensal:** Story 7.10 (GitHub Actions cron — auto canon → mirror)

### Sincronização manual (até Story 7.10 fechar)

```bash
# 1. Stakeholder ou cron roda o scraper (atualiza dataset do hub)
node /c/Users/benef/scrape_powerbi_amil.js

# 2. Copia para este projeto
cp /c/Users/benef/planodesaudepj/src/data/operadoras/amil/rede-credenciada.json \
   /c/Users/benef/planoamilempresas/data/rede-credenciada/rede-credenciada.json

# 3. Verifica diff e commita
cd /c/Users/benef/planoamilempresas
git diff data/rede-credenciada/rede-credenciada.json
git add data/rede-credenciada/rede-credenciada.json
git commit -m "feat(data): atualiza rede credenciada Amil [Mês]/2026"

# 4. Vercel detecta push e re-renderiza páginas SSG automaticamente
git push
```

Em Story 6.6 (pipeline mensal automatizado), isso vira:
- Cron Vercel agendado dia 1 de cada mês 03:00 BRT
- Workflow GitHub Actions roda scraper + copia + commit automático
- Notificação Slack/WhatsApp ao stakeholder validar

### Path final pós Story 1.1 (fork+strip)

Quando o fork acontecer, esta pasta vai migrar:

```
data/rede-credenciada/rede-amil.ts            →  src/lib/operadoras/amil/rede-credenciada-loader.ts
data/rede-credenciada/rede-credenciada.json   →  src/data/operadoras/amil/rede-credenciada.json
                                                + src/types/rede-credenciada-amil.ts (types separados)
```

## Compliance ANS / risco contratual

### Disclaimer obrigatório em todas as páginas

> Rede sujeita a alterações pela operadora. Confirmar via app oficial Amil antes de uso. Última atualização: [DATA].

### O que NUNCA fazer

- ❌ Usar logotipo Amil oficial (apenas texto)
- ❌ Apresentar dados como "tempo real" (são snapshot diário)
- ❌ Inventar especialidades não confirmadas pelos dados
- ❌ Mostrar como "exclusivo" ou "oficial" (somos corretor autorizado, não Amil)

### Mitigação caso Amil notifique

- Remover páginas em <24h
- Manter robots.txt bloqueando temporariamente o caminho `/rede/`
- Voltar para domínio-ponte `planosaudeempresas.com.br`
- Resposta pré-aprovada com advogado em `docs/legal/domain-contingency-plan.md`

## Referências

- ANS RN 71/2004 (categorias de prestadores)
- ANS RN 195/2009 (regulamentação publicidade)
- LGPD Lei 13.709/2018 (dados de prestadores são dados públicos cadastrais)
- PRD Story 6.5 (Rede Credenciada Filtrável) — a expandir em v1.2.2
- PRD Story 6.6 (Pipeline mensal de atualização) — cobrir 2 datasets sincronizados (preço + rede)
- Memory: `project_amil_rede_credenciada_powerbi.md` — pipeline de scraping reproduzível

## Volume SEO estimado por tipo de página

| Tipo de página | Volume | Status conteúdo |
|---|---|---|
| Hub `/rede-credenciada` | 1 | a fazer |
| Por UF: `/rede/[uf]` | 23 | a fazer |
| Por município: `/rede/[uf]/[municipio]` | ~300-500 | a fazer |
| Por prestador: `/rede/[uf]/[municipio]/[slug]` | **2.071** | a fazer |
| Por bairro: `/rede/[uf]/[municipio]/[bairro]` | ~800-1.500 | a fazer |
| Por tipo: `/[tipo]/[uf]/[municipio]` | ~200-400 | a fazer |
| Por produto×UF: `/rede/[rede-slug]/[uf]` | 230 | a fazer |
| **TOTAL** | **~3.500-4.500** | — |
