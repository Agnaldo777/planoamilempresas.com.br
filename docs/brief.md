# Project Brief: Plano Amil Empresas

**Documento:** Project Brief v1.0
**Projeto:** planoamilempresas.com.br
**Autor:** Atlas (Business Analyst) — Synkra AIOS
**Data:** 2026-04-16
**Status:** Draft inicial (YOLO Mode) — aguarda revisão do stakeholder

---

## Executive Summary

`planoamilempresas.com.br` é um site de captação de leads B2B especializado em **planos de saúde Amil para empresas (PJ/CNPJ)**, operado por corretor autorizado Amil. O produto resolve a dor do **decisor empresarial** (sócio, RH, financeiro) que busca contratar ou migrar plano de saúde corporativo mas enfrenta SERPs saturadas de sites genéricos, informações desatualizadas sobre tabelas 2026 e processos de cotação fragmentados.

A proposta é **dominar o nicho empresarial** (menos saturado que PF) através de SEO técnico agressivo em Astro, conteúdo original com autoridade E-E-A-T, e um funil de conversão otimizado que transforma buscas de alta intenção em leads qualificados para o corretor. O diferencial competitivo é a combinação de **Core Web Vitals impecáveis + conteúdo especializado em PJ + autoridade regulatória (corretor SUSEP + parceria oficial Amil)** em um mercado dominado por EMDs (Exact Match Domains) com conteúdo raso.

---

## Problem Statement

### Estado Atual e Pontos de Dor

O mercado brasileiro de planos de saúde empresariais movimenta **R$ 270+ bilhões/ano** (ANS, 2025) com penetração crescente em PMEs pós-reforma tributária. No entanto, a busca online pelo decisor PJ é caracterizada por:

1. **SERPs dominados por EMDs rasos:** Domínios como `planossaudeamil.com.br`, `planodesaudeamil.com.br`, `planosaudedaamil.com.br` ranqueiam apesar de conteúdo genérico, copiado e desatualizado — ocupando espaço que poderia servir ao usuário com informação real.

2. **Tabelas de preços 2026 desatualizadas:** Sites ranqueando em primeira página mostram valores de 2023-2024, gerando frustração quando o decisor pede cotação.

3. **Conteúdo focado em PF, não PJ:** Maioria dos sites mistura planos individuais com empresariais, sem tratamento especializado para dúvidas específicas de CNPJ (ME, EPP, MEI+PJ, grupos de afinidade, carência reduzida por migração, coparticipação em grupo).

4. **Jornada de cotação fragmentada:** Para obter um orçamento, o decisor precisa preencher múltiplos formulários em múltiplos sites, receber ligações insistentes de call centers, sem transparência sobre coberturas, rede credenciada regional e reajuste.

5. **Ausência de autoridade E-E-A-T clara:** Sites não identificam o corretor responsável, número SUSEP, ou parceria oficial com a operadora — gerando desconfiança no decisor B2B que está gerenciando o bem-estar de dezenas/centenas de colaboradores.

### Impacto Quantificado

- **Volume de busca (Brasil):** ~40K-60K buscas/mês para cluster "plano saúde empresarial Amil" (estimativa conservadora baseada em ferramentas públicas — validar com keyword research dedicado na Fase 5)
- **CPC médio:** R$ 8-25 no Google Ads para keywords desse cluster (indicador forte de intenção comercial)
- **Ticket médio PJ:** R$ 400-1.200/vida/mês × 10-500 vidas = contratos de R$ 48K-7.2M/ano
- **Comissão do corretor:** 1-3 meses da mensalidade (pay-per-life recorrente) = LTV altíssimo

### Por que as soluções existentes falham

