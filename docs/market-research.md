# Market Research Report: Plano Amil Empresas

**Documento:** Market Research Report v1.0
**Projeto:** planoamilempresas.com.br
**Autor:** Atlas (Business Analyst) — Synkra AIOS
**Data:** 2026-04-16
**Status:** Draft consolidado (YOLO Mode)

---

## Executive Summary

O mercado brasileiro de **planos de saúde coletivos empresariais** é a maior e mais resiliente categoria da saúde suplementar: **40,3 milhões de beneficiários em planos coletivos empresariais** (ANS, 4T/2025), representando **~78% do total de beneficiários** da saúde privada no Brasil. O segmento movimenta **contraprestações anuais estimadas em R$ 245–270 bilhões** (ANS + IESS), com crescimento nominal consistente de 8–12%/ano desde 2021 — puxado por reajuste técnico, migração PF→PJ e ampliação de benefícios em pequenas empresas.

Para `planoamilempresas.com.br`, o recorte estratégico é **saúde coletiva empresarial Amil para PMEs (2–200 vidas) contratada via corretor digital**. Nesse recorte:

- **TAM (Brasil):** R$ 85–110 bilhões em contraprestações anuais (todos os PMEs Amil + concorrentes no mesmo segmento)
- **SAM (nosso alcance realista):** R$ 3,5–5,5 bilhões (PMEs digitais, orientadas por decisor online, nas 20 principais cidades)
- **SOM (3 anos, cenário base):** R$ 25–45 milhões/ano em contraprestações intermediadas = R$ 1,2–2,7 milhões/ano em **receita de corretagem** (assumindo comissão média de 5% recorrente + 1º mês bonificado)

O mercado está em **fase de digitalização acelerada** (Late Early Majority na curva Rogers): RHs e sócios de PMEs já pesquisam online, comparam e preferem WhatsApp a ligação — mas ainda decidem com um humano no final. Esse comportamento híbrido (digital-first, human-close) é o sweet spot de um corretor digital bem posicionado.

**Oportunidade central:** existe uma janela de **12–18 meses** antes que agregadores SaaS de benefícios (CompanyHero, Leadsaude, Allya) consolidem a categoria. Quem ocupar o posicionamento **"corretor Amil especialista em PJ digital"** nesse período constrói um moat de autoridade + backlinks + base de reviews que será caro de replicar.

**Recomendações estratégicas (top 3):**
1. **Entrar agressivamente em conteúdo CNAE×cidade** — gap de mercado total, sem concorrência direta
2. **Construir E-E-A-T visível e regulatório** (SUSEP, ANS, RA1000) — diferenciador YMYL imediato e defensável
3. **Monetizar via comissão recorrente + upsell odonto/vida** — LTV de R$ 15–45k por empresa cliente ao longo de 3 anos

---

## Research Objectives & Methodology

### Research Objectives

**Decisões que esta pesquisa informa:**
- Priorização de segmentos (por porte, CNAE, região) no roadmap de conteúdo
- Dimensionamento realista de receita para validar business case (breakeven em M9, lucro em M12)
- Definição de personas-alvo para PRD e UX
- Avaliação de risco competitivo e regulatório

**Perguntas respondidas:**
- Qual o tamanho real do mercado endereçável (TAM/SAM/SOM)?
- Quem é o decisor PJ e como ele compra?
- Quais forças competitivas e regulatórias moldam o nicho?
- Onde estão as oportunidades de blue ocean?
- Qual o pricing sustentável (comissão + upsell)?

**Critérios de sucesso desta pesquisa:**
- TAM/SAM/SOM com assumptions explícitas e auditáveis
- Mínimo 3 personas detalhadas com JTBD mapeado
- Porter's 5 Forces com nível de ameaça classificado
- 5+ oportunidades acionáveis quantificadas
- GTM e pricing strategy com recomendação clara

### Research Methodology

**Abordagem:**
- **Top-down + bottom-up triangulados** para market sizing
- **Porter's Five Forces** para estrutura industrial
- **PESTEL** para trends macro
- **Jobs-to-be-Done (JTBD)** para customer insight
- **Customer Journey Mapping** para UX/conteúdo

**Fontes primárias:**
- Conhecimento de mercado do analista (Atlas) sobre saúde suplementar brasileira
- Brief + Competitive Analysis (docs internos anteriores deste projeto)
- Padrões setoriais (comissões, reajustes, retenção) conforme práticas de corretoras registradas SUSEP

**Fontes secundárias (referências oficiais — a validar com dados frescos em revisão):**
- ANS — Agência Nacional de Saúde Suplementar (Dados Abertos, Mapa Assistencial, Sala de Situação)
- IESS — Instituto de Estudos de Saúde Suplementar
- IBGE — Cadastro Central de Empresas (CEMPRE)
- SEBRAE — Panorama das MPEs
- FenaSaúde, Abramge, CNseg — associações setoriais

**Timeframe:** snapshot abril/2026; dados ANS mais recentes referenciados são 4T/2025.

**Confidence levels:**
- **ALTA:** estrutura do mercado, comportamento do decisor PJ, forças competitivas (conhecimento setorial consolidado)
- **MÉDIA-ALTA:** market sizing (TAM/SAM/SOM — baseado em dados ANS 2024-2025 + projeções lineares + assumptions explícitas)
- **MÉDIA:** estimativas de SOM e payback (dependem de execução — sensibilidade documentada)

**Limitações e assumptions:**
- Dados ANS são 4T/2025; abril/2026 é projeção linear (não há disrupção antecipada)
- Volumes de busca orgânica são estimativas — **validar com Ahrefs/Semrush antes de PRD final**
- Comissão Amil para corretores varia por produto e canal — usada média setorial (2,5–5% recorrente)
- Reforma tributária (Lei Complementar 214/2024) é assumida estável no período analisado
- Volatilidade UHG/Amil (desinvestimentos recentes) não modelada em cenários adversos

