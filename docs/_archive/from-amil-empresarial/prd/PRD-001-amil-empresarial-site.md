# PRD-001: Site Amil Planos Empresariais — Dominação SEO

> **Status:** Draft
> **Autor:** Morgan (PM) — Synkra AIOS
> **Data:** 2026-03-17
> **Versão:** 1.1
> **Classificação:** Greenfield
> **Addendum:** [SEO Keywords Strategy com Volumes Reais](ADDENDUM-SEO-KEYWORDS-STRATEGY.md)

---

## 1. Visão Geral do Produto

### 1.1 Declaração de Visão

Criar o site de corretora Amil mais completo do Brasil, focado em planos empresariais, com **1000+ páginas otimizadas para SEO**, performance técnica superior (PageSpeed 95+), e taxa de conversão 3-4x maior que os concorrentes — alcançando a **1ª posição no Google** para keywords de planos Amil empresariais em 6-12 meses.

### 1.2 Problema

O mercado de sites de corretoras Amil está tecnicamente na idade da pedra:
- **10 concorrentes analisados**, nenhum implementa Schema markup
- **Nenhum** tem meta descriptions consistentes
- **Nenhum** tem mais de 50 páginas
- **Nenhum** tem estratégia de SEO local em escala
- Sites usam WordPress genérico com performance PageSpeed 25-65
- Formulários de cotação com 10-16 campos (taxa de abandono ~70-80%)
- Dados desatualizados (um concorrente tem tabela de preços de 2023)

### 1.3 Oportunidade

Há um vácuo competitivo massivo. Os concorrentes ranqueiam por **falta de concorrência técnica**, não por mérito. Um site com SEO técnico moderno, conteúdo em escala e UX otimizada pode dominá-los em meses.

### 1.4 Público-Alvo

| Persona | Descrição | Keywords de Busca |
|---------|-----------|-------------------|
| **Empresário PME** | Dono de empresa 2-99 funcionários buscando plano | "amil empresarial", "plano saúde empresa" |
| **Gestor de RH** | Responsável por benefícios corporativos | "plano saúde corporativo", "benefício saúde funcionários" |
| **MEI** | Microempreendedor individual | "amil mei", "plano saúde mei" |
| **Contador/Contabilidade** | Indica planos para clientes | "plano saúde empresa cnpj" |
| **Grande Empresa** | 100+ vidas, decisão complexa | "amil grandes empresas", "amil corporativo" |

---

## 2. Análise Competitiva

### 2.1 Concorrentes Analisados (10 sites)

| # | Site | Páginas | Schema | Meta Desc | PageSpeed | Ameaça |
|:-:|------|:-:|:-:|:-:|:-:|:-:|
| 1 | planodesaudeamil.com.br | ~45 | ZERO | ZERO | ~35 | ALTA |
| 2 | planodesaudeamil.com.br/vendas/ | (mesma) | ZERO | ZERO | ~35 | ALTA |
| 3 | planosdesaudeamilrj.com.br | ~45 | ZERO | ZERO | ~40 | MÉDIA |
| 4 | corretoresamil.com.br | ~40 | ZERO | ZERO | ~40 | MÉDIA |
| 5 | rotaseguros.com.br | ~25 | ZERO | ZERO | ~50 | MÉDIA |
| 6 | amilplanos.com.br | ~50 | ZERO | ZERO | ~35 | BAIXA |
| 7 | amilassistenciamedica.com.br | ~15 | ZERO | ZERO | ~60 | BAIXA |
| 8 | planosdesaudesp.com.br | ~25 | ZERO | ZERO | ~50 | MÉDIA |
| 9 | amilsa.com.br | ~10 | ZERO | ZERO | ~25 | NULA |
| 10 | institucional.amil.com.br | SPA | N/A | N/A | N/A | N/A (institucional) |

### 2.2 Vulnerabilidades Universais dos Concorrentes

1. **ZERO Schema markup** em todos os 10 sites
2. **ZERO meta descriptions** consistentes
3. **Máximo 50 páginas** (o melhor deles)
4. **WordPress genérico** com themes como Flatsome/Astra
5. **jQuery pesado** + plugins desnecessários (WooCommerce, Popup Maker)
6. **Formulários longos** de 10-16 campos
7. **Zero estratégia de SEO local** em escala (máximo 30 cidades de 1 estado)
8. **Blogs inexistentes ou mínimos** (máximo 8 posts)
9. **Zero comparativos** entre planos
10. **Dados desatualizados** (tabelas de 2023 encontradas)

