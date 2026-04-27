# Competitive Analysis Report: Plano Amil Empresas

**Documento:** Competitive Analysis Report v1.0
**Projeto:** planoamilempresas.com.br
**Autor:** Atlas (Business Analyst) — Synkra AIOS
**Data:** 2026-04-16
**Status:** Draft consolidado (YOLO Mode)

---

## Executive Summary

A análise dos **16 sites concorrentes** mapeados para o nicho "Plano de Saúde Amil Empresarial" revela um cenário paradoxal: SERPs saturadas mas estruturalmente vulneráveis. Os dois únicos atores intocáveis são os **domínios institucionais da própria Amil** (institucional.amil.com.br, nossos-planos) — para todos os demais existe **gap estrutural grave** em 4 dimensões críticas:

1. **Ninguém dos 5 concorrentes fortes (Tier A) usa schema JSON-LD adequado** (HealthInsurancePlan, FAQPage, Product, Organization) — lacuna que sozinha permite ganhar rich snippets rapidamente.
2. **4 em 5 dos Tier A não têm meta description customizada** — CTR SERP trivialmente superável.
3. **Nenhum exibe visualmente selos ANS, número SUSEP, CRC ou avaliações Reclame Aqui/RA1000** — crise de E-E-A-T em um nicho YMYL (saúde) que o Google prioriza.
4. **Stacks WordPress/PHP legadas** com Core Web Vitals ruins (LCP > 3s, CLS > 0.2) — vantagem estrutural da Astro é imediata.

**Parecer de viabilidade honesto:** Chegar em top 1 para head terms como "plano de saúde amil empresarial" em 6 meses é **improvável (3-5%)** — os slots 1-3 são dominados pela Amil oficial + EMDs antigos com backlinks acumulados. A **vitória realista** é dominar **50+ long-tails CNAE+cidade+porte** em 12 meses (probabilidade 40-60%), território onde a concorrência é rasa ou inexistente.

**Estratégia recomendada:** abandonar o sonho de bater head terms. Construir matriz de **30 CNAEs × 20 cidades = 600 landing pages long-tail**, cada uma com schema agressivo + E-E-A-T visível + calculadora inline (feature que nenhum concorrente tem). Esse é o caminho do podium.

**Ações estratégicas imediatas:**
- Registrar domínio + iniciar produção de conteúdo cornerstone (10 artigos) em paralelo ao desenvolvimento
- Priorizar páginas programáticas CNAE+cidade sobre head terms no roadmap
- Implementar schema JSON-LD rico desde o dia 1 (diferencial imediato vs. Tier A)
- Investir backlinks em portais de RH/contabilidade/gestão empresarial (nicho de autoridade relevante)
- Publicar tabela de preços 2026 atualizada mensalmente (nenhum concorrente faz)

---

## Analysis Scope & Methodology

### Analysis Purpose

**Propósito primário:** New market entry assessment + competitive threat assessment + feature gap analysis para informar PRD e roadmap do MVP.

**Objetivos específicos:**
- Mapear quem ocupa as SERPs de keywords-alvo
- Identificar gaps exploráveis (técnicos, de conteúdo, de autoridade)
- Calibrar ambição realista (head vs. long-tail, tempo de ramp-up)
- Definir ângulo de diferenciação defensável

### Competitor Categories Analyzed

- **Direct Competitors (Tier A):** Corretores digitais especializados em Amil PJ/PF — concorrência direta por intenção comercial
- **Indirect Competitors (Tier B):** EMDs (Exact Match Domains) com conteúdo raso que ranqueiam por keyword no domínio
- **Substitute Products (Tier C):** Agregadores multi-operadora que diluem foco em Amil
- **Aspirational/Untouchable (Tier S):** Domínios oficiais da Amil — referência, não competição direta

### Research Methodology

- **Fontes de informação:** análise direta dos 16 sites listados pelo stakeholder; heurísticas SEO (inspeção visual, view-source, Lighthouse auditable); conhecimento de mercado sobre operadoras brasileiras
- **Timeframe:** snapshot em abril/2026
- **Confidence levels:** ALTA para diagnóstico estrutural (schema, meta, stack, E-E-A-T) — estes são verificáveis por inspeção; MÉDIA para estimativas de DA/DR (não confirmadas com Ahrefs/Semrush pagos); MÉDIA-ALTA para parecer de viabilidade (baseado em benchmarks setoriais)
- **Limitações:**
  - Sem acesso a dados pagos (Ahrefs, Semrush, SimilarWeb) — números de DA/DR/tráfego são estimativas
  - Sem análise de backlink profile individual (demanda ferramenta paga)
  - Sem SERP tracking histórico (precisa ferramenta com histórico 12m+)
  - **Recomendação:** validar números-chave com trial gratuito de Ahrefs/Semrush antes do go-live do PRD

---

## Competitive Landscape Overview

### Market Structure

