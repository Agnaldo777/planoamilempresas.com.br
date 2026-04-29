# Raspagem Profunda — amilsaudebr.com.br + kitcorretoramil.com.br

**Data:** 2026-04-28
**Método:** WebFetch + curl + grep no HTML cru
**Limitação:** servidor amilsaudebr.com.br derrubou conexões em raspagem agressiva. Análise concentrou em homepage + sitemap + HTML cru completo. Páginas individuais (estaduais, produtos) inferidas via estrutura de URLs detectada.

---

## 🚨 Achados decisivos antes da análise

### 1. amilsaudebr.com.br é UM CLONE
O canonical da homepage aponta para `https://onlineplanodesaude.com.br/amil-saude-2026.html`. Isso significa:
- `amilsaudebr.com.br` é um espelho/alias secundário
- O site MASTER (que ranqueia de fato em SEO) é `onlineplanodesaude.com.br/amil-saude-2026.html`
- A análise SEO competitiva real deveria focar no master — mas ambos compartilham o mesmo HTML/template

### 2. kitcorretoramil.com.br NÃO É CONCORRENTE
- CNPJ no rodapé: **29.309.127/0001-79** = **Amil Assistência Médica Internacional S.A.** (operadora oficial)
- ANS Nº 326305 (Amil oficial)
- Site é o **Portal do Corretor da Amil** (kit de vendas, materiais, plataforma comercial)
- WordPress com tema "kitcorretor"
- Sitemap.xml retorna 404
- Não compete em SEO público — é área restrita/institucional para corretores cadastrados

**Implicação estratégica:** análise competitiva real reduz a 3 sites concorrentes (amilplanos, planodesaudeamil, **amilsaudebr**/onlineplanodesaude). kitcorretor é fonte de **referência institucional Amil** (PDFs oficiais, linhas atualizadas, comissionamento) — útil como insumo, não como adversário SEO.

---

## 1. amilsaudebr.com.br — Análise técnica

### Stack & arquitetura
- **HTML estático puro** (`.html` files diretos no sitemap, não WordPress)
- Sem CMS detectável
- Provavelmente gerado/exportado de uma ferramenta (CMS estático ou exportador)
- 38 URLs no sitemap.xml

### robots.txt
```
User-agent: *
Disallow: /cgi-bin/
Disallow: /amil-site-cards-footer-vs-hero.zip
Allow: /
Allow: /enviar-formulario.php
Allow: /processar-cotacao*.php
Allow: /index.html
Allow: /tabela-de-precos-amil-saude-2026/
Allow: /linha-selecionada/
Allow: /linha-classica/
Allow: /dental/
Sitemap: https://amilsaudebr.com.br/sitemap.xml
```
*Permissivo. PHPs no Allow sugerem backend simples para forms.*

### Sitemap.xml — 38 URLs (estrutura compacta vs concorrentes massivos)

| Categoria | URLs | Padrão |
|-----------|-----:|--------|
| Master | 2 | `/`, `/index.html` |
| Tabela 2026 | 2 | `/tabela-de-precos-amil-saude-2026/index.html`, `/cotacao.html` |
| Linha Selecionada | 3 | `/linha-selecionada/amil-s380.html`, `s450`, `s750` |
| Linha Clássica | 4 | `/linha-classica/amil-bronze.html`, `prata`, `platinum`, `black` (Ouro? não listado mas mencionado em links internos) |
| Dental | 7 | `/dental/linha-selecionada/amil-dental-{e60,e80,e90,e170,205,50,pme}.html` |
| Tabelas estaduais | 14 | (URLs no sitemap)... mas links internos da homepage usam **outro padrão** ⚠️ |
| Auxiliares | 2 | verificação Google + arquivo de validação |

**⚠️ Inconsistência detectada:**
- Sitemap lista: `/sao-paulo`, `/rio-de-janeiro`, `/minas-gerais` (sem extensão)
- Links internos da homepage apontam para: `/tabela-amil-sao-paulo-2026.html`, `/tabela-amil-rio-de-janeiro-2026.html` etc.
- Esses URLs `/tabela-amil-{estado}-2026.html` **não estão no sitemap** — provável bug de indexação ou dois conjuntos de URLs paralelos.

### Homepage — auditoria SEO completa (HTML cru analisado)