### 2.3 O que os Melhores Fazem Bem (para absorvermos e melhorarmos)

| Concorrente | Ponto Forte | Como Superamos |
|-------------|-------------|----------------|
| planodesaudeamil.com.br | 12 planos detalhados, telefones regionais (9 cidades) | 12 planos + página individual de 1500 palavras cada |
| planosdesaudeamilrj.com.br | 30+ páginas de cidades RJ | 500+ páginas de cidades (todos os estados) |
| rotaseguros.com.br | FAQ 12 perguntas, imagens WebP, 2000 palavras | FAQ 50+ páginas com Schema, 1500+ palavras por página |
| corretoresamil.com.br | Tabelas de preço com faixas etárias | Tabelas filtráveis + atualizadas 2026 |
| planosdesaudesp.com.br | Estrutura de conteúdo lógica, lazy loading | Next.js nativo com lazy loading automático |

---

## 3. Requisitos Funcionais

### FR-001: Arquitetura de 1000+ Páginas (Silo Structure)

**Prioridade:** MUST

```
🏠 HOME — Plano de Saúde Amil Empresarial 2026
│
├── 📋 /planos/ (Hub — 1 página)
│   ├── /planos/amil-facil-s60/
│   ├── /planos/amil-facil-s80/
│   ├── /planos/amil-s380/
│   ├── /planos/amil-s450/
│   ├── /planos/amil-s580/
│   ├── /planos/amil-s750/
│   ├── /planos/amil-one-s2500/
│   └── /planos/amil-one-s6500-black/
│       → 8 páginas de produto (1500+ palavras cada)
│
├── 📊 /comparativos/ (Hub — 1 página)
│   ├── /comparativos/amil-s380-vs-s450/
│   ├── /comparativos/amil-s450-vs-s750/
│   ├── /comparativos/amil-vs-unimed/
│   ├── /comparativos/amil-vs-sulamerica/
│   ├── /comparativos/amil-vs-bradesco-saude/
│   ├── /comparativos/amil-vs-hapvida/
│   ├── /comparativos/amil-vs-porto-seguro/
│   └── ... (todas combinações internas + externas)
│       → 21+ páginas de comparação
│
├── 💼 /tipos-de-contratacao/ (Hub — 1 página)
│   ├── /empresarial/
│   ├── /empresarial/mei/
│   ├── /empresarial/pme-2-a-29-vidas/
│   ├── /empresarial/pme-30-a-99-vidas/
│   ├── /empresarial/grandes-empresas-100-vidas/
│   ├── /individual/
│   ├── /familiar/
│   └── /adesao/
│       → 8 páginas de segmento
│
├── 🏥 /rede-credenciada/ (Hub — 1 página)
│   ├── /rede-credenciada/hospitais/
│   ├── /rede-credenciada/laboratorios/
│   ├── /rede-credenciada/clinicas/
│   ├── /rede-credenciada/pronto-socorro/
│   └── /rede-credenciada/amil-espaco-saude/
│       → 5+ páginas
│
├── 📍 /plano-amil-[estado]/ — SILO LOCAL
│   ├── /plano-amil-sao-paulo/
│   │   ├── /plano-amil-sao-paulo/empresarial/
│   │   ├── /plano-amil-sao-paulo/rede-credenciada/
│   │   ├── /plano-amil-guarulhos/
│   │   ├── /plano-amil-campinas/
│   │   ├── /plano-amil-santos/
│   │   └── ... (50+ cidades SP)
│   ├── /plano-amil-rio-de-janeiro/
│   │   ├── /plano-amil-niteroi/
│   │   └── ... (40+ cidades RJ)
│   ├── /plano-amil-minas-gerais/
│   │   ├── /plano-amil-belo-horizonte/
│   │   └── ... (30+ cidades MG)
│   ├── /plano-amil-parana/
│   ├── /plano-amil-brasilia/
│   └── ... (26 estados + DF)
│       → 500+ páginas locais
│
├── 💰 /tabela-de-precos/ (Hub — 1 página)
│   ├── /tabela-de-precos/amil-facil/
│   ├── /tabela-de-precos/amil-s380/
│   ├── /tabela-de-precos/amil-s450/
│   ├── /tabela-de-precos/amil-s750/
│   ├── /tabela-de-precos/amil-one/
│   └── /tabela-de-precos/por-faixa-etaria/
│       → 15+ páginas de preço
│
├── ❓ /perguntas-frequentes/ (Hub — 1 página)
│   ├── /faq/carencia-amil/
│   ├── /faq/coparticipacao-o-que-e/
│   ├── /faq/reembolso-como-funciona/
│   ├── /faq/amil-cobre-cirurgia-bariatrica/
│   ├── /faq/amil-aceita-mei/
│   ├── /faq/portabilidade-para-amil/
│   ├── /faq/segunda-via-boleto/
│   └── ... (perguntas long-tail)
│       → 50+ páginas FAQ individuais
│
├── 📝 /blog/ (Hub — 1 página)
│   ├── /blog/guias/ (30+ posts)
│   ├── /blog/noticias/ (50+ posts)
│   ├── /blog/comparativos/ (20+ posts)
│   ├── /blog/dicas-saude/ (30+ posts)
│   ├── /blog/legislacao-ans/ (20+ posts)
│   └── /blog/beneficios-corporativos/ (30+ posts)
│       → 300+ posts de blog
│
├── 🧮 /cotacao-online/
├── 🏢 /sobre-nos/
├── 📞 /contato/
└── 🗺️ /sitemap/
```