| Concorrente | Falha Principal |
|-------------|-----------------|
| Oficiais Amil (institucional.amil.com.br) | Corporativo demais, sem foco em conversão PJ, jornada burocrática |
| EMDs rasos (planossaudeamil etc.) | Conteúdo genérico, sem E-E-A-T, tabelas desatualizadas |
| Corretores tradicionais (amilsa, amilbhsaude) | UX dos anos 2010, Core Web Vitals ruins, SEO técnico fraco |
| Agregadores (rotaseguros, zelas) | Comparam operadoras, diluem foco em Amil |

### Urgência

2026 marca ciclo de reajuste ANS + fim de benefícios fiscais transitórios para MEIs que migraram para ME/EPP, criando **janela de 12-18 meses** de demanda elevada por migração de planos. Entrar agora permite capturar o ciclo; atrasar significa competir com quem chegou primeiro.

---

## Proposed Solution

### Conceito Central

Um site **content-first** construído em Astro, posicionado como **"a referência em plano Amil para empresas"**, com três pilares:

1. **Autoridade visível:** Corretor identificado (nome, foto, SUSEP, CRECI equivalente), parceria oficial Amil explícita, selos de compliance ANS/LGPD.

2. **Conteúdo empresarial especializado:** Cluster topical profundo cobrindo todas as dores do decisor PJ — tabelas 2026 atualizadas mensalmente, comparativos entre planos (400, 500, 600, Black, Blue), simuladores de coparticipação, guias por porte da empresa (ME, EPP, grupos afinidade), rede credenciada regional, carência, portabilidade.

3. **Conversão sem fricção:** Formulário de cotação com < 6 campos (CNPJ auto-preenchido via consulta Receita, n° de vidas, região), WhatsApp direto com corretor, chat ao vivo em horário comercial, CTA contextual em cada artigo.

### Diferenciadores

| Dimensão | Nossa abordagem | Concorrência |
|----------|----------------|--------------|
| **Stack técnica** | Astro + React islands + Cloudflare Edge | WordPress, PHP legado |
| **Core Web Vitals** | LCP < 1.5s, CLS < 0.05, INP < 200ms | LCP > 3s, CLS > 0.2 |
| **Foco de conteúdo** | 100% PJ/empresarial | Misturado PF+PJ |
| **Atualização de tabelas** | Mensal (pipeline automatizado) | Anual ou nunca |
| **E-E-A-T** | Corretor real, SUSEP, parceria Amil | Genérico, anônimo |
| **Schema markup** | HealthInsurancePlan, FAQPage, LocalBusiness, Organization | Básico ou nenhum |
| **Conversão** | Formulário de 6 campos + WhatsApp | Formulários longos, sem WhatsApp |

### Por que vai funcionar onde outros falharam

- **Gap de mercado real:** Nenhum dos 16 concorrentes combina SEO técnico moderno + foco PJ + autoridade regulatória.
- **Capital de backlinks:** Budget aprovado para link building ético (guest posts em portais de RH, gestão empresarial, contabilidade) — diferencial vs. EMDs que dependem apenas de on-page.
- **Vantagem de stack:** Astro entrega Lighthouse 100 out-of-the-box, convertendo Core Web Vitals em ranking boost direto (Google Page Experience signal).
- **Janela temporal:** 2026 é o ano do ciclo de migração; chegamos antes dos incumbentes atualizarem suas stacks.

### Visão de Alto Nível

Em 12 meses: **top 3 no Google para 50+ keywords comerciais PJ** + pipeline mensal de 200-500 leads qualificados + reconhecimento como referência editorial no segmento (backlinks orgânicos de portais).

---

## Target Users

### Primary User Segment: Decisor PJ em PME (10-200 vidas)

**Perfil firmográfico:**
- Porte: ME (faturamento < R$ 4.8M) a EPP (até R$ 360M)
- Setores-alvo: tecnologia, serviços profissionais, comércio, indústria leve, saúde, educação
- Localização: capitais + regiões metropolitanas (SP, RJ, BH, POA, BSB, CWB, SSA, REC)
- Estágio: empresa contratando benefícios pela 1ª vez OU migrando de plano atual