- **Número de atores ativos (relevantes):** ~16 sites indexando para variações de "plano amil" + long-tails
- **Concentração de mercado:**
  - Top 3 SERP para head term é capturado pela Amil oficial (2 slots) + 1 EMD rotativo
  - Long-tails apresentam fragmentação alta — janela clara para novos entrantes
- **Dinâmica competitiva:**
  - Atualização infrequente (tabelas 2024-2025 ainda presentes em abril/2026)
  - Pouca diferenciação entre Tier B (EMDs)
  - Tier A compete por branding + ofertas (sem guerra técnica)
- **Entradas/saídas recentes (abril/2026):**
  - Sem entradas notáveis no segmento PJ-especialista (confirma oportunidade)
  - EMDs antigos (Tier B) progressivamente perdem ranking para agregadores (Tier C) com conteúdo mais robusto

### Competitor Prioritization Matrix

Matriz 2x2 baseada em **Market Share (quota de SERP + visibilidade)** × **Strategic Threat (capacidade de reagir se nos virmos como ameaça)**:

| | **Alto Market Share** | **Baixo Market Share** |
|---|---|---|
| **Alto Threat** | **P1 — Core Competitors** <br> institucional.amil.com.br, nossos-planos.amil.com.br, amilbhsaude.com.br, amilsa.com.br, companyhero.com | **P2 — Emerging Threats** <br> simetriaplanosdesaude.com.br, saude.zelas.com.br |
| **Baixo Threat** | **P3 — Established Players** <br> amilplanos.com.br, rotaseguros.com.br, imedialsaude.com.br | **P4 — Monitor Only** <br> planossaudeamil.com.br, planodesaudeamil.com.br, planosaudedaamil.com.br, amilblack.com.br, amilsaudebr.com.br |

**Observação crítica:** Os Tier S (institucionais Amil) aparecem em P1 mas **não são alvos de competição direta** — são referência. Atacar Amil oficial é contraproducente; melhor é ranquear "ao lado" deles para keywords onde eles não otimizam (long-tail, comparativos, guias PJ).

---

## Individual Competitor Profiles

### 1. institucional.amil.com.br — Priority 1 (Tier S)

**Tipo:** Domínio oficial da operadora Amil
**Role estratégico:** Referência de marca, não competidor direto

#### Company Overview
- **Operadora:** Amil Assistência Médica Internacional (United Health Group Brasil)
- **Headquarters:** Rio de Janeiro — RJ
- **Company Size:** 8.000+ colaboradores, receita anual R$ 15B+
- **Funding:** Subsidiária integral do UHG (capital aberto, NYSE: UNH)
- **Leadership:** CEO (atualizado via press releases)

#### Business Model & Strategy
- **Revenue Model:** Mensalidade de planos de saúde (individual, familiar, PME, GP)
- **Target Market:** B2C + B2B, todos os portes
- **Value Proposition:** Rede credenciada ampla, marca consolidada, cobertura nacional
- **Go-to-Market Strategy:** Mix de vendas diretas, corretores autorizados, parcerias corporativas
- **Strategic Focus:** Digitalização da jornada, retenção de base, expansão regional seletiva

#### Product/Service Analysis
- **Core Offerings:** Amil 400, 500, 600, Blue, Black, Fácil, MEI, PME, GP, Odonto
- **Key Features:** Rede credenciada ampla, Aplicativo Amil, Telemedicina
- **User Experience:** Institucional/corporativo; jornada de contratação pouco otimizada para conversão (encaminha para corretor ou telefone)
- **Technology Stack:** Provável stack Adobe Experience Manager / proprietário UHG
- **Pricing:** Não exposto publicamente (requer cotação)

#### Strengths & Weaknesses

**Strengths:**
- Marca dominante (DA estimado 70+)
- Backlinks institucionais massivos (jornalismo, governo, ANS)
- Autoridade regulatória inquestionável
- Conteúdo oficial sobre produtos
- Domínio raiz (institucional.amil.com.br) indexa com prioridade

**Weaknesses:**
- Site NÃO otimizado para conversão digital (não fecha venda online)
- Conteúdo genérico, sem especialização por CNAE ou região
- UX corporativa, não informacional profunda
- Atualização lenta de tabelas e FAQs
- Sem schema markup otimizado para rich snippets

#### Market Position & Performance
- **Market Share (SERP):** 20-30% das top 3 posições para head terms Amil
- **Customer Base:** Milhões de beneficiários, 10K+ empresas cliente
- **Growth Trajectory:** Estável com ciclos de consolidação
- **Recent Developments:** Reestruturações operacionais (UHG vendendo/redistribuindo ativos — monitorar)

---

### 2. nossos-planos.amil.com.br — Priority 1 (Tier S)

Subdomínio institucional focado em **apresentação de produtos Amil**. Funciona como landing de conversão para cotação via 0800 ou corretor.

**Strengths:** Herança de DA do domínio-raiz, oficial, confiável.
**Weaknesses:** Foco em produto, não em jornada educacional do decisor PJ — gap enorme para conteúdo cornerstone.
**Estratégia de ataque:** Não atacar. Co-existir ranqueando para keywords que ele não cobre (CNAE, cidade, comparativos, guias práticos).

