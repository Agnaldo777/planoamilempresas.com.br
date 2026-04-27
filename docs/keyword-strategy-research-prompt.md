# Deep Research Prompt: Keyword Strategy — planoamilempresas.com.br

**Documento:** Deep Research Prompt v1.0
**Projeto:** planoamilempresas.com.br
**Autor:** Atlas (Business Analyst) — Synkra AIOS
**Data:** 2026-04-16
**Uso:** Prompt estruturado para ser executado em Ahrefs/Semrush/Google Keyword Planner + ferramenta de deep research (Perplexity Pro, Claude Research, GPT-4 com web browsing)

---

## 1. Objetivo da Pesquisa

Mapear de forma exaustiva o universo de **keywords comerciais e informacionais** do nicho "Plano de Saúde Amil Empresarial no Brasil" para alimentar:

- Estrutura do cluster topical (silo de conteúdo)
- Calendário editorial dos primeiros 90 dias (pillar + 15 cornerstones + blog)
- Matriz programática CNAE × cidade × porte (target: 600 landing pages)
- Priorização de páginas por potencial de ROI (volume × dificuldade × intenção)
- Validação/calibração de estimativas de tráfego do market-research.md

**Output esperado:** planilha estruturada com ~800–1.500 keywords categorizadas por cluster, intent, volume, dificuldade, SERP features, CPC, e prioridade de publicação.

---

## 2. Contexto do Projeto (briefing para a IA/pesquisador)

```
Projeto: planoamilempresas.com.br — site de captação de leads B2B para plano de
saúde Amil empresarial, operado por corretor autorizado SUSEP.

Stack: Astro (SSG) + ilhas React para formulário de cotação e calculadora.

Nicho: Planos de saúde coletivos empresariais Amil, focando PME 2-200 vidas.

Segmentos-alvo prioritários:
- Sócio-fundador PME (2-30 vidas)
- Gestor de RH (30-200 vidas)
- Financeiro/Controladoria (stakeholder de validação)
- Contador/consultor (canal multiplicador)

Geografia prioritária: Top 20 cidades brasileiras (SP, RJ, BH, POA, BSB, CWB, SSA,
REC, FOR, Campinas, Manaus, Goiânia, Belém, Natal, João Pessoa, Maceió, Aracaju,
Cuiabá, Vitória, Florianópolis).

CNAEs prioritários (30 setores): advocacia, contabilidade, TI/software, arquitetura,
engenharia, consultoria, clínica médica, clínica odontológica, comércio varejista,
comércio atacadista, restaurantes, hotelaria, transportadora, logística, indústria
alimentícia, indústria têxtil, construção civil, educação, escolas particulares,
academias, estéticas/beleza, salão de cabeleireiro, corretoras de imóveis, imobiliárias,
serviços gerais, marketing/agências, e-commerce, franquias, oficinas mecânicas, postos
de gasolina.

Produtos Amil empresariais relevantes: Amil 400, 500, 600, Blue I/II/III, Black,
Fácil S/Q, Easy, Referência, One Saúde, MEI, PME Plus, GP (Grandes Públicos).

Regulação: ANS RN 195/2009 e 593/2024 limitam publicidade de operadora — keywords
com promessas absolutas ("melhor plano", "plano barato", "sem carência") devem ser
tratadas com cuidado editorial, mas não evitadas.
```

---

## 3. Instruções de Execução — 6 Blocos de Pesquisa

### Bloco 1 — Keywords seed (head + body terms)

**Ferramenta principal:** Ahrefs Keywords Explorer OU Semrush Keyword Magic Tool
**Filtros:** Location=Brasil, Language=Portuguese (BR)

**Seed keywords obrigatórias (rodar cada uma como origem de expansão):**

```
plano de saúde amil empresarial
plano amil para empresa
plano amil pj
plano de saúde amil cnpj
plano amil empresa pequena
plano amil mei
plano de saúde pme amil
plano amil 400
plano amil 500
plano amil 600
plano amil blue
plano amil black
tabela amil empresa
tabela amil 2026
tabela amil empresarial preço
cotação amil empresarial
cotar plano amil empresa
contratar plano amil pj
amil para empresa 2 vidas
amil para empresa 10 vidas
amil para empresa 50 vidas
amil empresarial reajuste
amil empresarial coparticipação
amil empresarial rede credenciada
carência plano amil empresa
migrar para plano amil empresa
portabilidade amil empresa
```

**Para cada seed, extrair:**
- Matching terms (all terms containing seed)
- Related terms (semântica próxima)
- Questions (queries interrogativas)
- Also rank for (keywords que páginas do top-10 também ranqueiam)

**Mínimo esperado:** 300–500 keywords categorizadas neste bloco.

---

### Bloco 2 — Keywords long-tail por CNAE × porte

Para **cada um dos 30 CNAEs** listados na seção 2, rodar variações:

```
plano de saúde amil para [CNAE]
plano amil empresarial para [CNAE]
plano saúde [CNAE] cnpj
amil para [CNAE] pequena empresa
plano amil [CNAE] coparticipação
tabela amil [CNAE]
cotação plano [CNAE] amil
```