**Personas específicas:**

1. **Sócio-fundador (PME até 30 vidas):** Decisor único, acumula RH + financeiro, precisa de velocidade e confiança. Dor: "não tenho tempo para estudar 20 opções, quero uma recomendação clara."

2. **Gestor de RH (empresa 30-200 vidas):** Comprador técnico, compara 3-5 cotações antes de decidir, prestará contas à diretoria. Dor: "preciso de planilha comparativa com rede, carência e custo por faixa etária."

3. **Financeiro/Controladoria:** Valida aspectos fiscais, coparticipação, provisões contábeis. Dor: "quero entender reajuste histórico e impacto no DRE dos próximos 3 anos."

**Comportamentos e workflows atuais:**
- Pesquisa no Google com queries longas e específicas ("plano amil 50 vidas empresa São Paulo reajuste 2026")
- Consome conteúdo em desktop durante horário comercial
- Lê reviews no ReclameAqui antes de contratar
- Prefere WhatsApp a ligação telefônica na primeira abordagem
- Demanda transparência de preços antes de ceder contato

**Necessidades e dores específicas:**
- Tabela de preços real, por faixa etária, atualizada
- Rede credenciada filtrável por cidade/estado
- Comparativo entre produtos Amil (400, 500, 600, Black, Blue, Blue Select)
- Explicação clara de carências, coparticipação, CPT
- Garantia de não receber "spam" após enviar contato

### Secondary User Segment: Contador / Consultor de Benefícios

**Perfil:** Profissional que terceiriza o benefício corporativo para clientes PME
**Comportamento:** Busca conteúdo técnico aprofundado, compartilha com clientes finais
**Valor estratégico:** Gera backlinks orgânicos + referência B2B de alto LTV

---

## Goals & Success Metrics

### Business Objectives

- **Gerar 200 leads qualificados/mês até M6 (outubro 2026)**, crescendo para 500 leads/mês até M12
- **Atingir top 3 no Google para 50 keywords comerciais PJ** até M9 (janeiro 2027)
- **Converter 15% dos leads em cotações formais** (meta M6: 30 cotações/mês)
- **Fechar 8% das cotações em contratos** (meta M6: 2-3 contratos/mês, crescendo)
- **ROI positivo em M9**: receita de comissões > custo de SEO + backlinks + operação
- **Tornar-se referência editorial no nicho**: 10+ backlinks orgânicos de portais Tier A até M12

### User Success Metrics

- Tempo médio para obter tabela de preços: < 30 segundos do clique ao resultado
- Taxa de retorno ao site (repeat visitors): > 25% em 30 dias
- NPS dos leads convertidos: >= 60
- Taxa de reclamação "spam" após contato: < 2%
- Taxa de conclusão do formulário de cotação: > 40% (vs. média mercado de 15-20%)

### Key Performance Indicators (KPIs)

- **Posição média Google:** Top 5 para keywords-alvo (medido via Search Console)
- **Tráfego orgânico mensal:** 15K sessões/mês até M6, 40K/mês até M12
- **CTR médio SERP:** > 6% (vs. média nicho 3-4%)
- **Core Web Vitals (Good):** 95% das páginas com LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Lighthouse Performance:** >= 95 em todas as páginas
- **Domain Rating (Ahrefs):** atingir DR 35 até M12 (partindo de 0)
- **Backlinks dofollow de qualidade (DR 40+):** 50+ até M12
- **Conversion Rate (sessão → lead):** >= 2.5%
- **Cost per Lead (orgânico):** < R$ 20 (vs. R$ 80-150 Google Ads no nicho)

---

## MVP Scope

### Core Features (Must Have)

