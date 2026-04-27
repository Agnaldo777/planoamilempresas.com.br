# PM Handoff Package — planoamilempresas.com.br

**Documento:** PM Handoff Package v1.0
**Projeto:** planoamilempresas.com.br
**De:** Atlas (Business Analyst — Decoder ♏) — Synkra AIOS
**Para:** Morgan (PM — Product Manager) — Synkra AIOS
**Data:** 2026-04-16
**Status:** Pacote de research COMPLETO — pronto para PRD Generation Mode

---

## 1. Resumo Executivo (1 minuto de leitura)

`planoamilempresas.com.br` é um site de captação de leads B2B para **plano de saúde Amil empresarial (PJ/CNPJ)**, operado por corretor autorizado SUSEP. O objetivo é dominar o nicho de **PMEs (2–200 vidas)** em 20 capitais brasileiras via SEO agressivo, conteúdo especializado e conversão WhatsApp-first.

**Posicionamento central (validado em brainstorm):**
> **"O corretor Amil especialista em empresas. Tabelas reais, cotação em WhatsApp, decisão sem arrependimento."**

**Tamanho de oportunidade:**
- TAM Brasil: R$ 85–110 B/ano
- SAM realista: R$ 3,5–5,5 B/ano
- SOM Ano 3 (cenário base): R$ 35 M em contraprestações intermediadas = **R$ 1,75 M/ano em receita de corretagem**

**Estratégia vencedora:** abandonar a competição por head terms (Amil oficial domina). Atacar **50+ long-tails CNAE × cidade × porte** (blue ocean confirmado). Construir autoridade YMYL visível (SUSEP, ANS, RA1000, corretor nomeado) como fosso defensável.

**Status legal:** Corretor autorizado confirmado. Uso da marca "Amil" no domínio: **pendente validação contratual** (bloqueador pré-go-live).

**Stack técnica:** Astro (SSG) + ilhas React para forms/calculadora + Cloudflare Pages + Headless CMS (a escolher).

---

## 2. Deliverables Completos desta Fase de Research

| # | Documento | Path | Propósito | Uso no PRD |
|---|---|---|---|---|
| 1 | **Project Brief** | `docs/brief.md` | Foundational document — problem, solution, users, scope | PRD base; seções Executive Summary, Problem, Goals |
| 2 | **Competitive Analysis** | `docs/competitor-analysis.md` | 16 concorrentes em 4 tiers, matriz priorização, SWOT | PRD features, diferenciação, positioning |
| 3 | **Market Research** | `docs/market-research.md` | TAM/SAM/SOM, personas, Porter 5F, PESTEL, JTBD, journey | PRD metrics, personas, pricing |
| 4 | **Keyword Research Prompt** | `docs/keyword-strategy-research-prompt.md` | Deep research brief para keyword discovery | PRD content scope, sitemap, calendar |
| 5 | **Brainstorming Results** | `docs/brainstorming-session-results.md` | Positioning, UVPs, tagline, moonshots | PRD vision, messaging, Phase 2 roadmap |
| 6 | **PM Handoff (este doc)** | `docs/pm-handoff.md` | Consolidação para início do PRD | Ponto de partida do @pm |