Exemplos concretos:
- "plano de saúde amil para escritório de advocacia"
- "plano amil para clínica odontológica"
- "plano de saúde amil para empresa de TI"
- "amil para contabilidade cnpj"
- "plano amil para restaurante"
- "tabela amil engenharia"

**Mínimo esperado:** 150–250 keywords categorizadas neste bloco.

---

### Bloco 3 — Keywords long-tail por cidade × porte

Para **cada uma das 20 cidades** × **3 faixas de porte (2-10, 10-30, 30-100 vidas)**:

```
plano de saúde amil empresarial [cidade]
plano amil pj [cidade]
tabela amil [cidade]
amil empresarial [cidade] [N vidas]
rede amil empresa [cidade]
amil [cidade] cnpj pequena empresa
```

Exemplos concretos:
- "plano de saúde amil empresarial São Paulo"
- "plano amil pj Belo Horizonte"
- "tabela amil Rio de Janeiro"
- "amil empresarial Porto Alegre 20 vidas"
- "rede amil empresa Brasília"
- "plano amil empresa pequena Curitiba"

**Mínimo esperado:** 200–400 keywords categorizadas neste bloco.

---

### Bloco 4 — Keywords informacionais e FAQs

Buscar queries interrogativas e informacionais:

**Carência e elegibilidade:**
- "qual a carência do plano amil empresarial"
- "amil pj tem carência"
- "empresa com 1 funcionário pode contratar amil"
- "mei pode contratar amil empresarial"
- "precisa ter cnpj para contratar plano amil"
- "quantas vidas mínimas para amil empresarial"

**Reajuste e preço:**
- "reajuste amil empresarial 2026"
- "histórico reajuste amil pme"
- "por que amil reajustou tanto"
- "como evitar reajuste alto amil"
- "amil empresarial é caro"
- "plano amil pme vale a pena"

**Comparativos:**
- "amil 400 vs 500 empresarial"
- "amil blue vs black empresa"
- "qual melhor plano amil para empresa pequena"
- "amil vs bradesco saúde empresarial"
- "amil vs sulamérica pj"
- "amil vs hapvida empresa"

**Processo e burocracia:**
- "como contratar plano amil para empresa"
- "documentos para contratar amil pj"
- "passo a passo amil empresarial"
- "demora para ativar plano amil pj"
- "como incluir funcionário no plano amil"
- "como cancelar plano amil empresa"
- "portabilidade amil empresa sem carência"

**Cobertura:**
- "amil empresarial cobre cirurgia"
- "amil pj cobre parto"
- "amil empresarial cobre exame x"
- "rede amil empresa hospital y"

**Mínimo esperado:** 150–250 keywords categorizadas neste bloco.

---

### Bloco 5 — SERP features e oportunidades de rich snippets

Para **cada keyword com volume >= 50/mês**, extrair:

- **SERP features presentes:** Featured Snippet, People Also Ask, Knowledge Panel, Sitelinks, Image Pack, Video Pack, Local Pack, Shopping Ads, AI Overview (se disponível)
- **Domínios dominando top 10:** identificar se é Amil oficial, corretor, agregador, blog, Reclame Aqui, fórum
- **Conteúdo dominante:** parágrafo, lista, tabela, vídeo, imagem, PDF
- **Ângulo editorial vencedor:** informacional, comparativo, transacional, local, review
- **Year/data freshness dos top 3:** identificar oportunidades onde top-3 está desatualizado (ex: todos ranqueando com "tabela 2024" ou "2023")

**Output esperado:** flag por keyword indicando:
- ✅ Featured Snippet disponível (não ocupado ou ocupado por conteúdo fraco)
- ✅ PAA com perguntas de alto valor para responder
- ✅ AI Overview citando fontes superáveis
- ✅ Top-3 desatualizado (janela de ataque)
- ❌ Top-3 dominado por Amil oficial (não atacar; complementar)

---

### Bloco 6 — Keywords adjacentes e de autoridade (link building)

Identificar keywords onde **portais de autoridade** ranqueiam para construir mapeamento de outreach de backlinks:

**Temas editoriais adjacentes (para guest posts e indicações):**
- "melhores benefícios corporativos para pme"
- "como escolher plano de saúde para empresa"
- "guia rh benefícios empresa"
- "tributação benefícios corporativos"
- "reforma tributária saúde suplementar"
- "benchmark rh empresas pequenas"

Para cada tema, identificar:
- Top 20 domínios que ranqueiam
- Autoridade (DR, tráfego orgânico mensal)
- Se aceita guest post, conteúdo patrocinado, ou parceria editorial
- Contato (editor, marketing, parcerias)

**Mínimo esperado:** 50–100 domínios candidatos a link building categorizados por prioridade.

---

## 4. Estrutura do Output Esperado

**Formato:** Google Sheet (ou equivalente) com as seguintes colunas por keyword:

| Coluna | Descrição | Exemplo |
|---|---|---|
| `keyword` | Keyword exata | "plano amil empresarial 20 vidas sp" |
| `cluster_primary` | Cluster topical principal | "long-tail cidade+porte" |
| `cluster_secondary` | Sub-cluster | "São Paulo / 10-30 vidas" |
| `intent` | transactional / commercial / informational / navigational | "commercial" |
| `funnel_stage` | TOFU / MOFU / BOFU | "BOFU" |
| `volume_monthly_br` | Volume de busca Brasil (Ahrefs/Semrush) | 320 |
| `kd` | Keyword Difficulty (0–100) | 18 |
| `cpc_brl` | CPC médio em Google Ads BR | R$ 11,40 |
| `serp_features` | Features presentes | "PAA, AI Overview" |
| `top_3_domains` | Domínios dos top 3 | "amilsa.com.br, companyhero.com, rotaseguros.com.br" |
| `top_3_freshness` | Ano de atualização dos top 3 | "2024, 2023, 2025" |
| `opportunity_score` | Nossa escala 1-10 (volume × freshness × KD baixo × SERP feature) | 8 |
| `recommended_content_type` | pillar / cornerstone / blog / landing programática / FAQ | "landing programática" |
| `target_url_slug` | URL sugerida | "/plano-amil/sp/20-vidas" |
| `priority_phase` | Fase de publicação (1-6) | "Fase 2" |
| `notes` | Observações editoriais, compliance, etc. | "Incluir disclaimer ANS. Atualizar tabela." |

---

## 5. Critérios de Priorização (Opportunity Score)

**Fórmula sugerida (ajustar com dados reais):**

```
opportunity_score = (volume_normalized × 0.30)
                  + (intent_weight × 0.25)
                  + ((100 - kd) / 100 × 0.20)
                  + (freshness_gap × 0.15)
                  + (serp_feature_available × 0.10)
```

**Pesos por intent:**
- transactional: 1.0
- commercial: 0.9
- informational: 0.6
- navigational: 0.3

**Freshness gap:**
- 1.0 se top-3 é >=18 meses atrás
- 0.7 se top-3 é 12–18 meses
- 0.4 se top-3 é 6–12 meses
- 0.1 se top-3 é < 6 meses

**SERP feature bonus:**
- 1.0 se Featured Snippet disponível
- 0.8 se PAA com perguntas boas
- 0.6 se AI Overview com fontes superáveis
- 0.3 se nenhuma feature exploitable

---

## 6. Deliverables Finais

1. **`keyword-universe.csv`** — planilha completa (800–1.500 keywords)
2. **`keyword-clusters-topical-map.md`** — mapa hierárquico (pillar → clusters → sub-clusters → keywords)
3. **`publication-calendar-90-days.md`** — calendário editorial com pillar + 15 cornerstones + 30 blog posts
4. **`programmatic-urls-matrix.csv`** — matriz CNAE × cidade × porte com 600 URLs sugeridas + título + meta + H1 + intent
5. **`backlink-outreach-targets.csv`** — 50–100 domínios para outreach categorizados por prioridade
6. **`serp-feature-opportunities.md`** — lista de quick wins para Featured Snippets e PAA

---

## 7. Validação e Sanity Checks

Após produzir o universo de keywords, **validar**:

- [ ] Volume agregado das top-50 keywords está em linha com estimativa do market-research.md (8K–25K sessões/mês no Ano 1)?
- [ ] KD médio das top-100 keywords-alvo é <= 30 (viável para domínio novo com budget de backlinks)?
- [ ] Pelo menos 40% das keywords são long-tail (volume <= 500/mês)?
- [ ] CPC médio da lista final é >= R$ 5 (confirma valor comercial do tráfego)?
- [ ] Top-3 de pelo menos 30% das keywords está desatualizado (janela de ataque)?
- [ ] Nenhuma keyword da lista viola ANS RN 195 ("melhor plano garantido", "carência zero absoluta", etc.)?

Se algum check falhar, retornar ao bloco correspondente e refinar.

---

## 8. Próximos Passos Após a Pesquisa

Com o keyword universe validado:

1. **Handoff para `@pm`** — inputs para definir escopo do PRD e estrutura de sitemap
2. **Handoff para `@ux-design-expert`** — inputs para Information Architecture e silo topical
3. **Handoff para `@architect`** — inputs para definir estrutura programmatic (templates, content collections Astro, CMS schema)
4. **Handoff para redação** — calendário editorial ativo, briefings dos cornerstones
5. **Setup de tracking** — configurar GSC + Ahrefs/Semrush monitor das 50 keywords-alvo

---

**Nota final:** Este prompt é **self-contained** — pode ser executado por qualquer especialista SEO ou IA de pesquisa (Perplexity, Claude Research, GPT-4 com browsing) sem contexto adicional. Se o executor tiver acesso a Ahrefs/Semrush, os dados quantitativos são obtidos diretamente das ferramentas. Se não tiver, usar Google Keyword Planner (gratuito, menos preciso) e triangular com Google Trends + People Also Ask manuais como fallback.