- **Homepage otimizada para keyword "plano amil empresarial"**: hero com proposta clara, CTA WhatsApp, social proof, FAQs críticos, formulário de cotação above-the-fold
- **Pillar page: "Plano de Saúde Amil para Empresas (Guia Completo 2026)"**: conteúdo de 3.000+ palavras, cobrindo todos os subtópicos do cluster, schema FAQPage, anchor links internos
- **Cluster de 15 artigos cornerstone:** cobrindo tabela de preços, comparativo 400/500/600/Black, por região (SP, RJ, BH, POA), por porte (ME, EPP), carência, portabilidade, reajuste, rede credenciada, coparticipação PJ, MEI pode contratar, migração, cancelamento, reembolso
- **Páginas de preços dinâmicas por faixa etária:** tabela atualizada mensalmente via CMS (Decap/Sveltia ou Sanity)
- **Formulário de cotação inteligente:** < 6 campos, auto-complete CNPJ via ReceitaWS, validação em tempo real, integração com CRM do corretor (RD Station / HubSpot / Pipedrive)
- **Integração WhatsApp Business:** botão flutuante + deep links contextuais em cada artigo
- **Blog com CMS headless:** permite corretor/equipe publicar sem dev, pipeline de revisão editorial
- **Schema markup completo:** Organization, LocalBusiness, HealthInsurancePlan, FAQPage, BreadcrumbList, Article
- **Página de autoridade (Sobre):** corretor com foto, SUSEP, LinkedIn, parceria Amil, selos compliance ANS/LGPD
- **LGPD compliance:** banner de cookies granular, política de privacidade clara, opt-in explícito no formulário
- **Analytics stack:** GA4 + GSC + Hotjar/Clarity + server-side tracking (Plausible/GA4 MP)
- **Performance core:** Astro + Cloudflare CDN + image optimization (AVIF/WebP) + font optimization + critical CSS

### Out of Scope for MVP

- Área logada para clientes (dashboard apólice, 2ª via boleto) — Phase 2
- App mobile nativo — provavelmente nunca
- Marketplace de múltiplas operadoras — violaria foco Amil
- E-commerce de contratação 100% online — compliance ANS complexo, melhor lead + humano
- Chatbot com IA generativa — Phase 2 após validar volume
- Programa de afiliados — Phase 3
- Multi-idioma (EN/ES) — não relevante para TAM Brasil
- PWA offline — nicho não demanda

### MVP Success Criteria

MVP é considerado bem-sucedido quando, **em M3 após lançamento**, atinge simultaneamente:

1. Top 20 no Google para 10 keywords comerciais PJ
2. 50 leads qualificados gerados
3. Lighthouse Performance >= 95 em 100% das páginas
4. Domain Rating >= 15 (Ahrefs)
5. Zero incidentes de compliance (ANS/LGPD/marca Amil)
6. Infraestrutura estável: uptime > 99.9%, zero perda de lead por falha técnica

---

## Post-MVP Vision

### Phase 2 Features (M6-M12)

- **Calculadora interativa de coparticipação:** input de sinistralidade esperada → output de custo total projetado
- **Simulador de reajuste:** histórico + projeção 3 anos
- **Comparador side-by-side de planos Amil:** UX tipo Trivago
- **Biblioteca de documentos:** modelos de aditivos, carta de portabilidade, comprovantes
- **Webinars mensais para RHs:** conteúdo educacional + captação qualificada
- **Página por cidade (programmatic SEO):** "plano amil empresarial [cidade]" com 50+ cidades-alvo
- **Área logada do cliente:** 2ª via boleto, carteirinha digital, rede credenciada personalizada

### Long-term Vision (1-2 anos)

Tornar-se a **plataforma de referência para contratação B2B de planos de saúde no Brasil** (expandindo além de Amil para Bradesco Saúde, SulAmérica, Hapvida, Unimed) — mas mantendo marca mestre neutra (ex: `comparaplanoscorporativos.com.br`) com `planoamilempresas.com.br` como vertical dominante. Possível expansão para seguros adjacentes (odonto, vida, previdência privada PJ).