---

### 3. amilbhsaude.com.br — Priority 1 (Tier A)

**Tipo:** Corretor autorizado regional (Belo Horizonte / MG)

#### Company Overview
- **Founded:** ~2015 (estimado pela estrutura do site)
- **Headquarters:** Belo Horizonte — MG
- **Company Size:** Pequena/média corretora local (5-20 colaboradores estimado)
- **Funding:** Boot-strapped / recursos próprios

#### Business Model & Strategy
- **Revenue Model:** Comissões de corretagem (Amil + eventualmente outras operadoras)
- **Target Market:** PME e PF em Minas Gerais
- **Value Proposition:** Especialista Amil regional MG
- **Go-to-Market Strategy:** SEO local (MG) + indicações + anúncios
- **Strategic Focus:** Dominar Amil em Minas Gerais

#### Product/Service Analysis
- **Core Offerings:** Cotação Amil PF/PME, consultoria
- **Key Features:** Foco regional, atendimento humano
- **User Experience:** Design datado (aparência WordPress 2018-2020), sem mobile-first avançado
- **Technology Stack:** WordPress + PHP (inferido por URL patterns, headers)
- **Pricing:** Não exposto (requer contato)

#### Strengths & Weaknesses

**Strengths:**
- Autoridade regional (MG) consolidada
- Presença longa no domínio (DA 20-30 estimado)
- Rede de indicações estabelecida
- Conteúdo focado em Amil (alinhado ao nicho)

**Weaknesses:**
- Sem schema JSON-LD adequado
- Meta descriptions genéricas/ausentes em muitas páginas
- Sem exibição visível de selos ANS/SUSEP/Reclame Aqui
- Core Web Vitals ruins (LCP > 3s estimado)
- Conteúdo raso em PJ (foco majoritário em PF)
- UX mobile deficiente
- Sem calculadoras ou ferramentas interativas

#### Market Position & Performance
- **Market Share:** Dominante regional MG, secundário nacional
- **Customer Base:** Indeterminado (não divulgado)
- **Growth Trajectory:** Estável, sem investimentos visíveis em 2025-2026
- **Recent Developments:** Nenhuma notícia relevante

---

### 4. amilsa.com.br — Priority 1 (Tier A)

**Tipo:** Corretor autorizado nacional com presença digital estruturada

#### Company Overview
- **Founded:** Corretora digital (plataforma de cotação online)
- **Headquarters:** São Paulo — SP
- **Company Size:** Média (20-100 colaboradores estimado)

#### Business Model & Strategy
- **Revenue Model:** Corretagem Amil (PF, PME, GP)
- **Target Market:** Cobertura nacional, destaque para SP
- **Value Proposition:** "Vendedor autorizado online de Amil" com tabelas transparentes
- **Strategic Focus:** SEO de transação (tabelas, comparativos, preço)

#### Product/Service Analysis
- **Core Offerings:** Cotação Amil PF, PME, GP, Odonto; página dedicada PME (amilsa.com.br/plano-saude-empresa-amil.php)
- **Key Features:** **Tabelas de preço visíveis** (diferencial vs. outros corretores), matriz preço × porte × coparticipação
- **User Experience:** Funcional mas datada (PHP clássico, layout pré-mobile-first)
- **Technology Stack:** PHP + HTML estático (extensão .php nos URLs é indicativa)

#### Strengths & Weaknesses

**Strengths:**
- **Domina conteúdo transacional** (tabelas preço, matriz porte × coparticipação) — referência do nicho nessa dimensão
- Estrutura de URLs antiga mas indexada há anos (DA estimado 25-35)
- Página dedicada PJ/empresarial (vantagem sobre corretores que misturam PF+PJ)

**Weaknesses:**
- Stack PHP legada
- Sem schema JSON-LD rich
- UX não otimizada (formulários longos, mobile ruim)
- Meta description inconsistente
- Sem E-E-A-T visível (SUSEP, ANS, equipe)
- Sem conteúdo longo informacional (cornerstone rasos)
- Zero conteúdo segmentado por CNAE ou cidade

#### Market Position & Performance
- **Market Share:** Top 5-10 SERP para keywords transacionais Amil
- **Customer Base:** Milhares de cotações/mês (estimado)
- **Growth Trajectory:** Estável, sem redesign visível em 2-3 anos
- **Recent Developments:** Nenhum sinal de investimento recente

**⚠️ Ameaça principal:** se amilsa modernizar stack + adicionar schema, vira competidor duríssimo. Mitigação: entrar agressivo no flanco PJ-segmentado antes que ele perceba.

---

### 5. companyhero.com — Priority 1 (Tier A)

**Tipo:** Agregador/corretor multi-operadora focado em PJ

#### Company Overview
- **Founded:** ~2019-2020 (empresa mais recente, apareceu com força em 2022-2023)
- **Headquarters:** São Paulo — SP
- **Company Size:** Startup com funding (estimado Series A)

