# Raspagem Profunda — planodesaudeamil.com.br

**Data:** 2026-04-27
**Método:** WebFetch (HTML→markdown), 12 páginas estratégicas + 4 sub-sitemaps
**Operador-mãe:** StarkCorretora (CNPJ 27.782.880/0001-51 / SUSEP 202067655)

---

## 1. Estrutura Técnica

### robots.txt
```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Sitemap: https://planodesaudeamil.com.br/sitemap.xml
Sitemap: https://planodesaudeamil.com.br/sitemap.html
```
*Idêntico ao do amilplanos.com.br — boilerplate Yoast.*

### Stack detectada
- **CMS:** WordPress
- **Tema:** Flatsome (footer: "Copyright 2026 © Flatsome Theme")
- **Plugin SEO:** Yoast (sub-sitemaps numerados)

### Sitemap-index (8 sub-sitemaps)
| Sub-sitemap | Conteúdo |
|-------------|----------|
| `sitemap-misc.xml` | homepage + sitemap.html (lastmod 2026-01-05) |
| `post-sitemap.xml` | **25 posts de blog** (todos 100% on-topic Amil/saúde) |
| `page-sitemap.xml` | Páginas estratégicas + rede credenciada por estado + city pages (A) |
| `page-sitemap2-6.xml` | City pages restantes |

**Estimativa total:** ~2.500+ URLs (city pages predominantes).

---

## 2. Inventário de URLs Estratégicas

### Páginas-âncora
- `/` — homepage
- `/sobre-a-amil/`
- `/duvidas-frequentes/` ⭐ FAQ DEDICADO
- `/diferenciais/`
- `/contato/`
- `/blog/`
- `/tabela-de-precos-amil/` ⭐ ATUALIZADA 2025

### Audiência (segmentação) — gap competitivo
- `/plano-individual-por-adesao/` ⭐ keyword "por adesão" pura
- `/plano-familiar-por-adesao/` ⭐
- `/plano-empresarial/`
- *(MEI mencionado no menu, URL específica a confirmar)*

### Catálogo de produtos
- `/amil-bronze/`, `/amil-prata/`, `/amil-ouro/`, `/amil-platinum/`, `/amil-black/`
- `/bronze-sp/`, `/bronze-sp-mais/`, `/bronze-rj/`, `/bronze-rj-mais/`, `/bronze-df/`, `/bronze-pr/`
- `/amil-s380/`, `/amil-s450/`, `/amil-s750/`, `/amil-s2500/`
- `/amil-dental-100-promo/`

### Suporte / Educacional
- `/carencias/`
- `/elegibilidade/`
- `/modalidade-de-contratacao/`
- `/regras-de-comercializacao/`
- `/tabela-de-precos-amil/`

### Rede credenciada (subpath limpo — SEO bom)
- `/rede-credenciada/`
- `/rede-credenciada/sao-paulo/`, `/rio-de-janeiro/`, `/minas-gerais/`, `/parana/`, `/distrito-federal/`, `/santa-catarina/`, `/bahia/`, `/rio-grande-do-sul/`, `/acre/` *(27 estados)*

### City pages (~2.400 URLs, 1 por município)
Padrão `/[municipio]/` — cobertura geográfica nacional (Abadia de Goiás, Abadia dos Dourados, …, Trajano de Moraes).

### Bairros SP (50+)
Padrão `/[bairro]/` — `/agua-rasa/`, `/butanta/`, etc. (gap exclusivo: amilplanos não tem).

### Páginas-lixo / risco
- `/modelo-pagina-zelas/` — template residual não removido

---

## 3. Auditoria SEO Página por Página

