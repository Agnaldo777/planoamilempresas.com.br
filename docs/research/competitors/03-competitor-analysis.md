# Análise Competitiva — Satélite SEO Amil (Astro+Bun)

**Analista:** Atlas (AIOS @analyst)
**Data:** 2026-04-27
**Escopo:** Diagnóstico para ultrapassar amilplanos.com.br e planodesaudeamil.com.br nas SERPs orgânicas do Google.

---

## 1. Sumário Executivo

Os dois concorrentes são sites WordPress legados, com **arquitetura de SEO programático mediana** e **execução técnica fraca** (sem schema, sem meta description, preços de 2022, blog com spam). Existe uma janela clara de superação: replicar a estratégia volumétrica (~1500 city pages) **com qualidade técnica de Core Web Vitals, schema completo e conteúdo atualizado**, exatamente o que Astro+Bun entrega nativamente.

**Avaliação de competitividade:**
- amilplanos.com.br = **6,5/10** (tem volume, tem profundidade em algumas páginas, mas tecnicamente fraco)
- planodesaudeamil.com.br = **6/10** (mais moderno em UX, FAQ explícito, mas menor escala)

**Veredito:** ultrapassáveis em 6–9 meses se executarmos com disciplina técnica.

---

## 2. Pontos Fortes do Concorrente (replicar)

| # | Estratégia | Por quê funciona |
|---|-----------|------------------|
| 1 | **Programmatic SEO de cidades** (~1500 páginas, ~2.800 palavras cada com locais signals) | Captura "plano de saúde amil em [cidade]" em todo o Brasil |
| 2 | **Catálogo completo de produtos** (linhas Fácil, One, Bronze→Black, S380→S6500) | Long-tail por SKU |
| 3 | **Tabela de preços pública** (mesmo desatualizada) | Captura intent "tabela de preços amil", "valores plano amil" |
| 4 | **Página Coparticipação** com 2k+ palavras | Ranking informacional + autoridade |
| 5 | **Diferenciais bem listados** (17 USPs) | Conteúdo de cauda longa premium |
| 6 | **Múltiplos canais de contato** (3 phones + WhatsApp + email + form) | Conversão alta |
| 7 | **H2/H3 ricos em keyword** (StarkCorretora) | "convênio médico amil em São Paulo" como H2 puro |

## 3. Pontos Fracos do Concorrente (atacar)

| # | Falha | Como exploramos |
|---|-------|-----------------|
| 1 | **Sem meta descriptions** em quase todas as páginas | CTR superior em SERP com meta otimizada |
| 2 | **ZERO JSON-LD schema** detectado | Rich results (FAQ, Product, LocalBusiness, BreadcrumbList) |
| 3 | **Title tags genéricos** ("X – Planos Amil Saúde") | Titles otimizados com keyword + qualifier |
| 4 | **Páginas de produto rasas** (~3 H2s, baixa profundidade) | 8–12 H2 por página, conteúdo 1500+ palavras |
| 5 | **Tabela de preços de 2022** | Preços atualizados + selo "atualizado em {mês/ano}" |
| 6 | **Blog com 4 posts off-topic spam** (WNBA, Champions, casino) | Blog editorial real com 30+ artigos relevantes |
| 7 | **WordPress + UX Themes/Flatsome** = LCP/CLS médio | Astro = LCP <1s, CLS 0, TBT <50ms (Core Web Vitals 100/100) |
| 8 | **Sem FAQ schema explícito** (StarkCorretora tem página, não schema) | FAQPage schema + People Also Ask domination |
| 9 | **Sem breadcrumbs visíveis** | BreadcrumbList schema + UX melhor |
| 10 | **CTA repetitivo (5 phones em cada página)** | UX limpa: 1 CTA primário (simulador), 1 secundário (WhatsApp) |
| 11 | **Sufixo `-2` em city pages** (ex: `/sao-paulo-2/`) sugere bug de slug | Slugs limpos consolidados |
| 12 | **Sem AMP/PWA** | Web Vitals + offline cache |

## 4. Mapa de Keywords Inferidas (top 30)

Extraído por frequência ponderada (title 4x > H1 3x > H2 2x > body 1x):

### Tier 1 — Head terms (alta concorrência, alto volume)
1. plano de saúde amil
2. amil saúde
3. planos amil
4. convênio amil
5. amil empresarial
6. plano amil

### Tier 2 — Modificadores (média concorrência, alto intent)
7. tabela de preços amil
8. valores plano amil
9. coparticipação amil
10. plano amil individual
11. plano amil familiar
12. plano amil pme
13. plano amil empresarial
14. amil one
15. amil fácil
16. amil dental
17. amil bronze, amil prata, amil ouro, amil platinum, amil black (5 keywords)
18. rede credenciada amil