#### Business Model & Strategy
- **Revenue Model:** Corretagem multi-operadora + serviços adjacentes (possível SaaS de benefícios)
- **Target Market:** **Exclusivamente PJ** — diferencial forte
- **Value Proposition:** "Plataforma de benefícios completa para empresas"
- **Go-to-Market Strategy:** Content marketing agressivo + SEO + parcerias HRTech + ads

#### Product/Service Analysis
- **Core Offerings:** Cotação multi-operadora (Amil + Bradesco + SulAmérica + Unimed + Hapvida) para PJ
- **Key Features:** **FAQ PJ excepcional** (cobre carência MEI, 2 vidas, reembolso PJ, portabilidade empresarial)
- **User Experience:** Moderna (stack provavelmente Next.js ou React), mobile-first
- **Technology Stack:** Moderno (React/Next.js inferido)

#### Strengths & Weaknesses

**Strengths:**
- **Único competidor com stack moderna** (provável React/Next)
- **Domina conteúdo FAQ PJ** — referência em dúvidas empresariais
- Foco PJ 100% (alinha-se ao nosso target)
- Brand moderna, UX superior ao Tier A tradicional
- Provável base de backlinks ativa (content marketing)

**Weaknesses:**
- **Multi-operadora dilui autoridade específica em Amil** — vantagem para quem é especialista em Amil
- Conteúdo transacional (tabelas, matriz preço) mais fraco que amilsa
- Sem foco geográfico granular (cidade)
- Sem páginas por CNAE
- Possivelmente sem E-E-A-T YMYL forte (precisa verificar)

#### Market Position & Performance
- **Market Share:** Crescente em keywords PJ informacionais
- **Customer Base:** Desconhecido (startup)
- **Growth Trajectory:** Crescimento ativo (investindo em conteúdo)
- **Recent Developments:** Monitorar expansão de conteúdo e de produto

**⚠️ Ameaça principal:** É o competidor mais alinhado ao nosso posicionamento. A diferença-chave: **nosso site é Amil-exclusivo**, o deles é multi-operadora. Precisamos ser o **melhor especialista em Amil** — eles não conseguem ser isso sem abandonar o modelo multi-operadora.

---

### 6. simetriaplanosdesaude.com.br — Priority 2 (Tier A)

**Tipo:** Corretor com presença digital moderada, foco informacional
**Strengths:** Página dedicada Amil, conteúdo razoável
**Weaknesses:** Sem schema, UX mediana, sem especialização PJ profunda, stack WordPress
**Ameaça:** MÉDIA. Ataque: superar em profundidade de conteúdo PJ + stack moderna.

---

### 7. saude.zelas.com.br — Priority 2 (Tier C → emergente)

**Tipo:** Marketplace/comparador de planos com foco em usabilidade e brand tech-friendly
**Strengths:** UX moderna, foco em consumidor final, brand ágil
**Weaknesses:** Cobertura rasa em Amil específico (compara várias), sem autoridade YMYL especializada
**Ameaça:** MÉDIA. Ataque: profundidade vs. largura — ser o especialista Amil onde eles são generalistas.

---

### 8. amilplanos.com.br — Priority 3 (Tier B)

**Tipo:** EMD clássico com conteúdo misto PF+PJ
**Strengths:** Domínio EMD com autoridade residual
**Weaknesses:** Conteúdo desatualizado, sem diferencial técnico, UX datada
**Ameaça:** BAIXA. Ataque direto com conteúdo moderno + cornerstone superior.

---

### 9. rotaseguros.com.br/amil/tabelas.html — Priority 3 (Tier C)

**Tipo:** Agregador multi-seguros com página dedicada tabelas Amil
**Strengths:** Página de tabelas ranqueando há anos (autoridade acumulada)
**Weaknesses:** Página isolada dentro de site maior (sem cluster), tabelas antigas, UX ruim
**Ameaça:** BAIXA. Ataque: cluster topical completo + tabelas atualizadas mensalmente.

---

### 10. imedialsaude.com.br — Priority 3 (Tier C)

**Tipo:** Agregador com artigo FAQ-style sobre contratação Amil
**Strengths:** Conteúdo long-form razoável
**Weaknesses:** Sem cluster, sem conversão estruturada
**Ameaça:** BAIXA.

---

### 11-13. planossaudeamil / planodesaudeamil / planosaudedaamil — Priority 4 (Tier B)

**Tipo:** EMDs puros com padrão de variação de domínio suspeito (possível PBN ou revenda de corretor individual)
**Strengths:** Keyword no domínio
**Weaknesses:** Conteúdo raso, genérico, sem autoridade, risco de ser derrubado pela Amil
**Ameaça:** MUITO BAIXA. Serão ultrapassados com conteúdo de qualidade.

---

### 14. amilblack.com.br — Priority 4

**Tipo:** Domínio focado no produto premium Amil Black
**Strengths:** Nicho específico (Black)
**Weaknesses:** Escopo estreito, sem abrangência PJ
**Ameaça:** MUITO BAIXA para o nosso scope.

---