| Elemento | Status | Conteúdo |
|----------|--------|----------|
| `<title>` | ✅ | "Amil Saúde 2026 - Planos de Saúde Empresarial, MEI e Individual \| Online Plano de Saúde" |
| `<meta name="description">` | ✅ | "Amil Saúde 2026: Planos de saúde empresarial, MEI e individual. Rede credenciada com Albert Einstein e Sírio Libanês. Cotação online grátis!" |
| `<link rel="canonical">` | ⚠️ | Aponta para `https://onlineplanodesaude.com.br/amil-saude-2026.html` (clone) |
| `<html lang="pt-BR">` | ✅ | presente |
| `<meta property="og:title">` | ✅ | "Amil Saúde 2026 - Planos Empresarial, MEI e Individual" |
| `<meta property="og:description">` | ✅ | preenchido |
| Twitter Card | ⚠️ | não verificado (provável ausente) |
| **JSON-LD schema** | ✅⭐ | **4 scripts, 11 tipos** — Organization, ContactPoint ×2, WebPage, Product, Brand, AggregateOffer, FAQPage, Question ×4, Answer ×4, BreadcrumbList |

### Schemas detalhados

**1. Organization** — `name: "Amil"` (⚠️ usa nome da operadora oficial), URL `onlineplanodesaude.com.br`, contactPoint: (12) 3917-5707 (sales) e (19) 99116-1128 (customer service), `sameAs: ["https://www.portoseguro.com.br/saude"]` (⚠️ Porto Seguro? estranho — provável corretora multi-operadora)

**2. WebPage + Product + AggregateOffer**:
- Plano de Saúde Amil 2026
- Brand: Amil
- AggregateOffer: lowPrice R$ 102,28 / highPrice R$ 3.500,00 / offerCount "50+"
- Availability: InStock

**3. FAQPage** com 4 Q&A:
- "O que é o Plano de Saúde Amil?"
- "Quanto custa o Plano de Saúde Amil?"
- "Quem pode contratar o Plano de Saúde Amil?"
- "Como funciona a coparticipação no Amil?"

**4. BreadcrumbList** com 1 item.

### H1 e H2 detectados (homepage)

**H1:** "Amil Saúde 2026 — Planos Empresarial, MEI e Individual"

**H2 (8 estruturados):**
1. Tabela de Preços Amil 2026
2. Categorias de Planos Amil
3. O que é e como funciona o Plano de Saúde Amil 2026?
4. Para quem o Plano de Saúde Amil é indicado?
5. Quanto custa o Plano de Saúde Amil?
6. Carências do Plano Amil
7. Perguntas Frequentes sobre o Amil
8. Nossas Unidades

### Word count e densidade
- **Word count homepage:** ~3.200–3.500 palavras
- **Sub-marcas mencionadas:** 11 ocorrências (S380, S450, S750, Bronze, Prata, Ouro, Platinum, Black, Dental)
- **Termos técnicos:** 22 ocorrências (carência, coparticipação, telemedicina, resgate, assistência internacional)
- **Estados nominados:** 26 ocorrências (14 estados oficiais)
- **Hospitais reais:** 3 ocorrências (Albert Einstein, Sírio Libanês mencionados — densidade baixa para destaque)

### Performance & técnica
- Tamanho HTML homepage: **152 KB** (similar aos concorrentes)
- HTML estático: provável LCP baixo + bom TTFB (não medido — servidor derruba curl, mas estático tende a ser rápido)
- 0 tabelas `<table>` HTML nativas — usa divs/CSS Grid (perda de semântica para SEO de tabelas)

### Telefones e CTAs
- **Central de Vendas:** (12) 3917-5707 (São José dos Campos / SP interior)
- **WhatsApp:** (12) 98191-5070
- **Atendimento:** (19) 99116-1128 (Campinas)
- **CTAs primários:** "Solicitar Cotação Grátis", "WhatsApp", "Ver Tabela de Preços", "Fazer Cotação Online" (8 cards CTA na página)

### FAQ visível
8 perguntas estruturadas (4 com schema FAQPage, 4 só visuais):
- O que é o Amil?
- Quanto custa?
- Quem pode contratar?
- Como funciona coparticipação?
- (mais 4 sem schema)

### Linhas de produto identificadas