**Contagem Total:**

| Silo | Páginas |
|------|:-:|
| Planos (produto) | 8 |
| Comparativos | 21 |
| Tipos de contratação | 8 |
| Rede credenciada | 5 |
| Páginas locais (estados + cidades) | 500+ |
| Tabelas de preço | 15 |
| FAQ individuais | 50+ |
| Blog posts | 300+ |
| Páginas utilitárias | 10 |
| **TOTAL** | **~1.000+** |

---

### FR-002: Formulário de Cotação Multi-Step

**Prioridade:** MUST

**Problema atual dos concorrentes:** Formulários com 10-16 campos numa tela, incluindo campos irrelevantes como "Profissão/Formação Acadêmica" (200+ opções), DDD separado do telefone, e 10 faixas etárias individuais.

**Solução:**

| Step | Pergunta | Campos | UX |
|:-:|----------|:-:|-----|
| 1 | "Quem é você?" | 1 seleção | Cards visuais: Empresa / MEI / Família / Individual |
| 2 | "Quantas pessoas?" | 1 seleção | Radio: 2-5 / 6-29 / 30-99 / 100+ |
| 3 | "Qual região?" | 1 dropdown | Auto-detectar por IP, opção de alterar |
| 4 | "Seus dados" | 2 campos | Nome + WhatsApp (com máscara) |

**Progress bar visual** com 4 dots (●○○○ → ●●●● )

**Comparativo:**

| Métrica | Concorrentes | Nosso |
|---------|:-:|:-:|
| Campos obrigatórios | 10-16 | **4** |
| Tempo de preenchimento | 3-5 min | **30 segundos** |
| Taxa de conversão estimada | 5-8% | **15-25%** |
| Taxa de abandono estimada | 70-80% | **20-30%** |

---

### FR-003: SEO Técnico Completo

**Prioridade:** MUST

#### FR-003.1: Schema Markup (@graph por página)

Cada página deve conter múltiplos schemas combinados em um único `@graph`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization" },
    { "@type": "WebSite", "potentialAction": { "@type": "SearchAction" } },
    { "@type": "BreadcrumbList" },
    { "@type": "FAQPage" },
    { "@type": "Product" | "@type": "Service" },
    { "@type": "LocalBusiness" }
  ]
}
```

| Schema | Páginas Aplicáveis |
|--------|-------------------|
| Organization | Todas |
| BreadcrumbList | Todas (exceto Home) |
| FAQPage | Páginas de plano, FAQ, blog com FAQ |
| Product/Service | Páginas de plano e tabela de preços |
| LocalBusiness | Páginas locais (estados/cidades) |
| WebSite + SearchAction | Home |

#### FR-003.2: Meta Tags Otimizadas

**Template de Title:** `{Keyword Principal} {Ano} | {CTA ou Diferencial} — {Brand}`
- Exemplo: `Plano Amil S450 Empresarial 2026 | Cotação Online Grátis — Amil Saúde`
- Máximo: 60 caracteres

**Template de Description:** `{Benefício principal}. {Detalhe específico}. {CTA com urgência}.`
- Exemplo: `Compare planos Amil S450 Empresarial: cobertura nacional, hospitais renomados. Tabela de preços 2026 atualizada. Simule grátis em 30 segundos.`
- Máximo: 160 caracteres

#### FR-003.3: Heading Hierarchy

- **1 H1 por página** (contendo keyword principal)
- **H2** para seções principais (4-8 por página)
- **H3** para subseções (dentro de cada H2)
- **Nunca** pular níveis (H1 → H3 sem H2)

#### FR-003.4: URLs Semânticas

**Regras:**
- Minúsculas, hifenizadas
- Máximo 60 caracteres
- Keyword principal presente
- Sem .html, sem parâmetros, sem trailing slash inconsistente

#### FR-003.5: Sitemap XML

```xml
<sitemapindex>
  <sitemap><loc>/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>/sitemap-local-sp.xml</loc></sitemap>
  <sitemap><loc>/sitemap-local-rj.xml</loc></sitemap>
  <sitemap><loc>/sitemap-local-mg.xml</loc></sitemap>
  <sitemap><loc>/sitemap-local-outros.xml</loc></sitemap>
  <sitemap><loc>/sitemap-blog.xml</loc></sitemap>
  <sitemap><loc>/sitemap-faq.xml</loc></sitemap>