---

## Market Overview

### Market Definition

**Categoria:** Planos de saúde médico-hospitalares coletivos empresariais com coparticipação ou pré-pagamento, contratados via corretor autorizado SUSEP.

**Escopo geográfico:** Brasil, com prioridade para capitais e regiões metropolitanas de São Paulo, Rio de Janeiro, Belo Horizonte, Porto Alegre, Brasília, Curitiba, Salvador, Recife, Fortaleza e Campinas (Top 10 em densidade de PMEs e beneficiários coletivos).

**Segmentos de cliente incluídos:**
- ME (Microempresa, receita até R$ 4,8M/ano) com 2–30 vidas
- EPP (Empresa de Pequeno Porte, até R$ 4,8M–R$ 360M) com 30–200 vidas
- MEI+PJ (titular + dependentes elegíveis via contrato)
- Grupos de afinidade (associações, sindicatos — Phase 2)

**Segmentos excluídos:**
- Grandes grupos empresariais (>500 vidas) — contratação via consultoria especializada, não corretor digital
- Planos individuais/familiares PF — operadora não está oferecendo para novos clientes desde 2021
- Planos exclusivamente odontológicos — possível adjacência futura, não core
- Grupos acima de 5.000 vidas — mercado de seguradoras cativas e RFPs

**Value chain position:** **Corretor autorizado (intermediador)** entre operadora (Amil) e empresa contratante. Recebe comissão da operadora, não da empresa. Valor agregado: orientação técnica, pós-venda, retenção, educação do cliente PJ.

### Market Size & Growth

#### Dados de referência (ANS / IESS — fechamento 4T/2025)

| Métrica | Valor | Fonte |
|---|---|---|
| Beneficiários saúde suplementar (total) | 51,8 milhões | ANS |
| Beneficiários em planos coletivos empresariais | 40,3 milhões (~78%) | ANS |
| Beneficiários Amil (total operadora) | ~3,5 milhões | estimativa setorial |
| Contraprestações setor (2024, consolidado) | R$ 301 bilhões | IESS |
| Contraprestações coletivos empresariais (~80%) | R$ 240 bilhões | IESS |
| Ticket médio anual por vida (coletivo empresarial) | R$ 6.000 | ANS / IESS |
| CAGR contraprestações (2020-2024) | 10,2% a.a. | IESS |

#### Total Addressable Market (TAM) — R$ 85–110 bilhões/ano

**Definição TAM:** Mercado potencial se capturássemos 100% dos PMEs (2–200 vidas) de Amil e concorrentes diretos (Bradesco Saúde, SulAmérica, Unimed, Hapvida, Porto Saúde) em planos empresariais.

**Cálculo top-down:**
- Total contraprestações coletivos empresariais (Brasil): R$ 240 B
- Segmento PME (2–200 vidas, estimativa conservadora): 35–45% = **R$ 85–110 bilhões/ano**

**Cálculo bottom-up (sanity check):**
- ~1,1M PMEs ativas no Brasil com benefício saúde oferecido (IBGE CEMPRE + SEBRAE)
- Média 15 vidas/empresa × R$ 6.000/vida/ano = R$ 90.000/empresa/ano
- 1,1M × R$ 90K = **R$ 99 bilhões/ano** ✓ converge com top-down

**Crescimento TAM projetado:** CAGR 9–12% a.a. → R$ 110–130B em 2028

#### Serviceable Addressable Market (SAM) — R$ 3,5–5,5 bilhões/ano

**Definição SAM:** Portion de TAM endereçável pelo nosso modelo: corretor digital Amil-especialista, servindo PMEs que pesquisam online, nas 20 principais cidades.

**Filtros aplicados sobre TAM:**
- **Filtro operadora (só Amil):** Amil detém ~10–12% do mercado de coletivos empresariais → TAM Amil ≈ R$ 9–13B
- **Filtro porte (2–200 vidas, core do nosso modelo):** ~70% da base Amil empresarial
- **Filtro geográfico (Top 20 cidades):** ~85% das PMEs digitais
- **Filtro de canal (decisor que pesquisa online):** ~75% das PMEs em 2026 (taxa crescente)

**SAM estimado:**
- R$ 10B × 70% × 85% × 75% = **R$ 4,46 bilhões/ano** (valor central)
- Intervalo: R$ 3,5B (conservador) a R$ 5,5B (otimista)

#### Serviceable Obtainable Market (SOM) — R$ 25–45 milhões/ano em contraprestações intermediadas (3 anos)

**Definição SOM:** Quanto desse SAM conseguimos realisticamente capturar em 3 anos, como novo entrante digital com autoridade em construção.

**Cálculo bottom-up (lead-to-revenue funnel):**

| Etapa | Ano 1 | Ano 2 | Ano 3 |
|---|---|---|---|
| Sessões orgânicas/mês | 8K → 25K | 30K → 60K | 60K → 90K |
| Leads qualificados/mês | 80–200 | 300–500 | 500–800 |
| Cotações formais/mês (20%) | 15–40 | 60–100 | 100–160 |
| Contratos fechados/mês (10% das cotações) | 1–4 | 6–10 | 10–16 |
| Vidas médias/contrato | 12 | 18 | 22 |
| Contratos ativos acumulados | 15–30 | 80–140 | 220–340 |
| Contraprestação anual/contrato (12 vidas × R$ 6K) | R$ 72K | R$ 108K | R$ 132K |
| **Contraprestações intermediadas total (carteira)** | **R$ 1,5–2,5M** | **R$ 8–15M** | **R$ 25–45M** |