### Tier 3 — Cauda longa (baixa concorrência, alta conversão)
19. plano de saúde amil em [cidade] (×~1500 cidades)
20. plano amil por adesão
21. plano amil mei
22. corretora amil [cidade]
23. amil resgate
24. telemedicina amil
25. carências amil / redução de carências
26. reembolso amil
27. amil agências de atendimento
28. simulador plano amil
29. amil multiviagem
30. hospitais credenciados amil

---

## 5. Arquitetura de Informação Recomendada (Novo Site)

```
/
├── /amil/                              ← pillar page principal
├── /planos/                            ← hub de catálogo
│   ├── /individual/
│   ├── /familiar/
│   ├── /por-adesao/                    ← gap competitivo identificado
│   ├── /mei/                           ← gap competitivo
│   ├── /pme/
│   └── /empresarial/
├── /produtos/                          ← cluster por SKU
│   ├── /amil-bronze/  ├── /amil-bronze-sp/  ├── /amil-bronze-rj/
│   ├── /amil-prata/   ├── /amil-ouro/       ├── /amil-platinum/
│   ├── /amil-black/   ├── /amil-one/        ├── /amil-facil/
│   ├── /amil-next/    ├── /amil-dental/     └── /amil-medial/
├── /diferenciais/                      ← copiar os 17 USPs com aprofundamento
│   ├── /amil-resgate/
│   ├── /telemedicina/
│   ├── /espaco-saude/
│   ├── /coleta-domiciliar/
│   ├── /reducao-de-carencias/
│   └── /assistencia-internacional/
├── /preco/                             ← cluster comercial
│   ├── /tabela-de-precos/              ← atualizada mensalmente
│   ├── /coparticipacao/
│   ├── /reembolso/
│   └── /simulador/                     ← interativo, principal CTA
├── /rede/                              ← cluster de network
│   ├── /hospitais-credenciados/
│   ├── /clinicas/
│   ├── /laboratorios/
│   └── /buscar-rede/                   ← busca dinâmica (Bun backend)
├── /cidades/                           ← hub city pages
│   └── /[cidade]/                      ← ~5570 municípios brasileiros (SSG Astro)
├── /blog/
│   └── /[slug]/                        ← 30+ artigos editoriais reais
├── /faq/                               ← FAQPage schema
├── /contato/
└── /sobre/
```

**Decisões-chave:**
- **5570 city pages** (vs ~1500 do concorrente) = todos os municípios IBGE
- **6 sub-páginas de diferenciais** (vs 1 página única) = mais URLs ranqueáveis
- **`/por-adesao/`** = gap explícito (StarkCorretora menciona keyword mas amilplanos não tem URL própria)
- **`/buscar-rede/`** = backend Bun com banco de hospitais → ranking + lead gen
- **`/simulador/`** = principal CTA, página de alta conversão

---

## 6. Pillar Pages e Cluster Topics

