# Plano Amil Empresas — Product Requirements Document (PRD)

**Documento:** Product Requirements Document v1.3.1
**Projeto:** planoamilempresas.com.br (Fase 1) + `planosaudeamil.com.br` (Fase 2 roadmap)
**Autor:** Morgan (Product Manager — Strategist ♑) — Synkra AIOS
**Data:** 2026-04-28 (última atualização v1.3.1)
**Modo:** v1.3.1 incorpora research adicional de `amilsaudebr.com.br` (ver `docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md`) sobre v1.3 — adiciona FR50-FR54 + NFR26. v1.3 incorpora research competitiva (13 acertos PSAmil + 8 acertos AmilPlanos), Caminho C (Astro descartado — ADR-008), ecossistema hub-and-spoke (ADR-009) e Fase 2 amplo (`planosaudeamil.com.br`) como roadmap futuro
**Status:** v1.3.1 — APPROVED PARA REVALIDAÇÃO @po

---

## Goals and Background Context

### Goals

- Ranquear em **top 3 no Google** para ≥20 keywords comerciais PJ até M12 (janeiro 2027)
- Gerar **200 leads qualificados/mês em M6** e **500 leads qualificados/mês em M12**
- Atingir **Domain Rating (Ahrefs) ≥35 em M12**, partindo de 0, com budget estruturado de backlinks
- Dominar **nicho de long-tail CNAE × cidade × porte** com 600+ landing pages programáticas publicadas até M6
- Construir **E-E-A-T YMYL visível e defensável** (SUSEP, ANS, RA1000, corretor nomeado) como fosso competitivo
- Entregar **Core Web Vitals "Good" em 95% das páginas** e **Lighthouse Performance ≥95** desde o go-live
- Fechar **3 contratos/mês em M6** escalando para **12 contratos/mês em M12**, gerando carteira de 220–340 contratos ativos e receita de corretagem de R$ 1,2–2,7M/ano no Ano 3
- Estabelecer fosso regulatório com **100% compliance ANS (RN 195/2009 e 593/2024) + LGPD** desde o primeiro dia

### Background Context

O mercado brasileiro de **planos de saúde coletivos empresariais** movimenta R$ 240+ bilhões/ano (IESS) e cresce CAGR 9–12%, puxado por migração PF→PJ e crescimento de PMEs formais. Dentro desse mercado, o nicho **Amil para empresas 2–200 vidas** apresenta SAM de R$ 3,5–5,5 B/ano — mas SERPs dominados por **16 concorrentes** em 4 tiers, sendo que **nenhum** combina simultaneamente stack moderna + especialização vertical Amil + E-E-A-T YMYL visível + conteúdo CNAE × cidade. Esse gap estrutural foi confirmado por análise competitiva detalhada (ver `competitor-analysis.md`) e representa uma **janela de 12–18 meses** antes que agregadores funded (CompanyHero, Leadsaude) consolidem a categoria.