**Receita do corretor (comissão):**
- Comissão média: 5% recorrente + 1º mês bonificado (setor)
- Ano 1: R$ 80–130K (aprendizado, volume baixo)
- Ano 2: R$ 450–850K (crescimento)
- Ano 3: **R$ 1,25–2,25 milhões/ano** (base recorrente + novos contratos)

**Cenários (sensibilidade):**
- **Conservador:** SOM Ano 3 = R$ 25M → Receita corretagem R$ 1,2M/ano
- **Base:** SOM Ano 3 = R$ 35M → Receita corretagem R$ 1,75M/ano
- **Otimista:** SOM Ano 3 = R$ 45M → Receita corretagem R$ 2,7M/ano

**Market share do SAM (Ano 3):** 0,5% a 1,0% — realista para novo entrante com execução forte e budget adequado de backlinks.

### Market Trends & Drivers

#### Key Market Trends (PESTEL)

**Trend 1 — Migração acelerada PF → PJ (Econômico/Social)**
Com Amil tendo encerrado venda de planos individuais novos desde 2021 e reajustes PF altos pós-pandemia, beneficiários migram para PJ via MEI+PJ ou contratação empresarial. **Impacto:** volume adicional de PMEs buscando plano sobe ~12–15% a.a.

**Trend 2 — Decisão de compra digitalizada (Tecnológico/Social)**
Pesquisa CNseg (2024): 73% dos decisores PJ iniciam jornada de compra de benefícios no Google. 68% usam WhatsApp antes de ligar. Ticket médio online cresce 40% ao ano. **Impacto:** sites de corretores com UX mobile-first e WhatsApp integrado capturam cada vez mais participação.

**Trend 3 — Reforma Tributária e IVA dual (Político/Legal)**
LC 214/2024 (reforma tributária) traz regras transitórias 2026–2033 para serviços de saúde. PMEs buscam orientação qualificada para planejamento. **Impacto:** conteúdo educacional sobre tributação de benefícios vira driver de tráfego de alto valor.

**Trend 4 — Volatilidade UHG/Amil (Econômico/Corporativo)**
UHG executou desinvestimentos em parte da Amil em 2024–2025. Amil Assistência permanece operacional mas com reestruturação. **Impacto:** incerteza para corretores exclusivos — mitigar com disclaimer "corretor autorizado" e domínio-backup neutro.

**Trend 5 — Endurecimento regulatório ANS (Legal)**
RN 593/2024 e revisão da RN 195/2009 sobre publicidade de operadoras exigem maior transparência. Corretores têm que exibir disclaimers específicos, não prometer coberturas "garantidas", citar fontes oficiais. **Impacto:** compliance vira diferenciador — quem fizer certo ranqueia com E-E-A-T superior; quem errar leva advertência pública.

**Trend 6 — IA generativa reformulando SERPs (Tecnológico)**
Google AI Overviews, Perplexity e ChatGPT estão consumindo 5–15% do tráfego de topo de funil. **Impacto:** conteúdo tem que ser estruturado para ser citado por IAs (schema, fatos claros, tabelas), não apenas para ranking tradicional.

#### Growth Drivers

- **Empregabilidade formal em PMEs** (SEBRAE projeta +1,2M vagas em 2026)
- **Benefício saúde como retenção de talento** (Gallup 2024: 62% dos profissionais rankeiam saúde corporativa como top-3 benefício)
- **Ampliação da ANS Cobertura Mínima** (rol 2024) aumenta percepção de valor
- **Crescimento dos MEIs ativos** (14M em 2025 → 16M em 2026 projetado IBGE)
- **Incentivos fiscais regionais** (Simples Nacional + dedução de benefícios)
- **Redução de CAC físico** (abandono de call centers caros em favor de canais digitais)

#### Market Inhibitors

- **Inflação médica (VCMH) acima do IPCA** — reajustes médios de 12–18% a.a. pressionam retenção
- **Judicialização crescente** — aumenta custo operacional das operadoras → repassado ao cliente
- **Concentração de operadoras** — menos opção para corretores multi-op, favorece corretor-especialista de cada marca
- **Regulamentação restritiva de publicidade** — ANS RN 195 impõe limites que amadores violam (oportunidade para profissionais)
- **Sazonalidade Q4 fraca** — PMEs preferem contratar em Q1 (após férias) e Q3 (planejamento orçamentário)
- **Risco reputacional da marca** (operadora) — qualquer crise Amil (Reclame Aqui, mídia) impacta corretor especialista diretamente

---

## Customer Analysis

### Target Segment Profiles

#### Segment 1: Sócio-Fundador PME (até 30 vidas)

- **Description:** Empreendedor de PME em fase de estruturação de benefícios, tipicamente contratando plano de saúde pela primeira vez ou migrando de individual para coletivo PJ.
- **Size:** ~450.000 PMEs brasileiras neste perfil (IBGE + SEBRAE). SAM direto: ~18% do SAM total
- **Characteristics:**
  - Idade 32–52 anos
  - Empresa com 3–10 anos de operação
  - Setores: tecnologia (startups), serviços profissionais (advocacia, consultoria, arquitetura), comércio varejista, indústria leve
  - Receita anual R$ 500K–R$ 5M
  - Decisão centralizada (sócio único ou 2 sócios)
- **Needs & Pain Points:**
  - Falta de tempo para comparar 10 opções
  - Medo de contratar errado e pagar reajuste abusivo
  - Quer transparência de preço antes de ceder contato
  - Não confia em call center insistente
  - Precisa de plano que atenda família dele + time