**Localização de todos os docs:** `C:\Users\benef\planoamilempresas\docs\`

---

## 3. Decisões Já Tomadas (não re-deliberar no PRD)

| Decisão | Valor | Fonte |
|---|---|---|
| Nicho | Plano de saúde Amil Empresarial (PJ) | Stakeholder |
| Domínio | `planoamilempresas.com.br` | Stakeholder |
| Stack principal | Astro (SSG) + React islands | Stakeholder + análise técnica |
| Hosting | Cloudflare Pages (preferencial) / Vercel (alternativa) | Recomendação Atlas |
| Foco PJ/empresarial | ≥90% do conteúdo; PF apenas mencional | Atlas (diferenciação) |
| Segmentos prioritários | ME 2–30 vidas (Fase 1) → EPP 30–200 (Fase 2) → B2B2B contadores (Fase 3) | Market research |
| Geografia prioritária | Top 20 cidades BR | Market research |
| Tagline | "O corretor Amil especialista em empresas." | Brainstorm |
| Sub-tagline | "Tabelas reais, cotação em WhatsApp, rede credenciada filtrável. Decida certo na primeira vez." | Brainstorm |
| Core emocional | "Redução do custo de arrependimento em decisão de 3 anos" | Brainstorm (First Principles) |
| Modelo de monetização | Comissão de corretagem Amil (5% recorrente + 1º mês bonificado) — cliente não paga | Market research |
| Canal de conversão primário | WhatsApp Business + formulário < 6 campos com auto-CNPJ | Brainstorm |
| SEO strategy | Long-tail CNAE×cidade programmatic (600 páginas) + 15 cornerstones + pillar | Competitor analysis + brainstorm |
| E-E-A-T | Corretor nomeado + SUSEP + ANS + RA1000 + selos compliance visíveis | Brainstorm (fosso YMYL) |

---

## 4. Decisões CRÍTICAS Pendentes (bloqueios do PRD)

### 🔴 Bloqueadores absolutos (PRD não fecha sem resolver)

1. **Nome completo + SUSEP do corretor nomeado**
   - Afeta: todas as páginas "Sobre", disclaimers, contratos de parceria
   - Owner: Stakeholder
   - Prazo sugerido: antes do kickoff do PRD

2. **Nome jurídico da corretora PJ responsável pelo site**
   - Afeta: contratos, faturamento, compliance ANS, rodapé legal
   - Owner: Stakeholder (com apoio contábil se necessário)
   - Prazo sugerido: antes do kickoff do PRD

3. **Validação contratual do uso de "Amil" no domínio**
   - Afeta: viabilidade binária do projeto (risco cease & desist)
   - Owner: Stakeholder + advogado
   - Prazo sugerido: em paralelo ao PRD, **obrigatório antes do go-live**
   - Plano B: registrar domínio-ponte neutro (`comparaplanoscorporativos.com.br` ou `corretoramil.com.br`) como contingência

4. **Regiões geográficas prioritárias de operação do corretor**
   - Afeta: priorização de conteúdo programmatic (top 20 cidades genéricas vs. foco regional)
   - Owner: Stakeholder
   - Prazo sugerido: antes da definição de sitemap no PRD

5. **Restrições contratuais Amil sobre produtos e disclaimers**
   - Afeta: quais produtos podem ser detalhados no site (ex: Black pode ter restrição de publicidade)
   - Owner: Stakeholder (consultar contrato de corretagem)
   - Prazo sugerido: antes da produção de conteúdo

### 🟡 Importantes (PRD pode proceder, mas melhor definir cedo)

6. **CRM a usar** (RD Station / HubSpot / Pipedrive / outro)
   - Afeta: integração do formulário, automação de funil, tracking
   - Owner: Stakeholder + @architect
   - Recomendação Atlas: **RD Station** (custo-benefício para nicho brasileiro + integrações nacionais)

7. **Budget exato para ferramentas SEO**
   - Afeta: qualidade de keyword research e monitoramento
   - Recomendação: Ahrefs (trial 7 dias + plano Lite R$ 500/mês) OU Semrush Pro R$ 700/mês
   - Owner: Stakeholder

8. **Equipe de conteúdo: in-house, freelance ou agência**
   - Afeta: custo, qualidade, velocidade, compliance
   - Recomendação: **freelance sênior + revisão do corretor + validação jurídica** = custo R$ 150–300/artigo; 15 cornerstones = R$ 3K–6K
   - Owner: Stakeholder

9. **Orçamento para backlinks** (valor específico)
   - Afeta: velocidade de ramp-up SEO
   - Recomendação: R$ 3K–5K/mês mínimo, R$ 8K–15K/mês competitivo
   - Owner: Stakeholder

10. **Aceite do stakeholder em aparecer publicamente** (foto, nome, bio, LinkedIn)
    - Afeta: E-E-A-T visível — fosso YMYL principal
    - Owner: Stakeholder

### 🟢 Podem ser resolvidas durante o PRD

11. Identidade visual (paleta definida: `#0066B3` Amil azul + `#00C389` CTA verde; tipografia: Inter/Manrope)
12. Escopo da Phase 2 (calculadora embed, API pública, webinars, newsletter VIP)
13. Política de upsell (odonto, vida em grupo — Phase 2)
14. Estratégia de parcerias B2B2B (contadores, HRTechs) — Phase 2

---

## 5. Epics Sugeridos para o PRD (input estrutural)

O @pm pode organizar o PRD nos seguintes épicos (sugestão; pode ajustar):

### Epic 1: Foundation & Compliance
- Registro de domínio + domínio-ponte neutro
- Configuração de infraestrutura (Cloudflare Pages, DNS, HTTPS, CSP)
- Política de privacidade LGPD + consent management
- Disclaimers ANS/SUSEP em todos os templates
- Página "Sobre o corretor" com autoridade visível
- Validação jurídica de templates e marca Amil
- Setup de analytics (GA4, GSC, Clarity/Hotjar)