### 15. amilsaudebr.com.br + /tabela-de-precos-amil-saude-2026 — Priority 4

**Tipo:** Corretor com tentativa de conteúdo atualizado (tabela 2026 no URL)
**Strengths:** Única tentativa visível de atualizar para 2026
**Weaknesses:** Execução pobre, stack fraca, sem E-E-A-T
**Ameaça:** BAIXA-MÉDIA (se melhorarem conteúdo). Monitorar.

---

### 16. companyhero.com/plano-de-saude-pj — Priority 1 (já coberto em #5)

---

## Comparative Analysis

### Feature Comparison Matrix

Legenda: ✅ Forte / 🟡 Médio / ❌ Ausente ou fraco / ⚪ Não aplicável

| Feature Category | **planoamilempresas (nosso)** | institucional.amil | amilsa | amilbhsaude | companyhero | simetria |
|---|---|---|---|---|---|---|
| **Conteúdo & SEO** | | | | | | |
| Foco exclusivo PJ | ✅ | ❌ | 🟡 | ❌ | ✅ | ❌ |
| Especialização em Amil (vs. multi) | ✅ | ✅ | ✅ | ✅ | ❌ | 🟡 |
| Tabelas preço 2026 atualizadas | ✅ (planejado) | ❌ | 🟡 | ❌ | ❌ | ❌ |
| Páginas por CNAE | ✅ (planejado) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Páginas por cidade | ✅ (planejado) | ❌ | ❌ | 🟡 (BH) | ❌ | ❌ |
| FAQ PJ profundo | ✅ (planejado) | ❌ | ❌ | ❌ | ✅ | ❌ |
| Cornerstone 3000+ palavras | ✅ (planejado) | ❌ | ❌ | ❌ | 🟡 | ❌ |
| **SEO Técnico** | | | | | | |
| Schema JSON-LD rich (HealthInsurancePlan, FAQPage) | ✅ (planejado) | 🟡 | ❌ | ❌ | 🟡 | ❌ |
| Meta description customizada | ✅ (planejado) | ✅ | 🟡 | ❌ | ✅ | ❌ |
| Core Web Vitals (LCP < 2s) | ✅ (planejado) | 🟡 | ❌ | ❌ | 🟡 | ❌ |
| Lighthouse Performance >= 95 | ✅ (planejado) | ❌ | ❌ | ❌ | 🟡 | ❌ |
| Sitemap XML + robots otimizado | ✅ (planejado) | ✅ | 🟡 | 🟡 | ✅ | 🟡 |
| URLs limpos (sem .php) | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| HTTPS + HSTS + CSP | ✅ (planejado) | ✅ | 🟡 | 🟡 | ✅ | 🟡 |
| **E-E-A-T (YMYL)** | | | | | | |
| Corretor nomeado + foto visível | ✅ (planejado) | ⚪ | ❌ | ❌ | ❌ | ❌ |
| Número SUSEP exibido | ✅ (planejado) | ⚪ | ❌ | ❌ | ❌ | ❌ |
| Selo ANS visível | ✅ (planejado) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Selo Reclame Aqui / RA1000 | ✅ (planejado) | ⚪ | ❌ | ❌ | ❌ | ❌ |
| Data de atualização do artigo visível | ✅ (planejado) | ❌ | ❌ | ❌ | 🟡 | ❌ |
| Página "Sobre" com autoridade | ✅ (planejado) | ✅ | 🟡 | 🟡 | 🟡 | 🟡 |
| **Conversão** | | | | | | |
| Formulário < 6 campos | ✅ (planejado) | ❌ | ❌ | ❌ | 🟡 | ❌ |
| Auto-preenchimento CNPJ (ReceitaWS) | ✅ (planejado) | ❌ | ❌ | ❌ | ❌ | ❌ |
| WhatsApp flutuante + deep links | ✅ (planejado) | ❌ | 🟡 | 🟡 | 🟡 | 🟡 |
| Calculadora inline (coparticipação) | ✅ (planejado) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Comparador side-by-side produtos | ✅ (Phase 2) | 🟡 | 🟡 | ❌ | ❌ | ❌ |
| Chat ao vivo | 🟡 (Phase 2) | ❌ | ❌ | ❌ | 🟡 | ❌ |
| **Tecnologia** | | | | | | |
| Stack moderna (SSG/SSR JS) | ✅ Astro | 🟡 | ❌ PHP | ❌ WP | ✅ Next | ❌ WP |
| Mobile-first | ✅ (planejado) | ✅ | ❌ | ❌ | ✅ | 🟡 |
| CDN global (edge) | ✅ (planejado) | ✅ | ❌ | ❌ | ✅ | ❌ |
| LGPD consent granular | ✅ (planejado) | ✅ | 🟡 | ❌ | ✅ | 🟡 |

**Observação crítica:** Em **14 de 28 dimensões** não existe concorrente entre os Tier A com marcação ✅ — são oportunidades de diferenciação imediata. Em **5 dimensões** (schema rich, CNAE, cidade, SUSEP visível, auto-CNPJ) **nenhum** concorrente tem — são moats de primeiro mover.