### Expansion Opportunities

- **Vertical odontológico:** domínio irmão `planoamilodonto.com.br` (se contrato permitir)
- **API de cotação white-label:** vender acesso para contabilidades, consultorias, HRTechs
- **Curso/certificação para corretores iniciantes:** info-produto paralelo
- **Parcerias com HRTechs (Gupy, Kenoby):** embed de cotação dentro do processo de admissão

---

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web (desktop + mobile), responsive-first
- **Browser/OS Support:** Chrome/Edge/Safari/Firefox últimas 2 versões; iOS 14+, Android 10+
- **Performance Requirements:** LCP < 1.5s, CLS < 0.05, INP < 200ms, Lighthouse Performance >= 95, TTFB < 200ms

### Technology Preferences

- **Frontend:** Astro 4+ (stack principal, content-first, zero JS por padrão) + ilhas React 18 para componentes interativos (formulário de cotação, calculadoras)
- **Backend:** Edge functions (Cloudflare Workers) para formulário de cotação + proxy anti-abuso; opcional Node.js serverless (Vercel/Netlify) se complexidade exigir
- **CMS:** Headless — opções a avaliar: Decap CMS (gratuito, git-based), Sanity (free tier generoso), Strapi (self-hosted), Payload CMS
- **Database:** Não necessário no MVP (conteúdo em Markdown + frontmatter no repo). Para leads: integração direta com CRM (sem DB próprio). Phase 2 pode introduzir Supabase/Turso se necessário
- **Hosting/Infrastructure:** Cloudflare Pages (preferencial — Workers + R2 + KV integrados) ou Vercel (alternativa com DX superior para Astro); CDN global, HTTP/3, Brotli

### Architecture Considerations

- **Repository Structure:** Monorepo simples (não precisa de Turborepo/Nx no MVP). Estrutura: `src/` (páginas, componentes, conteúdo), `public/` (assets estáticos), `scripts/` (automações de build e atualização de tabelas), `.github/` (CI/CD)
- **Service Architecture:** Static-first com edge functions pontuais. Formulário → Cloudflare Worker → CRM do corretor. Sem backend monolítico
- **Integration Requirements:**
  - CRM (RD Station / HubSpot / Pipedrive) — API para envio de leads
  - ReceitaWS / BrasilAPI — consulta CNPJ no formulário
  - WhatsApp Business API — deep links (simples) ou API oficial (Phase 2)
  - GA4 + Google Search Console — analytics
  - reCAPTCHA v3 / Cloudflare Turnstile — anti-spam
- **Security/Compliance:**
  - LGPD: consent management (OneTrust ou open-source), DPO identificado, política de privacidade revisada por jurídico
  - ANS: disclaimers obrigatórios (registro operadora, corretor SUSEP), não prometer cobertura que depende de análise
  - Marca Amil: termo de uso autorizado pelo contrato de corretagem, disclaimers "corretor autorizado" em rodapé
  - Infraestrutura: HTTPS obrigatório, HSTS, CSP restritivo, rate limiting no formulário, honeypot anti-bot
  - Backups: Git como fonte única de verdade + export periódico de leads do CRM

---

## Constraints & Assumptions

### Constraints

- **Budget:** Aprovado para stack + hosting (~R$ 500-1.500/mês) + backlinks (R$ 3K-10K/mês no período de ramp-up) — valor exato a confirmar com stakeholder
- **Timeline:** MVP no ar em **8-12 semanas** após aprovação deste brief; primeiros 10 artigos cornerstone publicados em paralelo ao desenvolvimento
- **Resources:** 1 corretor principal (conteúdo especializado + validação regulatória), 1 dev fullstack (Astro + integrações), 1 SEO/content (pesquisa + redação), 1 UX/designer (briefings pontuais) — viável freelance ou squad
- **Technical:**
  - Astro como stack única (proibido misturar frameworks sem justificativa)
  - Absolute imports (preferência do usuário, ver CLAUDE.md)
  - Sem modificar framework AIOS (boundary L1/L2 protegida)