</sitemapindex>
```

#### FR-003.6: robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://seusite.com.br/sitemap-index.xml
```

---

### FR-004: Páginas de Plano (Produto)

**Prioridade:** MUST

Cada uma das 8 páginas de plano deve conter:

| Seção | Conteúdo | Palavras |
|-------|----------|:-:|
| H1 + Introdução | Keyword + resumo do plano | 150 |
| O que é o plano | Descrição detalhada, público-alvo | 200 |
| Cobertura | Nacional/regional, ambulatorial, hospitalar | 200 |
| Rede credenciada | Hospitais destaque, laboratórios | 150 |
| Diferenciais | Telemedicina, reembolso, farmácia, etc. | 200 |
| Tabela de preços | Por faixa etária, atualizada 2026 | 100 |
| Para quem é indicado | Segmentação por perfil | 150 |
| Como contratar | Passo a passo | 100 |
| FAQ (5-8 perguntas) | Com Schema FAQPage | 250 |
| **Total** | | **1500+** |

**Schema obrigatório:** Product + FAQPage + BreadcrumbList

---

### FR-005: Páginas Locais (SEO Local)

**Prioridade:** MUST

Template para cada página de cidade/estado:

| Seção | Conteúdo |
|-------|----------|
| H1 | "Plano de Saúde Amil Empresarial em {Cidade} — Cotação 2026" |
| Introdução local | Contexto da cidade, demanda por planos |
| Hospitais credenciados | Lista REAL de hospitais Amil na cidade |
| Amil Espaço Saúde | Endereço da unidade mais próxima (se houver) |
| Planos disponíveis | Quais planos cobrem aquela região |
| Tabela de preços regional | Preços específicos para o estado |
| Depoimentos locais | Reviews de empresas da região |
| FAQ local (3-5 perguntas) | Schema FAQPage |
| Mapa embed | Google Maps da unidade mais próxima |
| CTA | "Cotação para empresas em {Cidade}" |

**Schema obrigatório:** LocalBusiness + FAQPage + BreadcrumbList

**Geração:** Templates dinâmicos no CMS com dados por cidade alimentados via banco de dados.

---

### FR-006: Blog com Estratégia de Conteúdo

**Prioridade:** MUST

#### Calendário Editorial

| Categoria | Posts/mês | Exemplo de Título | Intenção |
|-----------|:-:|---------|----------|
| Guias empresariais | 8 | "Como Escolher Plano de Saúde para Empresa: Guia 2026" | Informacional |
| Comparativos | 4 | "Amil S380 vs S450: Qual o Melhor em 2026?" | Comercial |
| Notícias/reajustes | 4 | "Reajuste Amil 2026: O que Muda para Empresas" | Informacional |
| Dicas de saúde | 4 | "Programas de Bem-Estar Corporativo: Guia" | Informacional |
| Legislação ANS | 2 | "Carência em Plano Empresarial: Regras da ANS 2026" | Informacional |
| Benefícios RH | 4 | "ROI de Plano de Saúde: Como Calcular" | Comercial |
| Long-tail FAQ | 6 | "Amil Empresarial Aceita 2 Vidas?" | Informacional |
| **Total** | **32** | | |

#### Estrutura de Post

- **Mínimo 2000 palavras** por post
- **FAQ ao final** (3-5 perguntas com Schema)
- **Tabela de conteúdo** (Table of Contents) no topo
- **CTA inline** após 1/3 do artigo
- **Links internos** para páginas de plano e locais (mínimo 3 por post)
- **Imagens otimizadas** com alt text descritivo (mínimo 2 por post)