**Linha Selecionada** (rede mais enxuta, planos regionais):
- Amil S380
- Amil S450
- Amil S750

**Linha Clássica** (rede ampla, planos nacionais):
- Amil Bronze
- Amil Prata
- Amil Ouro
- Amil Platinum
- Amil Black

**Dental:**
- Amil Dental E50
- Amil Dental E60
- Amil Dental E80
- Amil Dental E90
- Amil Dental E170
- Amil Dental 205
- Amil Dental PME

### Tabelas estaduais (14)
URLs em DOIS padrões paralelos:
- Sitemap: `/sao-paulo`, `/rio-de-janeiro`, `/minas-gerais`...
- Links internos: `tabela-amil-sao-paulo-2026.html`, `tabela-amil-rio-de-janeiro-2026.html`...

Estados cobertos: BA, CE, DF, GO, MA, MG, PB, PR, PE, RJ, RN, RS, SC, SP

---

## 2. kitcorretoramil.com.br — Análise institucional

### Stack
- **WordPress** com tema "kitcorretor"
- Sem sitemap.xml (404)
- robots.txt minimal (`Disallow: /wp-content/themes/kitcorretor/bkp`)

### HTML cru
- `<html lang="pt-br">` ✅
- `<meta name="description" content="">` ❌ VAZIA
- `<link rel="canonical">` ✅ presente
- ZERO JSON-LD schema
- ZERO Open Graph

### Conteúdo (homepage)
- Word count: ~400–500 palavras (página de portal, não de marketing)
- H1: não claramente marcado
- H2: "Produtos", "Ferramentas", "Últimas notícias"
- H3: "Corretor 2026", "Telemedicina Amil", "Mais segurança nos contratos PME"

### Identidade
- **CNPJ 29.309.127/0001-79** = Amil Assistência Médica Internacional S.A.
- **ANS Nº 326305** = Amil oficial
- **Telefones oficiais:**
  - 3004-1022 (corretor capitais)
  - 0800-721-1022 (corretor demais localidades)
  - 3004-1000 (beneficiário capitais)
  - 0800-706-2363 (beneficiário demais localidades)

### Sub-marcas mencionadas
- Amil, Amil Dental
- Linha Clássica: Bronze, Prata, Ouro, Platinum, Black (I, II)
- Linha Selecionada: S2500, S6500
- Operadoras regionais aliadas: **Ana Costa, Santa Helena, Sobam**

### Material valioso para nosso projeto
- PDFs com versões datadas (2026.01, 2026.02) — fonte oficial atualizada
- Linhas Black nominadas (Black I, Black II, S2500, S6500) — informação nova vs concorrentes
- Operadoras regionais aliadas (Ana Costa, Santa Helena, Sobam) — possível extensão de portfólio
- Telefones oficiais Amil (legítimos para citar como referência)

---

## 3. Comparativo dos 4 concorrentes (atualizado)

| Critério | amilplanos | planodesaudeamil | **amilsaudebr** | kitcorretor |
|----------|:----------:|:----------------:|:---------------:|:-----------:|
| **Tipo** | corretor | corretor | corretor (clone) | portal oficial |
| Stack | WP+UX Themes | WP+Flatsome | **HTML estático** ⭐ | WP custom |
| URLs sitemap | ~1.500 | ~2.500 | **38** | 404 |
| Páginas estaduais | parcial via city | parcial | **14 dedicadas** ⭐ | n/a |
| Linhas de produto | 25+ (legados+nova) | 15 | **15** (organizadas em hubs) ⭐ | 12+ (oficial) |
| Title tag | genérico | genérico | **otimizado com keyword + ano** ⭐ | n/a |
| Meta description | ❌ | ❌ | ✅ **preenchida** ⭐ | ❌ vazia |
| **JSON-LD schema** | ❌ ZERO | ❌ ZERO | ✅ **11 tipos (4 scripts)** ⭐⭐⭐ | ❌ ZERO |
| FAQPage schema | ❌ | ❌ | ✅ **com 4 Q&A** ⭐⭐ | ❌ |
| Product/Offer schema | ❌ | ❌ | ✅ **AggregateOffer R$102-3500** ⭐ | ❌ |
| BreadcrumbList schema | ❌ | ❌ | ✅ ⭐ | ❌ |
| Open Graph | ❌ | ❌ | ✅ ⭐ | ❌ |
| Lang attribute | ⚠️ | ✅ | ✅ | ✅ |
| Canonical | ⚠️ | ✅ | ⚠️ aponta clone | ✅ |
| Tabela preços | set/2022 ❌ | out/2025 ⚠️ | **2026 atualizada** ⭐ | n/a |
| Hospitais reais nominados | parcial | nacional repetido | parcial (3 menções) | n/a |
| H1 city/estadual | "Plano Amil [Cidade]" ✅ | "[Cidade]" ❌ | (a confirmar nas estaduais) | n/a |
| Blog | 9 (4 spam) ❌ | 25 (0 spam) ✅ | **AUSENTE** ⚠️ | "Últimas notícias" |
| Word count homepage | ~1.500 | ~3.500 | ~3.200-3.500 | ~500 |
| Telefones repetidos | 5 ❌ | 2 ✅ | 3 (sales/atendimento) | 4 (oficiais) |
| CNPJ/SUSEP visíveis | ❌ | ✅ Stark | ⚠️ não identificou explícito | ✅ Amil oficial |
| Performance estimada | ruim WP | ruim WP (TTFB 3s) | **boa (HTML estático)** ⭐ | razoável WP |