### Epic 2: Content Engine
- Pillar page "Guia Plano Amil Empresarial 2026" (3.000+ palavras)
- 15 cornerstones priorizados por keyword research
- Template de FAQ com schema FAQPage
- Template de comparativo de produtos Amil
- CMS headless (Decap / Sanity / Payload) — a escolher
- Pipeline editorial (redator → corretor → advogado → publicação)
- Calendário editorial dos 90 primeiros dias

### Epic 3: Programmatic SEO — Matrix CNAE × Cidade
- Template dinâmico de landing "Plano Amil Empresarial para [CNAE] em [Cidade]"
- 30 CNAEs × 20 cidades = 600 URLs iniciais
- Pipeline de geração com conteúdo único por combinação (não thin content)
- Schema markup rich por template
- Interlinking inteligente entre páginas programáticas

### Epic 4: Conversion Engine
- Formulário de cotação (< 6 campos + auto-CNPJ ReceitaWS)
- Integração CRM (RD Station / HubSpot / Pipedrive)
- Botão WhatsApp flutuante + deep links contextuais
- Página de tabela de preços 2026 atualizável mensalmente
- Página de rede credenciada filtrável por cidade/estado
- Calculadora de coparticipação inline (Phase 1.5)

### Epic 5: Trust & Authority (E-E-A-T)
- Página "Sobre o corretor" com SUSEP, foto, CRC, LinkedIn, bio
- Selos ANS, RA1000, LGPD compliance
- Seção "Data de atualização" em artigos e tabelas
- Biblioteca de contratos-modelo gratuita (lead magnet)
- Página institucional da corretora PJ

### Epic 6: SEO Technical Excellence
- Schema.org implementation (HealthInsurancePlan, FAQPage, Article, Organization, LocalBusiness, BreadcrumbList)
- Sitemap XML dinâmico + robots.txt otimizado
- Core Web Vitals: LCP < 1.8s, CLS < 0.05, INP < 200ms
- Image optimization (AVIF/WebP, lazy loading)
- Internal linking architecture + silo topical
- Redirecionamentos e canonical tags

### Epic 7: Measurement & Iteration
- Dashboard de KPIs (sessions, CTR, leads, conversões)
- A/B testing de CTAs, formulário, calculadora
- SEO rank tracking (50 keywords-alvo)
- Lead scoring e qualificação
- Retrospectiva mensal + ajuste de roadmap

### Epic 8 (Phase 2): Expansion & Moats
- Calculadora embed para contadores (viral loop)
- Newsletter VIP "Benchmark Amil Empresarial"
- Grupo VIP WhatsApp de decisores PJ
- Webinars mensais para RHs
- API pública de cotação (moonshot)
- Estudo anual "Radar Saúde Corporativa Brasil" (data-journalism)
- Cross-sell odonto + vida em grupo

---

## 6. Personas Resumidas (para PRD)

### Primary
- **Sócio-Fundador PME (2–30 vidas):** decisor único, tempo escasso, medo de erro, WhatsApp-first
- **Gestor de RH PME (30–200 vidas):** comprador técnico, compara 3–5 cotações, planilha para diretoria

### Secondary
- **Financeiro/Controladoria:** veto player, foco em custo total 3 anos, histórico de reajuste
- **Contador/Consultor:** multiplicador B2B2B, fonte de backlinks e indicações

(Perfis detalhados em `market-research.md` seção Customer Analysis)

---

## 7. KPIs Propostos (para validação com stakeholder)

| KPI | M3 | M6 | M12 |
|---|---|---|---|
| Sessões orgânicas/mês | 2K | 8K | 30K |
| Keywords em top 20 | 10 | 30 | 80 |
| Keywords em top 3 | 1 | 5 | 20 |
| Leads qualificados/mês | 20 | 100 | 400 |
| Cotações formais/mês | 3 | 20 | 80 |
| Contratos fechados/mês | 1 | 3 | 12 |
| Vidas ativas carteira | 12 | 80 | 350 |
| Core Web Vitals (Good) | 95% | 95% | 95% |
| Lighthouse Performance | 95 | 95 | 97 |
| Domain Rating (Ahrefs) | 10 | 20 | 35 |
| Backlinks DR 40+ | 5 | 20 | 50 |
| NPS leads convertidos | — | 55 | 65 |

---

## 8. Riscos Críticos + Mitigações (resumo)