---

### FR-007: Comparativos de Planos

**Prioridade:** SHOULD

21 páginas de comparação:

**Internos (Amil vs Amil):**
- S380 vs S450, S450 vs S750, S60 vs S80, S750 vs One S2500, etc.

**Externos (Amil vs Concorrentes):**
- Amil vs Unimed, Amil vs SulAmérica, Amil vs Bradesco Saúde, Amil vs Hapvida, Amil vs Porto Seguro, Amil vs NotreDame Intermédica

**Estrutura por página:**
- Tabela lado a lado (features, cobertura, preço, rede)
- Para quem cada plano é indicado
- Veredicto/recomendação
- FAQ com Schema

---

### FR-008: Tabelas de Preço Filtráveis

**Prioridade:** MUST

| Funcionalidade | Descrição |
|----------------|-----------|
| Filtro por plano | Dropdown: S60, S80, S380, S450, S750, One |
| Filtro por faixa etária | 10 faixas ANS |
| Filtro por nº de vidas | 2-5, 6-29, 30-99, 100+ |
| Filtro por região | Estado / Nacional |
| Atualização | Dados via CMS, atualização sem deploy |
| Schema | Product com AggregateOffer (lowPrice, highPrice) |

---

## 4. Requisitos Não-Funcionais

### NFR-001: Performance (Core Web Vitals)

| Métrica | Target | Concorrentes |
|---------|:-:|:-:|
| LCP (Largest Contentful Paint) | < 1.5s | 4-6s |
| FID/INP (Interaction to Next Paint) | < 50ms | 200-400ms |
| CLS (Cumulative Layout Shift) | < 0.05 | 0.2-0.5 |
| PageSpeed Mobile | 95+ | 25-65 |
| First Load (Total) | < 200KB | 2-4MB |
| Total JS | < 80KB | 500KB+ |
| Total CSS | < 30KB | 300KB+ |

### NFR-002: Stack Tecnológica

| Componente | Tecnologia | Justificativa |
|------------|-----------|---------------|
| Framework | **Next.js 15 (App Router, SSG)** | SSG = HTML puro, SEO perfeito, Edge rendering |
| CMS | **Sanity** ou **Strapi** | Headless, APIs rápidas, preview, multilíngue |
| Hosting | **Vercel** | Edge network global, CI/CD automático, analytics |
| Formulários | **React Hook Form + Zod** | ~8KB vs 200KB+ do Gravity Forms/FormCraft |
| Imagens | **Next/Image** | WebP/AVIF automático, lazy loading, blur placeholder |
| Fonts | **1 família (Inter), 2 weights (400, 700)** | ~50KB vs 400KB+ dos concorrentes |
| Ícones | **Lucide React** | Tree-shaking, só ícones usados |
| Analytics | **GA4 + Google Search Console** | Monitoramento SEO completo |
| WhatsApp | **Link direto wa.me** | Zero widget pesado |
| Estilos | **Tailwind CSS** | Purge automático, CSS mínimo |

### NFR-003: SEO Local Consistente

**NAP (Nome, Endereço, Telefone) idêntico em:**
- Site (footer + contato + páginas locais)
- Google Business Profile
- Reclame Aqui
- LinkedIn Company Page
- Facebook Business
- Instagram Business
- Bing Places
- Apple Maps
- Diretórios do setor

**Nenhum concorrente mantém NAP consistente.** O planosdesaudesp.com.br tem endereço de SP em página de BH — erro gravíssimo.

### NFR-004: Mobile-First

- Design mobile-first nativo (não adaptação de desktop)
- Touch targets mínimo 48x48px
- Fontes legíveis sem zoom (16px mínimo)
- Formulário otimizado para teclado mobile
- Click-to-call e click-to-WhatsApp
- Imagens responsivas com srcset

### NFR-005: Acessibilidade

- WCAG 2.1 Level AA
- Alt text em 100% das imagens
- Contraste mínimo 4.5:1
- Navegação por teclado
- Aria labels em formulários
- Semântica HTML5 correta

---

## 5. Estratégia de Palavras-Chave

### 5.1 Head Keywords (Alta Concorrência)

| Keyword | Volume Est. | Dificuldade | Página Alvo |
|---------|:-:|:-:|-------------|
| plano de saúde amil | Alto | Alta | Home |
| amil empresarial | Alto | Média | /empresarial/ |
| convênio médico amil | Médio | Média | Home |
| plano amil preço | Alto | Média | /tabela-de-precos/ |