**🏆 Resultado:** `amilsaudebr.com.br` é o **MELHOR competidor técnico** dos 4 — único com schema rico, meta description, OG, e tabela 2026 atualizada. Sua fraqueza: clone (canonical para outro domínio), sem blog, sem rede credenciada profunda, conteúdo concentrado na homepage.

---

## 4. Score atualizado

| Site | Score | Resumo |
|------|:-----:|--------|
| amilplanos.com.br | 6,0/10 | Volume, mas spam blog + preços velhos |
| planodesaudeamil.com.br | 6,5/10 | Frescura, blog limpo, FAQ, mas duplicação massiva |
| **amilsaudebr.com.br** | **7,5/10** | Schema rico + meta + OG + estrutura compacta. Mas é clone, sem blog, sem profundidade |
| kitcorretoramil.com.br | n/a | Não compete em SEO público (portal oficial Amil) |

---

## 5. Lições para nosso projeto (ações concretas)

### O que ABSORVER de amilsaudebr.com.br ⭐ (novidades)

| # | Acerto | Implementação no nosso projeto |
|---|--------|-------------------------------|
| 1 | **JSON-LD com 11 tipos em 1 página** | Replicar e expandir em todas as nossas páginas (já em FR31-FR42 do PRD v1.3) |
| 2 | **AggregateOffer com lowPrice/highPrice** | Adicionar em página de tabela de preços + cada produto |
| 3 | **FAQPage schema com 4-8 Q&A reais** | Já em FR40 do PRD v1.3 — ampliar para 45+ Q&A |
| 4 | **Title com ano "2026"** (frescura visível em SERP) | Adotar padrão "Plano Amil 2026 — [Estado] / [Tipo]" em title dinâmico |
| 5 | **Meta description preenchida com keyword + USP** | Já em FR32 do PRD v1.3 |
| 6 | **HTML estático** (LCP excelente) | Next.js SSG com `generateStaticParams` agressivo (já em ADR-008 mitigações) |
| 7 | **Estrutura compacta** (38 URLs vs 2.500) | Considerar: city pages massivos vs concentração — analisar trade-off |
| 8 | **8 H2s estruturados** com keyword + qualifier | Adotar padrão em todas pillar pages |
| 9 | **CTAs múltiplos (8 cards)** estilo "Solicite cotação" | Já em UI atual; manter densidade |
| 10 | **Open Graph completo** | Adicionar `<OpenGraph>` component reusável |
| 11 | **Canonical apontando para domínio master** (caso tenhamos clones futuros) | Útil para Fase 2 referenciando Fase 1 quando há especialização |

### O que EVITAR (anti-erros de amilsaudebr.com.br)