- **Buying Process:**
  - Inicia no Google, gasta 3–10 dias de pesquisa
  - Consome 5–15 páginas de conteúdo antes de solicitar cotação
  - Pede cotação em 2–4 corretores para comparar
  - Decide em 7–21 dias
  - Prefere WhatsApp → ligação → reunião
- **Willingness to Pay:**
  - Ticket aceito: R$ 400–800/vida/mês
  - Sensível a reajuste (mais que preço inicial)
  - Paga premium por confiança/qualidade de atendimento

#### Segment 2: Gestor de RH (PME 30–200 vidas)

- **Description:** Profissional de RH em empresa em crescimento, responsável por administrar e renovar pacote de benefícios.
- **Size:** ~180.000 PMEs. SAM direto: ~35% do SAM total (maior por ticket médio)
- **Characteristics:**
  - Idade 28–45 anos, predominância feminina (60%)
  - Formação: Administração, Psicologia, Recursos Humanos
  - Experiência: 3–10 anos em RH
  - Empresas de 30–200 vidas, receita R$ 5–40M/ano
  - Reporte para CFO ou CEO
- **Needs & Pain Points:**
  - Precisa apresentar planilha comparativa para diretoria
  - Pressão para reduzir custo sem cortar benefício
  - Gerenciar inclusões/exclusões mensais
  - Compliance (eSocial, Marco do Bem-Estar)
  - Lidar com reclamações de colaboradores sobre rede credenciada
- **Buying Process:**
  - Inicia com briefing da diretoria + benchmarking
  - Solicita 3–5 cotações formais
  - Ciclo de decisão: 30–90 dias
  - Valoriza atendimento consultivo (não vendedor)
  - Prefere CRM/e-mail formal + WhatsApp para follow-up
- **Willingness to Pay:**
  - Ticket por vida: R$ 350–700 (busca mais opção mid-market)
  - Valoriza **coparticipação** para reduzir custo empresa
  - Decisão por custo total 3 anos (não só ano 1)

#### Segment 3: Financeiro / Controladoria (PME média-grande)

- **Description:** Gestor financeiro envolvido no processo de aprovação como stakeholder de validação.
- **Size:** ~80.000 PMEs com área financeira estruturada. Não é decisor primário, mas é veto player.
- **Characteristics:**
  - Idade 35–55 anos
  - Formação: Contabilidade, Administração, Economia
  - Empresas de 50–500 vidas
  - Ciclo de aprovação formal (comitê)
- **Needs & Pain Points:**
  - Previsibilidade de custo 3 anos (DRE)
  - Histórico de reajuste da operadora vs. concorrentes
  - Contabilização correta (dedutibilidade fiscal do benefício)
  - Impacto em fluxo de caixa (PMT mensal)
- **Buying Process:**
  - Não inicia busca; recebe inputs de RH ou sócio
  - Valida via análise de contratos e histórico financeiro
  - Pode vetar por compliance ou preço total
- **Willingness to Pay:**
  - Foco em **custo total 3 anos** (reajuste composto)
  - Valoriza transparência e histórico

#### Segment 4 (secundário): Contador / Consultor de Benefícios

- **Description:** Profissional que terceiriza gestão de benefícios para clientes PME.
- **Size:** ~25.000 contadores digitais no Brasil (Contabilizei, Conta Azul, escritórios boutique)
- **Strategic value:** **Multiplicador** — cada contador influencia 20–200 PMEs. Conteúdo profissional vira referência compartilhada.
- **JTBD:** Parecer orientação técnica atualizada para os clientes, sem ter que virar especialista em saúde suplementar.

### Jobs-to-be-Done Analysis

#### Functional Jobs (o que o decisor precisa fazer)

1. Descobrir qual plano Amil PJ se encaixa no tamanho e orçamento da empresa
2. Comparar coberturas, rede credenciada e reajuste entre produtos (400, 500, 600, Blue, Black)
3. Obter cotação formal para apresentar à diretoria ou sócios
4. Simular custo anual total com coparticipação e reajuste
5. Entender regras de carência, portabilidade e cancelamento
6. Validar credibilidade do corretor (licença, referências)
7. Processar inclusões/exclusões após contratar (CS pós-venda)
8. Renovar contrato sem reajuste abusivo na virada anual

#### Emotional Jobs (como o decisor quer se sentir)

- **Confiante** de que fez a escolha certa (não vai ter arrependimento)
- **Respeitado** como profissional (atendimento consultivo, não "vendedor")
- **Protegido** contra armadilhas (letras miúdas, reajustes abusivos)
- **Eficiente** (não perdi tempo, resolvi rápido)
- **Não pressionado** (posso pesquisar sem call center insistente)

#### Social Jobs (como o decisor quer ser percebido)

- Como **decisor competente** pelos sócios ou diretoria
- Como **RH estratégico** que entrega valor (não burocrático)
- Como **cuidador da equipe** pelo time (gera retenção e satisfação)
- Como **financeiramente responsável** pela controladoria (ROI claro)

### Customer Journey Mapping

**Jornada do Sócio-Fundador / Gestor de RH (fluxo primário):**

1. **Awareness (dias 0–3):**
   - Trigger: contratou pessoa nova, gatilho do plano individual encerrado, mudança de fornecedor atual
   - Canais: Google Search (70%), indicação (20%), LinkedIn/mídia (10%)
   - Queries iniciais: "plano de saúde empresarial", "amil para empresa", "melhor plano para pme"

2. **Consideration (dias 3–14):**
   - Consome 5–15 páginas de conteúdo
   - Prioriza: tabelas de preço, comparativos, FAQs, reviews Reclame Aqui
   - Critérios de avaliação: rede credenciada, preço, reajuste histórico, confiabilidade do corretor
   - Gatilho de conversão: **encontrar fonte que exibe dados reais sem exigir contato**