### 5.2 Long-Tail Keywords (Prioridade Máxima)

| Keyword | Volume Est. | Dificuldade | Página Alvo |
|---------|:-:|:-:|-------------|
| plano de saúde amil para mei | Médio | Baixa | /empresarial/mei/ |
| amil empresarial para pequenas empresas | Médio | Baixa | /empresarial/pme-2-a-29-vidas/ |
| plano amil s450 cobertura nacional | Médio | Baixa | /planos/amil-s450/ |
| amil fácil s80 quanto custa | Médio | Baixa | /planos/amil-facil-s80/ |
| plano amil black preço 2026 | Médio | Baixa | /planos/amil-one-s6500-black/ |
| amil empresarial de 2 a 29 vidas | Baixo | Muito Baixa | /empresarial/pme-2-a-29-vidas/ |
| cotação amil online | Médio | Média | /cotacao-online/ |
| amil s380 vs s450 diferença | Baixo | Muito Baixa | /comparativos/amil-s380-vs-s450/ |
| amil cobre cirurgia bariátrica | Baixo | Muito Baixa | /faq/amil-cobre-cirurgia-bariatrica/ |
| amil vale a pena | Médio | Baixa | /blog/amil-vale-a-pena/ |

### 5.3 Keywords Locais

| Keyword | Página Alvo |
|---------|-------------|
| plano amil são paulo | /plano-amil-sao-paulo/ |
| plano amil rio de janeiro | /plano-amil-rio-de-janeiro/ |
| amil empresarial belo horizonte | /plano-amil-belo-horizonte/ |
| plano amil curitiba | /plano-amil-parana/ |
| amil saúde brasília | /plano-amil-brasilia/ |
| amil empresarial salvador | /plano-amil-bahia/ |
| plano amil campinas | /plano-amil-campinas/ |
| amil recife | /plano-amil-pernambuco/ |

### 5.4 Termos LSI (Semantic Keywords)

Incluir naturalmente em todo o conteúdo:
- coparticipação, reembolso médico, rede credenciada
- ANS (Agência Nacional de Saúde Suplementar)
- carência, CNPJ, PME (Pequena e Média Empresa)
- beneficiários, UnitedHealth Group
- Amil Espaço Saúde, telemedicina
- cobertura ambulatorial, cobertura hospitalar
- acomodação enfermaria/apartamento

---

## 6. Estratégia SEO Off-Page

### 6.1 Link Building por Fase

| Fase | Ação | Links/mês | Autoridade |
|------|------|:-:|:-:|
| Mês 1-2 | Google Business Profile + diretórios (Reclame Aqui, LinkedIn, Bing) | 10 | Média |
| Mês 2-4 | Guest posts em blogs de RH, contabilidade e benefícios | 8 | Alta |
| Mês 3-6 | Parcerias com escritórios de contabilidade | 5 | Média-Alta |
| Mês 4-8 | Assessoria de imprensa digital (portais saúde/negócios) | 3 | Muito Alta |
| Mês 6-12 | Infográficos compartilháveis + estudos de caso | 4 | Alta |

### 6.2 Google Business Profile

- Categoria: "Corretor de Seguros" + "Seguro Saúde"
- Fotos do escritório e equipe
- Posts semanais no GBP
- Responder 100% das avaliações
- Horário atualizado
- Atributos de serviço completos

---

## 7. Design e UX

### 7.1 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Azul Amil (primária) | #0066CC | Headers, links, elementos principais |
| Verde CTA | #00C853 | Botões de ação, WhatsApp |
| Azul escuro | #1A237E | Textos, footer, headers secundários |
| Cinza claro | #F5F5F5 | Fundos de seção |
| Branco | #FFFFFF | Fundo principal |
| Vermelho urgência | #D32F2F | Alertas, badges "novo" |

### 7.2 CTAs Estratégicos

| Posição | CTA | Cor |
|---------|-----|-----|
| Hero (acima da dobra) | "Simular meu plano empresarial →" | Verde |
| Após tabela de preços | "Quero esta proposta no WhatsApp" | Verde WhatsApp |
| Sidebar sticky (scroll) | "Cotação em 2 minutos" | Azul |
| Final de artigo | "Fale com especialista Amil" | Azul escuro |
| Exit intent popup | "Antes de sair: cotação grátis em 30s" | Vermelho |