### Pillar 1: `/amil/` (Pillar — “tudo sobre Amil”)
**Clusters internos:**
- /planos/* (6 sub-páginas)
- /produtos/* (12 sub-páginas)
- /diferenciais/* (6 sub-páginas)

### Pillar 2: `/preco/` (Pillar — “tudo sobre preço Amil”)
**Clusters internos:**
- /preco/tabela-de-precos/
- /preco/coparticipacao/
- /preco/reembolso/
- /preco/simulador/
- Posts de blog com tópicos: "amil é caro?", "como economizar plano amil", "comparar amil vs bradesco"

### Pillar 3: `/rede/` (Pillar — “rede credenciada”)
**Clusters internos:**
- /rede/hospitais-credenciados/
- /rede/[hospital-slug]/ (gerar página por hospital top-100)
- /rede/clinicas/
- /rede/laboratorios/
- /rede/buscar-rede/

### Pillar 4: `/cidades/` (Pillar — local SEO)
**Cada city page contém:**
- H1: "Plano de Saúde Amil em [Cidade] — [Estado]"
- Hospitais credenciados locais (snippet de /rede/)
- Tabela de preços local (regional pricing)
- FAQs locais ("Onde tem agência Amil em [cidade]?")
- Schema LocalBusiness + BreadcrumbList

---

## 7. Schema.org Plan Completo

| Schema | Onde aplicar | Benefício SERP |
|--------|--------------|----------------|
| **Organization** | `/`, `/sobre/` | Knowledge Panel |
| **LocalBusiness** | `/cidades/[cidade]/` (×5570) | Pacote local + mapa |
| **Product** | `/produtos/[slug]/` (×12+) | Rich product results |
| **Offer** + **AggregateOffer** | dentro de cada Product | Preço em SERP |
| **FAQPage** | `/faq/` + cada `/produtos/*` | "People Also Ask" |
| **BreadcrumbList** | TODAS as páginas | Breadcrumb visual em SERP |
| **MedicalBusiness** ou **MedicalClinic** | `/rede/[hospital]/` | Categoria saúde |
| **Article** + **BlogPosting** | `/blog/[slug]/` | Top stories carousel |
| **HowTo** | tutoriais ("como contratar plano amil") | Step-by-step na SERP |
| **Review** + **AggregateRating** | páginas de produto | ★★★★★ em SERP (somente se autêntico — proibido fake) |
| **WebSite** + **SearchAction** | `/` | Sitelinks search box |

---

## 8. Gaps de Conteúdo (oportunidades não exploradas)

| Gap | Por quê é oportunidade | Implementação |
|-----|------------------------|---------------|
| **Plano Amil por Adesão dedicado** | StarkCorretora referencia mas amilplanos não tem URL | `/planos/por-adesao/` com 1500 palavras |
| **Comparador entre planos** | Nenhum dos 2 tem | `/comparar/?planos=bronze,prata,ouro` (interativo) |
| **Calculadora de carências** | Mencionado em texto, sem ferramenta | Widget JS calculador |
| **Mapa interativo de hospitais** | Lista plana | Mapa Leaflet/Mapbox |
| **Reviews/Avaliações reais** | Ausente | Seção com depoimentos verificáveis |
| **Comparação Amil vs concorrentes** | Tabu nos sites Amil | Posts: "Amil vs Bradesco", "Amil vs SulAmérica" |
| **FAQ schema explícito** | Stark tem página /duvidas-frequentes/ sem schema | FAQPage schema + 50+ Q&As |
| **Blog editorial real** | Concorrente tem 4 posts spam | 30 artigos sobre saúde, reforma da ANS, prazos legais |
| **YouTube/Video schema** | Ausente | Vídeos curtos por plano com VideoObject schema |
| **WhatsApp Business Catalog** | Ausente | Integração — diferencial UX/conversão |
| **Glossário de termos** | Ausente | `/glossario/` com FAQs sobre carência, coparticipação, reembolso, ANS, RN |
| **Selo de atualização** | "Tabela 2022" sem aviso | Campo `<time datetime>` + selo "Atualizado em {mês/ano}" |

---

## 9. Anti-Padrões a Evitar (lições do concorrente)

1. **Não publicar conteúdo off-topic no blog** (WNBA, casino, futebol) — destrói relevância semântica e atrai penalização de spam.
2. **Não duplicar slugs** (sufixo `-2`) — gera canibalização de keywords.
3. **Não deixar preços desatualizados públicos** — atualização ≤30 dias OU remover datas.
4. **Não repetir 5 telefones em todas as páginas** — UX ruim, dilui CTA.
5. **Não usar tema WordPress pesado** — Astro + 0 KB JS por padrão.
6. **Não esquecer meta description / Open Graph** — checklist obrigatório por página.

---

## 10. Métricas de Sucesso (definir com @pm)

**Não claimo % específicos sem fonte** (lição: ver `feedback_claims_metricas.md` em memória).

Indicadores qualitativos a monitorar (ferramenta a definir: GSC + GA4 + Ahrefs/SEMRush):
- Posição média para keywords Tier 1, 2, 3
- Páginas indexadas pelo Google (objetivo: ≥5570 indexadas em 6 meses)
- CTR médio em SERPs
- Core Web Vitals (LCP <1.5s, CLS <0.1, INP <200ms)
- Backlinks (DR / DA crescente)
- Conversões via simulador / WhatsApp

A/B test continuamente; honestidade nos relatórios mensais.

---

## 11. Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| **Penalização por uso da marca "Amil"** | Média | Disclaimers claros: "site de corretora autorizada", footer com SUSEP/CNPJ; não usar logo Amil sem autorização |
| **Conteúdo programático percebido como AI/thin content** | Alta | Gerar com diferenciação real por cidade (hospitais locais, planos disponíveis, contatos regionais) — variação semântica |
| **Concorrência reage atualizando** | Baixa-Média | Velocidade de execução; nicho técnico (Astro + schema rico) demora mais para clonar |
| **Domínio novo demora 4-6 meses** | Alta | Linking interno do hub planodesaudepj.com.br (carry authority); guest posts em blogs de saúde |
| **Custos de hospedagem com 5570 city pages** | Baixa | Astro SSG + Cloudflare Pages = grátis até 500 builds/mês, CDN global |

---

## 12. Recomendação para Próxima Fase (handoff @pm)

Atlas → Morgan (@pm):
- ✅ Use este relatório como input principal do PRD
- ✅ Priorize MVP enxuto: 1 pillar (`/amil/`) + 6 product pages + 5 city pages-piloto + 1 blog post + simulador funcional → testar SEO técnico antes de escalar para 5570 cidades
- ✅ Defina cadência de publicação de city pages (sugiro 100/semana após validação técnica)
- ✅ Inclua KPIs sem inventar números — definir baselines reais via GSC após 30 dias
- ✅ Considerar contratar editor de saúde (não inventar conteúdo médico)

— Atlas, investigando a verdade 🔎