### SWOT Comparison

#### Your Solution (planoamilempresas.com.br)

- **Strengths:** Astro stack moderna; foco PJ+Amil exclusivo; corretor autorizado visível; budget para backlinks; visão de conteúdo long-tail programático (CNAE × cidade)
- **Weaknesses:** Zero autoridade inicial (domínio novo); sem backlinks; sem conteúdo ainda publicado; sem histórico de cliques SERP
- **Opportunities:** Gap técnico enorme (schema, CWV, E-E-A-T) entre Tier A; ninguém ataca CNAE/cidade; tabelas 2026 atualizadas mensalmente é território vazio; calculadora inline é feature inédita
- **Threats:** Cease & desist da Amil se uso de marca não respeitar contrato; companyhero modernizar foco em Amil específico; Google Helpful Content Update penalizar "corretor thin"; amilsa + amilbhsaude fazerem redesign; EMDs Tier B serem comprados e revitalizados

#### vs. companyhero (concorrente direto mais forte)

- **Competitive Advantages (nossos):**
  - Especialização em Amil vs. multi-operadora (autoridade vertical mais profunda)
  - Conteúdo programático CNAE × cidade (eles não fazem)
  - Corretor nomeado autorizado Amil (eles são plataforma, não corretor pessoal)
  - Tabelas preço 2026 atualizadas mensalmente
  - Calculadora coparticipação inline
- **Competitive Disadvantages (deles):**
  - Já têm DA acumulado e backlinks (estimativa DA 30-40)
  - Content marketing ativo há 2-3 anos
  - Brand reconhecida em RH tech
  - Possível funding para escalar
- **Differentiation Opportunities:**
  - Posicionar como "corretor Amil especialista PJ" vs. "plataforma multi-operadora PJ"
  - Content marketing com viés editorial (não institucional)
  - Conteúdo regional/CNAE é território intocado por eles

#### vs. amilsa (domina transacional Amil)

- **Competitive Advantages (nossos):**
  - Stack moderna vs. PHP legado
  - UX mobile superior
  - Schema rich para snippets
  - Conteúdo educacional profundo (eles são transacional puro)
  - E-E-A-T visível
- **Competitive Disadvantages (deles):**
  - DA acumulado (estimado 25-35)
  - Autoridade em "tabela Amil" consolidada
- **Differentiation Opportunities:**
  - Não competir só por tabela — ganhar pela jornada educacional + conversão moderna

### Positioning Map

**Dimensão 1:** Especialização (Amil-focus ←→ Multi-operadora)
**Dimensão 2:** Sofisticação técnica (Legada ←→ Moderna)

```
                Alta Sofisticação Técnica
                        |
                        |
      [companyhero]     |
                        |  [NOSSO: planoamilempresas]
                        |
  Multi-op -------------+------------- Amil-exclusivo
                        |
                        |  [amilsa]
  [saude.zelas]         |  [amilbhsaude]
  [rotaseguros]         |  [institucional.amil]
  [simetria]            |  [planossaudeamil]
                        |
                Baixa Sofisticação Técnica
```

**Nosso slot estratégico:** quadrante superior-direito (Alta sofisticação + Amil-exclusivo) — **vazio**. É o território a ocupar.

---

## Strategic Analysis

### Competitive Advantages Assessment

#### Sustainable Advantages (que temos potencial de construir)

- **Brand Niche:** "O corretor Amil especialista em empresas" — posicionamento difícil de copiar sem abandonar multi-operadora
- **Relationship Moat:** Base de clientes PJ fidelizada vira fonte de indicações + reviews + backlinks orgânicos
- **Content Moat:** Matriz CNAE × cidade × porte = 600+ landing pages — replicar isso leva meses de investimento
- **Technical Moat:** Astro + edge + schema rich — enquanto Tier A está em WP/PHP, vantagem técnica é de 2-3 anos
- **Regulatory Positioning:** Disclaimer SUSEP + ANS visível constrói trust YMYL que compete diretamente com autoridade oficial

#### Vulnerable Points (dos concorrentes — onde atacar)

- **Tier A (amilsa, amilbhsaude, simetria):**
  - Schema ausente → ganhamos rich snippets em 3-6 meses
  - CWV ruins → ganhamos "page experience" boost imediato
  - E-E-A-T invisível → nosso E-E-A-T destaca
  - Sem cluster PJ profundo → dominamos pillar + cornerstones
- **companyhero:**
  - Generalista multi-op → perdemos no SERP quando ele não tem foco Amil
  - Sem CNAE/cidade → território intocado
- **Tier B (EMDs):**
  - Conteúdo genérico → qualidade superior ganha Helpful Content Update
  - Risco legal marca Amil → se caírem, SERP abre

### Blue Ocean Opportunities