| Risco | Severidade | Mitigação |
|---|---|---|
| Cease & desist Amil sobre domínio | 🔴 ALTA (binário) | Validação contratual + domínio-ponte neutro como backup |
| Duplicate content / scraping acusação | 🔴 ALTA | Política editorial de conteúdo 100% original + Copyscape |
| Google Helpful Content penalizar programmatic | 🟡 MÉDIA | Conteúdo único por combinação CNAE×cidade (rede real, dados locais) |
| Cancelamento contrato de corretagem | 🔴 ALTA | Domínio-ponte + relacionamento institucional Amil |
| Concorrente funded (CompanyHero) atacar Amil | 🟡 MÉDIA | Especialização vertical profunda + velocidade de conteúdo |
| ANS RN 195 — publicidade imprópria | 🟡 MÉDIA | Revisão jurídica por batch + disclaimers padronizados |
| LGPD non-compliance | 🟡 MÉDIA | Consent management + DPO identificado + política clara |
| Leads de baixa qualidade | 🟢 BAIXA | Keywords de alta intenção + qualificação progressiva no formulário |

---

## 9. Próximos Passos (roadmap imediato pós-handoff)

### Para o Stakeholder (esta semana)
1. Resolver os 5 bloqueadores absolutos da Seção 4
2. Engajar advogado para validação contratual Amil + disclaimers
3. Confirmar budget de ferramentas SEO + backlinks + redação
4. Decidir sobre aparecer publicamente (E-E-A-T)

### Para o @pm (Morgan) — ao iniciar PRD
1. Revisar os 6 deliverables desta fase (brief, competitor, market, keyword-prompt, brainstorm, handoff)
2. Validar com stakeholder Os 8 epics sugeridos (Seção 5) e refinar
3. Detalhar PRD com user stories por epic
4. Criar epic execution file conforme protocolo AIOS
5. Definir critérios de aceite por story
6. Handoff para @architect → @ux-design-expert → @data-engineer após PRD aprovado

### Para executar em paralelo (não bloqueia PRD)
1. **Executar o Deep Research Prompt** (`keyword-strategy-research-prompt.md`) em Ahrefs/Semrush — entrega concreta: planilha com 800–1.500 keywords
2. **Registrar domínio + domínio-ponte neutro** (se ainda não feito)
3. **Trial 30 dias Ahrefs** para validar DA/DR dos concorrentes
4. **Contratar redator freelance sênior** para iniciar cornerstones em paralelo ao dev
5. **Agendar Design Sprint** para Semana 3–4 do desenvolvimento

---

## 10. Ordem Recomendada de Agentes Pós-PRD

```
@pm (Morgan) → PRD com epics e stories
      ↓
@architect (Aria) → System design (Astro SSG + CMS + integrações)
      ↓
@data-engineer (Dara) → Schema de conteúdo (content collections Astro) + pipeline de tabelas Amil
      ↓
@ux-design-expert (Uma) → Wireframes + design system + sprint de homepage/calculadora
      ↓
@sm (River) → Story creation a partir do PRD
      ↓
@po (Pax) → Story validation
      ↓
@dev (Dex) → Implementação story a story
      ↓
@qa (Quinn) → QA gate + Lighthouse validation
      ↓
@devops (Gage) → Deploy + monitoring + CI/CD
```

**Atlas (eu) retorna** nas fases:
- Após keyword research formal (ajustar personas, KPIs, scope)
- Em retrospectivas trimestrais (competitive re-analysis, market re-sizing)
- Quando surgir dúvida estratégica que exige research profundo

---

## 11. Assinatura de Entrega

Atlas declara a **Fase 1 — Research** **concluída**, com todos os 6 deliverables entregues conforme escopo acordado e qualidade compatível com o framework AIOS.

Os artefatos estão prontos para **PRD Generation Mode** pelo @pm (Morgan). Nenhum bloqueio de research pendente — apenas os 5 inputs críticos do stakeholder (Seção 4) precisam ser coletados em paralelo ao início do PRD.

**Recomendação final:** Morgan pode iniciar o PRD **agora**, trabalhando em paralelo com a coleta dos 5 inputs críticos do stakeholder. Os epics 1–7 podem ser detalhados sem depender desses inputs; epic 5 (Trust & Authority) e compliance final dependem dos inputs para finalizar.

---

**Owner:** Atlas (Analyst) ♏ — research concluído
**Next owner:** Morgan (PM) ♌ — PRD ownership
**Signature closing:** — Atlas, investigando a verdade 🔎