### 7.3 Componentes Reutilizáveis

| Componente | Uso | Descrição |
|------------|-----|-----------|
| PlanCard | Páginas de plano, home | Card com nome, preço "a partir de", features, CTA |
| PriceTable | Tabelas de preço | Filtrável por faixa/plano/região |
| QuoteForm | Todas as páginas | Multi-step 4 campos, fixed/floating |
| FAQAccordion | Planos, FAQ, blog | Accordion com Schema FAQPage |
| ComparisonTable | Comparativos | 2 colunas lado a lado |
| LocalHero | Páginas locais | H1 + cidade + mapa + CTA |
| BlogCard | Blog, home | Thumbnail + título + excerpt + data |
| BreadcrumbNav | Todas (exceto home) | Navegação + Schema BreadcrumbList |
| StatsCounter | Home, sobre | Números animados (beneficiários, hospitais) |
| TestimonialCard | Home, locais | Review com estrelas + nome + empresa |

---

## 8. Integrações

### 8.1 Obrigatórias (MVP)

| Integração | Finalidade |
|------------|-----------|
| **Google Analytics 4** | Tráfego, conversões, comportamento |
| **Google Search Console** | Rankings, indexação, erros |
| **Google Tag Manager** | Gestão de tags sem deploy |
| **WhatsApp Business API** | Click-to-chat por região |
| **Google Maps Embed** | Mapas em páginas locais |
| **Google Business Profile** | SEO local |

### 8.2 Recomendadas (Pós-MVP)

| Integração | Finalidade |
|------------|-----------|
| **CRM (HubSpot/Pipedrive)** | Gestão de leads |
| **Hotjar/Clarity** | Heatmaps, gravação de sessões |
| **Semrush/Ahrefs** | Monitoramento de keywords |
| **Mailchimp/Brevo** | Email marketing para leads |

---

## 9. Roadmap de Implementação

### Fase 1: Fundação (Semanas 1-4) — MVP 50 páginas

| Semana | Entrega | Responsável |
|--------|---------|-------------|
| 1 | Arquitetura Next.js + Sanity CMS + Schema base | @architect + @dev |
| 2 | Design system + wireframes + formulário multi-step | @ux + @dev |
| 3 | 8 páginas de plano + home + cotação + contato | @dev |
| 3 | 10 comparativos + 7 tabelas de preço + 15 FAQ | @dev |
| 4 | QA: Core Web Vitals + Schema + mobile + acessibilidade | @qa |
| 4 | Deploy: Vercel + domínio + SSL + Search Console + GA4 | @devops |

**Entregável:** 50 páginas indexadas, PageSpeed 95+, Schema completo

### Fase 2: Expansão Local (Semanas 5-12) — 350 páginas

| Semana | Entrega | Responsável |
|--------|---------|-------------|
| 5-6 | Template de página local + automação CMS | @dev |
| 6-8 | 27 páginas de estado + 100 cidades grandes | @dev + Redator |
| 9-12 | 150 cidades médias + rede credenciada por região | @dev + Redator |

**Entregável:** 400 páginas totais, dominação SEO local iniciada

### Fase 3: Blog Massivo (Semanas 5-24) — 300 posts

| Período | Entrega | Ritmo |
|---------|---------|-------|
| Semanas 5-12 | 64 posts (8/semana) | Categorias prioritárias |
| Semanas 13-24 | 240 posts (8/semana) | Todas as categorias |

**Entregável:** 300+ posts, dominação de long-tail keywords

### Fase 4: Escala Final (Meses 4-12) — 1000+ páginas

| Período | Entrega |
|---------|---------|
| Meses 4-6 | +200 cidades menores |
| Meses 6-9 | +50 páginas de procedimentos ("Amil cobre X?") |
| Meses 9-12 | +100 posts de blog |

**Entregável:** 1000+ páginas, posição Top 3 para keywords principais

---

## 10. Métricas de Sucesso (KPIs)

| KPI | Mês 3 | Mês 6 | Mês 12 |
|-----|-------|-------|--------|
| Páginas indexadas | 100 | 500 | 1000+ |
| Posição média "amil empresarial" | Top 10 | Top 5 | **Top 3** |
| Tráfego orgânico mensal | 2.000 | 10.000 | **50.000+** |
| Keywords no Top 10 | 50 | 200 | **500+** |
| PageSpeed Mobile | 95+ | 95+ | 95+ |
| Taxa de conversão (leads) | 3% | 5% | **7%+** |
| Leads/mês | 100 | 500 | **2.000+** |
| Core Web Vitals | ✅✅✅ | ✅✅✅ | ✅✅✅ |