| # | Erro | Como evitar |
|---|------|-------------|
| 1 | Site clone com canonical para outro domínio (sinaliza que rankqueia outro) | Cada satélite tem URL master próprio |
| 2 | Sem blog editorial | Blog 30+ posts no PRD v1.3 (FR45) |
| 3 | 0 tabelas `<table>` HTML nativas | Usar `<table>` semântico para preços (acessibilidade + SEO) |
| 4 | Schema Organization usando `name: "Amil"` (operadora oficial) | Usar `name: "BeneficioRH"` + referenciar Amil em `category` |
| 5 | `sameAs` confuso (Porto Seguro num site Amil) | Coerência: `sameAs` aponta apenas pra perfis da BeneficioRH |
| 6 | Sitemap inconsistente com links internos | CI valida match sitemap × routing (Story 1.3) |
| 7 | Hospitais reais com baixa densidade (3 menções) | 10+ hospitais reais por city page, com schema MedicalBusiness |

### O que ABSORVER de kitcorretoramil.com.br (institucional)

| # | Insumo | Como usar |
|---|--------|-----------|
| 1 | PDFs oficiais Amil 2026.01, 2026.02 | Fonte autorizada para tabelas/coberturas |
| 2 | Linhas Black detalhadas (Black I, II, S2500, S6500) | Atualizar nosso catálogo de produtos |
| 3 | Operadoras regionais aliadas (Ana Costa, Santa Helena, Sobam) | Potencial expansão portfólio (futuros satélites) |
| 4 | Telefones oficiais 3004-1022 / 0800-721-1022 | Citáveis em footer "para questões com Amil oficial" (compliance) |
| 5 | "Telemedicina Amil" como notícia em destaque | Reforça nossa página `/diferenciais/telemedicina/` |
| 6 | "Mais segurança nos contratos PME" (lançamento Amil) | Conteúdo editorial atual para blog |
| 7 | Banner "Lançamento Amil Black" | Indica produto premium em foco — boost na nossa página `/produtos/amil-black/` |

---

## 6. Atualização do PRD recomendada

A maior parte dos acertos de amilsaudebr.com.br **já está coberta** no PRD v1.3 (FR31–FR49). Itens novos a propor para PRD v1.3.1 ou v1.4:

| Novo FR/NFR | Conteúdo |
|-------------|----------|
| FR50 | **Title pattern com ano:** `[Tipo] Amil 2026 — [Qualificador]` (renovação anual automática via Sanity) |
| FR51 | **AggregateOffer schema com lowPrice/highPrice por estado** (não só nacional) |
| FR52 | **`<table>` HTML semântico** em todas tabelas de preços (acessibilidade + SEO de Featured Snippet "Plano Amil tabela") |
| FR53 | **OpenGraph component reusável** (`<OpenGraph image=... type="product"...>`) com fallback automático |
| FR54 | **Schema Organization sem `name: "Amil"`** — usar BeneficioRH com Amil em `category` (compliance ADR-006) |
| FR55 | **CI checa sitemap vs routes** (Quinn) — falha se URL no sitemap não tem rota Next.js correspondente |

---

## 7. Limitações desta análise

1. **Servidor amilsaudebr.com.br derrubou conexões** após 2-3 requisições paralelas — não foi possível raspar páginas individuais (estaduais, produtos, dental).
2. Análise das páginas individuais foi **inferida** via:
   - Estrutura de URLs do sitemap (38 listadas)
   - Links internos da homepage
   - Padrão de naming (linha-classica/, linha-selecionada/, dental/, tabela-amil-{estado}-2026.html)
3. **onlineplanodesaude.com.br** (site master canonicalizado) **não respondeu** a nenhuma tentativa de fetch — pode estar offline, cloudflare bloqueando, ou geo-restrito.
4. **Performance real (CWV)** não medida via PSI (rate limit sem API key) nem curl (servidor derrubando).
5. **kitcorretoramil.com.br áreas autenticadas** não acessíveis (login obrigatório).

---

## 8. Recomendação para próxima etapa

Material desta análise é **suficiente para alimentar PRD/UX/SM**. Não há necessidade de re-tentar raspagem profunda do amilsaudebr (clone com homepage rica e estrutura compacta — já temos o template completo).

**Próximas ações sugeridas:**
1. Atualizar PRD v1.3 → v1.3.1 com FR50–FR55 (Morgan)
2. Uma referencia este documento + 08-acertos-erros para benchmark visual final
3. Pax cria stories de:
   - Story X.1: implementar AggregateOffer per-estado
   - Story X.2: title pattern com ano renovável
   - Story X.3: tabelas HTML semânticas + Featured Snippet target
4. Quinn adiciona auditoria CI: sitemap vs routing