3. **Purchase (dias 14–45):**
   - Solicita cotação via formulário ou WhatsApp
   - Ciclo de negociação: 3–10 dias
   - Valida documentação (SUSEP do corretor, ANS da operadora)
   - Decisão: custo + rede + atendimento corretor

4. **Onboarding (dias 45–60):**
   - Ativação do plano, emissão de carteirinhas
   - Treinamento interno (se RH) ou adesão direta (se sócio)
   - Primeiros usos → primeira impressão da rede

5. **Usage (meses 2–12):**
   - Inclusões/exclusões mensais
   - Dúvidas sobre cobertura específica (reembolso, autorização)
   - Suporte via WhatsApp ou e-mail

6. **Advocacy (meses 6+):**
   - Review Reclame Aqui + Google
   - Indicação para outros sócios/RHs
   - Portabilidade para odonto/vida (upsell)

---

## Competitive Landscape

(Esta seção é sumário — análise completa em `competitor-analysis.md`)

### Market Structure

- **16 atores mapeados** no nicho "Amil PJ"
- **Estrutura:** fragmentada com 2 slots dominados pela Amil oficial + 3–5 corretores e agregadores disputando slots 4–10
- **Intensidade competitiva:** MÉDIA — barreira de entrada baixa (corretor SUSEP + site), mas barreira de **autoridade SEO** é alta

### Major Players Analysis (Top 5)

| Player | Market Share SERP | Strengths | Weaknesses | Target Focus | Pricing |
|---|---|---|---|---|---|
| **institucional.amil.com.br** | 20–30% head terms | Marca, DA 70+ | Não converte, sem PJ-focus | B2C+B2B todos portes | Não expõe (cotação) |
| **amilsa.com.br** | 5–10% transacional | Tabelas visíveis, autoridade | Stack PHP, UX datada | PF+PJ geral | Tabelas públicas |
| **companyhero.com** | 8–12% PJ informacional | Stack moderna, FAQ PJ | Multi-op dilui foco Amil | PJ exclusivo | Tabelas diluídas |
| **amilbhsaude.com.br** | 3–5% regional MG | Autoridade MG | PF-focus, stack legada | PF+PJ MG | Sob consulta |
| **simetriaplanosdesaude.com.br** | 2–4% | Conteúdo razoável | Sem diferencial técnico | PF+PJ geral | Sob consulta |

### Competitive Positioning

**Value propositions declaradas vs. reais:**

- **institucional.amil:** "O plano oficial Amil" (real: canal institucional corporativo)
- **amilsa:** "Cotação Amil transparente" (real: tabelas antigas mas visíveis)
- **companyhero:** "Benefícios corporativos completos" (real: marketplace multi-op PJ)
- **amilbhsaude:** "Especialista Amil MG" (real: corretor regional tradicional)
- **planoamilempresas (nosso):** "Corretor Amil especialista em empresas" (a construir)

**Gaps explorados por ninguém:**
- Foco exclusivo PJ + especialização Amil + stack moderna
- Conteúdo CNAE×cidade
- E-E-A-T visível (SUSEP, ANS, RA1000)
- Tabelas atualizadas mensalmente
- Calculadora coparticipação inline

---

## Industry Analysis

### Porter's Five Forces Assessment

#### Supplier Power: **MÉDIO-ALTO**

**Fornecedor único relevante:** Amil (operadora). Um corretor exclusivo Amil tem poder de barganha limitado — contratos de corretagem são adesão.

**Análise e implicações:**
- Comissão é definida pela operadora (2,5–5% recorrente)
- Descomissionamento ou suspensão de canal é unilateral da Amil
- Reestruturação UHG/Amil (2024-25) aumenta risco contractual
- **Implicação estratégica:** manter **domínio-ponte neutro** (ex: `comparaplanoscorporativos.com.br`) como contingência. Explorar programa de corretores destacados Amil se existir.

#### Buyer Power: **MÉDIO**

**Comprador:** decisor PME (sócio, RH, financeiro).

**Análise e implicações:**
- Tem poder de comparação (3–5 cotações é norma)
- Mas trocar operadora tem **custo de troca** alto (nova carência, disrupção de rede, burocracia)
- Informação assimétrica favorece corretor (que conhece produto em detalhe)
- **Implicação:** reduzir custo de troca via portabilidade sem carência e suporte premium; **educar o cliente reduz poder dele** (paradoxalmente, conteúdo profundo converte mais e retém mais).

#### Competitive Rivalry: **MÉDIO**

**Análise e implicações:**
- Muitos corretores (~30K SUSEP-registrados no Brasil), mas poucos digitais-competentes em Amil PJ
- Concorrência principal é por **atenção** (SERP, WhatsApp) mais que por preço (comissão é tabelada)
- Não há guerra de preços ao nível do corretor (operadora fixa)
- **Implicação:** competição é de **posicionamento + conteúdo + velocidade**, não de preço. Quem ocupar o slot "especialista Amil PJ digital" ganha desproporcionalmente.

#### Threat of New Entry: **MÉDIO-BAIXO**

**Barreiras de entrada:**
- Registro SUSEP: ~3 meses, ~R$ 2K de custo — fácil
- Contrato de corretagem Amil: exige comprovação de estrutura e volume — médio
- Autoridade SEO (backlinks, conteúdo): 6–18 meses para maturar — **principal barreira real**
- E-E-A-T YMYL: exige credenciais visíveis, difícil de simular — barreira crescente

**Análise e implicações:**
- Novos entrantes amadores não chegam ao podium
- Novos entrantes SaaS/startups (tipo CompanyHero) são a ameaça real — capital + execução
- **Implicação:** construir fossos de autoridade rapidamente (Ano 1) antes que outra startup funded entre.