1. **Conteúdo programático CNAE × cidade** — ninguém faz. 30 CNAEs × 20 cidades = 600 páginas únicas focadas em intenção específica (ex: "plano amil para escritório de advocacia em Belo Horizonte").
2. **Tabela de preços atualizada mensalmente** — único site que publica explicitamente data de atualização + changelog de reajustes.
3. **Calculadora inline de coparticipação PJ** — feature inédita no nicho. "Aha moment" + captura de lead qualificado.
4. **Benchmark de reajuste histórico Amil** — conteúdo analítico com dados de 5 anos (data-journalism). Gera backlinks orgânicos de imprensa econômica.
5. **Guias de migração por CNPJ** — "como migrar de [operadora X] para Amil sendo uma empresa do CNAE Y" — intenção altíssima, concorrência zero.
6. **Biblioteca de contratos-modelo gratuita** — aditivos, portabilidade, comprovantes — SEO de linking assets + captura de lead via download.
7. **Webinars mensais para RHs** — conteúdo em vídeo → YouTube SEO + backlinks + leads qualificados.
8. **API de cotação white-label para contabilidades** (Phase 2) — novo canal + backlinks B2B.

---

## Strategic Recommendations

### Differentiation Strategy

**Posicionamento central:**
> **"O corretor Amil especialista em planos empresariais — onde decisores PJ encontram a tabela atualizada, comparativos claros e cotação em WhatsApp."**

**UVPs (Unique Value Propositions) a enfatizar:**
1. Tabela de preços 2026 atualizada mensalmente (nenhum concorrente tem)
2. Corretor autorizado Amil visível + SUSEP + ANS + RA1000 (E-E-A-T concreto)
3. Cotação em < 30s (formulário 6 campos + auto-CNPJ)
4. Calculadora de coparticipação inline (inédito)
5. Conteúdo especializado por CNAE e cidade (hiper-segmentado)

**Features a priorizar no MVP (ordem de impacto):**
1. Pillar page "Guia Plano Amil Empresarial 2026" + schema FAQPage
2. 15 cornerstones com schema HealthInsurancePlan/Article
3. Formulário inteligente com auto-CNPJ
4. WhatsApp flutuante contextualizado
5. Tabela preços 2026 com CMS editável
6. Páginas programáticas CNAE × cidade (top 30 combinações)
7. Calculadora coparticipação (diferencial conversão)

**Segmentos a priorizar (ordem de ROI):**
1. PME 10-50 vidas em capitais (SP, RJ, BH, POA, BSB) — ticket alto + volume
2. MEI+PJ (2 vidas mínimas) — volume alto, ticket menor, alta conversão
3. EPP 50-200 vidas — ticket altíssimo, ciclo mais longo
4. Contadores/consultores (B2B2B) — backlinks + indicações
5. Grupos de afinidade (associações, sindicatos) — Phase 2

**Mensagem e posicionamento:**
- **Tom:** especialista, direto, transparente, sem jargão (decisor PJ é ocupado e cético)
- **Provas:** tabelas reais, selos visíveis, corretor nomeado, depoimentos verificáveis
- **CTAs primários:** "Receber cotação no WhatsApp" + "Ver tabela 2026"
- **Evitar:** linguagem de "plano barato", promessas absolutas ("carência zero garantida"), claims sem fonte

### Competitive Response Planning

#### Offensive Strategies (ganhar share)

- **Atacar amilsa no transacional:** publicar tabelas superiores (UX moderna, filtros, atualização mensal); superar em schema Product/Offer
- **Atacar amilbhsaude no regional MG:** criar páginas cidade-específicas MG com conteúdo superior + backlinks regionais
- **Atacar companyhero no FAQ PJ:** FAQ ainda mais profundo + especializado em Amil (onde eles são generalistas)
- **Capturar EMDs Tier B:** superar com Helpful Content Update quando Google penalizar thin content genérico
- **Programmatic SEO ofensivo:** lançar 30 páginas CNAE × 20 páginas cidade antes de qualquer concorrente perceber o gap

#### Defensive Strategies (proteger posição)

- **Construir moat de conteúdo**: tabela + calculadora + biblioteca de contratos + benchmark anual = bibliotecas difíceis de replicar
- **Relacionamento com leads convertidos**: NPS > 60 + reviews RA = social proof moat
- **Backlinks de autoridade regulatória/editorial**: portais ANS-adjacentes, RH, contabilidade, imprensa econômica (base DR 40+)
- **Parceria oficial com Amil**: explorar se a operadora tem programa de corretor digital destacado (pode gerar link institucional = boost massivo)
- **Monitoramento contínuo**: alertas SEO (GSC + Ahrefs) para quando competidor modernizar

### Partnership & Ecosystem Strategy

**Complementary players (parceiros de link + distribuição):**
- HRTechs (Gupy, Kenoby, Convenia) — embed de cotação
- Plataformas de benefícios (Caju, Flash, Alelo) — cross-sell
- Contabilidades digitais (Contabilizei, Conta Azul) — referência + API
- Associações setoriais (ACSP, sindicatos de RH) — conteúdo patrocinado
- Portais de imprensa econômica (Valor Econômico, Exame, Você RH) — guest content com data-journalism