### Key Assumptions

- Corretor tem contrato ativo e vigente com Amil durante todo o período do projeto
- Amil não lança operadora própria digital concorrente nos próximos 12 meses
- Google não altera drasticamente algoritmo de E-E-A-T para YMYL (saúde) de forma que desfavoreça corretores
- Budget para backlinks é sustentável por no mínimo 6 meses (janela típica para SEO maturar)
- Volume de busca estimado (40K-60K/mês) é confirmado pela pesquisa formal de keywords (Fase 5)
- Regulação ANS permanece estável (sem proibições novas a publicidade de operadoras via corretores)
- Stakeholder disponível para revisões semanais de progresso e validação de conteúdo

---

## Risks & Open Questions

### Key Risks

- **Violação de marca Amil:** Se uso do termo "Amil" no domínio não for autorizado explicitamente no contrato de corretagem, Amil pode derrubar via SACI-Adm. **Impacto: perda total do domínio + redirecionamentos.** Mitigação: validação contratual antes do go-live.
- **Penalização por duplicate content:** Se conteúdo for scraped/clonado (não apenas inspirado), Google penaliza com queda de ranking. **Impacto: projeto inviável.** Mitigação: política editorial de conteúdo 100% original, checagem via Copyscape antes de publicar.
- **Mudança de algoritmo Google (Helpful Content / YMYL):** Atualizações tendem a favorecer autoridade; sites de corretores podem ser considerados "affiliate thin content". **Impacto: queda de ranking.** Mitigação: E-E-A-T forte, autor identificado, dados originais (tabelas, estudos), reviews de mercado.
- **Cancelamento do contrato de corretagem com Amil:** Sem contrato, site perde razão de existir. **Impacto: perda de ativo digital.** Mitigação: domínio-ponte neutro (`comparaplanoscorporativos.com.br`) como backup estratégico.
- **Competição entrando no mesmo nicho:** Se grande concorrente (Alper, Leadsaude) focar em Amil PJ, barreira de entrada desaparece. **Impacto: difícil.** Mitigação: construir moat via E-E-A-T + velocidade de publicação.
- **Compliance ANS:** Publicidade de operadora via corretor tem regras específicas (Res. Normativa 195/2009). Violação pode gerar advertência pública. Mitigação: revisão jurídica de templates antes do lançamento.
- **Leads de baixa qualidade:** Volume alto sem conversão é vaidade. Mitigação: otimizar para keywords de alta intenção + qualificação progressiva no formulário.

### Open Questions

- Quem é o corretor nomeado que aparecerá como autor do conteúdo e nas páginas "Sobre"?
- Qual o nome oficial da corretora (PJ responsável) e número SUSEP?
- Existe já um CRM em uso ou será necessário escolher na Fase 1?
- Quais regiões do Brasil são prioritárias para a operação do corretor (afeta conteúdo programmatic)?
- Há restrições contratuais da Amil sobre quais produtos podem ser mencionados (ex: Amil Black tem restrição de publicidade)?
- Budget exato para ferramentas (Ahrefs: ~R$ 500/mês, Semrush: ~R$ 700/mês) — quais aprovar?
- Equipe de conteúdo: terceirizar redação ou corretor escreve com apoio de copy?

### Areas Needing Further Research

- **Keyword research profundo:** validar volume, dificuldade e intenção de cada cluster (@analyst na Fase 5)
- **Competitive analysis formal:** matriz completa dos 16 sites com DA, backlinks, top pages, content gap (@analyst na Fase 1 — próximo passo)
- **Análise regulatória ANS:** mapear todas as RNs aplicáveis a publicidade de corretor (pode demandar consultoria jurídica especializada)
- **Estudo de persona com dados primários:** entrevistas com 5-10 decisores PJ que contrataram plano nos últimos 12 meses
- **Benchmarking de CRMs:** RD Station vs. HubSpot vs. Pipedrive — custo, integrações, UX para corretor
- **Validação do conceito de domínio neutro:** faz sentido registrar `comparaplanoscorporativos.com.br` agora como backup?