### `/` (Homepage)
- **Title:** "Plano de Saúde Amil | Corretora Autorizada" (presumido)
- **Meta description:** AUSENTE
- **H1:** "Plano de saúde amil" (keyword pura, lowercase)
- **H2 destacados:** "Amil one", "amil fácil", "amil dental", "Amil em Números", "O PLANO DE SAÚDE AMIL É BOM?", "DIFERENCIAIS AMIL", "Nova Grade de Planos Amil"
- **Word count:** ~3.500
- **JSON-LD:** AUSENTE
- **Open Graph:** AUSENTE
- **Lang attribute:** AUSENTE no `<html>`
- **Telefones:** 2 (nacional + RJ)
- **CTAs:** "COTAÇÃO ONLINE", "SIMULE AGORA", "SIMULAR PLANO"
- **Imagens quebradas:** placeholders base64 GIF (provável lazy-load mal configurado)

### `/plano-empresarial/`
- Title: "Plano Empresarial – Plano de Saúde Amil"
- Word count: ~3.500
- **Tabelas reais com preços** SP (atualizada 09/10/2025) e RJ (24/04/2025)
- 6 H2 estruturados: "Como contratar / Categorias / Benefícios / Rede / Carências / Abrangências"
- Meta description: AUSENTE / Schema: AUSENTE / FAQ embutido: NÃO

### `/plano-individual-por-adesao/`
- Title: "Plano Individual por Adesão – Plano de Saúde Amil"
- Word count: ~2.500
- Mesma estrutura 6-H2
- Meta/Schema/FAQ: AUSENTES

### `/plano-familiar-por-adesao/`
- Title: "Plano Familiar por Adesão – Plano de Saúde Amil"
- Word count: ~2.800
- 10 H2, mesma estrutura + "Saiba mais no blog"
- Meta/Schema: AUSENTES

### `/duvidas-frequentes/` ⭐
- H1: "Dúvidas Frequentes"
- **45+ Q&A em accordion** sobre rede, pagamento, reembolso, agendamento
- Word count: ~3.500
- **❌ FAQPage schema AUSENTE** — perde People Also Ask / Featured Snippets
- Title/meta: não detectados

### `/rede-credenciada/`
- Title: "Rede Credenciada – Plano de Saúde Amil"
- 4 hospitais por tier (Albert Einstein, Sírio Libanês, etc.)
- 27 estados linkados
- Word count moderado, conteúdo genérico ("ampla cobertura")
- Meta/Schema: AUSENTES

### `/tabela-de-precos-amil/` ⭐
- Title: "Tabela de Preços Amil – Plano de Saúde Amil"
- **15+ planos listados com tabelas reais por faixa etária**
- **SP atualizada outubro/2025; RJ abril/2025** (defasagem de 6 meses entre regiões)
- Word count: ~3.500
- Meta/Schema PriceSpecification: AUSENTES

### `/blog/`
- Title: "Blog – Plano de Saúde Amil"
- 25 posts, **100% on-topic** (Amil S80 series, ANS, IR, eleição & saúde, autismo, doenças do outono)
- 2 posts em destaque + lista
- **ZERO conteúdo spam off-topic** (vs amilplanos com 4/9 posts spam!)

### `/sao-paulo/` (city page capital)
- Title: "São Paulo – Plano de Saúde Amil"
- H1: "São Paulo" (genérico — sem qualifier!)
- 18 hospitais nominados
- Conteúdo: template semi-customizado
- Meta/Schema: AUSENTES

### `/abadia-de-goias/` (city page município pequeno)
- Title: "Abadia de Goiás – Plano de Saúde Amil"
- H1: "Abadia de Goiás"
- Word count: ~2.500
- **Hospitais listados são nacionais (Sírio, Einstein, Pro-Cardíaco), não locais**
- Cobertura mencionada apenas SP/RJ/DF/PR — sem dados reais de Goiás
- ⚠️ **RISCO MODERADO-ALTO de thin/duplicate content** (Google penaliza)

### `/amil-black/` (produto premium)
- 6 itens "Coberturas Assistenciais"
- 11 diferenciais específicos
- 7 regiões com hospitais de destaque
- **Profundidade muito superior aos demais (Bronze/Prata/Ouro/Platinum são rasos)** — paridade ausente