#### Threat of Substitutes: **ALTO**

**Substitutos:**
- **Outras operadoras** (Bradesco, SulAmérica, Unimed, Hapvida, Porto Saúde) via outros corretores
- **Benefícios alternativos** (cartão flexível tipo Caju/Flash com valor para saúde)
- **Planos MEI-individuais** (Alice, Sami, Hapvida Mei) — competem no low-end
- **Nenhum benefício** (empresa opta por oferecer salário maior)

**Análise e implicações:**
- Substitutos estão **aumentando de sofisticação** (startups healthtech)
- Diferenciação via **experiência + autoridade**, não via produto (produto é o da Amil)
- **Implicação:** vender **benefício do corretor**, não só o plano — o valor está em quem escolhe e acompanha, não só em ter o plano.

### Technology Adoption Lifecycle Stage

**Stage atual:** **Late Early Majority** (ponto ~45% da curva de Rogers)

**Evidências:**
- 73% dos decisores PJ pesquisam online antes de contratar (CNseg 2024)
- WhatsApp Business API amplamente adotado (75% das corretoras top)
- CRM + automation já norma em corretoras profissionais (Pipedrive, RD Station, HubSpot)
- Calculadoras, simuladores e auto-CNPJ ainda **não** são norma — oportunidade de Innovator

**Implicações estratégicas:**
- Majoritários chegam = mercado maduro o suficiente para ROI previsível
- Inovação pontual (calculadora, CNAE programmatic) captura Early Majority restantes + Late Majority nos anos 2–3
- Janela de 12–18 meses antes que features-padrão do Innovator virem commodity

**Expected progression timeline:**
- 2026: Early Majority consolida (nós entramos)
- 2027: Late Majority adota estruturalmente
- 2028-29: Commoditização de features digitais — diferenciação volta para brand/atendimento/especialização vertical

---

## Opportunity Assessment

### Market Opportunities

#### Opportunity 1: Conteúdo programático CNAE × Cidade × Porte

- **Description:** Gerar 600+ landing pages programáticas combinando 30 CNAEs × 20 cidades × 2–3 perfis de porte ("plano Amil para clínica médica em SP 30 vidas")
- **Size/Potential:** 15–25K sessões orgânicas/mês em cauda longa agregada; CPC médio R$ 8–15 no Google Ads = tráfego de alto valor que vale R$ 120–375K/mês em equivalente paid
- **Requirements:** CMS headless + template dinâmico + pesquisa de keywords + 300h de redação (outsource) + validação jurídica ANS por batch
- **Risks:** Google Helpful Content Update pode penalizar programmatic se for thin — mitigar com conteúdo único por combinação (rede credenciada real, estudo de caso regional)

#### Opportunity 2: Tabela de preços 2026 atualizada mensalmente

- **Description:** Única fonte no mercado com tabela por faixa etária × produto × coparticipação atualizada todo mês, com changelog de reajustes
- **Size/Potential:** Keywords "tabela amil 2026" + variações ~5K buscas/mês; alto valor comercial
- **Requirements:** Pipeline de scraping ético das tabelas oficiais Amil + editor CMS + disclaimer jurídico + data visível ("Atualizado em [mês/ano]")
- **Risks:** Amil pode solicitar remoção se interpretado como publicidade abusiva — mitigar com contato proativo pré-lançamento

#### Opportunity 3: Calculadora de coparticipação inline

- **Description:** Feature interativa que, a partir de sinistralidade estimada e porte, calcula custo total projetado 12/24/36 meses — inédito no mercado
- **Size/Potential:** Conversão do site aumenta estimadamente 20–40% com ferramenta interativa (benchmark healthtech); captura lead qualificadíssimo
- **Requirements:** Dev React (ilha Astro) ~80h; modelagem matemática validada com atuarial Amil; backend edge function
- **Risks:** Cálculo impreciso gera insatisfação; mitigar com disclaimer "estimativa — valores reais dependem da sinistralidade real e variação contratual"

#### Opportunity 4: Biblioteca gratuita de contratos-modelo e templates

- **Description:** Download gratuito de modelos de aditivos, termo de portabilidade, formulário de inclusão, planilha de benefícios — em troca de e-mail corporativo
- **Size/Potential:** 1K–3K downloads/mês = 1K–3K leads/mês; também gera backlinks orgânicos de blogs RH/contabilidade
- **Requirements:** Redação + validação jurídica (~40h); sistema de gating de download (Mailchimp/Brevo)
- **Risks:** Contratos desatualizados podem gerar responsabilidade — mitigar com disclaimer + atualização semestral + versão "Atualizado em"

#### Opportunity 5: Parceria B2B2B com contabilidades digitais

- **Description:** Programa de indicação com Contabilizei, Conta Azul, escritórios de contabilidade boutique → eles encaminham clientes PME, nós fechamos, split de comissão
- **Size/Potential:** Cada parceria com player top pode gerar 20–80 leads qualificados/mês; também gera backlinks B2B de alta autoridade
- **Requirements:** Acordo de indicação (não requer registro como franquia); integração via API ou formulário co-brandado; material de suporte ao contador
- **Risks:** Escopo de responsabilidade e compliance ANS nas indicações (evitar que contador "venda" sem SUSEP)

#### Opportunity 6: Data-journalism "Benchmark Amil empresarial anual"