---

## Appendices

### A. Research Summary

Pesquisa preliminar realizada pelo orquestrador Orion com base em:
- Análise pública dos 16 sites concorrentes listados
- Contexto regulatório ANS/SUSEP (conhecimento geral do setor)
- Best practices SEO para nichos YMYL (saúde)
- Capabilities da stack Astro para sites content-heavy

**Pesquisa formal pendente:**
- Competitive analysis detalhado (próximo passo: `*create-competitor-analysis`)
- Market research quantitativo (Fase 2: `*perform-market-research`)
- Keyword research aprofundado (Fase 5: `*research-prompt keyword-strategy`)

### B. Stakeholder Input

**Stakeholder principal:** Corretor autorizado Amil (a nomear)

**Inputs recebidos durante brainstorming inicial:**
- Nicho confirmado: Plano de Saúde Amil
- Domínio escolhido: `planoamilempresas.com.br`
- Stack aprovada: Astro (principal)
- Orçamento para backlinks: aprovado
- Status legal: corretor autorizado (bloqueio Fase 0 resolvido)
- Foco em PJ/empresarial: alinhado

### C. References

- ANS — Resolução Normativa 195/2009 (publicidade em planos de saúde)
- ANS — Agência Nacional de Saúde Suplementar (https://www.gov.br/ans/)
- SUSEP — Superintendência de Seguros Privados (https://www.gov.br/susep/)
- Google Search Central — E-E-A-T Guidelines
- Astro Docs — Content Collections, SSR, Islands Architecture
- Cloudflare Pages — deployment patterns
- Concorrentes analisados (16 URLs — ver Tier S/A/B/C no histórico do projeto)

---

## Next Steps

### Immediate Actions

1. **Revisão e validação deste brief pelo stakeholder** — responder Open Questions críticos (corretor nomeado, SUSEP, regiões prioritárias, restrições contratuais Amil)
2. **Executar `*create-competitor-analysis`** (Atlas / @analyst) — matriz completa dos 16 sites, pontos de ataque, content gap
3. **Executar `*perform-market-research`** (Atlas / @analyst) — TAM/SAM/SOM, personas com dados, sazonalidade, tendências 2026
4. **Executar `*research-prompt keyword-strategy`** (Atlas / @analyst) — deep research prompt para descoberta de keywords long-tail
5. **Facilitar `*brainstorm positioning`** (Atlas / @analyst) — ângulo vencedor contra EMDs, proposta de valor única
6. **Handoff para `@pm` (Morgan)** — transformar este brief + outputs de pesquisa em PRD completo com epics e stories
7. **Validação regulatória preliminar** (paralelo) — consultoria jurídica valida domínio + disclaimers antes de qualquer go-live
8. **Registro de domínio-ponte neutro** (decisão estratégica) — avaliar se `comparaplanoscorporativos.com.br` ou similar deve ser registrado como backup

### PM Handoff

Este Project Brief fornece o contexto completo para **Plano Amil Empresas**. @pm (Morgan): por favor inicie em 'PRD Generation Mode' após o stakeholder validar este brief e os outputs das próximas pesquisas (competitive analysis, market research, keyword strategy). Revise este brief integralmente e trabalhe com o stakeholder para criar o PRD seção por seção conforme o template indica, solicitando esclarecimentos ou sugerindo melhorias quando necessário.

---

**Status do documento:** Draft YOLO — aguardando revisão stakeholder
**Próxima atualização:** após sessão de validação + inputs das Open Questions
**Owner:** Atlas (Analyst) → transição para @pm (Morgan) após validação