### `/sobre-a-amil/`
- Word count: ~2.500
- **Dados quantificáveis verificáveis:**
  - 6 milhões de beneficiários (3,3M médico + 2,5M dental)
  - 469 mil empresas
  - 22 mil colaboradores
  - 26 mil médicos / 14 mil prestadores odontológicos
  - 2,1M atendimentos urgência via telemedicina
- CNPJ corretora 27.782.880/0001-51 + SUSEP 202067655 visíveis

### `/diferenciais/`
- Word count: ~4.200 (denso, melhor que homepage)
- **17 USPs listados** (Amil Espaço Saúde, Telemedicina, Desconto Farmácia, Resgate, Reembolso, Coleta Domiciliar, Telemedicina One, Embaixadas One, Sírio/Einstein retaguarda, Samaritano retaguarda, Vacinas, Vacinas em domicílio, Acompanhante internação, Courier reembolso, Pré-hospitalar, Urgência nacional, Seguro viagem)

---

## 4. Defeitos Técnicos Consolidados

### Críticos
1. **JSON-LD schema 100% ausente** em todas as 12 páginas auditadas (Organization, LocalBusiness, FAQPage, Product, BreadcrumbList, Article — nenhum)
2. **Meta description ausente** em todas as páginas
3. **FAQPage schema ausente apesar de 45+ Q&As reais** — perde People Also Ask
4. **Lang attribute ausente** no `<html>` — afeta acessibilidade e Google
5. **Open Graph / Twitter Card ausentes** — compartilhamento social degradado

### Sérios
6. **City pages thin content:** hospitais nacionais, não locais — risco SGE/Google de penalização por duplicação programática
7. **H1 city pages só com nome da cidade** ("São Paulo") — não otimiza keyword "plano de saúde amil em [cidade]"
8. **Tabela RJ defasada 6 meses vs SP** (abril/2025 vs outubro/2025)
9. **Bronze/Prata/Ouro/Platinum rasos vs Black profundo** — paridade ausente prejudica intent comparativo
10. **Sem badge "Atualizado em..." visível** no topo das tabelas (só dentro)

### Moderados
11. **Imagens com placeholder base64 quebradas** na homepage (lazy-load mal config)
12. **`/modelo-pagina-zelas/` no sitemap** — página de teste indexável
13. **Bairros SP em URL raiz** (`/butanta/`) — pode canibalizar com city pages homônimas
14. **Sem breadcrumbs visíveis nem schema** — UX e SERP prejudicados
15. **2 telefones repetidos em todas as páginas** (melhor que os 5 do concorrente, mas ainda dilui)

### Pontos onde NÃO há defeito (vs amilplanos.com.br)
- ✅ Blog 100% on-topic (sem WNBA/casino)
- ✅ Tabela de preços atualizada 2025 (vs 2022)
- ✅ Sem sufixo "-2" em city pages observadas
- ✅ FAQ dedicado (45+ Q&As)
- ✅ Subpath `/rede-credenciada/[uf]/` limpo
- ✅ CNPJ + SUSEP visíveis (compliance)

---

## 5. Veredito de Posicionamento

`planodesaudeamil.com.br` é **tecnicamente equivalente** a `amilplanos.com.br` em SEO técnico (ambos sem schema, sem meta) mas **estrategicamente superior** em 5 frentes:
1. Blog limpo (sem spam)
2. Preços atualizados (2025 vs 2022)
3. FAQ dedicado
4. URLs limpas (sem `-2`)
5. Compliance visível

E **inferior** em:
1. Volume bruto (~2.500 vs ~1.500+ city pages do amilplanos — embora ambos massivos)
2. Profundidade da `/rede-credenciada/` master (genérica)
3. Paridade de produtos (Black >> Bronze/Prata)

**Avaliação:** 7/10 (vs 6,5/10 do amilplanos).
Para superar: replicar a profundidade de `/diferenciais/` e a frescura de tabela, **adicionando schema rico, meta dinâmica e conteúdo local real** — que é exatamente o ataque vetorial Astro+Bun.