---

## 11. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|:-:|:-:|-----------|
| Google penalizar conteúdo gerado em massa | Média | Alto | Conteúdo único por página, dados reais por cidade, revisão editorial |
| Concorrentes copiarem estratégia | Baixa | Médio | Vantagem de first-mover, volume difícil de replicar |
| Amil mudar tabela de preços/planos | Alta | Médio | CMS permite atualização rápida sem deploy |
| Problemas legais (uso da marca Amil) | Média | Alto | Disclaimer de corretora autorizada, SUSEP ativo |
| Custos de produção de conteúdo | Alta | Médio | Automação de templates, IA para rascunhos + revisão humana |

---

## 12. Orçamento Estimado

| Item | Custo Mensal | Notas |
|------|:-:|-------|
| Vercel Pro | R$ 100 | Hosting + CI/CD |
| Sanity CMS | R$ 0-500 | Free tier cobre MVP |
| Domínio + SSL | R$ 50/ano | .com.br |
| Google Workspace | R$ 30 | Email profissional |
| Redator freelancer | R$ 2.000-5.000 | 32 posts/mês |
| SEO tools (Semrush/Ahrefs) | R$ 500 | Monitoramento |
| **Total mensal estimado** | **R$ 3.000-6.000** | |

---

## 13. Critérios de Aceitação do MVP

- [ ] 50+ páginas indexadas no Google
- [ ] PageSpeed Mobile 95+ em todas as páginas
- [ ] Schema markup validado (Google Rich Results Test) em todas as páginas
- [ ] Meta title e description em 100% das páginas
- [ ] Formulário multi-step funcional com < 5 campos
- [ ] Core Web Vitals todos verdes (LCP < 1.5s, INP < 50ms, CLS < 0.05)
- [ ] Google Search Console configurado e verificado
- [ ] Google Analytics 4 rastreando conversões
- [ ] Google Business Profile otimizado
- [ ] Mobile-first responsivo testado em 5+ dispositivos
- [ ] WhatsApp click-to-chat funcional
- [ ] Sitemap XML submetido ao Google
- [ ] robots.txt configurado
- [ ] Breadcrumbs com Schema em todas as páginas (exceto home)
- [ ] Alt text em 100% das imagens
- [ ] Zero erros no Google Search Console

---

## Apêndice A: Dados dos Concorrentes (Resumo)

### Tecnologias Identificadas

| Site | CMS | Theme/Framework | Formulário | Chat |
|------|-----|----------------|-----------|------|
| planodesaudeamil.com.br | WordPress 6.9.4 | Flatsome v3.18-19 | Gravity Forms | — |
| planosdesaudeamilrj.com.br | WordPress | Não identificado | Básico | GetButton.io (WhatsApp) |
| corretoresamil.com.br | WordPress | Não identificado | FormCraft v3 | JivoSite |
| rotaseguros.com.br | HTML estático | jQuery + Slick | Link externo | Jivo API |
| amilplanos.com.br | WordPress 6.6.5 | Flatsome | FormCraft v3 | — |
| amilassistenciamedica.com.br | PHP/Laravel | Custom | jQuery mask | WhatsApp link |
| planosdesaudesp.com.br | WordPress | Astra | WPForms Lite | — |
| amilsa.com.br | HTML | Bootstrap 4.4.1 (2019) | — | — |

### Falhas por Frequência

| Falha | Ocorrência (de 8 analisáveis) |
|-------|:-:|
| Meta description ausente | 8/8 (100%) |
| Schema markup ausente | 8/8 (100%) |
| Breadcrumbs ausentes | 7/8 (87%) |
| H1 duplicado ou genérico | 6/8 (75%) |
| Imagens sem alt text | 7/8 (87%) |
| Blog inexistente ou mínimo | 7/8 (87%) |
| FAQ sem Schema | 8/8 (100%) |
| Formulário com 10+ campos | 5/8 (62%) |
| Dados desatualizados | 3/8 (37%) |
| WordPress com plugins pesados | 5/8 (62%) |

---

> **Documento:** PRD-001-amil-empresarial-site.md
> **Versão:** 1.0 | **Data:** 2026-03-17
> **Autor:** Morgan (PM) — Synkra AIOS
> **Próximo passo:** `*create-epic` para quebrar em stories executáveis