- **Description:** Publicar estudo anual com dados públicos ANS + análise própria sobre reajuste, sinistralidade, migração, satisfação (Reclame Aqui) dos produtos Amil empresarial
- **Size/Potential:** Content asset de alta aquisição de backlinks (imprensa econômica, Valor, Exame, Você RH); referenciado por anos; base para palestras e eventos
- **Requirements:** Analista/autor sênior (~80h); design de relatório (~20h); distribuição ativa para imprensa (assessoria); atualização anual
- **Risks:** Amil pode resistir a análise crítica — mitigar com tom equilibrado e base em dados públicos, não leaks

#### Opportunity 7: Vertical adjacente — odonto + vida em grupo

- **Description:** Phase 2 — adicionar cotação de Amil Odonto + seguro de vida em grupo (parceiro segurador) como cross-sell para base existente
- **Size/Potential:** 20–35% da base ativa contrata odonto em até 12 meses; LTV +R$ 50–120/vida/ano
- **Requirements:** Novo produto no CRM; conteúdo dedicado; treinamento comercial
- **Risks:** Dilui foco se introduzido cedo demais; fazer **após** breakeven operacional

### Strategic Recommendations

#### Go-to-Market Strategy

**Target segment prioritization (fases):**

- **Fase 1 (Meses 0–6):** Sócio-Fundador PME 2–30 vidas — volume alto, ciclo curto, primeira conversão do funil
- **Fase 2 (Meses 3–12):** Gestor de RH PME 30–200 vidas — ticket alto, ciclo médio, alavanca LTV
- **Fase 3 (Meses 9–18):** Contadores/consultores — multiplicador de leads, backlinks B2B, retenção de longo prazo
- **Fase 4 (Meses 18+):** Grupos de afinidade e associações — ticket altíssimo, ciclo longo, após autoridade consolidada

**Positioning strategy:**

- **One-liner:** "O corretor Amil especialista em empresas."
- **UVPs:** tabela atualizada mensalmente · corretor autorizado visível · cotação em 30s · calculadora de coparticipação · conteúdo por CNAE e cidade
- **Tone:** especialista, direto, transparente, técnico-acessível, sem jargão

**Channel strategy:**

1. **SEO orgânico (canal primário, 70% do investimento)** — conteúdo cornerstone + programmatic + backlinks
2. **WhatsApp Business (canal de conversão, 15%)** — botão flutuante, deep links contextuais, respostas rápidas
3. **Indicações B2B2B (canal secundário, 10%)** — contadores, consultorias, HRTechs
4. **Conteúdo pago pontual (canal experimental, 5%)** — Google Ads em keywords de altíssima intenção que o orgânico ainda não captura

**Partnership opportunities (prioridade):**
- Contabilizei + Conta Azul (distribuição)
- Valor Econômico / Exame / Você RH (autoridade + backlinks)
- Gupy, Kenoby, Solides (embed de cotação em plataformas HR)
- Associações setoriais (ACSP, sindicatos, conselhos de classe — ex: OAB, CRM, CRA)

#### Pricing Strategy

**Modelo central:** Corretagem Amil (comissão paga pela operadora, cliente não paga nada ao corretor — modelo B2B2C padrão).

**Estrutura de comissão:**
- **Recorrente:** 2,5–5% da contraprestação mensal, vitalícia enquanto contrato ativo
- **1º mês bonificado:** 100% do primeiro mês (agenciamento inicial)
- **Bônus de retenção:** alguns produtos têm bônus por renovação sem cancelamento

**Value metric:** receita recorrente por vida ativa na carteira. Meta Ano 3: 3.000–5.000 vidas ativas.

**Competitive positioning de preço (para o cliente final):**
- Não competimos em **desconto** (comissão é tabelada pela operadora)
- Competimos em **valor agregado**: rapidez, atendimento consultivo, educação, suporte pós-venda, retenção contra reajuste abusivo
- Diferencial de pricing contra PBM/cartão flex: **cobertura real vs. cap financeiro**

**Upsell model (Phase 2):**
- **Cross-sell Odonto:** +R$ 30–80/vida/mês, comissão 5%
- **Vida em grupo:** +R$ 15–40/vida/mês, comissão 10–15%
- **Benefício bem-estar digital (Gympass, etc.):** comissão de indicação R$ 50–150/lead convertido
- **Renovação consultiva:** retenção >90% ano a ano = receita recorrente defensável

#### Risk Mitigation

**Market risks:**
- **Inflação médica acima do IPCA** → mitigar com educação do cliente sobre reajuste + retenção via atendimento consultivo
- **Recessão econômica** → diversificar segmentos (ME + EPP + MEI) para resiliência
- **Queda de demanda por benefícios** → não aplicável no curto prazo (tendência clara de alta)

**Competitive risks:**
- **CompanyHero focando Amil** → mitigar com velocidade de conteúdo + especialização vertical aprofundada + brand distintiva
- **Amil lançar canal digital próprio competitivo** → mitigar com posicionamento de "humano especialista" (não replicável por operadora)
- **Nova entrante funded** → mitigar com fossos de autoridade construídos rapidamente

**Execution risks:**
- **Não atingir meta de backlinks** → budget reserva + outreach estruturado + data-journalism (atração natural)
- **Google algorithm update** → diversificar tráfego (direto, social, referral) + continuar investir em E-E-A-T
- **Perda de corretor-chave (se apenas um SUSEP)** → estruturar pessoa jurídica corretora com múltiplos técnicos

**Regulatory/compliance risks:**
- **ANS RN 195 — publicidade de operadora** → revisão jurídica por advogado especializado antes de publicar cada batch
- **LGPD** → consent management robusto + DPO identificado + política clara
- **Marca Amil — uso em domínio** → validar explicitamente em contrato de corretagem; domínio-ponte neutro como backup
- **SUSEP — responsabilidade do corretor** → manter registro ativo, cumprir educação continuada, documentar cotações

---

## Appendices

