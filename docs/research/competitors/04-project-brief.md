# Project Brief — Satélite SEO Amil (Astro+Bun)

**Owner:** Agnaldo Silva (beneficiorh@gmail.com)
**Analista:** Atlas (@analyst)
**Data:** 2026-04-27
**Status:** Pronto para handoff a @pm (Morgan)

---

## 1. Visão de Produto

Site satélite SEO independente, especializado **100% no produto Amil** (PJ + PF), com missão de **ultrapassar amilplanos.com.br e planodesaudeamil.com.br** nas SERPs orgânicas do Google em 6–9 meses.

Modelo de negócio replica o satélite já operacional `bradescosaudeempresas.com.br` do mesmo proprietário — captura de leads via SEO orgânico, conversão por simulador/WhatsApp, encaminhamento ao hub `planodesaudepj.com.br` quando aplicável.

---

## 2. Objetivo Estratégico

Construir o site Amil tecnicamente mais bem executado do mercado brasileiro:
- **Volume superior** (~5570 city pages vs ~1500 do líder atual)
- **Profundidade superior** (1500+ palavras por landing, vs ~3 H2s do concorrente)
- **Tecnicamente impecável** (LCP <1.5s, CLS 0, schema completo, meta tags em 100% das páginas)
- **Conteúdo atualizado** (preços/regulamentação ANS sempre ≤30 dias)
- **UX limpa** (1 CTA primário, simulador funcional, mapa interativo de rede)

---

## 3. Stack Confirmada

| Camada | Tecnologia | Razão |
|--------|-----------|-------|
| **Front-end** | Astro | SSG nativo, 0 KB JS por padrão, ideal para SEO técnico |
| **Runtime/Back-end** | Bun | Performance, fetch nativo, file routing |
| **Hosting** | A definir (@architect) — Cloudflare Pages, Vercel ou VPS | |
| **DB** | A definir (@architect) — provável SQLite/Turso para read-heavy ou Postgres se houver app admin | |
| **CMS** | A definir (@architect) — opções: MDX local, Decap CMS, Sanity, Strapi | |
| **Analytics** | GA4 + Google Search Console + Plausible (privacy-friendly) | |

---

## 4. Escopo MVP (proposta para validação @pm)

**Princípio:** validar SEO técnico antes de escalar para 5570 cidades.

### Fase MVP (4 semanas)
- ✅ Homepage `/`
- ✅ Pillar `/amil/`
- ✅ 6 product pages: Bronze, Prata, Ouro, Platinum, Black, One
- ✅ 4 audience pages: Individual, Familiar, PJ/MEI, Empresarial
- ✅ Página `/preco/tabela-de-precos/` (com selo "atualizado em")
- ✅ Página `/preco/coparticipacao/`
- ✅ Página `/preco/simulador/` (interativo)
- ✅ Página `/diferenciais/`
- ✅ Página `/rede/buscar-rede/` (busca por estado/cidade/especialidade)
- ✅ 5 city pages piloto: São Paulo, Rio de Janeiro, Belo Horizonte, Brasília, Salvador
- ✅ 3 blog posts iniciais
- ✅ FAQ com FAQPage schema
- ✅ Esquemas Organization, Product, BreadcrumbList em todas
- ✅ robots.txt + sitemap.xml gerados pelo Astro
- ✅ Submissão Google Search Console + Bing Webmaster

### Fase 2 (mês 2-3)
- 100 city pages/semana até atingir 5570 (~12 meses)
- 30 blog posts editoriais
- Schema LocalBusiness em cada city page
- Mapa interativo de hospitais

### Fase 3 (mês 4-6)
- Comparador interativo de planos
- Calculadora de carências
- Glossário
- Vídeos com VideoObject schema
- Integração WhatsApp Business Catalog

---

## 5. Anti-Escopo (NÃO fazer no MVP)

- ❌ Aplicativo mobile nativo
- ❌ Login de usuário / área restrita
- ❌ E-commerce de planos (contratação fica no WhatsApp/telefone)
- ❌ Pagamento online
- ❌ Chatbot com IA generativa (risco regulatório saúde)
- ❌ Conteúdo médico inventado (contratar revisor médico antes)

---

## 6. Restrições Legais e Éticas (CRÍTICO)