`planoamilempresas.com.br`, operado por corretor autorizado SUSEP Agnaldo Silva (SUSEP 201054484, BeneficioRH Corretora de Seguros — CNPJ 14.764.085/0001-99), é a resposta a esse gap. Produto **content-first em Next.js 14 (App Router)** hospedado em **Vercel** (pivot v1.2 — fork autorizado do clone Bradesco do mesmo stakeholder), combina SEO técnico agressivo (schema JSON-LD rich, Core Web Vitals de classe mundial), **autoridade visível** (corretor nomeado, selos ANS/RA1000/LGPD, disclaimers ANS RN 195), **conteúdo especializado** (pillar + 15 cornerstones + 600 landing pages programáticas CNAE × cidade × porte + ~3.500-4.500 URLs de rede credenciada + 742 páginas-cidade reaproveitadas do clone) e **conversão sem atrito** (formulário < 6 campos com auto-CNPJ, WhatsApp Business, calculadora de coparticipação inline). O objetivo não é competir em head terms dominados pela Amil oficial, mas dominar o território de **long-tail** onde concorrentes hoje entregam conteúdo raso ou inexistente — construindo um negócio de corretagem recorrente com LTV estimado de R$ 15–45 mil por cliente empresa ao longo de 3 anos.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-04-16 | 1.0 | Draft inicial PRD — modo híbrido, 6 epics MVP + roadmap Phase 2 | Morgan (PM) |
| 2026-04-16 | 1.1 | Correções pós-validação @po (Pax): adicionada Story 1.0 formalizando placeholders do stakeholder + setup de contas externas (REC-1); prerequisite note no Epic 3 exigindo front-end-spec.md antes da Story 3.2 (REC-2); cross-reference entre Stories 6.3 e 6.7 estabelecendo validação atuarial como prerequisite da implementação (REC-3) | Pax (PO) |
| 2026-04-16 | 1.2 | Pivot arquitetural Astro → Next.js via fork de clone pré-existente (autor: stakeholder); hosting Cloudflare Pages → Vercel; Upstash Redis como KV layer; ajustes em NFR1/NFR2/NFR4/NFR13; Epic 1 Stories 1.1-1.4 reescritas. Conforme Sprint Change Proposal aprovada em 2026-04-16 (`docs/sprint-change-proposal.md`). Astro (PRD v1.1) preservado como plano B documentado. | Orion (Master) + Morgan (PM) |
| 2026-04-16 | 1.2.1 | Refinamentos pós re-validação integrada PO: Story 1.0 AC1 expandida com 3 novos items (1.11 logo, 1.12 cor autorização, 1.13 ilustrações) consolidando Open Questions do front-end-spec. Nenhuma alteração estrutural. | Pax (PO) |
| 2026-04-26 | 1.2.2 | Pós Story 1.0 conclusão: 11 correções incorporando decisões reais do stakeholder — nomenclatura produtos Bronze→Platinum Mais, CRM Clint, Sanity v3, Story 5.0 reaproveita 742 cidades-clone, Story 1.2a DNS ponte, Story 6.5 expandida (~3.500 URLs SEO), Story 6.6 cobre 2 datasets, Story 6.1 PrecoSobConsulta, ADRs 001/002 fechados/atualizados, 3 deliverables Story 2.4 | Morgan (PM) |
| 2026-04-26 | 1.2.3 | Story 1.0c (Spike Clint API) adicionada pós Pax re-validação — desbloqueia Story 4.3 com viability check técnico antes da implementação | Aria (Architect) + Pax (PO) |
| 2026-04-26 | 1.2.4 | Recalibração rede credenciada (dataset 9.325 prestadores · 26 UFs); **Epic 7 NOVO** "Programmatic SEO Rede Credenciada Amil" (11 stories 7.0a→7.10); Stories 6.5/6.6 movidas para Epic 7; Epic 6 fica focado em "Price Intelligence & Calculator + Library"; Story 5.7 AC nova (audit por amostragem estratificada). Conforme `docs/sprint-change-proposal-v1.2.3.md`. ADR-005 v2 (recalibração) + ADR-006 (URL-as-trademark, Proposed) + ADR-007 (Dataset SSOT, Accepted) | Orion (Master) + Morgan (PM) + Pax (PO) |
| 2026-04-26 | 1.2.5 | **Story 1.1 (Fork+Strip Bradesco) CONCLUÍDA** via consolidação Caminho A — codebase `amil-empresarial/site/` migrado para `planoamilempresas/`. Stack atualizada: **Next.js 14 → Next.js 16 + React 19 + Tailwind CSS 4** (sync com codebase real, não downgrade). Sanity v3 → v5.17.1. Docs paralelas arquivadas em `docs/_archive/from-amil-empresarial/` para audit trail | Orion (Master) + stakeholder (autor original do clone) |
| 2026-04-28 | 1.3   | **Atualização research-driven + ecosystem + Fase 2.** (1) Incorporação de 13 acertos de `planodesaudeamil.com.br` + 8 acertos de `amilplanos.com.br` + anti-erros como FRs/NFRs (FR31-FR45, NFR21-NFR25): 11 schemas JSON-LD, meta description dinâmica, H1 city pages com qualifier, tabela auto-atualizada com selo de freshness, hospitais REAIS por município, FAQ schema sobre 45+ Q&A, simulador interativo, comparador, calculadora carências, mapa interativo, glossário, max 2 telefones, Author schema YMYL, sub-pillars rede (D'or, One, Fácil, Clássica, Selecionada), página `/preco/coparticipacao/` dedicada, blog 30+ on-topic ZERO off-topic, posts comparativos, sem slugs `-2`. (2) Nova seção **"Estratégia de Ecossistema (Hub-and-Spoke)"** referenciando ADR-009 e `docs/ecosystem-link-strategy.md` — footer cross-domain, schema `parentOrganization`, anti-PBN. (3) Nova seção **"Fase 2 Roadmap — `planosaudeamil.com.br`"** (escopo amplo PJ+PF+adesão+dental, fork da Fase 1, ~80% reuso, 8-10 semanas pós-MVP) marcada explicitamente como **out-of-scope MVP v1**. (4) Caminho C consolidado: Astro descartado para ambos satélites Amil (ref. ADR-008). Fontes: `docs/research/competitors/06-tabela-comparativa-concorrentes.md` + `08-acertos-erros-detalhado.md`. | Morgan (PM) + Aria (Architect, ADR-008/009) |
| 2026-04-28 | 1.3.1 | **Patch research-driven amilsaudebr.com.br.** Incorpora 6 novos requisitos derivados de `docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md` (deep-scrape do clone amilsaudebr — 11 schemas JSON-LD, AggregateOffer, FAQPage, OG, title com ano "2026"). Adições: **FR50** title pattern com ano renovável (`[Tipo] Amil [ANO] — [Qualificador]`, currentYear via Sanity); **FR51** AggregateOffer per-estado (não só nacional); **FR52** tabelas HTML semânticas `<table>` (Featured Snippet + a11y); **FR53** `<OpenGraph>` component reusável dinâmico com fallback; **FR54** schema `Organization.name: "BeneficioRH"` (NUNCA "Amil") — Amil só em `category` ou `Product.brand`, conformidade ADR-006; **NFR26** CI valida sitemap × routing (anti-erro de inconsistência detectado em amilsaudebr). Nota anti-padrão clone+canonical adicionada à seção "Estratégia de Ecossistema". | Morgan (PM) |

---

## Requirements

### Functional

- **FR1:** O site deve apresentar **pillar page "Guia Plano Amil Empresarial 2026"** com mínimo 3.000 palavras, cobrindo todos os subtópicos do cluster (produtos, carência, reajuste, rede, preços, portabilidade, coparticipação), com schema FAQPage + BreadcrumbList + Article, e anchor links internos para cornerstones.
- **FR2:** O site deve publicar **15 cornerstones editoriais** (2.000–2.500 palavras cada) cobrindo: tabela de preços por faixa etária, comparativos entre produtos Amil PME (Bronze, Bronze Mais, Prata, Ouro, Platinum, Platinum Mais — com variações QC/QP) + 4 produtos premium "sob consulta" (Black, Amil One S2500 QP, Amil One S6500 Black QP, Amil S580 QP), guias por porte (ME 2–10, 10–30, 30–100, 100–200), carência e CPT, portabilidade empresarial, reajuste histórico, rede credenciada por região, coparticipação PJ, MEI+PJ, migração entre operadoras, cancelamento, reembolso e casos de cobertura.
- **FR3:** O site deve gerar **landing pages programáticas combinando CNAE × cidade × porte** — mínimo 600 URLs no primeiro batch, geradas a partir de template dinâmico que inclui: H1 específico, 800–1.200 palavras de conteúdo único por combinação (rede credenciada real, regulamentação local quando aplicável, dados do CNAE), schema HealthInsurancePlan + Organization + LocalBusiness, CTA contextual.
- **FR4:** O site deve manter **tabela de preços 2026 atualizada no mínimo mensalmente**, exibindo data de atualização visível, changelog de reajustes aplicados, dados por faixa etária × produto × coparticipação. A tabela cobre **6 segmentações Amil PME com valores indexáveis** (Bronze QC, Bronze Mais QC, Prata QC/QP, Ouro QC/QP, Platinum QP R1/R2, Platinum Mais QP R1/R2 — com coparticipação 30% ou 40% conforme estado, 10 faixas etárias ANS) e **4 produtos premium "sob consulta"** (Black, Amil One S2500 QP, Amil One S6500 Black QP, Amil S580 QP — `<PrecoSobConsulta />` com CTA WhatsApp). Disclaimer "valores sujeitos à análise da operadora" obrigatório.
- **FR5:** O site deve oferecer **formulário de cotação com no máximo 6 campos**, integrado a API de consulta CNPJ (ReceitaWS ou BrasilAPI), com auto-preenchimento de razão social, endereço e CNAE principal em ≤2 segundos, validação em tempo real e fallback manual quando a API falhar.
- **FR6:** O site deve disparar os leads do formulário para o **CRM do corretor — Clint CRM** (vertical brasileiro especializado em corretoras de seguros — decisão Story 1.0; spike técnico API Clint planejado em Story 1.0c) via API, com campos mínimos: nome, e-mail, WhatsApp, CNPJ, razão social, CNAE, porte (número de vidas), origem (página + query de entrada), consent LGPD e timestamp. Adapter pattern (`CRMAdapter` interface) preserva flexibilidade de troca futura, mas Clint é a implementação primária do MVP.
- **FR7:** O site deve oferecer **botão WhatsApp flutuante** presente em 100% das páginas, com link de deep link personalizado por página (mensagem pré-preenchida contextual ao artigo/produto) e fallback para formulário se usuário desktop sem WhatsApp instalado.
- **FR8:** O site deve oferecer **calculadora de coparticipação interativa** (inline em artigos relevantes + página dedicada), com input de 2 steps (porte + sinistralidade estimada + produto) e output de custo total projetado 12/24/36 meses, gráfico visual, PDF exportável e disclaimer "estimativa — valores reais dependem da sinistralidade real e variação contratual".
- **FR9:** O site deve apresentar **página "Sobre o Corretor"** com foto profissional, nome completo, número SUSEP, LinkedIn, bio de 5–10 linhas, número de registro da corretora PJ (se aplicável), número ANS da Amil (326305), selos de compliance (LGPD, RA1000 quando conquistado), e links para contratos modelo disponíveis.
- **FR10:** O site deve exibir **rodapé legal padronizado** em 100% das páginas com: razão social e CNPJ da corretora, número SUSEP do corretor, texto "Corretor autorizado a intermediar planos da Amil Assistência Médica (ANS nº 326305)", link para política de privacidade LGPD, link para termos de uso, data da última atualização do site.
- **FR11:** O site deve implementar **consent management LGPD** com banner de cookies granular (necessários, analytics, marketing), opt-in explícito no formulário de cotação, política de privacidade clara com DPO identificado, e mecanismo de opt-out acessível.
- **FR12:** O site deve publicar **biblioteca gratuita de contratos-modelo** (lead magnet) com: aditivo de inclusão, carta de portabilidade, formulário de cancelamento empresarial, planilha de benefícios — download gated por e-mail corporativo, sem exigir CNPJ.
- **FR13:** O site deve expor **rede credenciada filtrável** por cidade/estado e especialidade (mínimo integração de leitura da base pública Amil), com atualização mensal e disclaimer de "rede sujeita a alterações pela operadora".
- **FR14:** O site deve oferecer **blog/centro de atualizações** com CMS headless **Sanity v3** (decisão Story 1.0 Bloco 3.2 — ADR-001 Accepted) permitindo publicação por equipe não-técnica, pipeline editorial (redator → corretor → advogado → publicação), e versionamento de conteúdo.
- **FR15:** O site deve implementar **schema.org completo** em todas as páginas relevantes: Organization + LocalBusiness no rodapé global, HealthInsurancePlan nas páginas de produto, FAQPage nos blocos de FAQ, Article nos cornerstones, BreadcrumbList em todas as páginas internas, Product + Offer nas tabelas de preço.
- **FR16:** O site deve gerar **sitemap.xml dinâmico** atualizado automaticamente a cada publicação/edição, com prioridade e frequência de atualização por tipo de página, e submetido ao Google Search Console.
- **FR17:** O site deve implementar **robots.txt** permitindo indexação ampla, excluindo páginas de admin/staging/preview, e declarando sitemap.
- **FR18:** O site deve garantir **interlinking automático** entre pillar → cornerstones → landing pages programáticas via estrutura de silo topical, com mínimo 5 links internos contextuais por cornerstone e breadcrumbs em todas as páginas.
- **FR19:** O site deve ter **busca interna** (opcional MVP, recomendada Phase 1.5) com autocomplete e integração ao catálogo de conteúdo.
- **FR20:** O site deve registrar **analytics** em: GA4 (server-side + client-side), Google Search Console, Microsoft Clarity (UX heatmaps), com dashboards dedicados para tráfego orgânico, conversão por página, performance de formulário e rede de origem.
- **FR21:** O site deve implementar **tracking de eventos-chave** (GTM ou Plausible events): scroll 50/75/100%, clique em CTA, abertura formulário, submissão formulário, clique WhatsApp, início calculadora, export PDF calculadora, download contrato-modelo.
- **FR22:** O site deve expor **tag de consentimento LGPD** controlando disparo de scripts marketing (GA4 Ads, Meta Pixel se usado) apenas após consent explícito.
- **FR23:** O site deve oferecer **busca/filtro de rede credenciada** por CEP, cidade, especialidade e hospital (integração read-only com base pública Amil quando disponível; caso contrário, base manualmente mantida em CMS com atualização mensal).
- **FR24:** O site deve registrar **anti-spam** via Cloudflare Turnstile (ou reCAPTCHA v3), rate limiting via `@upstash/ratelimit` em Next.js API Routes e honeypot no formulário.
- **FR25:** O site deve prover **dashboard interno de KPIs** (Phase 1.5) com acesso restrito: leads/mês por origem, posição média das 50 keywords-alvo, CWV por página, taxa de conversão formulário.
- **FR26:** O site deve implementar **A/B testing leve** (GrowthBook ou similar, opcional MVP) para otimização contínua de CTAs, headlines e estrutura do formulário.
- **FR27:** O site deve exibir **"Atualizado em [data]"** em todos os artigos, tabelas e páginas programáticas — sinal de freshness para SEO e confiança para o usuário.
- **FR28:** O site deve exibir **selo "Avaliado no Reclame Aqui"** (linkando perfil público) e meta de conquistar selo RA1000 em até M12.
- **FR29:** O site deve ter **página 404 útil** com busca, links para pillar page e cornerstones top, e CTA para WhatsApp.
- **FR30:** O site deve implementar **redirecionamentos 301** para qualquer URL legada, slug change ou migração de CMS, preservando link equity.
- **FR31:** O site deve implementar **11 tipos de schema JSON-LD** transversais ao site (anti-erro estrutural dos concorrentes que têm ZERO schema): `Organization` + `LocalBusiness` (×N city pages) + `Product` + `Offer` + `AggregateOffer` + `FAQPage` + `BreadcrumbList` + `Article` + `MedicalBusiness/MedicalClinic` (rede credenciada) + `HowTo` (cornerstones operacionais) + `WebSite` com `SearchAction`. Validação obrigatória via Schema.org validator + Google Rich Results Test no CI (alinhado a NFR19 e Story 7.9).
- **FR32:** O site deve garantir **meta description dinâmica em 100% das páginas**, gerada por template + variáveis de contexto (cidade, produto, faixa, CNAE) e nunca vazia (anti-erro: ambos concorrentes diretos têm meta description **ausente** em todas as páginas; gap competitivo).
- **FR33:** O site deve gerar **H1 de city pages com qualifier descritivo**, no padrão "Plano de Saúde Amil em [Cidade] — [UF]" ou variação rica em keyword (anti-erro: `planodesaudeamil.com.br` usa H1 só com nome da cidade, ex: "São Paulo"; perde keyword + contexto).
- **FR34:** O site deve oferecer **tabela de preços auto-atualizada via job mensal automatizado** (cron / GitHub Actions), com **selo "Atualizado em [mm/aaaa]" visível no topo da página** (não apenas dentro da tabela). Anti-erro: `amilplanos.com.br` exibe tabela de **setembro/2022** (3+ anos defasada); freshness é fator de ranking decisivo. Sanity v3 content scheduled OU webhook → Vercel Revalidate API.
- **FR35:** O site deve gerar **city pages com hospitais REAIS por município** (não lista nacional repetida), construídos por join entre dataset IBGE de municípios + dataset rede credenciada Amil filtrado por geolocation/UF/município. Anti-erro: `planodesaudeamil.com.br` lista Sírio-Libanês e Albert Einstein em city pages de municípios pequenos (ex: Abadia de Goiás) — risco direto de Helpful Content Update.
- **FR36:** O site deve oferecer **`FAQPage` schema sobre 45+ Q&As** com componente accordion + JSON-LD válido. Anti-erro: `planodesaudeamil.com.br` tem 45+ Q&As em texto puro **sem schema**, desperdiçando rich results em SERP. Replicar o conteúdo (texto público) e capturar via schema.
- **FR37:** O site deve oferecer **simulador interativo de plano** (não apenas formulário), com cálculo client-side de estimativa de mensalidade por porte + faixa etária + produto. Diferencia do CTA "calcular plano" puramente vinculado a formulário visto nos concorrentes.
- **FR38:** O site deve oferecer **comparador entre planos** em rota dedicada (ex: `/comparar/?planos=bronze,prata,ouro`) com URL shareable, schema `Product` × N, e copy que explica trade-offs (acomodação, abrangência regional vs nacional, coparticipação).
- **FR39:** O site deve oferecer **calculadora de carências** (widget JS) inline em cornerstone de carência + página dedicada — anti-erro: `amilplanos.com.br` menciona carência em texto sem ferramenta interativa.
- **FR40:** O site deve oferecer **mapa interativo de hospitais** (Leaflet OSS ou Mapbox tier gratuito) na página master `/rede-credenciada/` e em páginas de cidade — anti-erro: ambos concorrentes têm zero mapa interativo, apenas listas estáticas.
- **FR41:** O site deve publicar **glossário de termos** em `/glossario/` (carência, CPT, coparticipação, copart% vs franquia, reajuste etário vs sinistralidade, portabilidade, abrangência geográfica, acomodação coletiva vs particular, etc.) com schema `DefinedTerm`/`DefinedTermSet`, contribuindo para People Also Ask + interlinking semântico.
- **FR42:** O site deve exibir **no máximo 2 telefones de contato em qualquer página** (anti-erro: `amilplanos.com.br` repete 5 telefones por página, gerando indecisão e poluição visual). UX: 1 CTA primário (simulador OU formulário) + 1 WhatsApp.
- **FR43:** O site deve manter **estrutura de URL livre de slugs duplicados com sufixo `-2`** (anti-erro: `amilplanos.com.br` tem **centenas** de slugs como `/sao-paulo-2/`, gerando canibalização interna). URL builder com detecção de colisão + 410/301 para legados.
- **FR44:** O site deve publicar **páginas dedicadas a sub-redes credenciadas Amil** em rotas próprias: `/rede/hospitais-dor/`, `/rede/amil-one-rede-selecionada/`, `/rede/clinicas-amil/`, `/rede/amil-facil-rede/`, `/rede/clascica/` (ou slug equivalente conforme ADR-006). Captura gap parcial: `amilplanos.com.br` tem `/rede-de-hospitais-dor-amil/` dedicada e `planodesaudeamil.com.br` mistura sub-redes com tiers.
- **FR45:** O site deve publicar **página `/preco/coparticipacao/` dedicada com ~2.500 palavras + calculadora inline** (referenciada em FR8/FR39). Anti-erro: `planodesaudeamil.com.br` NÃO tem URL dedicada de coparticipação (apenas `amilplanos.com.br` tem ~2.100 palavras — único acerto exclusivo desse concorrente que devemos cobrir).
- **FR46:** O site deve publicar **blog editorial com mínimo 30 posts on-topic em 12 meses** com cadência mensal mínima e ZERO posts off-topic. Anti-erro: `amilplanos.com.br` publica WNBA, Champions League, Austin TX e casino entre os 9 posts (44% spam off-topic) destruindo autoridade temática YMYL.
- **FR47:** O site deve publicar **posts comparativos cross-operadora** ("Amil vs Bradesco", "Amil vs SulAmérica", "Amil vs Hapvida"), gap não coberto por nenhum dos 2 concorrentes diretos. Outbound aos respectivos satélites BeneficioRH (Bradesco) ou ao hub multi-operadora (`planodesaudepj.com.br/operadoras/[op]/`) conforme `docs/ecosystem-link-strategy.md`.
- **FR48:** O site deve declarar `Organization` schema com **`parentOrganization` apontando para o hub `planodesaudepj.com.br`** (ref. ADR-009 + `docs/ecosystem-link-strategy.md`), e `subOrganization` no hub apontando para os satélites — sinaliza ao Google a estrutura legítima de portfolio (anti-PBN).
- **FR49:** O site deve apresentar **footer global cross-domain** listando explicitamente o hub + satélites irmãos com `rel="me"` (alinhado ao snippet do `ecosystem-link-strategy.md` §5.1), reforçando autoridade verificável e disclaimer único de operação BeneficioRH.
- **FR50:** O site deve adotar **title pattern com ano renovável** no padrão `[Tipo] Amil [ANO] — [Qualificador opcional]` em todas as páginas indexáveis (homepage, tabela de preços, produtos, estaduais, cornerstones). O ano deve ser injetado dinamicamente a partir de variável `currentYear` no Sanity v3 (atualizada anualmente via single-source-of-truth document) — Next.js (App Router, ADR-008) consome via GROQ no `generateMetadata()` de cada `page.tsx`. Exemplos: "Plano de Saúde Amil 2026 — Empresarial PJ", "Tabela Amil 2026 — São Paulo PME", "Amil Black 2026 — Cobertura Internacional". Justificativa: `amilsaudebr.com.br` usa "Amil 2026" no title sinalizando frescura ao Google e ao usuário em SERP — gap competitivo barato de cobrir.
- **FR51:** O site deve declarar **`AggregateOffer` schema próprio por estado** em cada página estadual (`/rede-credenciada/[uf]/` e `/precos/[uf]/`), com campos `lowPrice`, `highPrice`, `offerCount`, `priceCurrency: "BRL"`, `availability: "InStock"`, derivados do dataset de preços filtrado por UF. Não usar apenas `AggregateOffer` nacional — granularidade regional vence em SERPs de "preço plano amil [estado]". Anti-erro: `amilsaudebr.com.br` declara `AggregateOffer` apenas nacional (R$ 102–3.500); per-estado é gap explorável.
- **FR52:** O site deve implementar **todas as tabelas de preços (master + per-estado + per-produto) como `<table>` HTML semântico** com `<thead>`, `<tbody>`, `<th scope="col">` e `<caption>` descritivo. Não usar div/CSS Grid puro nem componentes JS proprietários sem fallback HTML. Razões: (a) Featured Snippet do Google para "plano amil tabela" prefere `<table>` nativo; (b) acessibilidade a leitores de tela (NFR9 / WCAG 2.1 AA); (c) schema `Table` é mapeável para rich results. Anti-erro: `amilsaudebr.com.br` não tem `<table>` HTML nativo — gap explorável.
- **FR53:** O site deve oferecer **componente `<OpenGraph>` reusável** em `src/components/seo/` que recebe props `title`, `description`, `image`, `type` (`website` | `product` | `article`) e gera as meta tags `<meta property="og:*">` + `<meta name="twitter:*">` correspondentes. Fallbacks automáticos: se `title` ausente → usa o page title; se `image` ausente → usa default `/og-default.jpg`; se `description` ausente → usa meta description da página (FR32). Usado em `app/layout.tsx` global (Next.js App Router, ADR-008) com override por página via `generateMetadata()`. Diferenciação vs. `amilsaudebr.com.br`: OG dinâmico contextual por produto/cidade vs. OG estático único.
- **FR54:** O site deve declarar **schema `Organization` global usando `name: "BeneficioRH Corretora de Seguros"`** com `url` do site, `taxID: "14.764.085/0001-99"`, `identifier` SUSEP `201054484`, e `parentOrganization` referenciando o hub `planodesaudepj.com.br` (alinhado a FR48). **A marca "Amil" NUNCA aparece como `Organization.name`** — apenas como `category` no schema `Organization` ou em `Product.brand` nas páginas de produto. Conformidade obrigatória com `docs/decisions/adr-006-url-as-trademark-policy.md` (URL-as-Trademark). Anti-erro: `amilsaudebr.com.br` declara `Organization.name: "Amil"` (operadora oficial) — risco de violação de trademark UnitedHealth + falsa autoridade institucional + canibalização do schema oficial Amil em SERP.

### Non Functional

- **NFR1:** **Performance — Core Web Vitals:** 95% das páginas com LCP < 2,0s, CLS < 0,05, INP < 200ms (medido via CrUX field data). Lighthouse Performance ≥92 em todos os templates (target v1.2 revisto para Next.js + App Router + RSC; ainda muito acima dos concorrentes que ficam em 40-70). TTFB < 300ms (Vercel Edge Network).
- **NFR2:** **Performance — Recursos:** JavaScript entregue ao cliente ≤100KB comprimido por página (Next.js App Router com RSC minimiza client JS; target v1.2 maior que Astro compensado pelo ganho de pattern reuse). Imagens servidas em AVIF (fallback WebP) via `next/image`, com lazy loading automático abaixo do fold. Fontes self-hosted via `next/font` com font-display: swap e subset reduzido.
- **NFR3:** **Availability:** Uptime ≥99,9% medido mensalmente (Vercel + Sanity v3). Plano de contingência: reversão a cache estático ISR + Cloudflare DNS apontando para Vercel (TTL 300s para rollback rápido — ver Story 1.2a) em caso de falha do CMS.
- **NFR4:** **Segurança:** HTTPS obrigatório com HSTS (Vercel nativo), CSP restritivo com nonces em scripts inline, CORS configurado restritivamente, proteção contra XSS/SQLi/CSRF, rate limiting em endpoints (Next.js API Routes + @upstash/ratelimit), secrets gerenciados via Vercel Environment Variables (separados por environment — development/preview/production; nunca no código).
- **NFR5:** **Compliance LGPD:** política de privacidade revisada por advogado, DPO identificado e contactável, consent management granular (não apenas "aceitar todos"), registro de consent com timestamp e versão da política, direito de opt-out e exclusão de dados atendidos em ≤15 dias.
- **NFR6:** **Compliance ANS:** 100% das páginas que mencionam produtos Amil incluem disclaimer ANS RN 195/2009 + 593/2024, valores apresentados como "sujeitos a análise da operadora", nenhuma promessa absoluta de cobertura ou "carência zero garantida", rodapé padronizado com registro ANS da operadora.
- **NFR7:** **Compliance SUSEP:** rodapé global com número SUSEP do corretor, página "Sobre" com credenciais completas, nenhuma menção a "investimento" ou "rentabilidade" (não aplicável a planos de saúde, mas guarda-rail de escopo).
- **NFR8:** **Marca Amil:** uso do termo "Amil" restrito ao permitido no contrato de corretagem (Story 1.0 Bloco 2.1 — opção 🅲️ "assumir risco" + 5 mitigações documentadas; sem parecer prévio do advogado), com disclaimer "Corretor autorizado a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº 326305)" em rodapé e página "Sobre"; NUNCA logo Amil oficial (ver `docs/editorial/brand-usage-policy.md` — deliverable Story 2.4). Domínio-ponte `planosaudeempresas.com.br` registrado e DNS configurado em Story 1.2a com TTL 300s.
- **NFR9:** **Accessibility:** WCAG 2.1 nível AA em 100% das páginas — contraste mínimo 4,5:1 (texto normal) e 3:1 (texto grande), navegação por teclado, ARIA labels, alt text em imagens significativas, skip-links, foco visível.
- **NFR10:** **SEO — Crawlability:** arquitetura de URLs limpa (sem `.php`, sem parâmetros de tracking em URL canônica), canonical tags corretos, hreflang ausente (escopo Brasil), pageSpeed mobile-first, renderização HTML server-side ou pré-renderizada (Next.js 14 SSG/ISR + RSC).
- **NFR11:** **SEO — Indexability:** todas as páginas-alvo com meta description única (máx 160 caracteres), title tag único (máx 60 caracteres), H1 único por página, open graph + twitter card configurados para compartilhamento social.
- **NFR12:** **Observability:** logs estruturados de erros (Vercel Logs + Sentry), alertas em 5xx > 1% por 5 minutos, monitoramento de Core Web Vitals via CrUX + Real User Monitoring (RUM via Vercel Speed Insights ou Web Vitals library), dashboard de disponibilidade público ou interno.
- **NFR13:** **Escalabilidade:** capacidade de servir 100K sessões/mês em Vercel Edge Network sem degradação; 99% das respostas HTML estático ≤300ms e 99% das respostas API ≤1500ms (incluindo calls externas a BrasilAPI/CRM); upgrade para Vercel Pro se volume ultrapassar tier gratuito (~100GB bandwidth/mês).
- **NFR14:** **Manutenibilidade:** codebase TypeScript onde possível, lint + formatter obrigatórios (ESLint + Prettier), commits seguem Conventional Commits (ver CLAUDE.md), testes unitários para lógica de negócio crítica (calculadora, auto-CNPJ, integração CRM), CI automático em cada PR.
- **NFR15:** **Data retention:** leads do CRM retidos pelo período legal de retenção LGPD (5 anos para dados fiscais, 2 anos para leads não-convertidos), com processo automatizado de purga.
- **NFR16:** **Backup & Recovery:** git como fonte única de verdade do código e conteúdo (via CMS headless git-based OU export periódico de CMS não-git), export automático de leads CRM semanal, plano de recuperação documentado com RTO 4h / RPO 24h.
- **NFR17:** **Internacionalização:** escopo Brasil — português brasileiro único, sem i18n no MVP, timezone America/Sao_Paulo em timestamps de sistema.
- **NFR18:** **Compatibilidade de browser:** últimas 2 versões estáveis de Chrome, Edge, Safari, Firefox. iOS Safari 14+. Android Chrome 90+. Degradação graceful em browsers mais antigos (sem JavaScript ativo, conteúdo ainda acessível).
- **NFR19:** **SEO Technical Excellence:** schema.org validado via Rich Results Test Google + Schema.org validator; sitemap validado; robots.txt validado; páginas sem erros no GSC (index coverage); CWV "Good" no CrUX.
- **NFR20:** **Editorial Quality:** conteúdo 100% original (verificação via Copyscape antes de publicar), revisão por advogado de cada batch de conteúdo regulado, política editorial documentada, versionamento de artigos com histórico de mudanças.
- **NFR21:** **Schema Coverage Mínimo:** 100% das páginas indexáveis têm pelo menos 1 schema JSON-LD válido (Organization global + tipo específico por template). Validação automatizada no CI via `schema-validation.yml` (Story 1.3 AC4) bloqueia merge em caso de schema malformado. Cobertura por template documentada em `architecture.md`.
- **NFR22:** **E-E-A-T YMYL — Author schema obrigatório:** todo conteúdo médico/de saúde publicado em cornerstones, blog e landings programáticas deve declarar `author` (Person ou Organization) com credenciais quando aplicável (corretor SUSEP, médico revisor, advogado revisor regulatório). Conforme `docs/editorial/brand-usage-policy.md` (deliverable Story 2.4) e diretrizes Google YMYL.
- **NFR23:** **E-E-A-T — revisão técnica humana em conteúdo de saúde:** conteúdo médico/regulatório (cornerstones de carência, CPT, ANS, reajuste, coberturas, doenças) NUNCA pode ser IA-only — exige revisão humana com track-changes arquivada antes de publicação. Pipeline editorial (redator → corretor → advogado) registrado em `docs/editorial/cms-guide.md` e enforced via Sanity workflow status field (Story 3.1).
- **NFR24:** **Compliance Cross-Domain:** todo satélite do ecossistema BeneficioRH (incluindo `planoamilempresas.com.br` Fase 1 e `planosaudeamil.com.br` Fase 2) deve exibir, em rodapé global, **CNPJ 14.764.085/0001-99 + SUSEP 201054484 + disclaimer ANS por operadora referenciada + links cross-domain (`rel="me"`)** conforme `docs/ecosystem-link-strategy.md` §5.1. Auditoria mensal por @qa (Quinn) anti-duplicate content cross-site.
- **NFR25:** **Anti-Cookie-Cutter / Helpful Content Update:** nenhum template programático (city pages, CNAE pages, rede pages) pode produzir páginas com texto > 70% idêntico entre instâncias — variação contextual mínima de 30% por interpolação real (hospitais reais por cidade, CNAE-specific copy, dados ANS por UF). Auditoria por amostragem estratificada (Story 5.7 AC v1.2.4) verifica conformidade. Risco direto identificado em research dos 2 concorrentes (`planodesaudeamil.com.br` tem ~2.400 city pages com texto idêntico).
- **NFR26:** **CI valida sitemap × routing:** GitHub Action obrigatória em cada PR executa `scripts/validate-sitemap-routing.mjs` que: (a) parseia o output de `app/sitemap.ts` (Next.js App Router, ADR-008); (b) descobre as rotas Next.js via discovery em `app/**/page.tsx` (incluindo dynamic segments resolvidos por `generateStaticParams`); (c) **falha o build** se alguma URL declarada no sitemap não tiver rota correspondente OU se alguma rota indexável (não-`noindex`) estiver ausente do sitemap. Bloqueia merge no GitHub. Anti-erro: `amilsaudebr.com.br` tem sitemap inconsistente com links internos (sitemap lista `/sao-paulo` mas links apontam para `/tabela-amil-sao-paulo-2026.html` — dois conjuntos paralelos de URLs gerando confusão de indexação ao Google).

---

## User Interface Design Goals

### Overall UX Vision

O site adota posicionamento de **"consultor editor especialista"** — não "vendedor de plano". UX equilibra **autoridade técnica** (dados visíveis, fontes linkadas, tabelas reais) com **acessibilidade conversacional** (linguagem direta, sem jargão, CTAs humanos). Paleta cromática alinha com marca Amil (`#0066B3` azul) + CTA verde institucional (`#00C389`), com neutros cinzas para legibilidade e campos de urgência em laranja escuro. Tipografia **Inter** (principal) ou **Manrope** (alternativa) — sem serifa, alta legibilidade, suporte técnico a tabelas e dados.

**Princípios UX centrais:**
1. **Transparência radical primeiro** — tabelas, preços e rede visíveis sem exigir contato
2. **Inversão do ônus** — o site entrega valor antes de pedir algo em troca
3. **Autoridade explícita sem intimidação** — corretor visível, mas tom consultivo
4. **Velocidade perceptível** — CWV excepcional + micro-interações que reforçam fluidez
5. **Sem pressão** — sem pop-ups "espere, veja essa oferta", sem 0800, sem cronômetros de urgência

### Key Interaction Paradigms

- **Content-first, conversion-adjacent:** conteúdo domina o viewport; CTAs contextuais aparecem em posições estratégicas (após cada seção relevante, sticky sidebar opcional, rodapé de artigo), nunca como obstrução
- **WhatsApp como canal primário:** botão flutuante presente, mas discreto; deep links com mensagem pré-preenchida por contexto
- **Formulário mínimo-viável:** 6 campos máximo, validação em tempo real, feedback visual claro
- **Calculadora como experiência lúdica:** 2 steps, resultado visual rico (gráfico + PDF), shareable
- **Escolha por exposição:** em comparativos, apresentar opções lado a lado com pros/contras; deixar decisão com o usuário, não empurrar "o melhor"
- **Freshness visível:** "Atualizado em [mês/ano]" em todo conteúdo datado; changelog em tabelas de preço
- **Autoridade contextual:** selos, número SUSEP e ANS não apenas no rodapé, mas próximos a pontos de conversão (ex: ao lado do formulário)

### Core Screens and Views

- **Homepage** — hero com tagline + sub-tagline + CTA WhatsApp + formulário, social proof (logos cliente se disponível), destaques de cornerstones, link pillar, FAQs top 5, selos de autoridade
- **Pillar page** — "Guia Plano Amil Empresarial 2026" com TOC lateral, seções ancoradas, CTAs contextuais, schema FAQPage
- **Cornerstone articles (15)** — template padronizado: hero, autor (corretor), data de atualização, TOC, conteúdo principal, FAQs estruturadas, CTA de cotação, related articles, CTA WhatsApp
- **Landing page programática (template)** — específico por CNAE × cidade × porte: H1 contextual, rede regional destacada, tabela de preço filtrada, CTA WhatsApp, schema rich
- **Tabela de preços 2026** — página dedicada com filtros (produto, faixa etária, coparticipação, região), changelog, data de atualização, CTA cotação
- **Calculadora de coparticipação** — tela de input (2 steps), tela de resultado (gráfico + números + PDF export), CTA "Falar com corretor"
- **Formulário de cotação** — modal ou página dedicada, 6 campos, auto-CNPJ, consent LGPD, post-submit thank-you com próximos passos
- **Rede credenciada** — busca por CEP/cidade/especialidade, lista filtrada com mapa opcional
- **Sobre o corretor** — foto, bio, SUSEP, LinkedIn, selos, contato direto
- **Biblioteca de contratos** — lista de PDFs baixáveis com e-mail gate, descrição de cada documento
- **Blog / Centro de atualizações** — índice, busca, filtros por tag, paginação, subscribe newsletter (opcional)
- **Política de privacidade + Termos de uso** — páginas legais completas, versionadas
- **Página 404** — útil (busca, links top, CTA WhatsApp)

### Accessibility: WCAG AA

### Branding

- **Paleta:**
  - Primária: `#0066B3` (Amil azul — alinha marca operadora, uso contido)
  - CTA: `#00C389` (verde — conversão, ação positiva)
  - Neutros: escala de cinzas `#1A1A1A` / `#4A4A4A` / `#8A8A8A` / `#F5F5F5`
  - Urgência/alerta: `#D97706` (laranja escuro — disclaimers, avisos regulatórios)
  - Erro/bloqueio: `#DC2626` (vermelho — validação formulário)
  - Sucesso: `#059669` (verde escuro — confirmações)

- **Tipografia:**
  - **Inter** (primária) — sans-serif variable, 400/500/600/700, subset Latin + Latin Extended
  - Ou **Manrope** como alternativa se feedback do stakeholder preferir
  - Hierarquia: H1 48/56px · H2 36/44px · H3 24/32px · body 16/26px · small 14/22px

- **Componentes visuais de autoridade:**
  - Selos horizontais no footer: ANS · SUSEP · LGPD · Reclame Aqui (RA1000 quando conquistado)
  - Badge "Corretor Autorizado Amil" próximo ao nome do corretor
  - Ícones de verificação (✓) em disclaimers de compliance

- **Direção estilística geral:**
  - Minimalista mas editorial (como a revista do Valor Econômico digital, não como site de banco)
  - Muito whitespace
  - Tabelas profissionais com zebra striping suave
  - Gráficos minimalistas com paleta restrita
  - Fotografias reais (corretor, equipe, talvez clientes autorizados) — não banco de imagens genérico
  - Sem stock photos de "sorriso corporativo"

### Target Device and Platforms: Web Responsive

Prioridade **mobile-first** (decisão de compra PJ cada vez mais em dispositivos móveis, especialmente sócios-fundadores). Breakpoints principais: mobile 360–768px, tablet 768–1024px, desktop 1024px+. Design system em 8px grid. Sem app nativo no MVP (escopo explicitamente excluído).

---

## Technical Assumptions

### Repository Structure: Monorepo

Monorepo simples (**sem Turborepo/Nx no MVP** — complexidade desnecessária para um site). Estrutura (Next.js 14 App Router — herdada do fork):

```
planoamilempresas/
├── src/
│   ├── app/            # Next.js 14 App Router (route groups: (marketing)/, (landing)/, api/)
│   ├── components/     # Componentes React (Server e Client)
│   ├── lib/            # utils (CNPJ, schema markup, formatters, sanity client, crm adapters)
│   └── styles/         # Tailwind config + tokens CSS
├── data/               # Datasets versionados (tabelas-amil.ts, rede-credenciada.json)
├── sanity/             # Sanity v3 studio (schemas, config) — montado em /studio
├── public/             # assets estáticos (favicon, imagens, robots.txt)
├── scripts/            # automações (scrape rede credenciada, transform-cidades, sync tabela Amil, build-time programmatic)
├── tests/              # unit + integration tests
├── .github/workflows/  # CI/CD
├── docs/               # PRD, briefs, arquitetura (este diretório)
├── next.config.mjs
├── tailwind.config.ts
├── sanity.config.ts
├── vercel.json
├── package.json
└── README.md
```

### Service Architecture

**Arquitetura Serverless / JAMstack via Next.js 14 App Router (pivot v1.2 — ver Sprint Change Proposal):**

- **Frontend:** **Next.js 14 (App Router)** + **React Server Components (RSC)** + SSG/ISR conforme necessidade. Static export para a maioria das páginas (pillar, cornerstones, programmatic landings); ISR com revalidate mensal para tabelas de preço. React 18 client components apenas para ilhas interativas (formulário, calculadora, busca rede, WhatsApp button)
- **Backend/APIs:** **Next.js API Routes + Edge Runtime** para:
  - Proxy anti-abuso do formulário de cotação
  - Consulta CNPJ (proxy BrasilAPI/ReceitaWS com cache + rate limit)
  - Endpoint da calculadora (cálculo server-side + PDF generation)
  - Integração com CRM via adapter pattern (`src/lib/crm/`)
- **CMS:** **Sanity v3** (decisão fechada Story 1.0 Bloco 3.2 — ADR-001 Accepted). Free tier (3 users + 10GB) cobre MVP; integração nativa Next.js 14 App Router via `next-sanity` + GROQ; webhook → Vercel Revalidate API para ISR.
- **Database/KV:** **Upstash Redis** (serverless, já validado no clone) — rate limiting + cache de CNPJ + queue para leads com CRM indisponível. Phase 2 pode introduzir Supabase/Neon se necessário
- **Hosting:** **Vercel** (host nativo do Next.js) — edge network global, preview deploys automáticos em PRs, analytics nativos, tier Pro apenas se ultrapassar free quota (~100GB bandwidth/mês)
- **CDN:** **Vercel Edge Network** (280+ PoPs globais, HTTP/2 e HTTP/3 parcial, compressão Brotli nativa)
- **Domain & DNS:** **Cloudflare DNS apontando para Vercel** (best-of-both — DDoS protection Cloudflare + hosting Vercel); alternativa Vercel DNS direto. Decisão em ADR-004.

**Por que Next.js via fork (pivot documented in `docs/sprint-change-proposal.md` 2026-04-16):**
- Stakeholder tem codebase Next.js 14 pré-existente e funcional com **1.005 páginas programáticas** (originalmente para Bradesco Saúde Empresarial; conteúdo 100% reescrito para Amil; fork autorizado — stakeholder é autor único)
- **Economia de 4-8 semanas** no time-to-market vs. greenfield Astro
- Patterns maduros já implementados: rate limiting (Upstash), form validation (zod + react-hook-form), route groups App Router `(landing)`+`(marketing)`+`api/`, SEO audit automation, sitemap/robots dinâmicos, componentes Radix UI acessíveis
- Stakeholder conhece a codebase — reduz risco de bugs em edge cases
- Next.js 14 + RSC + App Router atingem CWV target (Lighthouse ≥92) com tuning adequado — target ligeiramente abaixo do Astro (≥95) compensado por aceleração de 4-8 semanas
- Alinhamento com moat competitivo mantido (velocidade + SEO técnico)
- **Plano B preservado:** se pivot se mostrar inviável, PRD v1.1 com Astro + Cloudflare fica como fallback documentado

### Testing Requirements

**Unit + Integration:**
- **Unit tests** (Vitest) obrigatórios para: utils de validação CNPJ, formatters de CPF/telefone/moeda, lógica da calculadora de coparticipação, transformações de schema markup, integração CRM (com mocks)
- **Integration tests** (Playwright ou Cypress) para: fluxo completo de formulário de cotação (preenchimento → consulta CNPJ → envio → CRM), fluxo da calculadora (input → cálculo → PDF export), navegação principal (homepage → pillar → cornerstone → CTA), landing programática (geração e acesso)
- **E2E visual regression** (opcional MVP, recomendado Phase 1.5): Percy ou Chromatic para detectar mudanças visuais inesperadas
- **Performance tests:** Lighthouse CI obrigatório em cada PR (fail se Performance < 90 ou CLS > 0.1)
- **Accessibility tests:** axe-core via CI em cada PR (fail em violações WCAG AA)
- **SEO tests:** validação automática de schema.org (via Google Rich Results Test API) e meta tags em cada PR

Manual testing convenience:
- Ambiente de preview automático em cada PR (Vercel Preview Deployments)
- Staging environment com dados de teste (não-produção)
- Script CLI para popular conteúdo de teste no Sanity v3

### Additional Technical Assumptions and Requests

- **Typescript strict mode** em toda lógica de negócio (calculadora, integrações)
- **Absolute imports** configurados (alinhado com CLAUDE.md — `@/components/...` não `../../../components/...`)
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`) — referenciar story ID (ver CLAUDE.md)
- **CodeRabbit integration** no CI (alinhado com rules do AIOS) — self-healing em severidade CRITICAL/HIGH
- **Dependabot ou Renovate** para updates automatizados de dependências
- **CI/CD via GitHub Actions** com Vercel como deploy target (GitHub Integration nativa)
- **Observability stack:** Vercel Analytics (incluído) + Google Analytics 4 + Microsoft Clarity (heatmaps gratuitos) + Sentry (erros)
- **Secrets management:** Vercel Environment Variables (separados por environment development/preview/production) para API keys (ReceitaWS, Clint CRM, WhatsApp Business, Sanity token, Upstash), nunca committadas
- **Feature flags:** considerar GrowthBook (open-source, free tier) para A/B tests e rollouts graduais — opcional MVP
- **Content pipeline:** automação para (a) sync mensal de tabelas de preço Amil via scraping ético ou API, se disponível; (b) geração batch de landing pages programáticas a partir de CSV de CNAEs × cidades
- **ReceitaWS vs. BrasilAPI:** BrasilAPI é gratuito e open-source, recomendado como primário; ReceitaWS (pago) como fallback com cache agressivo
- **WhatsApp integration:** deep links (gratuito, imediato, MVP) → Phase 2 avaliar WhatsApp Business API para automação
- **CRM integration strategy:** implementar adapter pattern com `ClintAdapter` como implementação primária do MVP (decisão Story 1.0), permitindo substituir por RD Station / HubSpot / Pipedrive futuro sem refatoração massiva
- **Backup do conteúdo:** Sanity v3 — export automático semanal (`sanity dataset export`) para Vercel Blob ou S3
- **Domínio-ponte defensivo:** `planosaudeempresas.com.br` já registrado pelo stakeholder (decisão Story 1.0 Bloco 2) como contingência se houver questão com uso da marca Amil — DNS configurado em Story 1.2a com TTL 300s para rollback rápido
- **Subdomínios reservados:** `app.planoamilempresas.com.br` (Phase 2 dashboard cliente), `api.planoamilempresas.com.br` (Phase 2 API pública)
- **Terceirização de scraping:** se tabelas Amil não forem publicamente rastreáveis, considerar Apify Actor dedicado (docker-gateway MCP disponível para AIOS)
- **Edge functions timeouts:** Vercel serverless 10s (Hobby) / 60s (Pro) / Edge Runtime 25s streaming — adequado para calculadora e proxies
- **Origem do codebase (v1.2):** fork do repositório pré-existente `amil-saude/` (autor: stakeholder; originalmente Bradesco Saúde Empresarial) com strip total de conteúdo/branding Bradesco em Story 1.1
- **Stack principal confirmada (v1.2):** Next.js 14.2+ (App Router), React 18, TypeScript 5 strict, Tailwind CSS 3, Radix UI primitives, React Hook Form 7 + Zod 3, Upstash Redis (via @upstash/ratelimit), Vitest + Testing Library
- **Deploy target (v1.2):** Vercel (substituindo Cloudflare Pages do PRD v1.1) — Next.js é nativo Vercel
- **Secrets (v1.2):** Vercel Environment Variables (separados por environment development/preview/production)
- **ReceitaWS/BrasilAPI integration (v1.2):** via Next.js API Route com Edge Runtime (substituindo Cloudflare Workers)
- **Rate limiting (v1.2):** `@upstash/ratelimit` (já implementado no clone) — mantido
- **CMS decision (v1.2):** ADR-001 reconsidera opções priorizando integração Next.js (Sanity ganha peso; Payload também forte em Next.js; MDX+Git como fallback simples)
- **Astro reserva (v1.2):** caso pivot se mostre inviável por qualquer razão futura, plano B é Astro conforme PRD v1.1 (documento preservado em git history)

---

## Epic List

Após revisão do pacote de research do @analyst (Atlas), consolidei os **8 epics sugeridos em 6 epics MVP** (cross-cutting concerns como SEO técnico, analytics e observability foram distribuídos em cada epic em vez de isolados em epic próprio, seguindo best practice do template). **Phase 2** foi movida para roadmap pós-MVP (não faz parte deste PRD inicial).

| # | Epic | Goal Statement (1 frase) |
|---|------|--------------------------|
| **1** | **Foundation, Compliance & Observability** | Estabelecer infraestrutura base (Next.js 14 fork + Vercel + Sanity v3 + Upstash Redis), compliance regulatório (LGPD + ANS + SUSEP) e stack de observability, com canary page deployada para validar pipeline end-to-end. |
| **2** | **Trust & Authority (E-E-A-T)** | Construir autoridade visível YMYL através da página "Sobre o Corretor", selos de compliance, disclaimers padronizados e rodapé legal — base de credibilidade para todo o conteúdo subsequente. |
| **3** | **Content Engine: Pillar + Cornerstones** | Publicar pillar page "Guia Plano Amil Empresarial 2026" e 15 cornerstones editoriais com schema rich, estabelecendo o core de autoridade editorial e captura de tráfego orgânico. |
| **4** | **Conversion Engine** | Implementar fluxo de conversão completo — formulário de cotação com auto-CNPJ, integração CRM, WhatsApp Business e analytics de funil — transformando tráfego em leads qualificados. |
| **5** | **Programmatic SEO — Matrix CNAE × Cidade + Reaproveitamento Clone** | Gerar e publicar 600+ landing pages programáticas (30 CNAEs × 20 cidades × 2-3 portes) + reaproveitar 742 páginas-cidade simples do clone (Story 5.0) — total ~1.342 URLs programmatic core, dominando o território de long-tail. |
| **6** | **Price Intelligence & Calculator + Library** (v1.2.4 — Stories 6.5/6.6 movidas para Epic 7) | Publicar tabela de preços 2026 atualizável mensalmente (6 segmentações Bronze→Platinum Mais com tabela pública + 4 produtos premium "sob consulta"), calculadora de coparticipação inline e biblioteca de contratos — suite de ferramentas como "moat" de conversão. |
| **7** | **Programmatic SEO — Rede Credenciada Amil** (v1.2.4 NOVO) | Indexar ~10.500 URLs SEO da rede credenciada Amil (9.325 prestadores · 26 UFs · 438 municípios · 11 redes ativas) em 6 ataques: hub `/rede-credenciada`, páginas-prestador SSG, páginas-cidade SSG, páginas-bairro SSG (filtradas ≥3), Cluster E rede × UF, tipo × UF × município (filtradas ≥3) — moat competitivo via volume + schema rich + freshness mensal automatizada. Detalhes em `docs/sprint-change-proposal-v1.2.3.md`. |

**Phase 2 (roadmap pós-MVP — NÃO neste PRD):**
- ~~Epic 7: Calculadora Embed + Viral Loops~~ (renumerado — Epic 7 atual é "Programmatic SEO Rede Credenciada", promovido para MVP em v1.2.4)
- Epic 8: Newsletter VIP + Grupo WhatsApp Decisores
- Epic 9: API Pública de Cotação (moonshot)
- Epic 10: Cross-Sell (Odonto + Vida em Grupo)
- Epic 11: Estudo Anual "Radar Saúde Corporativa Brasil" (data-journalism)
- Epic 12 (NOVO Phase 2): Calculadora Embed + Viral Loops (former Epic 7 Phase 2)

**Rationale de sequenciamento:**
- Epic 1 **DEVE** ser primeiro (infra + compliance bloqueiam qualquer outra coisa)
- Epic 2 vem antes de content porque **E-E-A-T visível multiplica o valor SEO do conteúdo** (YMYL exige autoridade desde a primeira indexação)
- Epic 3 (content) precisa estar publicado antes de Epic 4 (conversion) para o conversion ter tráfego para converter
- Epic 4 (conversion) precisa funcionar antes de Epic 5 (programmatic em escala) — não escalar tráfego sem conversão validada
- Epic 5 (programmatic) é o maior volume de trabalho — executa após fundações estáveis
- Epic 6 (tabelas + calculadora) pode acontecer em paralelo com Epic 5 (times diferentes) mas é lançado após Epic 4 para aproveitar o fluxo de conversão

---

## Epic 1: Foundation, Compliance & Observability

**Goal:** Estabelecer toda a infraestrutura técnica, compliance regulatório e stack de observabilidade necessárias para que qualquer outro trabalho de produto seja viável, encerrando com um **canary/health page público** deployado, acessível e instrumentado. Este epic cria o substrato sobre o qual tudo mais é construído.

### Story 1.0: Project Kickoff & External Accounts Setup (PREREQUISITE)
Como **stakeholder** e **@devops**, quero **todos os placeholders pendentes resolvidos e contas externas criadas antes do início do desenvolvimento**, para **desbloquear toda a sequência de Epic 1 e eliminar débito técnico de inputs do stakeholder**.

> **⚠️ PREREQUISITE:** Esta story deve ser concluída antes de Story 1.1 iniciar. Todos os demais itens de Epic 1-6 dependem dos inputs consolidados aqui.

**Acceptance Criteria:**
1. ✅ **Os 13 placeholders RESOLVIDOS** (sessão 2026-04-24) e documentados em `docs/stakeholder-inputs.md`:
   1. ✅ Nome completo + número SUSEP do corretor nomeado — **Agnaldo Silva, SUSEP 201054484**
   2. ✅ Nome jurídico + CNPJ da corretora PJ responsável pelo site — **BeneficioRH Corretora de Seguros, 14.764.085/0001-99**
   3. ✅ Validação contratual do uso de "Amil" no domínio — **opção 🅲️ assumir risco com 5 mitigações** (sem parecer prévio); risk acknowledgment + brand usage policy + contingency plan deliverables na Story 2.4
   4. ✅ Regiões geográficas prioritárias — **top 20 cidades MG-heavy** (8 capitais + 3 SP + 9 MG)
   5. ✅ Restrições contratuais Amil sobre produtos mencionáveis — **todos os produtos comercializados**; 6 com tabela pública (Bronze→Platinum Mais) + 4 sob consulta (Black, Amil One S2500/S6500, Amil S580)
   6. ✅ Decisão de CRM — **Clint CRM** (vertical brasileiro corretoras) → documentada em `docs/decisions/adr-002-crm-adapter.md`
   7. ✅ Decisão de CMS — **Sanity v3** → documentada em `docs/decisions/adr-001-cms-choice.md` (Status: Accepted)
   8. ✅ Nome + e-mail + contato do DPO — **Agnaldo Silva** (beneficiorh@gmail.com, +55 11 92651-0515) — DPO da BeneficioRH (acumulação titular+DPO permitida pela ANPD para PME)
   9. ✅ Número WhatsApp Business oficial do corretor — **+55 11 92651-0515** (E.164: 5511926510515)
   10. ✅ Aceite escrito do stakeholder em aparecer publicamente — **aceite total** (foto + nome + bio + LinkedIn fornecidos)
   11. ✅ Logo Amil broker — **Combo BeneficioRH + selo discreto "Corretor autorizado Amil"** (SVG da logo BeneficioRH com pendência menor não-bloqueante; fallback wordmark texto)
   12. ✅ Confirmação cor `#0066B3` — **mantida** (risco aceito; plano B `#004280` 1-line swap em `tailwind.config.ts`)
   13. ✅ Direção de ilustrações — **Stock editado unDraw/Storyset** (R$ 0; paleta `#0066B3` sincronizada; Phase 2 avalia ilustrador próprio)
2. **Contas externas criadas e credenciais arquivadas seguramente** (1Password, Bitwarden ou equivalente — nunca em código):
   - GitHub (org ou conta pessoal do stakeholder)
   - Vercel (hosting Next.js — tier Hobby ou Pro conforme volume)
   - Cloudflare (apenas DNS + Turnstile anti-bot — DDoS protection)
   - Upstash Redis (rate limiting + cache CNPJ — free tier suficiente MVP)
   - Sanity v3 (CMS — free tier 3 users + 10GB)
   - Clint CRM (acesso e API token do stakeholder — vertical brasileiro corretoras)
   - Google Analytics 4 (nova property)
   - Google Search Console (verificação DNS ou meta)
   - Microsoft Clarity (gratuito)
   - Sentry (erros — free tier suficiente MVP)
   - Cloudflare Turnstile (anti-bot gratuito)
   - Copyscape (validação de originalidade — plano essencial)
   - Ahrefs OU Semrush (trial 7 dias para keyword research + plano mensal inicial)
   - BrasilAPI (gratuito, sem conta) + ReceitaWS (fallback, opcional)
3. **Domínios registrados:**
   - Principal: `planoamilempresas.com.br` (ou confirmado já registrado pelo stakeholder)
   - Ponte neutra: `comparaplanoscorporativos.com.br` (ou equivalente) como contingência anti-cease-and-desist
4. **Foto profissional do corretor** fornecida (alta resolução, formato vertical + horizontal, fundo neutro) — bloqueia Story 2.1
5. **Budget confirmado** para ferramentas (Ahrefs ou Semrush mensais) + backlinks (mínimo R$ 3K/mês conforme brief) + redação freelance (R$ 150–300/artigo × 15 cornerstones = R$ 3–6K)
6. **Advogado contratado e disponível** para revisões regulares (SLA definido: resposta em 48h úteis para revisões de conteúdo; 24h para emergências regulatórias)
7. **Pipeline editorial definido:** redator (freelance ou in-house) identificado e contratado; corretor como revisor técnico; advogado como revisor jurídico; SLA de publicação acordado
8. Documento `docs/stakeholder-inputs.md` aprovado por escrito pelo stakeholder e arquivado
9. Checklist de go/no-go aprovada antes de autorizar início da Story 1.1

**Notas:**
- Esta story não gera código — é a fundação humana/contratual do projeto
- Tempo estimado: 5–10 dias úteis (depende da agilidade do advogado)
- Bloqueia: Story 1.1 em diante. Pode acontecer em paralelo com Story 1.0b (editorial pipeline) se desejado
- Owner primário: stakeholder; apoio: @devops para setup de contas, @po para tracking

### Story 1.0c: Spike Técnico — API do Clint CRM (PARALLEL OK)

Como **@architect (Aria)** e **@dev (Dex)**, quero **explorar a API do Clint CRM antes de Story 4.3 começar a implementação**, para **validar viabilidade técnica do `ClintAdapter` (ADR-002), descobrir gaps de doc, e produzir spec técnica precisa**.

> **⚠️ DEPENDS ON:** stakeholder fornece acesso (URL instância, credenciais admin, doc API se houver)
> **⚠️ BLOCKS:** Story 4.3 (Integração CRM)
> **PARALLEL:** pode rodar em paralelo com Stories 1.1-1.8 (Epic 1 infra)

**Acceptance Criteria:**

1. Stakeholder fornece via canal seguro (1Password / Bitwarden):
   - URL da instância Clint (ex: `https://beneficiorh.clint.com.br`)
   - Credenciais admin para acessar painel + doc
   - API token (gerar se não existir)
   - Lista de tags/funis atuais usados em leads do site

2. @architect (Aria) audita documentação Clint API e produz `docs/spike/clint-api-audit.md` cobrindo:
   - Endpoint base + autenticação (OAuth/API Key/Basic Auth)
   - Schema de Lead (campos obrigatórios/opcionais, tipos, validações)
   - Endpoints relevantes: criar lead, atualizar lead, tag lead, buscar lead, webhooks de status
   - Rate limits e quotas
   - Disponibilidade da API (uptime histórico, SLA)
   - Webhooks suportados (lead criado, lead convertido, lead perdido)

3. Implementação prova-de-conceito (`scripts/spike-clint-poc.mjs`):
   - Cria 1 lead de teste via API
   - Atualiza tags do lead
   - Recebe webhook (se suportado)
   - Documenta payload exato em `docs/spike/clint-payload-examples.md`

4. Atualização do `ClintAdapter` skeleton em `src/lib/crm/clint.ts`:
   - Implementação inicial baseada na API real
   - Tipos TypeScript fiéis ao schema Clint
   - Tratamento de errors (auth, rate limit, validação)
   - Tests com mock MSW cobrindo cenários happy + error

5. Decisão final no ADR-002:
   - Confirmar que ClintAdapter atende todos os requisitos da `CRMAdapter` interface
   - Se houver gap (ex: Clint não suporta tag dinâmica), documentar workaround
   - Atualizar `docs/decisions/adr-002-crm-adapter.md` com resultado do spike

6. Output documentado em `docs/spike/clint-spike-report.md`:
   - Status: Viable / Viable-with-workarounds / Not-viable (escalate)
   - Gaps de documentação encontrados
   - Issues técnicas conhecidas
   - Recomendação para Story 4.3 (timeline ajustada se necessário)

**Estimativa:** S (1-3 dias). Bloqueia se stakeholder demorar a fornecer credenciais.

**Quality Gate:** @pm (Morgan) revisa output antes de fechar Story 1.0c.

**Notes:**
- Esta é uma **research story**, não dev story — output é documentação + POC, não código de produção
- Resultado pode mudar timeline da Story 4.3 (extender se Clint API tiver complexidade inesperada)
- Plano B se Clint API for inviável: fallback para RDStationAdapter (ADR-002 backup option) + comunicar stakeholder

### Story 1.1: Fork do Codebase Existente + Strip Bradesco (v1.2 — substitui setup Astro greenfield)
Como **@dev** e **@devops**, quero **forkar o repositório pré-existente `amil-saude/` (stakeholder = autor), remover todo conteúdo e branding Bradesco, e criar novo repositório `planoamilempresas` limpo**, para **aproveitar 1.005 páginas programáticas e patterns maduros sem carregar qualquer referência à operadora anterior**.

**Acceptance Criteria:**
1. Novo repositório git `planoamilempresas` criado no GitHub (org ou conta pessoal do stakeholder — definido em Story 1.0)
2. Fork do codebase `amil-saude/` importado como primeiro commit (baseline preservada para auditoria futura)
3. **Strip completo de conteúdo Bradesco:**
   - `/src/data/` (se existir): esvaziado ou substituído por placeholders Amil
   - `/src/content/` (se existir): esvaziado
   - `/src/components/`: remover strings hardcoded "Bradesco" → temporariamente "TBD" até Epic 2/3 substituir por "Amil"
   - `/public/`: remover logos/imagens Bradesco; placeholders até assets Amil serem fornecidos
4. **Strip de branding e meta:**
   - `src/config/brand.ts`: reescrever para `planoamilempresas` (título, descrição, URL base, cores como placeholder até front-end-spec.md de Uma)
   - `package.json`: `name: "planoamilempresas"`, remover referências Bradesco, atualizar version para `0.1.0`
   - `layout.tsx`: meta tags título/descrição genéricas temporárias
   - `sitemap.ts` + `robots.ts`: gerados dinamicamente — sem hardcode Bradesco
5. **Strip de analytics e integrações:**
   - Remover IDs GA4/GSC/Sentry/Clarity Bradesco; placeholders via env vars até Story 1.5 aplicar os novos
   - Remover conexões Upstash Bradesco (placeholders novos via env vars)
   - Remover webhook/API keys CRM Bradesco
6. **Strip de segmentos:**
   - `segment-redirects.mjs`: limpar todas as entradas Bradesco; será repopulado em Epic 5 com segmentos Amil/CNAEs
   - Arquivos de dados de segmentos (estados/cidades): preservar apenas estrutura; conteúdo vai para Epic 3/5
7. **Auditoria final de strip:**
   - `grep -ri bradesco src/ public/ docs/` deve retornar 0 matches
   - `grep -r amil-saude .` deve retornar 0 matches fora de `.git/` (histórico preservado)
8. TypeScript strict mode mantido; `npm run typecheck` passa
9. `npm run build` gera build limpo sem erros
10. `npm run test` passa (testes podem ser ajustados mas não removidos)
11. Commit inicial Conventional Commits: `feat: initial fork of codebase with Bradesco stripped, ready for Amil rebranding [Story 1.1]`
12. README.md reescrito explicando origem do fork, propósito do projeto, comandos principais (`dev`, `build`, `start`, `lint`, `test`, `typecheck`)
13. `.gitignore` mantém exclusões (`node_modules`, `.next`, `.env`, IDE files)
14. `.nvmrc` atualizado para Node 20.x LTS (clone usa >=18.17.0; upgradear para 20 LTS)

### Story 1.2: Configuração de Hosting (Vercel) e DNS (v1.2 — substitui Cloudflare Pages)
Como **@devops**, quero **conectar o repositório forkado a Vercel com preview automático em PRs e DNS configurado**, para que **o site esteja em URL estável e cada mudança seja deployada em preview isolado para review**.

**Acceptance Criteria:**
1. Conta Vercel criada (ou org existente do stakeholder) e projeto Vercel conectado ao repositório GitHub
2. Deploy automático do `main` para produção (URL `*.vercel.app` até domínio ser apontado)
3. Preview automático para cada PR com URL única comentada no PR
4. Build command e output directory validados (Next.js default: `next build` + `.next/`)
5. Environment variables placeholder configuradas em 3 environments (development / preview / production): `GA4_ID`, `GSC_VERIFICATION`, `SENTRY_DSN`, `CLARITY_ID`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CRM_API_KEY`, `RECEITA_API_KEY` (valores reais aplicados em Story 1.5)
6. Branch protection: PRs obrigatórios para `main`, ao menos 1 approval, CI verde + Vercel Preview Deploy OK
7. DNS configurado (Cloudflare DNS ou Vercel DNS — decisão em ADR-004): `planoamilempresas.com.br` apontando para Vercel (quando Story 1.0 fornecer domínio)
8. HTTPS forçado, HSTS habilitado (Vercel nativo)
9. Preview deploys protegidos por password (Vercel Pro feature) ou abertos conforme preferência do stakeholder
10. Upstash Redis KV provisionado e testado — rate limiting funcionando em endpoint de teste
11. Vercel Analytics habilitado (tier gratuito)

### Story 1.2a: Configurar DNS do Domínio-Ponte de Contingência
Como **@devops**, quero **configurar DNS do domínio-ponte `planosaudeempresas.com.br` (já registrado pelo stakeholder) apontando inicialmente para landing minimalista, mas pronto para receber redirect 301 em <1h se houver notificação Amil**, para **mitigar risco de cease & desist conforme decisão 🅲️ da Story 1.0 (5 mitigações obrigatórias)**.

**Acceptance Criteria:**
1. Domínio `planosaudeempresas.com.br` confirmado registrado pelo stakeholder no Registro.br
2. DNS Cloudflare configurado: A/AAAA → Vercel + CNAME (www) → cname.vercel-dns.com
3. TTL configurado em 300s (5min) para permitir troca rápida
4. Landing minimalista deployada em `planosaudeempresas.com.br` enquanto não acionado: "Plano de saúde empresarial — em breve novidades. Fale com nosso corretor: WhatsApp 5511926510515"
5. Configuração de redirect 301 mapeando todas as 600+ URLs `/plano-amil/...` → equivalente `/plano-empresarial/...` arquivada como dormant em `vercel.json` (não-aplicada até evento)
6. Plano de contingência documentado em `docs/devops/domain-contingency-plan.md` (entregável Story 2.4)

### Story 1.3: CI/CD com GitHub Actions + Vercel Integration (v1.2)
Como **@devops**, quero **GitHub Actions rodando lint, typecheck, testes unitários, Lighthouse CI e axe-core em cada PR, com deploy automatizado via Vercel GitHub Integration**, para que **qualidade, performance e acessibilidade sejam garantidas antes do merge e deploy seja zero-friction**.

**Acceptance Criteria:**
1. Workflow `ci.yml` rodando em PR: install deps, lint (`eslint-config-next`), typecheck (`tsc --noEmit`), test unit (`vitest run`), build (`next build`)
2. Workflow `lighthouse.yml` rodando Lighthouse CI em PRs com threshold Performance ≥90 (alinhado com NFR1 ≥92 meta); rodado contra URL de preview do Vercel
3. Workflow `accessibility.yml` rodando axe-core em componentes isolados + páginas-chave, falhando em violações WCAG AA
4. Workflow `schema-validation.yml` validando schema.org via Google Rich Results Test (stories futuras de conteúdo se beneficiarão)
5. Vercel GitHub Integration ativa: deploy automático preview em cada PR; deploy production em merge para `main`
6. Status checks bloqueando merge: CI, Lighthouse, Accessibility, Vercel Preview Deploy, CodeRabbit (se adotado)
7. Badges de CI no README.md
8. Cache de node_modules via `actions/setup-node@v4` com `cache: 'npm'` para builds <2min
9. Secret management: GitHub Actions secrets sincronizados com Vercel env vars (script documentado em `docs/devops/sync-secrets.md`)

### Story 1.4: Canary Page + Health Endpoint em Next.js (v1.2 — Primeira Deploy Funcional pós-fork)
Como **stakeholder**, quero **acessar uma página canary "coming soon" no domínio deployado** que confirma fork limpo + pipeline end-to-end funcionando, para **validar que a fundação está operacional antes de investir em conteúdo Amil**.

**Acceptance Criteria:**
1. Rota `/` (página server-rendered via RSC) com título "Em breve — planoamilempresas.com.br", tagline, data da última build (via `process.env.VERCEL_GIT_COMMIT_SHA` ou similar)
2. Rota `/api/healthz` (Next.js API Route com Edge Runtime) retorna JSON `{ status: "ok", version: "<git-sha>", timestamp, environment }` — verificável via curl
3. Página 404 custom (`not-found.tsx` herdada do clone, limpa) com link para `/`
4. Página de erro (`error.tsx`) com logging Sentry (se configurado em Story 1.5) ou fallback
5. Meta tags básicas (title, description, viewport, charset, og:title, og:image placeholder)
6. Favicon placeholder (pode ser genérico)
7. HTTPS ativo com cadeado no browser
8. Lighthouse Performance ≥95 nesta página simples (target facilmente atingido em página trivial)
9. CWV: LCP < 1s, CLS 0, INP < 100ms
10. **Grep de validação confirma:** zero strings `Bradesco` / zero referências a `amil-saude` original / zero IDs Bradesco em analytics

### Story 1.5: Analytics & Observability Stack
Como **@pm**, quero **GA4 + Google Search Console + Microsoft Clarity + Sentry configurados e disparando eventos desde o primeiro dia**, para que **toda sessão futura seja rastreada e tenhamos baseline de métricas**.

**Acceptance Criteria:**
1. GA4 property criado e tag GTM (ou gtag direto) integrada no layout global
2. GA4 configurado com enhanced measurement (scroll, outbound clicks, site search, file download, video engagement)
3. Google Search Console verificado via meta tag ou DNS, sitemap submetido (ainda vazio, mas submetido)
4. Microsoft Clarity integrado (gratuito) para heatmaps e session recordings
5. Sentry configurado para captura de erros client e edge
6. Logs estruturados em Vercel Functions / Edge Runtime (quando stories futuras criarem API Routes)
7. Disparo de analytics condicionado a consent LGPD (tag só dispara se usuário consentiu)
8. Dashboard básico GA4 configurado com métricas-chave (sessions, engagement, top pages)

### Story 1.6: LGPD — Consent Management e Política de Privacidade
Como **@dev** e **@legal**, quero **banner de cookies LGPD-compliant + página de política de privacidade publicadas**, para que **o site esteja em compliance desde o primeiro visitante público**.

**Acceptance Criteria:**
1. Banner LGPD granular implementado (opções: Necessários / Analytics / Marketing) com opt-in explícito (não "aceitar todos" automático)
2. Banner registra consent com timestamp + versão da política em localStorage + idealmente em backend (edge function) para auditoria
3. Página `/politica-de-privacidade` publicada com texto revisado por advogado, **DPO Agnaldo Silva (BeneficioRH — beneficiorh@gmail.com, +55 11 92651-0515)** — acumulação titular+DPO permitida pela ANPD para PME (Resolução CD/ANPD 2/2022); procedimento de solicitação de dados e exclusão
4. Página `/termos-de-uso` publicada com condições de uso do site
5. Cookies analytics e marketing bloqueados antes do consent
6. Link "Gerenciar cookies" no rodapé permite revisar e alterar escolha
7. Link "Solicitar dados" / "Excluir dados" no rodapé com formulário ou e-mail do DPO
8. Texto dos banners e políticas em português brasileiro correto (sem jurídiquês desnecessário)

### Story 1.7: Rodapé Legal e Disclaimers ANS/SUSEP Globais
Como **@legal**, quero **rodapé global padronizado com disclaimers ANS, SUSEP e informações legais corretos em todas as páginas**, para **garantir compliance regulatório em 100% do site**.

**Acceptance Criteria:**
1. Componente `Footer.tsx` renderizado globalmente no layout base (Next.js 14 App Router)
2. Rodapé contém: razão social + CNPJ **BeneficioRH Corretora de Seguros — CNPJ 14.764.085/0001-99**, número SUSEP do corretor **Agnaldo Silva — SUSEP 201054484**, texto "Corretor autorizado a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº 326305)"
3. Rodapé contém: links para política de privacidade, termos de uso, gerenciar cookies, solicitar/excluir dados
4. Rodapé contém: disclaimer ANS RN 195/2009: "As informações apresentadas não constituem oferta ou promessa de cobertura. Valores sujeitos a análise pela operadora. Coberturas conforme contrato e regulamentação ANS."
5. Rodapé contém: data da última atualização do site (build time)
6. Selos visuais: ANS · SUSEP · LGPD Compliant (ícone ou mini-banner)
7. Rodapé responsivo (mobile stack, desktop grid)
8. Links de rodapé com `rel="nofollow"` onde apropriado (legal docs) e `rel="me"` em LinkedIn do corretor

### Story 1.8: Robots.txt, Sitemap.xml e SEO Foundation
Como **@dev**, quero **robots.txt e sitemap.xml configurados e válidos desde a primeira deploy**, para que **Google comece a entender a estrutura do site imediatamente**.

**Acceptance Criteria:**
1. `robots.txt` público em `/robots.txt` permitindo indexação total, bloqueando `/preview`, `/admin`, declarando sitemap URL
2. `sitemap.xml` gerado dinamicamente via `app/sitemap.ts` (Next.js 14), válido em validator W3C
3. Canonical tags em todas as páginas (mesmo na canary — aponta para `/`)
4. Meta tags `title` e `description` únicas por página (validado em lint custom)
5. Open Graph tags (og:title, og:description, og:image, og:url, og:type) em todas as páginas
6. Twitter Card tags configuradas (summary_large_image)
7. Schema Organization + LocalBusiness no layout global (BeneficioRH Corretora de Seguros — CNPJ 14.764.085/0001-99, SUSEP 201054484, endereço Av. Afonso Pena 4098, Belo Horizonte/MG)
8. Sitemap submetido no Google Search Console

---

## Epic 2: Trust & Authority (E-E-A-T)

**Goal:** Construir visibilidade de autoridade YMYL que eleve o valor SEO de cada página futura. No YMYL (saúde), Google prioriza fortemente Experience, Expertise, Authoritativeness e Trustworthiness — E-E-A-T bem implementado é multiplicador direto de ranking, e é um fosso competitivo (nenhum dos 16 concorrentes mapeados tem E-E-A-T visível comparável).

### Story 2.1: Página "Sobre o Corretor" como Landing de Autoridade
Como **decisor PJ visitando o site**, quero **ver claramente quem é o corretor responsável, suas credenciais e sua foto**, para que **eu confie em ceder meu contato e seguir com uma cotação**.

**Acceptance Criteria:**
1. Página `/sobre` publicada com foto profissional do corretor (fornecida pelo stakeholder em `/public/images/agnaldo-silva-corretor.jpeg`), nome completo **Agnaldo Silva**, número SUSEP **201054484**, bio editorial de 5–10 linhas focada em experiência com planos empresariais (texto aprovado em `docs/stakeholder-inputs.md` Bloco 1.4 — versão integral em `/sobre`; versão curta focada em Amil em homepage/cornerstones)
2. Seção "Credenciais" listando: registro SUSEP, CPF/CRC contábil se aplicável, certificações ANS (se tiver), filiações associativas (FENACOR, etc.)
3. Seção "A corretora PJ" com razão social, CNPJ, endereço, ANS da Amil (operadora), link para contrato de corretagem (público ou resumo)
4. Seção "Por que Amil PJ?" com pitch editorial (não comercial) de 2–3 parágrafos explicando foco vertical
5. Link direto para LinkedIn do corretor + WhatsApp Business
6. Selos visuais: SUSEP · ANS · LGPD · RA (quando disponível)
7. Schema markup: `Person` aninhado em `Organization`, com `jobTitle`, `sameAs` (LinkedIn), `worksFor`
8. CTA "Falar no WhatsApp" + "Solicitar cotação"
9. Lighthouse ≥95, CWV "Good"
10. SEO: title "Sobre o Corretor — Plano Amil Empresas", meta description < 160 chars, H1 único

### Story 2.2: Componente de Disclaimers Padronizado (Template)
Como **@dev**, quero **um componente React `<Disclaimer type="ans|lgpd|valores" />` reutilizável**, para que **todas as páginas de conteúdo regulado usem texto padronizado e aprovado pelo advogado**.

**Acceptance Criteria:**
1. Componente `<Disclaimer />` aceita prop `type` com valores: `ans-publicidade`, `ans-valores`, `lgpd-dados`, `sugep-corretor`, `marca-amil`
2. Textos de cada type versionados em Sanity v3 (schema `disclaimer`) com fallback em `src/content/disclaimers/` Markdown para facilitar update jurídico
3. Disclaimer renderiza com styling visual distinto (caixa cinza clara, ícone de info, fonte ligeiramente menor)
4. Props opcionais: `compact={true}` (texto curto inline), `link` (link para fonte regulatória completa)
5. Testes unitários validando renderização de cada type
6. Documentação no README interno explicando quando usar cada tipo
7. Primeira aplicação: usar em rodapé global, página Sobre, e planejado para uso em stories futuras de conteúdo

### Story 2.3: Selos Visuais de Compliance (Badges)
Como **decisor cético**, quero **ver selos visuais claros (ANS, SUSEP, LGPD, Reclame Aqui)** próximos aos CTAs, para **ter prova rápida de credibilidade sem ter que ler texto legal**.

**Acceptance Criteria:**
1. Componente `<ComplianceBadges />` com variantes: `layout="horizontal"` (rodapé), `layout="grid"` (página sobre), `layout="inline"` (próximo a formulário)
2. Badges incluídos: ANS (#326305 Amil), SUSEP (#corretor), LGPD Compliant, Reclame Aqui (linkando perfil real quando existir), RA1000 (quando conquistado)
3. Cada badge com link para fonte oficial ou perfil (ANS consulta, SUSEP consulta, Reclame Aqui perfil)
4. Visual: ícones SVG próprios ou oficiais quando disponíveis, acessível (alt text, aria-label)
5. Hover state com tooltip "Verificar no [fonte]"
6. Integrado no rodapé global (layout horizontal) e página Sobre (layout grid)
7. Renderização condicional: badges que ainda não foram conquistados (ex: RA1000) não aparecem até flag `has_ra1000=true`

### Story 2.4: Validação Jurídica Inicial e Política de Uso da Marca Amil
Como **stakeholder**, quero **ter validação formal sobre uso do termo "Amil" no domínio e em conteúdo antes do go-live (decisão Story 1.0 Bloco 2: opção 🅲️ "assumir risco" + 5 mitigações)**, para **mitigar risco de cease & desist e perda do domínio**.

**Acceptance Criteria — 3 deliverables obrigatórios:**
1. Checklist de validação jurídica criada em `docs/legal/compliance-checklist.md` cobrindo: uso da marca Amil, disclaimers ANS, compliance LGPD, termos de uso, política de privacidade
2. **Deliverable 1 — `docs/legal/domain-risk-acknowledgment.md`** — risk acknowledgment assinado pelo stakeholder, confirmando que foi informado do risco de uso de "Amil" no domínio e optou por prosseguir sem parecer prévio (mitigação 5 da Story 1.0 Bloco 2)
3. **Deliverable 2 — `docs/editorial/brand-usage-policy.md`** — política de uso da marca Amil (NUNCA logo Amil, sempre disclaimer "corretor autorizado a intermediar planos da Amil Assistência Médica Internacional S.A. — registro ANS nº 326305"; cores podem ser usadas; texto sim, wordmark/ícone oficial não)
4. **Deliverable 3 — `docs/devops/domain-contingency-plan.md`** — plano de rollback 301 em <1h, mapeamento de URLs `/plano-amil/*` → `/plano-empresarial/*`, template de resposta a notificação Amil pré-aprovado (sem assumir culpa, pedindo 30 dias para transição), checklist de DNS TTL 300s ativo
5. Domínio-ponte `planosaudeempresas.com.br` confirmado registrado pelo stakeholder e DNS configurado em Story 1.2a
6. Item do checklist de go-live: "3 deliverables Story 2.4 arquivados + DNS ponte ativo"
7. **Deliverable 4 (NOVO v1.2.4 — Story 7.0c)** — co-sign formal de ADR-006 (`docs/decisions/adr-006-url-as-trademark-policy.md`) por advogado revisor:
   - Input: `docs/legal/legal-review-packet-adr-006.md` (pacote auto-contido para review em ≤1h, preparado por Aria)
   - Anexos: `docs/decisions/legal-precedents-corretoras-amil.md` (8+ corretoras com "amil" em domínio + 10+ com path)
   - Output: parecer formal Sim/Não + 7 perguntas estruturadas respondidas + assinatura
   - Status do ADR-006: muda de `Proposed` para `Accepted` (ou `Rejected` com modificações sugeridas)
   - **Esta AC desbloqueia Story 7.7** (Cluster E rede × UF SSG — 286 URLs `/rede/[rede-slug]/[uf]`)
   - Conventional Commit pós co-sign: `docs(adr): legal review accepts ADR-006 [Story 7.0c, 2.4]`

---

## Epic 3: Content Engine — Pillar + 15 Cornerstones

**Goal:** Publicar o núcleo editorial de autoridade do site — 1 pillar page abrangente + 15 cornerstones cobrindo ~70% do volume de busca comercial do nicho, com schema markup rich, interlinking profundo e pipeline editorial que permite atualizações mensais. Este epic estabelece a biblioteca de "ativos de linking" que sustentará todo o programmatic SEO subsequente.

> **⚠️ PREREQUISITE (REC-2 pós-validação @po):** **Epic 3 Story 3.2 (Template de Cornerstone) depende de `front-end-spec.md` produzido por @ux-design-expert (Uma).** O template de cornerstone precisa do design system finalizado (tokens, componentes, tipografia, paleta, responsividade, acessibilidade) antes de ser implementado. Timeline sugerida: Uma inicia `front-end-spec.md` em **paralelo ao Epic 1** (Semana 1–2), finaliza no máximo **final da Semana 3**. Se front-end-spec não estiver pronto, Story 3.1 (CMS setup) pode avançar, mas Story 3.2+ fica bloqueada.

### Story 3.1: Setup CMS Headless Sanity v3 + GROQ Content Schemas
Como **@dev**, quero **Sanity v3 instalado e integrado ao Next.js 14 App Router via GROQ queries + next-sanity**, para que **corretor e equipe editorial publiquem conteúdo sem depender de código**.

**Acceptance Criteria:**
1. Decisão de CMS fechada como **Accepted: Sanity v3** em `docs/decisions/adr-001-cms-choice.md` (free tier 3 users + 10GB cobre MVP — Agnaldo + redator freelance + advogado)
2. Sanity studio instalado em `/studio` (rota protegida) com schemas para: `cornerstone`, `pillarPage`, `blogPost`, `disclaimer`, `priceTable`, `programmaticLanding`, `networkProvider`
3. Sanity content schemas + GROQ queries configurados em `src/lib/sanity/` com client tipado (`@sanity/client` + `next-sanity`); fetch via RSC para SSG/ISR
4. Preview automático de conteúdo em rascunho (não-published) acessível em URL protegida por auth (`/api/preview` Next.js Route Handler)
5. Workflow editorial: rascunho → revisão corretor → revisão advogado → publicação (implementado via status field do Sanity)
6. Webhook Sanity → Vercel Revalidate API para ISR em tabelas de preço e cornerstones (Story 6.6)
7. Documentação em `docs/editorial/cms-guide.md` explicando como usar Sanity studio (passo a passo com screenshots)
8. Treinamento agendado com corretor/equipe editorial (1h) para operar Sanity studio
9. Dependências instaladas: `@sanity/client`, `next-sanity`, `@sanity/image-url`, `@sanity/vision` (studio dev)

### Story 3.2: Template de Cornerstone com Schema Markup
Como **@dev** e **@ux-design-expert**, quero **template `CornerstoneLayout.tsx` padronizado com todos os elementos SEO + UX**, para que **os 15 cornerstones tenham consistência e aceleração de publicação**.

**Acceptance Criteria:**
1. Layout `CornerstoneLayout.tsx` (Next.js 14 RSC) com: hero (H1, subtitle, breadcrumbs, autor, data atualização, tempo de leitura), TOC lateral sticky em desktop, conteúdo principal (Sanity Portable Text → React via `@portabletext/react`), sidebar com CTA + related articles, footer do artigo com FAQs, CTA WhatsApp flutuante
2. Schema `Article` com `author` (Person — corretor), `publisher` (Organization), `datePublished`, `dateModified`, `mainEntityOfPage`
3. Schema `FAQPage` extraído automaticamente de blocos `<FAQ />` no MDX
4. Schema `BreadcrumbList` com hierarquia correta (Home > [Cluster] > [Artigo])
5. Meta tags: title custom, description custom (160 chars), OG image custom ou gerada dinamicamente
6. Componentes MDX disponíveis: `<Disclaimer />`, `<FAQ />`, `<PriceTable />` (placeholder), `<CalloutBox />`, `<InfoCard />`, `<InternalLink />`
7. "Atualizado em [mês/ano]" extraído do frontmatter, visível abaixo do H1
8. Lighthouse ≥95, CWV "Good" no template padrão
9. Accessibility WCAG AA (heading hierarchy, ARIA landmarks, alt texts, focus management)

### Story 3.3: Pillar Page "Guia Plano Amil Empresarial 2026"
Como **decisor PJ entrando via busca genérica**, quero **um guia abrangente que me oriente no nicho inteiro**, para **encontrar todas as respostas em um lugar e decidir se vale solicitar cotação**.

**Acceptance Criteria:**
1. Página `/guia-plano-amil-empresarial` publicada com ≥3.000 palavras
2. Seções cobrem: O que é plano Amil empresarial; Quem pode contratar (ME, EPP, MEI+PJ, grupo de afinidade); Produtos Amil PME empresariais com tabela comparativa — 6 segmentações públicas (Bronze, Bronze Mais, Prata, Ouro, Platinum, Platinum Mais com variações QC/QP) + 4 produtos premium "sob consulta" (Black, Amil One S2500 QP, Amil One S6500 Black QP, Amil S580 QP); Como escolher o plano certo por porte; Preços e coparticipação (30% ou 40% conforme estado); Rede credenciada; Carência e CPT; Reajuste histórico; Como contratar; Documentação necessária; Cancelamento e portabilidade; FAQs (≥10 perguntas estruturadas)
3. Interlinks para todos os 15 cornerstones via TOC e contextualmente no corpo
4. CTAs contextuais: 1 após seção "Como escolher" (formulário), 1 após "Preços" (calculadora), 1 sticky WhatsApp
5. Schema FAQPage com ≥10 Q&A
6. Schema Article com autor (corretor), published/modified dates
7. Imagens/infográficos originais (não stock): mínimo 3 assets visuais com alt text descritivo
8. Tempo de leitura estimado: 18–22 minutos, exibido no hero
9. Conteúdo 100% original validado via Copyscape
10. Revisão jurídica completa antes de publicar (disclaimers em todos os blocos de preço/cobertura)

### Story 3.4 a 3.18: 15 Cornerstones Individuais
(Story template repetido 15 vezes, uma por cornerstone)

**Story 3.4:** Cornerstone "Tabela de Preços Amil Empresarial 2026" (cobre 6 segmentações Bronze→Platinum Mais com QC/QP)
**Story 3.5:** Cornerstone "Amil Bronze vs Prata para PME 11-30 vidas — Qual Escolher" (acomodação coletiva vs particular, abrangência regional vs nacional, custo×rede)
**Story 3.6:** Cornerstone "Platinum vs Platinum Mais — Quando Vale a Pena Subir" (R1 vs R2, reembolso, rede premium) + bloco lateral "Amil One Black vs Platinum Mais — premium executivo (sob consulta)"
**Story 3.7:** Cornerstone "Plano Amil para Empresa de 2 a 10 Vidas (ME/MEI+PJ)" — Bronze/Bronze Mais como entrada, Prata QC quando rede regional cobre
**Story 3.8:** Cornerstone "Plano Amil Empresarial 30 a 200 Vidas (EPP/Grupos)" — Ouro/Platinum como sweet spot corporativo, opções premium Black sob consulta para C-level
**Story 3.9:** Cornerstone "Carência e CPT nos Planos Amil Empresariais"
**Story 3.10:** Cornerstone "Portabilidade para Amil Empresarial — Como Funciona"
**Story 3.11:** Cornerstone "Reajuste Amil Empresarial 2026 — Histórico e Projeção"
**Story 3.12:** Cornerstone "Rede Credenciada Amil por Região — Guia Completo"
**Story 3.13:** Cornerstone "Coparticipação no Plano Amil PJ — Vale a Pena?"
**Story 3.14:** Cornerstone "MEI Pode Contratar Plano Amil? Guia Completo"
**Story 3.15:** Cornerstone "Como Contratar Plano Amil para sua Empresa — Passo a Passo"
**Story 3.16:** Cornerstone "Documentação Necessária para Contratar Amil PJ"
**Story 3.17:** Cornerstone "Como Cancelar Plano Amil Empresa sem Multa"
**Story 3.18:** Cornerstone "Reembolso e Autorização no Amil — Guia do Decisor"

**Acceptance Criteria comuns a todos os cornerstones (3.4–3.18):**
1. Mínimo 2.000 palavras de conteúdo original validado via Copyscape
2. Estrutura: hero (H1, subtitle, breadcrumbs, autor, data, read time), TOC, introdução, 5–8 seções com H2/H3, FAQs (≥5), conclusão com CTA, related articles
3. Schema Article + FAQPage + BreadcrumbList implementados
4. Interlinks: ≥3 para pillar page, ≥2 para cornerstones relacionados, ≥1 para landing programática quando aplicável
5. Mínimo 2 imagens/infográficos originais com alt text
6. Meta title <60 chars, meta description <160 chars, OG image custom
7. Revisão editorial (corretor) + revisão jurídica antes de publicar
8. "Atualizado em" visível, commit mensal de revisão mínima
9. Lighthouse ≥95, CWV "Good"
10. Publicado no CMS com status "published"

### Story 3.19: Pipeline de Atualização Mensal de Cornerstones
Como **@pm**, quero **processo documentado de revisão e atualização mensal dos cornerstones**, para que **o conteúdo se mantenha fresh para SEO e alinhado com mudanças regulatórias/produto**.

**Acceptance Criteria:**
1. Documento `docs/editorial/monthly-review-sop.md` com processo passo-a-passo
2. Checklist por cornerstone: (a) dados ainda atuais?, (b) disclaimers atualizados?, (c) novos FAQs relevantes?, (d) interlinking ainda apropriado?, (e) "Atualizado em" atualizado
3. Calendar reminder configurado (Google Calendar ou similar) para dia 1 de cada mês
4. Log de atualizações em `docs/editorial/changelog-content.md` com data e resumo da mudança
5. Trigger de revisão urgente quando: ANS emite nova RN, Amil anuncia novo produto ou reajuste, mudança regulatória LGPD

---

## Epic 4: Conversion Engine

**Goal:** Transformar o tráfego orgânico gerado pelos Epics 2 e 3 em leads qualificados para o corretor. Implementar o fluxo completo de conversão: formulário de cotação com auto-CNPJ, WhatsApp Business integrado, dispatching inteligente para CRM, e tracking de funil ponta-a-ponta para otimização contínua.

### Story 4.1: Formulário de Cotação — Versão Base (6 Campos)
Como **decisor PJ pronto para solicitar cotação**, quero **formulário curto e rápido**, para **enviar meu interesse sem ter que preencher 15 campos irrelevantes**.

**Acceptance Criteria:**
1. Componente `<QuoteForm />` (React island) com 6 campos: Nome Completo, E-mail Corporativo, WhatsApp, CNPJ, Número de Vidas (dropdown 2-10, 11-30, 31-100, 101-200), Mensagem opcional
2. Validação em tempo real (onBlur): e-mail válido, CNPJ válido (algoritmo), WhatsApp formato brasileiro
3. Consent LGPD checkbox obrigatório com link para política
4. Submit bloqueado até todos campos válidos + consent marcado
5. Estado de loading durante submit (spinner + botão disabled)
6. Mensagem de sucesso clara pós-submit com próximos passos ("Entraremos em contato em até 2h úteis via WhatsApp")
7. Mensagem de erro amigável em caso de falha (fallback: link WhatsApp direto)
8. Anti-spam: Cloudflare Turnstile + honeypot field invisível
9. Acessibilidade: labels visíveis, aria-invalid em campos com erro, navegação por teclado, erros anunciados para screen readers
10. Analytics: eventos `form_start` (primeiro campo preenchido) e `form_submit` disparados no GA4

### Story 4.2: Auto-Preenchimento de CNPJ via BrasilAPI
Como **decisor PJ**, quero **digitar apenas meu CNPJ e ter razão social e endereço preenchidos automaticamente**, para **economizar tempo e reduzir erro de digitação**.

**Acceptance Criteria:**
1. Edge function `/api/cnpj-lookup` consulta BrasilAPI (primário) com fallback ReceitaWS
2. Cache de 24h por CNPJ em Upstash Redis (reduz chamadas à API externa)
3. Rate limiting: 10 consultas/min por IP
4. Response time p95 ≤2 segundos (incluindo API externa + cache lookup)
5. Integrado no formulário: ao digitar CNPJ válido, chama endpoint e preenche `razaoSocial`, `endereco.cep`, `endereco.cidade`, `endereco.uf`, `cnaeFiscal`
6. Loading state visual no campo durante consulta
7. Fallback manual: se API falhar ou CNPJ não encontrado, usuário pode continuar preenchendo manualmente com aviso "não conseguimos validar automaticamente"
8. Dados da API enviados para CRM junto com dados do form (enriquecimento automático)
9. Teste unitário: validação de CNPJ + formatação
10. Teste integration: mock BrasilAPI + submissão completa do form

### Story 4.3: Integração com Clint CRM (CRM primário do corretor)
Como **@pm**, quero **leads do formulário serem enviados automaticamente para o Clint CRM com campos e tags padronizadas**, para **o corretor atender rápido e medir conversão por origem**.

**Acceptance Criteria:**
1. Decisão de CRM fechada como **Clint CRM** (vertical brasileiro especializado em corretoras de seguros — decisão Story 1.0; spike técnico API Clint planejado em Story 1.0c). Documentado em `docs/decisions/adr-002-crm-adapter.md` (status: Updated — ClintAdapter primária; RDStationAdapter / HubSpotAdapter / PipedriveAdapter como backups futuros)
2. Adapter pattern implementado em `src/lib/crm/` (`CRMAdapter` interface + `ClintAdapter` como implementação primária — preserva flexibilidade de troca futura, mas Clint é a implementação primária do MVP). Factory `src/lib/crm/index.ts` aceita `CRM_PROVIDER=clint`
3. Next.js API Route `/api/lead` (Edge Runtime) recebe payload, valida (zod), envia ao Clint via API REST
4. Campos enviados: dados do form + dados enriquecidos do CNPJ + metadata de origem (página, query, referrer, utm_*) + timestamp + versão da política de privacidade aceita
5. Tags no Clint: `plano-amil-empresarial`, porte (`porte-2-10`, `porte-11-30`, etc.), origem (`source-organic`, `source-whatsapp`, `source-direct`), CNAE quando disponível (tags exatas alinhadas com Adendum 3 da Story 1.0 — confirmar com stakeholder no spike Story 1.0c)
6. Fallback: se Clint falhar, lead é persistido em fila (Upstash Redis com retry exponencial via Vercel Cron) e re-tentado, além de envio de e-mail de alerta ao corretor
7. Leads duplicados (mesmo CNPJ nos últimos 7 dias) marcados como "repeat lead" no Clint, não criam duplicatas
8. Webhook Clint opcional para sincronizar status ("cotação enviada", "contratado", "perdido") de volta para analytics
9. Teste integration: mock Clint API + submissão form + verificação de payload correto

### Story 4.4: Botão WhatsApp Flutuante Contextual
Como **decisor pesquisando no mobile**, quero **clique rápido no WhatsApp com mensagem já escrita sobre o artigo que estou lendo**, para **iniciar conversa sem pensar muito**.

**Acceptance Criteria:**
1. Componente `<WhatsAppButton />` flutuante presente em todas as páginas (exceto legal)
2. Posição: canto inferior direito em desktop, rodapé bar em mobile
3. Deep link WhatsApp com mensagem pré-preenchida contextual ao conteúdo da página (ex: em cornerstone de "carência", mensagem "Olá, li seu artigo sobre carência Amil e gostaria de uma cotação para minha empresa")
4. Número WhatsApp configurado via env variable `WHATSAPP_NUMBER=5511926510515` (Agnaldo Silva — formato E.164 conforme Story 1.0 Bloco 1.5)
5. Clique dispara evento GA4 `whatsapp_click` com label = página de origem
6. Animação de entrada suave (fade-in após 3s de permanência na página) para não ser intrusivo
7. Acessível: aria-label, foco por teclado, contraste adequado
8. Respeita consent LGPD (só dispara analytics se consent dado)
9. Mobile: botão aparece como sticky bottom bar "Falar no WhatsApp" com ícone
10. Desktop: FAB circular com ícone + tooltip "Falar no WhatsApp"

### Story 4.5: Tracking de Funil de Conversão
Como **@pm**, quero **visão clara do funil (visitante → viewer de CTA → form start → form complete → lead CRM → cotação → contrato)**, para **otimizar cada etapa baseado em dados**.

**Acceptance Criteria:**
1. Eventos GA4 configurados: `page_view`, `scroll_50`, `scroll_75`, `cta_view` (CTA no viewport), `cta_click`, `form_start`, `form_field_filled`, `form_submit_success`, `form_submit_error`, `whatsapp_click`, `phone_click` (se houver), `download_contract_template`
2. Eventos com parâmetros ricos: source page, section, persona (se identificável), CNAE (se preenchido)
3. Conversion funnel report configurado no GA4 mostrando cada etapa com taxa de conversão
4. Looker Studio (ou GA4 Explore) dashboard com KPIs do PRD
5. Integração UTM em todos os CTAs e botões (permite atribuição precisa de campanha)
6. Sessões identificadas com CRM lead_id quando há conversão (via Measurement Protocol server-side GA4)
7. Dashboard acessível ao @pm e stakeholder via link permanente

### Story 4.6: Anti-Spam e Segurança do Formulário
Como **@dev**, quero **formulário resistente a bots e scripts de spam**, para **evitar que o CRM seja poluído e o corretor perca tempo com leads falsos**.

**Acceptance Criteria:**
1. Cloudflare Turnstile integrado (alternativa gratuita ao reCAPTCHA) com token validado server-side antes de processar lead
2. Honeypot field invisível (nome como "website") — preenchido = bot, lead descartado silenciosamente
3. Rate limiting por IP: máximo 3 submissões/hora (`@upstash/ratelimit` no Next.js API Route)
4. Validação server-side completa (não confiar em validação client)
5. Lista de e-mails domínios bloqueados (configurable em env): tempmail, 10minutemail, etc.
6. Normalização de CNPJ (apenas dígitos) para detectar duplicatas
7. Logs estruturados de tentativas bloqueadas para análise
8. Alertas para @pm se volume de tentativas bloqueadas subir >5x da média (possível ataque)
9. Teste integration simulando bot (preenchimento < 2s ou honeypot preenchido) — lead rejeitado

---

## Epic 5: Programmatic SEO — Matrix CNAE × Cidade + Reaproveitamento Clone

**Goal:** Gerar e publicar **600+ landing pages programáticas** combinando 30 CNAEs × 20 cidades × 2–3 portes (matriz principal) **+ 742 páginas-cidade simples reaproveitadas do clone Bradesco com strip→Amil** (Story 5.0 nova v1.2.2), totalizando ~1.342 URLs programmatic core, cada uma com conteúdo único suficiente para não ser classificada como "thin content" pelo Helpful Content Update, dominando o território de long-tail onde nenhum concorrente tem presença. Este é o maior epic em volume de trabalho, mas o mais impactante em ROI de tráfego.

### Story 5.0: Reaproveitar 742 Páginas-Cidade Simples do Clone com Strip Bradesco→Amil
Como **@dev** e **@data-engineer**, quero **reaproveitar a estrutura de 742 páginas-cidade simples herdadas do clone Bradesco (estilo `/plano-saude-[cidade]`) com strip total de conteúdo Bradesco e aplicação de conteúdo Amil**, para **maximizar volume SEO desde o Wave 1 sem custo editorial adicional**.

**Acceptance Criteria:**
1. Identificar 742 rotas de páginas-cidade simples no fork do clone (em `src/app/(marketing)/[slug]/page.tsx` ou similar)
2. Script de transformação `scripts/transform-cidades.mjs` que:
   - Substitui menções "Bradesco" → "Amil" no conteúdo (template-based)
   - Atualiza tabelas de preço para a estrutura `tabelas-amil.ts`
   - Atualiza schema LocalBusiness para usar dados ANS Amil (registro 326305)
   - Atualiza CTA para WhatsApp do corretor + form de cotação Amil
3. Cada página resultante tem ≥600 palavras de conteúdo Amil (validar via Copyscape antes de publicar)
4. Schema markup atualizado: HealthInsurancePlan + Organization + LocalBusiness
5. URLs preservadas onde fizer sentido (ex: `/plano-saude-belo-horizonte`) ou redirect 301 quando renomeadas
6. Auditoria: `grep -ri "Bradesco" src/app/` retorna 0 matches
7. Wave 1 adiciona ~742 URLs de páginas-cidade simples ao volume programmatic principal (matriz CNAE×cidade×porte)

### Story 5.1: Keyword Research Formal + Priorização da Matriz
Como **@pm**, quero **planilha validada com Ahrefs/Semrush dos 600+ combinações CNAE × cidade × porte com volume, KD e priorização**, para **ter base empírica para publicar em ordem de maior ROI**.

**Acceptance Criteria:**
1. Deep Research Prompt executado (ver `keyword-strategy-research-prompt.md`) em Ahrefs ou Semrush
2. Planilha `docs/seo/programmatic-keywords.csv` publicada com todas as 600+ combinações + volume, KD, CPC, SERP features, top 3 domínios, oportunidade score (1-10)
3. Priorização em 3 waves: Wave 1 (top 100 — volume >200 e KD <25), Wave 2 (próximas 200), Wave 3 (restante)
4. Para cada combinação: title, meta description, H1, slogan, intent mapeado, CTA recomendado
5. Validação: volume agregado ≥15K/mês (sanity check vs. market research)
6. Verificação de canibalização: nenhuma landing programática ataca keyword já atacada por cornerstone
7. Blacklist de combinações inviáveis (CNAE irrelevante para cidade, por exemplo)

### Story 5.2: Template de Landing Programática
Como **@dev** e **@ux-design-expert**, quero **template dinâmico `ProgrammaticLayout.tsx` que gere 600+ páginas únicas a partir de dados estruturados**, para **publicação em escala sem perda de qualidade**.

**Acceptance Criteria:**
1. Layout `ProgrammaticLayout.tsx` (Next.js 14 RSC + `generateStaticParams`) com: hero (H1 dinâmico contextualizado, breadcrumbs), seção 1 "Sobre Amil empresarial para [CNAE]" (400 palavras customizáveis por CNAE), seção 2 "Rede credenciada em [cidade]" (300 palavras + lista real), seção 3 "Tabela de preços para [porte]" (200 palavras + PriceTable filtrada), seção 4 FAQs específicas (5 Q&A por combinação), CTA formulário, rodapé com disclaimers
2. Conteúdo mínimo por página: 800 palavras únicas (variação contextual evita thin content)
3. Schema markup: HealthInsurancePlan + Organization + LocalBusiness + BreadcrumbList + FAQPage
4. URLs seguindo padrão: `/plano-amil/[cidade-slug]/[cnae-slug]/[porte-slug]` (ex: `/plano-amil/sao-paulo/clinica-medica/30-vidas`)
5. Canonical tags corretos (cada URL é canônica de si mesma)
6. Geração em build time (SSG puro via `next build` — zero custo runtime)
7. Preview local funcionando com `next dev`
8. Lighthouse ≥95 no template
9. Acessibilidade WCAG AA

### Story 5.3: Wave 1 — Primeiras 100 Páginas Programáticas
Como **@pm**, quero **as 100 combinações de maior ROI publicadas em batch inicial**, para **capturar tráfego logo e validar a hipótese de volume antes de escalar para 600**.

**Acceptance Criteria:**
1. Arquivo `src/content/programmatic/wave-1.csv` com 100 combinações selecionadas da Story 5.1
2. Para cada combinação: conteúdo contextual redigido (CNAE-specific insights de 400 palavras, cidade-specific rede de 300 palavras, porte-specific pricing 200 palavras)
3. Conteúdo passa por Copyscape (originalidade) + revisão do corretor + revisão jurídica
4. Build gera 100 páginas programáticas, cada uma com URL única, meta tags únicas, conteúdo único
5. Sitemap.xml atualizado automaticamente incluindo todas as novas URLs
6. Submissão manual das URLs top 10 no Google Search Console (indexação rápida)
7. Lighthouse ≥95 em amostra de 10 páginas aleatórias
8. Nenhum erro 404 ou soft 404 em indexação
9. Monitoramento de indexação nas primeiras 4 semanas após publicação

### Story 5.4: Wave 2 — Próximas 200 Páginas + Otimização baseada em Wave 1
Como **@pm**, quero **Wave 2 de 200 páginas publicadas com ajustes do que funcionou em Wave 1**, para **maximizar eficácia editorial baseada em dados reais**.

**Acceptance Criteria:**
1. Análise de Wave 1: quais páginas indexaram rápido, quais estão rankeando, quais tiveram pageviews >0 em 30 dias
2. Ajustes no template ou conteúdo base baseados em insights (ex: se páginas de CNAE "advocacia" converteram 3x, priorizar mais CNAEs jurídicos)
3. 200 novas páginas publicadas seguindo mesmo processo da Wave 1
4. Sitemap atualizado, submissão no GSC
5. Documentação dos aprendizados em `docs/seo/programmatic-learnings.md`

### Story 5.5: Wave 3 — Páginas Restantes (até 600+ total)
Como **@pm**, quero **matriz completa publicada em M6**, para **ter escala de tráfego long-tail no roadmap de ROI do Ano 1**.

**Acceptance Criteria:**
1. Todas as combinações restantes da Story 5.1 publicadas (300+ páginas adicionais)
2. Sistema de monitoramento de indexação automatizado (API GSC ou scraping sitemap status)
3. Alertas em caso de >10% de páginas com erro de indexação
4. Processo mensal de revisão de páginas programáticas underperforming (pageviews = 0 em 90 dias → revisão ou unpublish)

### Story 5.6: Internal Linking Automatizado
Como **@seo**, quero **interlinking inteligente entre landing programáticas + cornerstones + pillar**, para **distribuir autoridade e ajudar Google a descobrir/indexar páginas**.

**Acceptance Criteria:**
1. Lógica de linking: cada landing programática linka para (a) pillar page, (b) 2–3 cornerstones relacionados (mesmo CNAE ou mesmo porte), (c) 3 landings "irmãs" (mesmo cidade OR mesmo CNAE)
2. Links contextuais (não apenas "veja também") integrados no conteúdo
3. Validação automática: nenhum link quebrado (404), nenhum link para URL não-canônica
4. Cornerstones e pillar também linkam para landings programáticas relevantes quando mencionados (ex: pillar cita "empresas de tecnologia" → linka para landing `/plano-amil/[cidade]/empresa-de-ti/...`)
5. Teste de crawl simulado (Screaming Frog ou similar) confirma distribuição de link equity

---

## Epic 6: Price Intelligence & Calculator

**Goal:** Entregar suite de ferramentas que **nenhum concorrente oferece** — tabela de preços 2026 atualizada mensalmente com changelog, calculadora de coparticipação inline com PDF exportável, rede credenciada filtrável, e biblioteca gratuita de contratos. Este epic é o principal **moat de conversão** — decisor sai do site com informação que ele não conseguiria em nenhum outro lugar, o que aumenta taxa de conversão e justifica a autoridade editorial.

### Story 6.1: Componente PriceTable + PrecoSobConsulta com Sanity-backed Data
Como **decisor**, quero **ver tabela de preços real por faixa etária × produto × coparticipação**, para **estimar custo sem precisar solicitar cotação primeiro**.

**Acceptance Criteria:**
1. Componente `<PriceTable />` (React Client Component) com filtros: **produto (Bronze, Bronze Mais, Prata, Ouro, Platinum, Platinum Mais — com acomodação QC/QP quando aplicável)**, estado (14 estados cobertos em `tabelas-amil.ts` + 6 a definir), coparticipação (30% ou 40% conforme estado), faixa etária (10 faixas ANS reais 00-18 → 59+)
2. Dados em `data/tabelas-amil.ts` versionado em git (source of truth) + Sanity v3 para conteúdo editorial associado (legendas, notas regulatórias) — atualização mensal pelo corretor via commit ou Sanity studio
3. Tabela responsiva: desktop = grid, mobile = cards empilhados
4. Legenda clara: "Valores mensais por vida, tabela Amil PME Abril/2026, exceto MEI; sujeitos a análise contratual da operadora"
5. Badge "Atualizado em [mês/ano]" com data do último commit ao dataset
6. Link para changelog histórico dos reajustes
7. Export para PDF da tabela filtrada (botão "Baixar tabela")
8. Schema markup: `Product` + `Offer` com `priceSpecification` para os 6 produtos com tabela pública
9. Disclaimer ANS inline no componente (`<Disclaimer type="ans-valores" />`)
10. **Componente `<PrecoSobConsulta produto="black|amil-one-s2500|amil-one-s6500|amil-s580" />`**:
    - Exibido em todas as páginas dos 4 produtos premium sem tabela pública (Black, Amil One S2500, Amil One S6500 Black, Amil S580)
    - Badge visual: "Cotação personalizada"
    - Headline: "Cotação personalizada para empresas de alto padrão"
    - CTA WhatsApp contextual com mensagem pré-preenchida pelo produto
    - Texto explicativo: "Este produto tem precificação por análise específica do perfil empresarial. Solicite cotação."
    - Schema `Product` sem `Offer.price` (válido — Google aceita "POA" / "Sob consulta")

### Story 6.2: Página Dedicada "Tabela de Preços 2026"
Como **decisor que busca "tabela amil 2026"**, quero **página dedicada com todas as tabelas + changelog**, para **ter autoridade única no nicho que ranqueia top 3**.

**Acceptance Criteria:**
1. Página `/tabela-precos-amil-2026` com PriceTable full-featured
2. Conteúdo editorial acompanhando tabela: explicação de como ler, fatores que afetam preço, exemplos práticos (≥800 palavras)
3. Changelog visível listando cada atualização mensal com data + resumo da mudança
4. CTA calculadora ("Simule o custo total para sua empresa") + CTA WhatsApp + CTA formulário
5. Schema markup rich (Product, Offer, FAQPage para FAQs no rodapé)
6. Atualização mensal obrigatória (Story 6.6 processo)
7. Target keyword "tabela amil empresarial 2026" + variações

### Story 6.3: Calculadora de Coparticipação — Versão Base
Como **decisor**, quero **simular o custo total da minha empresa com coparticipação por 12/24/36 meses**, para **decidir com projeção real, não só preço de tabela**.

> **⚠️ DEPENDS ON (REC-3 pós-validação @po):** **Story 6.7 (Validação Atuarial da Calculadora) é PREREQUISITE obrigatório desta story.** A fórmula matemática validada por pessoa com background atuarial deve estar aprovada e arquivada em `docs/decisions/adr-003-calculator-formula.md` ANTES de iniciar a implementação. Implementar sem fórmula validada gera retrabalho certo. Sequência correta do Epic 6: 6.1 → 6.2 → **6.7 (validação)** → **6.3 (implementação)** → 6.4 → 6.5 → 6.6 → 6.8.

**Acceptance Criteria:**
1. Story 6.7 (validação atuarial) concluída e ADR-003 arquivado antes desta story começar
2. Componente `<Calculator />` (React island) em 2 steps
3. Step 1 — Inputs: número de vidas, distribuição de faixas etárias (10 faixas ANS reais 00-18 → 59+), produto selecionado (Bronze, Bronze Mais, Prata, Ouro, Platinum, Platinum Mais — com acomodação QC/QP), percentual de coparticipação (30% ou 40% conforme estado), sinistralidade estimada (slider baixa/média/alta)
4. Step 2 — Output: gráfico de barras (mensal × custo empresa + custo colaborador), tabela mês-a-mês, totais anuais e 3-year, comparação "com vs sem coparticipação"
5. Botão "Exportar PDF" gera PDF com gráfico + dados + logo + disclaimer
6. Botão "Salvar e receber por e-mail" (coleta e-mail + envia + cria lead no CRM tagged "calculator_lead")
7. Cálculo executado server-side (edge function) para proteger fórmulas atuariais
8. Modelo matemático exatamente conforme ADR-003 (Story 6.7) — qualquer desvio requer re-validação
9. Disclaimer clara: "estimativa, valores reais dependem de sinistralidade efetiva e variação contratual"
10. Analytics: eventos `calculator_start`, `calculator_step2`, `calculator_export_pdf`, `calculator_save_email`
11. Lighthouse ≥90 (JS pesado pode reduzir ligeiramente) — CWV "Good"

### Story 6.4: Página Dedicada "Calculadora Coparticipação"
Como **decisor procurando ferramenta de simulação**, quero **página dedicada à calculadora**, para **encontrar via busca e compartilhar com sócios**.

**Acceptance Criteria:**
1. Página `/calculadora-coparticipacao-amil` com `<Calculator />` em destaque
2. Conteúdo editorial: como interpretar resultados, o que é coparticipação, cenários comuns (≥600 palavras)
3. Shareable URL com parâmetros de simulação (ex: `/calculadora?vidas=30&produto=prata-qc&copart=30`)
4. Schema markup: SoftwareApplication ou WebApplication
5. CTAs: salvar simulação, compartilhar link, solicitar cotação real
6. Landing específica para "calculadora coparticipação amil"

### Story 6.5: ~~Rede Credenciada — Pipeline Completo + 5 Ataques SEO~~ → **MOVIDA PARA EPIC 7 em v1.2.4**

> **v1.2.4 (SCP v1.2.3):** Esta story foi recalibrada e movida para Epic 7 — "Programmatic SEO Rede Credenciada Amil". Razão: dataset evoluiu de 2.071 prestadores para 9.325 (4,5×); Epic 6 perdia foco como "ferramentas de moat"; Epic 7 separa concerns (tools vs SEO programmatic). Ver `docs/sprint-change-proposal-v1.2.3.md` §3.3 para justificativa do split.
>
> **Substituída por:** Stories 7.0a, 7.0b, 7.0c, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10 — totalizando 13 stories.
>
> Conteúdo original abaixo preservado para audit trail; **NÃO usar como referência operacional** — fonte de verdade é Epic 7.

#### [ARQUIVADO — original v1.2.2] Story 6.5: Rede Credenciada — Pipeline Completo + 5 Ataques SEO

Como **decisor avaliando cobertura regional** e **@pm**, quero **rede credenciada Amil totalmente integrada ao site com 5 ataques SEO simultâneos gerando ~3.500-4.500 URLs SEO indexáveis**, para **dominar long-tail "hospital amil [cidade]" / "[bairro]" / "[especialidade]" e construir moat competitivo (concorrentes não cobrem 1/3 desse volume com schema rich)**.

**Pré-requisitos:**
- Dataset oficial em `data/rede-credenciada/rede-credenciada.json` (978 KB · 2.071 prestadores · 23 UFs · 14 colunas)
- Loader funcional em `data/rede-credenciada/rede-amil.ts` (13 helpers + cache em memória)
- Pipeline scraping reproduzível (`scrape_powerbi_amil.js`) — fonte primária no hub `planodesaudepj`

**Acceptance Criteria — 5 Ataques SEO:**

**Ataque 1 — Hub busca filtrável:**
1. Página `/rede-credenciada` com filtros (UF, município, tipo, produto, query textual)
2. Component `<NetworkSearch />` (Client Component com cache em memória)
3. Mapa Leaflet (gratuito) com pins por município (não por prestador — sem coordenadas)

**Ataque 2 — Páginas-prestador individuais (2.071 URLs):**
4. Rota `/rede/[uf]/[municipio]/[prestador-slug]` gerada via SSG (`generateStaticParams`)
5. Cada página: nome + bairro + município + UF + tipo inferido + lista de produtos aceitos + CTA WhatsApp + disclaimer ANS
6. Schema markup: `LocalBusiness` ou subclasse específica conforme tipo (Hospital/MedicalClinic/MedicalLaboratory/EmergencyService/etc.)

**Ataque 3 — Páginas por município (~300-500 URLs):**
7. Rota `/rede/[uf]/[municipio]` agregada com lista filtrável + estatísticas + bairros mais cobertos

**Ataque 4 — Páginas por bairro (~800-1500 URLs):**
8. Rota `/rede/[uf]/[municipio]/[bairro]` (hyper-long-tail — concorrentes não cobrem)

**Ataque 5 — Páginas por tipo (~200-400 URLs) e por produto×UF (230 URLs):**
9. Rota `/[tipo]/[uf]/[municipio]` (ex: `/hospital/sp/sao-paulo`)
10. Rota `/rede/[rede-slug]/[uf]` (ex: `/rede/platinum-mais/sp`)

**Compliance:**
11. Disclaimer obrigatório em todas as páginas: "Rede sujeita a alterações pela operadora. Confirmar via app oficial Amil antes de uso. Última atualização: [DATA]."
12. Link discreto "Ver versão oficial Amil"
13. Sem uso de logotipo Amil (apenas texto)

**Performance:**
14. Build SSG de 5.000+ páginas em <15min no Vercel (validar em Story 1.4 canary)
15. Cache em memória do loader funciona em build-time (sem chamadas runtime)
16. Lighthouse ≥92 em amostra de 10 páginas-prestador aleatórias
17. Atualização mensal via Story 6.6 não invalida cache (revalidate ISR)

### Story 6.6: Pipeline Mensal de Atualização — Tabelas (Rede Credenciada movida para Epic 7)

> **v1.2.4 (SCP v1.2.3):** Pipeline de rede credenciada movido para **Story 7.10** (Epic 7). Esta Story 6.6 fica reduzida ao escopo de **tabelas de preço Amil PME apenas** — pipeline manual via stakeholder editando `data/tabelas-amil.ts` (até Amil oferecer feed estruturado).
>
> Conteúdo original abaixo preservado para audit trail.

#### [ARQUIVADO parcial — original v1.2.2 cobria 2 datasets] Story 6.6: Pipeline Mensal de Atualização — Tabelas + Rede Credenciada

Como **@pm**, quero **processo automatizado de atualização mensal cobrindo (a) tabelas de preço Amil PME e (b) rede credenciada Amil**, para **garantir freshness real, consistente e indexada como sinal SEO**.

**Acceptance Criteria:**
1. SOP unificado em `docs/editorial/monthly-update.md`
2. Pipeline rede credenciada: `scrape_powerbi_amil.js` (Playwright) executado dia 1 de cada mês via cron Vercel + GitHub Action — gera novo `rede-credenciada.json`
3. Pipeline tabela preço: stakeholder edita `data/tabelas-amil.ts` manualmente (até Amil oferecer feed estruturado)
4. Validação automática: comparar dados novos vs antigos, alertar se mudança >20% em qualquer campo (anomalia)
5. Notificação Slack/WhatsApp ao corretor para validar antes de publicar
6. Commit Conventional: `feat(data): atualiza rede credenciada Amil [Mês]/2026` + `feat(data): atualiza tabela preço Amil [Mês]/2026`
7. Vercel detecta push e re-renderiza páginas SSG/ISR automaticamente
8. Sitemap atualizado, novas URLs submetidas ao Google Search Console
9. Changelog público em `/tabela-precos-amil-2026/changelog` e `/rede-credenciada/changelog` (data + resumo)

### Story 6.7: Validação Atuarial da Calculadora (PREREQUISITE da Story 6.3)
Como **stakeholder**, quero **validação formal de que o modelo de cálculo da calculadora é realisticamente preciso**, para **não gerar expectativa errada no decisor**.

> **⚠️ SEQUENCING (REC-3 pós-validação @po):** Apesar do número 6.7, esta story **DEVE ser executada ANTES da Story 6.3** (implementação da calculadora). Implementar sem fórmula validada gera retrabalho certo. Sequência correta do Epic 6: **6.1 → 6.2 → 6.7 → 6.3 → 6.4 → 6.5 → 6.6 → 6.8**. Numbering preservado para estabilidade de referências; sequência de execução inverte 6.3 ↔ 6.7.

**Acceptance Criteria:**
1. Documento `docs/decisions/adr-003-calculator-formula.md` com fórmulas matemáticas completas
2. Revisão por pessoa com background atuarial (corretor com experiência ou consultor externo) — assinatura no documento
3. Testes unitários cobrindo: 5 cenários canônicos (pequeno/médio/grande porte × com/sem coparticipação)
4. Tolerância de erro documentada (ex: ±10% do valor real esperado considerando sinistralidade estimada)
5. Disclaimer da calculadora alinhado com tolerância real
6. Plano de re-validação anual (após reajustes maiores)
7. ADR-003 aprovado e arquivado antes de Story 6.3 iniciar

### Story 6.8: Biblioteca de Contratos-Modelo (Lead Magnet)
Como **decisor estudando opções**, quero **modelos de contratos e formulários gratuitos**, para **antecipar documentação e ceder contato voluntariamente**.

**Acceptance Criteria:**
1. Página `/biblioteca-contratos` com lista de documentos: aditivo de inclusão, carta de portabilidade, formulário de cancelamento, planilha de custo total, checklist de documentação
2. Cada documento gated por e-mail corporativo (LGPD-compliant, consent explícito)
3. E-mail envia PDF + adiciona pessoa ao CRM tagged "biblioteca_download"
4. Documentos revisados por advogado
5. Atualização semestral (ou quando houver mudança regulatória) — changelog visível
6. Versões baixadas indicadas ("v2.1 — atualizado em abril 2026")
7. Schema markup: DigitalDocument por item
8. CTA após download: "Quer orientação para preencher? Fale no WhatsApp"

---

## Epic 7: Programmatic SEO — Rede Credenciada Amil (NOVO v1.2.4)

**Goal:** Indexar **~10.500 URLs SEO** da rede credenciada Amil em 6 ataques simultâneos (hub + páginas-prestador + cidade + bairro + Cluster E rede × UF + tipo × UF × município) baseado em dataset oficial de 9.325 prestadores em 26 UFs e 438 municípios. Construir moat competitivo via **volume + schema rich (MedicalOrganization + HealthInsurancePlan + ItemList) + freshness mensal automatizada** — concorrentes Tier B do `competitor-analysis.md` não cobrem 1/3 desse volume com schema. Detalhes consolidados em `docs/sprint-change-proposal-v1.2.3.md`.

**Pré-requisitos Epic 7:**
- Stories 1.0-1.4 (foundation) concluídas — `src/` existe via fork
- Story 2.4 deliverable em progresso (advogado revisor disponível para ADR-006)
- Memória `project_amil_rede_credenciada_powerbi.md` registra pipeline scraper reproduzível em `planodesaudepj` (ADR-007 SSOT)

### Story 7.0a: Pre-flight — gap 11 vs 49 redes do dataset (XS, 1d)

Como **@architect (Aria)** quero **validar se as 38 redes restantes do header `dataset.redes[]` foram capturadas incompletamente OU são metadados sem prestadores associados**, para **decidir GO/HOLD em Story 7.7 (Cluster E rede × UF SSG)**.

**Acceptance Criteria:**
1. Rodar `scrape_powerbi_amil.js` (verbose) e enumerar set-difference entre `dataset.prestadores[].redes` e `dataset.redes[]`
2. Documentar achado em `docs/decisions/network-coverage-2026-04.md`
3. Output 1 (38 são metadados): GO Story 7.7 com 11 URLs Cluster E (1 por rede ativa)
4. Output 2 (38 têm prestadores não capturados): HOLD Story 7.7 + criar Story 7.0a-bis para rerun do scraper
5. Cross-reference 11 redes ativas ↔ 6 segmentações Bronze→Platinum Mais da `data/tabelas-amil.ts` — documentar mapeamento ou flag faltante

**Bloqueia:** Story 7.7. Não bloqueia outras.

### Story 7.0b: Decisão SSOT do dataset — Hub é canon (XS, 0,5d)

Como **@aios-master (Orion)** quero **ADR-007 publicado e Story 7.10 ACs alinhadas com decisão "hub canon, mirror via cron"**, para **eliminar drift entre `planodesaudepj` e `planoamilempresas`**.

**Acceptance Criteria:**
1. ADR-007 publicado com Status: Accepted (já feito no SCP v1.2.3)
2. `data/rede-credenciada/README.md` atualizado removendo ambiguidade de SSOT (linhas 86-90)
3. Story 7.10 ACs explicitam canon → mirror → snapshot → diff → notify

**Bloqueia:** Story 7.10. Não bloqueia outras.

### Story 7.0c: Decisão URL-as-trademark policy (XS, 1d + advogado loop)

Como **@architect (Aria) + advogado revisor** quero **ADR-006 com Status: Accepted (slugs canônicos + 5 mitigações)**, para **desbloquear Story 7.7 (Cluster E)**.

**Acceptance Criteria:**
1. ADR-006 publicado com Status: Proposed (já feito no SCP v1.2.3)
2. Advogado revisor (Story 2.4 deliverable) co-sign — Status: Accepted ou Rejected
3. Se Rejected: pivotar para Caminho C (slugs sem prefix "AMIL"); criar Story 7.0c-bis para refactor de slugs
4. Se Accepted: GO Story 7.7

**Bloqueia:** Story 7.7. Não bloqueia outras.

### Story 7.1: Schema + Loader Reescrito — Foundation Epic 7 (M, 4-5d)

Como **@dev (Dex)** quero **tipos novos + loader compatível com schema redesenhado do dataset (`prestadores[].redes: string[]`)**, para **que Stories 7.2-7.10 tenham fundação confiável e tipo-segura**.

**Acceptance Criteria:**
1. Novo `src/types/rede-credenciada-amil.ts` com `interface PrestadorAmil`, `interface DatasetRedeAmil`, type guard runtime
2. Novo `src/lib/operadoras/amil/rede-credenciada-loader.ts` com 13+ helpers (`getAllPrestadores`, `getMunicipios`, `getMunicipioBySlug`, `getPrestadoresPorMunicipio`, `getPrestadoresPorBairro`, `getMunicipiosByUf`, `getTopMunicipios`, `getBairrosDoMunicipio`, `getPrestadoresPorRede`, `getPrestadoresPorTipo`, `getEstatisticasRede`, `getEstatisticasByUF`, `prestadorSlug`)
3. `inferTipoAtendimento(nome)` regex helper (8 categorias)
4. Cache em memória (Map) construído no boot; sem chamadas runtime
5. Deprecar `data/rede-credenciada/rede-amil.ts` (header `@deprecated`)
6. Tests unitários Vitest (slug determinístico, filtros, estatísticas — validar `totalPrestadores === 9325`)
7. Imports absolutos `@/types/...` `@/lib/...` (NFR14 + code-standards.md)
8. `pnpm build` passa sem erro TypeScript
9. NFR8 enforcement: zero literal "Bradesco" em código novo

**Bloqueia:** Stories 7.2-7.10 (todas).

### Story 7.2: Hub `/rede-credenciada` + `<NetworkSearch />` — Ataque 1 (M, 4-5d)

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.2.** Resumo: rota `app/(marketing)/rede-credenciada/page.tsx` (RSC + ISR 7d); component Client com MiniSearch index; filtros progressivos; FAQPage schema; stats dataset-driven; LCP ≤2.0s.

**Bloqueado por:** 7.1.

### Story 7.3: Templates Editoriais por Tipo (M, 5-7d)

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.3.** Resumo: 4 templates (Hospital/Lab/Clínica/Outro) ≥600 palavras; variação contextual; CTA WhatsApp + disclaimer.

**Bloqueado por:** 7.1.

### Story 7.4: Páginas-prestador SSG por Chunking (L, 6-8d)

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.4.** Resumo: 9.325 páginas via SSG chunking (Sudeste primeiro = 7.166); schema MedicalOrganization subtipos; ISR 30d; noindex em prestador único quando município <5 prestadores.

**Bloqueado por:** 7.1, 7.3.

### Story 7.5: Páginas-cidade SSG (M, 4-5d)

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.5.** Resumo: 438 páginas; top-100 SSG full + cauda (~338) ISR 30d; ItemList schema; lista paginada.

**Bloqueado por:** 7.1, 7.3.

### Story 7.6: Páginas-bairro SSG Filtradas (M, 4-5d)

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.6.** Resumo: ~700-800 páginas (filtro ≥3 prestadores); long-tail moat; bairros 1-2 prestadores → noindex + canonical para cidade.

**Bloqueado por:** 7.1, 7.3.

### Story 7.7: Cluster E `/rede/[rede-slug]/[uf]` — High-Conversion (M, 4-5d) [GATED]

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.7.** Resumo: ~286 páginas rede × UF; HealthInsurancePlan + ItemList schema; 400 palavras editoriais; CTA cotação.

**Bloqueado por:** 7.0c (ADR-006 Accepted), 7.1, 7.3.

### Story 7.8: Páginas Tipo × UF × Município (S, 3d)

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.8.** Resumo: ~250-350 páginas (filtro ≥3 prestadores classificados); 8 tipos válidos; MedicalOrganization subtipo + ItemList.

**Bloqueado por:** 7.1, 7.3.

### Story 7.9: Schemas JSON-LD Aplicados Transversalmente (S, 3d)

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.9.** Resumo: `<NetworkSchemaJsonLd />` discriminated union; validação CI Schema.org + Google Rich Results; 100% cobertura.

**Bloqueado por:** 7.2 (qualquer outra também serve para começar; consolida ao final).

### Story 7.10: Pipeline Mensal Automatizado + SSOT (S, 3d)

**ACs detalhadas em `sprint-change-proposal-v1.2.3.md` §4.3 Story 7.10.** Resumo: GitHub Actions workflow (cron dia 1 mês 03:00 BRT); scraper hub canon → mirror site → snapshot mensal gz → diff alert → auto-PR/merge → Vercel deploy → ping GSC.

**Bloqueado por:** 7.1; depende externamente de `planodesaudepj` ter remote configurado (ver memory `project_planodesaudepj_pending_github.md`).

### Story 5.7 (REFERENCED): Auditoria de Conteúdo Wave 1+2 — AC nova v1.2.4

> **Nota Pax v1.2.4:** Story 5.7 é referenciada por ADR-005 + Story 7 mas não tem definição formal no PRD. Open Question — @sm criar Story 5.7 formal antes de Wave 1 deploy. AC nova adicionada via SCP v1.2.3:
>
> **AC nova:** Audit por **amostragem estratificada** (top-50 cidades + top-10 redes + 30 cidades mid-tier + 20 cidades cauda aleatória = ~110 páginas auditadas, representando ≥80% do tráfego potencial). Audit exhaustivo das 9.325 páginas-prestador é descartado por inviabilidade. Critério ≥600 palavras + variação contextual (≥8 interpolações nome+bairro+UF) verificado por amostragem. Resultado registrado em `docs/audit-content-rede-2026-MM.md` mensalmente.

---

## Estratégia de Ecossistema (Hub-and-Spoke) — NOVO v1.3

> **Referências canônicas:** `docs/ecosystem-link-strategy.md` (especificação completa) + ADR-009 (a publicar — Aria/Architect, ver Task #14) + `docs/decisions/adr-006-url-as-trademark-policy.md` (URL-as-Trademark, política de slugs).

### Visão Geral

`planoamilempresas.com.br` opera como **satélite especializado Amil PJ** dentro de um ecossistema digital da corretora BeneficioRH (Agnaldo Silva — SUSEP 201054484 — CNPJ 14.764.085/0001-99) estruturado em **hub-and-spoke**:

- **Hub master:** `planodesaudepj.com.br` (multi-operadora, 10 operadoras, 131 páginas, recebe backlinks orgânicos externos)
- **Satélites operadora-específicos:**
  - `bradescosaudeempresas.com.br` (Bradesco PJ — no ar)
  - `planoamilempresas.com.br` (**Amil PJ — Fase 1, escopo deste PRD**)
  - `planosaudeamil.com.br` (Amil amplo — Fase 2, ver seção próxima)

### Princípios

1. **Hub concentra autoridade:** investimento em backlinks foca o hub; satélites recebem juice via páginas `/operadoras/[op]/` no hub
2. **Satélites linkam de volta ao hub** via footer global + página `/sobre/`
3. **Diferenciação obrigatória:** cada satélite tem dataset, copy editorial e design próprios — NUNCA cookie-cutter cross-site (ver NFR25)
4. **Anti-PBN:** auditoria mensal de duplicate content cross-site por @qa (Quinn); anchor text natural; hosting distribuído via Cloudflare DNS
5. **Cross-domain canonical:** apenas onde há sobreposição real (ex: `/empresarial/` Fase 2 → canonical Fase 1, especialização vence)

### Implementações Requeridas neste PRD

- **FR48:** schema `Organization.parentOrganization` apontando para hub
- **FR49:** footer global cross-domain (`rel="me"`)
- **NFR24:** compliance cross-domain (CNPJ + SUSEP + disclaimer único)
- Story 1.5 / 1.7 ajustadas para entregar o footer global conforme snippet do `ecosystem-link-strategy.md` §5.1
- Story 4.7 (NOVA, opcional v1.3) — auditoria mensal de duplicate content cross-site via script `tools/cross-site-content-diff.mjs`

### KPIs do Ecossistema

> **Sem inventar % de conversão.** Conforme feedback `feedback_claims_metricas.md` em memória — preferir A/B test e honestidade. Indicadores qualitativos a monitorar pós-baseline: posições GSC por keyword core, páginas indexadas por site, backlinks externos genuínos (Ahrefs/SEMRush), CTR em SERPs, CWV, leads por satélite vs leads pelo hub, origem do lead. Definir baselines após 30 dias de cada lançamento.

### Anti-Padrão: Clone com Canonical Externo (learning amilsaudebr) — NOVO v1.3.1

`amilsaudebr.com.br` é um clone do master `onlineplanodesaude.com.br/amil-saude-2026.html` — declara `<link rel="canonical">` apontando para o domínio externo. Isso significa que `amilsaudebr.com.br` **renuncia explicitamente ao SEO em favor de outro domínio**, funcionando como sat-alias sem propósito (`docs/research/competitors/09-amilsaudebr-kitcorretor-deep-scrape.md` §1).

**Para o nosso ecossistema (Fase 1 + Fase 2 + futuros satélites):**
- Cada satélite tem **canonical próprio apontando para si mesmo** (self-canonical) — nunca para hub ou para outro satélite
- Diferenciação editorial real (NFR25) garante que cada domínio mereça indexação independente
- Cross-domain canonical é aceito **apenas em casos excepcionais e bilateralmente acordados** (ex: `/empresarial/` em Fase 2 → canonical Fase 1, onde a especialização vence — definido em ADR-009 quando publicado)
- Footer cross-domain (FR49) e `parentOrganization` schema (FR48) são os mecanismos legítimos de sinalização de portfolio — clones com canonical externo NÃO são

---

## Fase 2 Roadmap — `planosaudeamil.com.br` (OUT OF SCOPE MVP v1)

> **Status:** Roadmap futuro v2.x — **NÃO** faz parte do escopo do MVP da Fase 1 (`planoamilempresas.com.br`). Documentado aqui para alinhar visão de longo prazo, evitar débito arquitetural e permitir reuso planejado de componentes/datasets.

### Escopo Funcional Fase 2

`planosaudeamil.com.br` é o **satélite Amil amplo** complementar ao Fase 1:

| Dimensão | Fase 1 — `planoamilempresas.com.br` | Fase 2 — `planosaudeamil.com.br` |
|----------|--------------------------------------|----------------------------------|
| Público | Empresas (PJ) | PF + PJ + adesão + dental |
| Foco SEO | "amil empresarial", "amil PJ", "amil PME [cidade]" | "plano de saúde amil" (head), "amil [cidade]", "amil one", "amil black", "amil por adesão", "amil dental" |
| Produtos | 6 PME públicos + 4 premium "sob consulta" | Catálogo amplo: PJ + PF + adesão (`/planos/individual-por-adesao/` + `/planos/familiar-por-adesao/`) + dental |
| Concorrentes diretos | 16 do `competitor-analysis.md` Tier A-D | `planodesaudeamil.com.br`, `amilplanos.com.br` (research em `docs/research/competitors/`) |
| Domínio | Registrado | **A registrar — verificar disponibilidade Registro.br antes de iniciar Fase 2** |

### Stack Fase 2

**Idêntica à Fase 1** — Caminho C consolidado conforme `docs/decisions/adr-008-stack-unificada-nextjs-satelites-amil.md`:

- Next.js 16 App Router + React 19 + Tailwind CSS 4
- Sanity v3 (CMS headless)
- Vercel (hosting + edge)
- Cloudflare DNS
- Upstash Redis (rate limiting + cache)
- TypeScript strict + Vitest + Playwright

**Astro DESCARTADO** para os dois satélites Amil (ADR-008 Accepted 2026-04-28). Motivos resumidos: (1) custo cronograma +6-8 semanas reescrevendo ~14 componentes React maduros, (2) perda de Visual Editing nativo Sanity, (3) ganho de LCP marginal invisível ao público-alvo (vertical YMYL ranqueia por schema/E-E-A-T/conteúdo único, não CWV marginal). Memória `project_satelite_amil_astro.md` é histórica/superada.

### Estrutura — Fork da Fase 1

- **Repo:** novo repositório `planosaudeamil` forkado de `planoamilempresas` (semelhante ao fork original `bradescosaudeempresas` → `planoamilempresas` — Story 1.1 já validou o pattern)
- **Monorepo opcional v2.x:** se complexidade justificar, evoluir para layout `/apps/{planoamilempresas,planosaudeamil}` + `/packages/ui/` + `/packages/data/` (Turborepo). Decisão postergada para após MVP Fase 2 estabilizar
- **Reuso esperado: ~80% componentes** (calculadora, formulário, PriceTable, Disclaimer, ComplianceBadges, WhatsAppButton, QuoteForm, NetworkSearch, Footer global, Schema components)
- **Differenciador 20%:** city pages com hospitais REAIS por município (FR35), copy PF/adesão/dental específica, posicionamento head term mais agressivo

### Cronograma Estimado

- **Pré-requisito hard:** MVP Fase 1 (`planoamilempresas.com.br`) no ar e estável (≥30 dias com tráfego baseline)
- **Janela:** 8-10 semanas após go-live MVP Fase 1
- **Início estimado:** ~M3-M4 do roadmap Fase 1

### Posicionamento SEO Fase 2

Head + long-tail amplo Amil. Captura keywords não-PJ que Fase 1 não persegue (PF, adesão, dental, produtos premium individual). Anti-canibalização entre os dois satélites Amil resolvida por canonical cross-domain conforme `ecosystem-link-strategy.md` §3.3.

### Pré-Setup Fase 2 (Tarefas Não-Bloqueantes)

1. ⏳ Verificar disponibilidade `planosaudeamil.com.br` no Registro.br
2. ⏳ Registrar domínio se disponível (defensivo, antes de competidor capturar)
3. ⏳ Documentar dataset adicional necessário (catálogo PF + dental + adesão)
4. ⏳ Decidir se monorepo é introduzido na Fase 2 ou postergado para v2.x

### O Que NÃO Faz Parte do MVP v1 (anti-scope-creep)

Para clareza absoluta: **as Stories e ACs deste PRD cobrem APENAS `planoamilempresas.com.br` Fase 1**. Toda menção a `planosaudeamil.com.br` é roadmap futuro. Nenhum FR/NFR de Fase 2 deve inflar Stories de Epic 1-7. Fase 2 receberá PRD próprio (ou anexo a este PRD versão v2.0) quando entrar em planejamento ativo.

---

## Checklist Results Report

*Esta seção será populada após execução do `pm-checklist` por @po ou @aios-master. Placeholder atual:*

- [ ] Checklist PM-1: Goals alinhados com brief — Status: pendente execução
- [ ] Checklist PM-2: FRs e NFRs completos e testáveis — Status: pendente execução
- [ ] Checklist PM-3: UX Goals definidos — Status: pendente execução
- [ ] Checklist PM-4: Technical Assumptions documentadas — Status: pendente execução
- [ ] Checklist PM-5: Epics sequenciados logicamente — Status: pendente execução
- [ ] Checklist PM-6: Stories entregam valor vertical — Status: pendente execução
- [ ] Checklist PM-7: ACs testáveis e sem ambiguidade — Status: pendente execução
- [ ] Checklist PM-8: Cross-cutting concerns distribuídas — Status: pendente execução
- [ ] Checklist PM-9: Phase 2 claramente separada — Status: pendente execução
- [ ] Checklist PM-10: Próximos passos (UX + Architect prompts) prontos — Status: pendente execução

---

## Next Steps

### UX Expert Prompt

Uma (UX Design Expert ♓), você está recebendo o PRD de `planoamilempresas.com.br` — site de SEO agressivo para plano de saúde Amil empresarial operado por corretor autorizado.

Objetivo desta fase: criar **front-end specification** (`docs/front-end-spec.md`) com:

1. **Design system minimalista-editorial** (paleta `#0066B3` + `#00C389`, tipografia Inter/Manrope, 8px grid)
2. **Wireframes** das 8 telas-chave: Homepage, Pillar page, Cornerstone template, Programmatic landing template, Tabela de Preços, Calculadora, Sobre o Corretor, Formulário de cotação
3. **Fluxos de conversão**: (a) visitor → pillar → CTA → form, (b) visitor → cornerstone → WhatsApp, (c) visitor → calculadora → email capture → CRM
4. **Information Architecture** com silo topical (pillar → cornerstones → programmatic)
5. **Component library** específica: `<Disclaimer />`, `<ComplianceBadges />`, `<PriceTable />`, `<Calculator />`, `<QuoteForm />`, `<WhatsAppButton />`, `<FAQ />`
6. **Accessibility**: WCAG 2.1 AA compliance guide para implementação
7. **Mobile-first** com breakpoints 360/768/1024/1440

Prioridades: (1) E-E-A-T visível e sem intimidar, (2) mobile-first (sócio-fundador decide no celular), (3) inversão do ônus (site entrega valor antes de pedir contato), (4) velocidade perceptível (micro-interações que reforçam CWV excelentes).

Inputs: este PRD + `brief.md` + `brainstorming-session-results.md` (especialmente seção "Positioning" e "UVPs") + `market-research.md` (personas Segment 1 e Segment 2).

Após completar front-end-spec, handoff para @architect.

### Architect Prompt

Aria (Architect ♊), você está recebendo o PRD + (idealmente) front-end-spec da @ux-design-expert para `planoamilempresas.com.br`.

Objetivo desta fase: criar **fullstack architecture document** (`docs/architecture.md`) cobrindo:

1. **System architecture diagram** (Next.js 14 App Router SSG/ISR + Vercel + Sanity v3 + Upstash Redis + Clint CRM integration)
2. **Service decomposition**: Next.js API Routes (cnpj-lookup, lead-dispatch via Clint, calculator, price-sync, rede-credenciada), SSG pipeline (`generateStaticParams`), Sanity content delivery
3. **Data flow**: decisor PJ → browser → Next.js RSC page → Client island → API Route (Edge Runtime) → BrasilAPI / Clint / Upstash; calculadora: input → API Route → PDF gen → storage
4. **Content architecture**: Sanity v3 schemas + GROQ queries para cornerstone, pillar, blog, programmatic landing, FAQ, disclaimer, price table, network provider; ADR-001 fechado como Accepted (Sanity v3)
5. **SEO technical architecture**: schema.org strategy por template, sitemap dynamic, robots, canonical, interlinking rules
6. **Programmatic generation strategy**: build-time vs. on-demand, template system, variation logic para evitar duplicate content, URL structure
7. **Testing strategy**: Vitest unit, Playwright E2E, Lighthouse CI, axe accessibility, schema validator
8. **Observability stack**: logging (Vercel Logs), metrics (Vercel Analytics + GA4), errors (Sentry), RUM (Vercel Speed Insights + Web Vitals library)
9. **Security**: CSP nonces, rate limiting, anti-bot (Turnstile), secrets management, LGPD-compliant data retention, WAF rules
10. **Deployment**: GitHub Actions CI → Vercel GitHub Integration (main = production, PRs = preview) + rollback procedure (Vercel Instant Rollback + DNS TTL 300s para domínio-ponte)
11. **ADRs**: CMS choice, CRM adapter pattern, calculator formula validation, schema markup strategy, image optimization approach
12. **Non-functional constraints implementation**: como atingir Lighthouse ≥95, LCP <1.8s, CLS <0.05, INP <200ms em 95% das páginas

Prioridades: (1) JAMstack moderno via Next.js 14 RSC + SSG/ISR (maximizar CWV e segurança), (2) custo inicial baixo (Vercel Hobby + Sanity free + Upstash free aguentam MVP), (3) ADR pattern para decisões reversíveis (CRM Adapter especialmente — Clint é primária mas substituível), (4) observability desde dia 1 (não retrofit).

Inputs: este PRD + front-end-spec (quando pronto) + brief.md + competitor-analysis.md (seção "Technical Comparison").

Após completar architecture, handoff para @data-engineer (para schema detalhado do CMS + dados programmatic) e depois @sm para story creation.

---

## Open Questions — Critical Placeholders

> **✅ Status v1.2.2: TODOS OS 13 PLACEHOLDERS RESOLVIDOS** em sessão Story 1.0 (2026-04-24). Documento de referência: `docs/stakeholder-inputs.md` (aprovado pelo stakeholder Agnaldo Silva). Histórico abaixo preservado para auditoria.

| # | Placeholder original | Resolução |
|---|---|---|
| 1 | Nome + SUSEP do corretor | ✅ Agnaldo Silva, SUSEP 201054484 |
| 2 | Razão social + CNPJ corretora PJ | ✅ BeneficioRH Corretora de Seguros, 14.764.085/0001-99 |
| 3 | Validação contratual uso "Amil" no domínio | ✅ Risco aceito 🅲️ + 5 mitigações + ponte `planosaudeempresas.com.br` registrada |
| 4 | Top 20 cidades prioritárias | ✅ Lista MG-heavy aprovada (8 capitais + 3 SP + 9 MG) |
| 5 | Restrições Amil sobre produtos | ✅ Todos os produtos comercializados; 4 sob consulta (Black, Amil One S2500/S6500, Amil S580) |
| 6 | Decisão de CRM | ✅ **Clint CRM** (vertical brasileiro corretoras) |
| 7 | Decisão de CMS | ✅ **Sanity v3** (ADR-001 Accepted) |
| 8 | Nome + contato DPO | ✅ Agnaldo Silva (beneficiorh@gmail.com, 5511926510515) — DPO da BeneficioRH |
| 9 | Número WhatsApp Business | ✅ +55 11 92651-0515 (E.164: 5511926510515) |
| 10 | Aceite público | ✅ Aceite total + foto + bio + LinkedIn fornecidos |
| 11 | Logo Amil broker | ✅ Combo BeneficioRH + selo discreto "Corretor autorizado Amil" |
| 12 | Autorização cor `#0066B3` | ✅ Mantida (risco aceito; plano B `#004280` 1-line swap) |
| 13 | Direção de ilustrações | ✅ Stock editado unDraw/Storyset (R$ 0, paleta sincronizada) |

**Pendência menor não-bloqueante:** spike técnico API Clint (Story 1.0c) — coletar URL/doc/token (Adendum 3 do `stakeholder-inputs.md`).

---

**Status do documento:** **v1.3 — APPROVED PARA REVALIDAÇÃO @po** em 2026-04-28

**Histórico de versões:**
- v1.0 (2026-04-16): Draft inicial — Morgan (PM)
- v1.1 (2026-04-16): Correções @po — REC-1 (Story 1.0), REC-2 (front-end-spec prerequisite Epic 3), REC-3 (Story 6.3↔6.7 sequencing) — Pax (PO)
- v1.2 (2026-04-16): Pivot arquitetural Astro→Next.js via fork de clone pré-existente — 12 Edits aplicados conforme Sprint Change Proposal — Orion (Master) + Morgan (PM)
- v1.2.1 (2026-04-16): Refinamentos pós re-validação integrada PO (Story 1.0 AC1 expandida com items 1.11/1.12/1.13) — Pax (PO)
- v1.2.2 (2026-04-26): 11 correções pós conclusão Story 1.0 — nomenclatura produtos Bronze→Platinum Mais, CRM Clint, Sanity v3 fechado, Story 5.0 (742 cidades-clone), Story 1.2a (DNS ponte), Story 6.5 expandida (~3.500 URLs), Story 6.6 cobre 2 datasets, Story 6.1 PrecoSobConsulta, ADRs 001/002, 3 deliverables Story 2.4 — Morgan (PM)
- v1.2.3 (2026-04-26): Story 1.0c (Spike Clint API) adicionada pós Pax re-validação — Aria (Architect) + Pax (PO)
- v1.2.4 (2026-04-26): Recalibração rede credenciada (9.325 prestadores · 26 UFs); Epic 7 NOVO; Stories 6.5/6.6 movidas para Epic 7; ADR-005 v2 + ADR-006 + ADR-007 — Orion (Master) + Morgan (PM) + Pax (PO)
- v1.2.5 (2026-04-26): Story 1.1 CONCLUÍDA via Caminho A; Stack atualizada Next.js 16 + React 19 + Tailwind 4 + Sanity v5.17.1 — Orion (Master) + stakeholder
- **v1.3 (2026-04-28):** Atualização research-driven + ecosystem hub-and-spoke + Fase 2 roadmap. (1) FR31-FR49 + NFR21-NFR25 incorporando 13 acertos `planodesaudeamil.com.br` + 8 acertos `amilplanos.com.br` + anti-erros (schema 11 tipos, meta description dinâmica, H1 com qualifier, freshness selo topo, hospitais reais por município, FAQ schema sobre 45+ Q&A, simulador, comparador, calculadora carências, mapa, glossário, max 2 telefones, sub-pillars rede, `/preco/coparticipacao/`, blog 30+ on-topic ZERO off-topic, posts comparativos, sem slugs `-2`). (2) Nova seção **"Estratégia de Ecossistema"** referenciando ADR-009 + `docs/ecosystem-link-strategy.md`. (3) Nova seção **"Fase 2 Roadmap — `planosaudeamil.com.br`"** explicitamente OUT OF SCOPE MVP v1. (4) Caminho C consolidado: Astro descartado para AMBOS satélites Amil (ref. ADR-008 Accepted 2026-04-28). — Morgan (PM) + Aria (Architect, ADR-008/009)

**Placeholders:** ✅ TODOS OS 13 RESOLVIDOS em sessão Story 1.0 (2026-04-24) — ver `docs/stakeholder-inputs.md`
**Plano B documentado:** ~~Astro + Cloudflare (PRD v1.1)~~ — **OBSOLETO em v1.3.** Caminho C unificado Next.js consolidado (ADR-008). Não há plano B Astro ativo para nenhum satélite Amil.
**Owner atual:** aprovado para handoff paralelo + revalidação @po pendente

**Próximos owners (paralelo):**
- @po (Pax) — **REVALIDAÇÃO v1.3** focando nas adições: FR31-FR49, NFR21-NFR25, seção Ecossistema, seção Fase 2 Roadmap. Verificar consistência com Stories existentes (1.5/1.7 footer global, 5.0 city pages, Epic 7 schema). Estimativa ~45min.
- @ux-design-expert (Uma) — refresh do `front-end-spec.md` para incorporar componentes novos: simulador interativo (FR37), comparador (FR38), calculadora carências (FR39), mapa interativo (FR40), glossário (FR41), accordion FAQ schema-ready (FR36), `<PrecoSobConsulta />` já existente
- @architect (Aria) — finalizar **ADR-009** (estratégia de ecossistema) com Status Accepted + atualizar `architecture.md` para refletir cobertura schema 11 tipos (FR31), `parentOrganization` cross-domain (FR48), e auditoria anti-duplicate cross-site (NFR24)
- @sm (River) — avaliar criação de Stories novas:
  - Story 4.7 (auditoria duplicate cross-site mensal — NFR24/NFR25)
  - Story 6.9 (página `/preco/coparticipacao/` dedicada — FR45)
  - Story 6.10 (calculadora de carências — FR39)
  - Story 6.11 (comparador de planos — FR38)
  - Story 7.11 (mapa interativo Leaflet — FR40)
  - Story 3.20 (glossário `/glossario/` — FR41)
  - Story 3.21 (10+ posts comparativos cross-operadora — FR47)

**Handoff seguinte:** @sm (River) — story creation a partir do PRD v1.3 + ADR-008 + ADR-009 + `docs/ecosystem-link-strategy.md`

— Morgan (PM, v1.0–v1.3) · Pax (PO, v1.1, v1.2.1) · Orion (Master, v1.2, v1.2.4, v1.2.5) · Aria (Architect, v1.2.3, v1.3 ADRs)