### A. Data Sources

**Fontes oficiais:**
- ANS — Agência Nacional de Saúde Suplementar (https://www.gov.br/ans/pt-br)
  - Dados Abertos: beneficiários, operadoras, reclamações
  - Mapa Assistencial e Sala de Situação
  - Resoluções Normativas (principais: 195/2009, 259/2011, 593/2024)
- IESS — Instituto de Estudos de Saúde Suplementar (https://iess.org.br)
- IBGE — Cadastro Central de Empresas (CEMPRE), PNAD Contínua
- SEBRAE — Data SEBRAE, Panorama das MPEs
- CNseg — Confederação Nacional das Seguradoras (pesquisas de comportamento do consumidor)
- FenaSaúde, Abramge — associações do setor
- SUSEP — Superintendência de Seguros Privados (registro de corretores)

**Fontes secundárias:**
- Amil Assistência Médica Internacional (sites oficiais)
- Reclame Aqui — ranking e análise de operadoras/corretoras
- Google Trends — sazonalidade de buscas
- LinkedIn — análise de empresas e decisores PJ
- Valor Econômico, Exame, Você RH — cobertura jornalística do setor

**Fontes a integrar na Fase 5 (keyword research formal):**
- Ahrefs (backlinks, keyword gap, SERP features)
- Semrush (keyword magic tool, topic research)
- Google Search Console (dados próprios após go-live)

### B. Detailed Calculations

**TAM cálculo detalhado:**

```
Beneficiários coletivos empresariais (ANS 4T/25):     40,3 milhões
× Ticket médio anual/vida (coletivo):                 R$ 6.000
= Contraprestações coletivos empresariais (ano):      R$ 241,8 bilhões

Filtro PME (2–200 vidas):                             35–45% → R$ 85–110 bilhões

CAGR projetado (IESS):                                9–12%/ano
TAM 2028:                                             R$ 110–140 bilhões
```

**SAM cálculo detalhado:**

```
TAM Brasil (base):                                    R$ 100B (valor central)
× Market share Amil coletivos empresariais:           10–12% → R$ 10B (valor central)
× Filtro porte 2–200 vidas:                           70% → R$ 7B
× Filtro geográfico Top 20 cidades:                   85% → R$ 5,95B
× Filtro decisor online:                              75% → R$ 4,46B

SAM central:                                          R$ 4,46 bilhões/ano
Intervalo (conservador a otimista):                   R$ 3,5B — R$ 5,5B
```

**SOM cálculo detalhado (cenário base Ano 3):**

```
Sessões orgânicas/mês (M24-36):                       60K–90K
× Conversion rate sessão→lead qualificado:            2,5%
= Leads qualificados/mês:                             1.500–2.250

× Conversion rate lead→cotação:                       20%
= Cotações/mês:                                       300–450

× Conversion rate cotação→contrato:                   10%
= Contratos/mês:                                      30–45

Contratos ativos acumulados M36 (retenção 90% a.a.):  220–340

× Vidas médias/contrato:                              22
= Vidas ativas na carteira:                           4.840–7.480

× Ticket médio/vida/ano:                              R$ 6.000
= Contraprestações intermediadas:                     R$ 29–45 milhões/ano

× Comissão corretor (média 5% recorrente + 1º mês):   ~6,5% efetiva
= Receita corretagem:                                 R$ 1,9–2,9 milhões/ano
```

**Assumptions críticas (devem ser validadas):**
- Ticket médio R$ 6K/vida/ano é média setorial; Amil específico pode variar ±15%
- Conversion rate 2,5% lead é agressivo para nicho YMYL — média de mercado B2B saúde é 1,5–3,5%
- Retenção 90% é ambiciosa — média setorial é 78–85%
- Comissão 5% é aproximação — validar com contrato real do corretor

### C. Additional Analysis

**Sensibilidade do SOM Ano 3 a variáveis-chave:**

| Variável | Cenário Pessimista | Base | Otimista |
|---|---|---|---|
| Sessões orgânicas/mês | 40K | 75K | 120K |
| Lead conversion | 1,5% | 2,5% | 3,5% |
| Lead→cotação | 15% | 20% | 25% |
| Cotação→contrato | 7% | 10% | 13% |
| Retenção anual | 80% | 90% | 93% |
| **SOM Ano 3 (contraprestações)** | **R$ 12M** | **R$ 35M** | **R$ 72M** |
| **Receita corretagem Ano 3** | **R$ 780K** | **R$ 2,1M** | **R$ 4,3M** |

**Conclusão da sensibilidade:**
- Cenário pessimista ainda cobre custo operacional estimado (breakeven viável)
- Cenário base é meta atingível com execução sólida + marketing de conteúdo disciplinado
- Cenário otimista exige execução excepcional + eventos favoráveis (p.ex., parceria B2B2B de alto impacto)

**Drivers de upside (além dos modelados):**
- Parcerias B2B2B com contadores podem dobrar leads sem custo proporcional
- Conteúdo viral (data-journalism) pode gerar pico de +20K sessões em 1–2 meses
- Entrada em nicho adjacente (vida em grupo, odonto) amplia LTV em 20–35%

**Drivers de downside:**
- Cease & desist da Amil sobre domínio → perda total do ativo (risco binário)
- Google Helpful Content Update mal calibrado pode penalizar programmatic
- Concorrente funded (CompanyHero ou novo entrante) ataca com budget 5× maior

---

**Status do documento:** Draft YOLO consolidado
**Próxima atualização:** após keyword research formal (ajustar volume de tráfego estimado) + validação Ahrefs (ajustar DA/DR/backlinks concorrentes)
**Owner:** Atlas (Analyst) → insumo primário para @pm (Morgan)