- **Marca "Amil":** site de corretora autorizada, **não** site oficial Amil. Footer obrigatório com:
  - CNPJ da corretora
  - Registro SUSEP (se aplicável)
  - Disclaimer: "Site não oficial. Corretora autorizada a comercializar planos Amil. Marca Amil é propriedade da Amil Assistência Médica Internacional S.A."
- **ANS:** seguir RN 195/2009 sobre publicidade de planos de saúde — não prometer cobertura sem cláusulas, não usar termos "garantido" ou "completo" sem ressalvas.
- **LGPD:** consentimento explícito em formulários, política de privacidade, cookies banner.
- **Não copiar copy literal** dos concorrentes — apenas extrair padrões de IA.
- **Não inventar métricas** ("99% de satisfação"). Usar somente dados verificáveis ou descartar.

---

## 7. Personas (rascunho — refinar com @pm)

### Persona A: Decisor PJ (B2B)
- RH ou sócio de empresa 5–500 funcionários
- Pesquisa "plano amil pme", "plano empresarial amil [cidade]"
- Decisão envolve preço, rede, prazo de carência
- Conversão via WhatsApp/telefone para corretor

### Persona B: Indivíduo / Família (B2C)
- 30–55 anos, classe B/C
- Pesquisa "plano amil familiar", "amil é bom?", "preço amil ouro"
- Decisão envolve preço × cobertura × hospitais próximos
- Conversão via simulador online + WhatsApp

### Persona C: Pesquisador Informacional (futuro lead)
- Buscando "carência amil", "coparticipação amil", "reembolso amil"
- Não pronto para comprar agora, mas captura via blog + email
- Conversão diferida (3-6 meses)

---

## 8. Critérios de Sucesso

**Sem inventar números** (per memória `feedback_claims_metricas.md`):

| KPI | Baseline | Meta 6 meses |
|-----|----------|---------------|
| Páginas indexadas Google | 0 | ≥1.000 |
| Posição média keywords Tier 1 | N/A | top 20 |
| Posição média keywords Tier 2 | N/A | top 10 |
| Posição média keywords Tier 3 (long-tail city) | N/A | top 5 |
| LCP (P75) | N/A | <1,5s |
| CLS (P75) | N/A | <0,1 |
| INP (P75) | N/A | <200ms |
| Leads/mês via simulador | 0 | A definir após 30 dias com baseline real |

Métricas de leads/conversão **NÃO PROJETAR** sem A/B test rodado.

---

## 9. Pipeline AIOS — Próximos Passos

1. ✅ **@analyst (Atlas) — CONCLUÍDO** — entregáveis em `C:/Users/benef/satelite-amil-astro/research/`
2. ⏭️ **@pm (Morgan)** — gerar `prd.md` v1.0 com este brief como input + template `prd-tmpl.yaml`
3. ⏭️ **@architect (Aria)** — desenhar arquitetura técnica Astro+Bun, decisão de hosting, modelo de dados (especialmente para city pages e busca de rede)
4. ⏭️ **@ux-design-expert (Uma)** — design system, wireframes das 11 page templates do MVP
5. ⏭️ **@po (Pax)** — fatiar PRD em epics + stories em `docs/stories/`
6. ⏭️ **@dev (Dex)** — implementar stories no padrão Story-Driven Development
7. ⏭️ **@devops (Gage)** — repo GitHub, CI/CD, deploy, DNS, Search Console

---

## 10. Anexos (research/)

- `01-sitemap-inventory.md` — inventário completo de URLs do concorrente
- `02-pages-scraped.md` — dados raspados de 10 landings principais
- `03-competitor-analysis.md` — análise estratégica + arquitetura proposta + schema plan
- `04-project-brief.md` — este documento

---

## 11. Decisões Pendentes (para @pm capturar)

1. **Domínio:** qual será? `planodesaudeamil.com.br` está em uso pelo concorrente. Opções: `amilcorretora.com.br`, `meuplanoamil.com.br`, `amilfacil.com.br`, etc. — verificar disponibilidade.
2. **Razão social/CNPJ:** corretora existente ou criar nova? Afeta footer legal.
3. **Editor médico:** terceirizar revisão de conteúdo de saúde? (Recomendado.)
4. **Orçamento total / runway:** define agressividade do roadmap.
5. **Equipe:** dev solo (Dex agente) ou contratar humano? Editor de blog?
6. **Prazo MVP:** 4 semanas é factível? @architect + @dev validam após arquitetura.

— Atlas, investigando a verdade 🔎