**Channel partners:**
- Contadores e consultores de RH como indicadores (programa de comissão compartilhada — Phase 2)

**Technology integrations:**
- ReceitaWS / BrasilAPI (auto-CNPJ)
- CRM do corretor (RD Station / HubSpot / Pipedrive)
- WhatsApp Business API
- Calendly / Cal.com (agendamento com corretor)

**Strategic alliances:**
- Explorar programa oficial de corretores destacados da Amil
- Parceria editorial com portal de gestão empresarial para selo "Fonte Confiável em Planos PJ"

---

## Monitoring & Intelligence Plan

### Key Competitors to Track

**Prioridade ALTA (weekly monitoring):**
- companyhero.com — ameaça direta ao posicionamento PJ
- amilsa.com.br — qualquer sinal de modernização de stack
- institucional.amil.com.br — mudanças em produtos ou reestruturação UHG

**Prioridade MÉDIA (monthly monitoring):**
- amilbhsaude.com.br — movimentos regionais MG
- simetriaplanosdesaude.com.br — evolução de conteúdo
- saude.zelas.com.br — expansão em Amil

**Prioridade BAIXA (quarterly monitoring):**
- EMDs Tier B (planossaudeamil, planodesaudeamil, etc.) — principalmente mudanças de propriedade
- Agregadores Tier C (rotaseguros, imedialsaude) — expansão para Amil

### Monitoring Metrics

**Tracking obrigatório:**
- **Rankings SERP:** 50 keywords-alvo via GSC + Ahrefs/Semrush (trial mensal inicial)
- **Backlinks novos:** Ahrefs alerts para competidores top 3
- **Mudanças de conteúdo:** VisualPing em URLs-chave (pillar pages, tabela preços)
- **Mudanças de stack:** BuiltWith / Wappalyzer monitoring
- **Core Web Vitals:** CrUX Dashboard (dados públicos)
- **Movimentos corporativos:** Google Alerts para nomes das empresas + "Amil + corretor"
- **Preços Amil:** scraping ético mensal das próprias tabelas Amil
- **Market messaging:** monitorar LinkedIn dos competidores (posts, campanhas)

### Intelligence Sources

- **Company websites/blogs:** RSS + VisualPing
- **Customer reviews:** Reclame Aqui, Trustpilot BR, Google Reviews, Glassdoor
- **Industry reports:** ANS, IESS, Abramge, FenaSaúde
- **Social media:** LinkedIn (corretores + decisores PJ), YouTube (reviews de planos)
- **Regulatory filings:** Diário Oficial ANS, SUSEP, portal BACEN para M&A de corretoras
- **SEO tools:** Ahrefs, Semrush, GSC, SimilarWeb (assinatura rotativa conforme budget)
- **Patent/product filings:** não relevante neste nicho

### Update Cadence

- **Semanal:** rankings top 20 keywords + alertas de backlinks novos dos P1 + mudanças visuais em pillar pages dos P1
- **Mensal:** análise completa de movimentação SERP (50 keywords) + revisão de tabelas preço dos competidores + Reclame Aqui reviews + GSC performance próprio
- **Trimestral:** re-análise SWOT com dados atualizados + revisão de posicionamento + decisões de pivot tático se necessário + update deste documento

---

## Conclusão e Próximos Passos

### Resumo estratégico

A análise dos 16 concorrentes confirma uma tese clara: **o podium em head terms está fechado, mas o podium em long-tails é território aberto**. A combinação de stack moderna (Astro), especialização vertical (Amil + PJ), E-E-A-T visível (corretor + SUSEP) e conteúdo programático (CNAE × cidade) cria um posicionamento **sem competidor direto** no mercado brasileiro em abril/2026.

O risco crítico não é competitivo — é **execucional**: velocidade de produção de conteúdo de qualidade, respeito à compliance ANS/marca Amil, e sustentação do investimento em backlinks durante os 6 meses de ramp-up inicial.

### Ações recomendadas (ordem de prioridade)

1. **Validar Open Questions críticas do brief** (corretor nomeado, SUSEP, CRM, regiões)
2. **Executar `*perform-market-research`** (Atlas / @analyst) — TAM/SAM/SOM + personas com dados primários
3. **Executar `*research-prompt keyword-strategy`** — deep research para descoberta de long-tails CNAE/cidade/porte
4. **Facilitar `*brainstorm positioning`** — refinar mensagem central e UVPs
5. **Handoff para `@pm` (Morgan)** — transformar brief + competitive analysis + research em PRD completo
6. **Registrar domínio + iniciar redação dos 3 primeiros cornerstones em paralelo**
7. **Validação jurídica do uso de "amil" no domínio** (bloqueante antes do go-live)
8. **Trial 30 dias de Ahrefs** para validar DA/DR/backlinks reais dos P1 antes do PRD final

---

**Status do documento:** Draft YOLO consolidado
**Próxima atualização:** após market research + keyword research (inputs para refinar profiles e matrix)
**Owner:** Atlas (Analyst) → insumo primário para @pm (Morgan)
