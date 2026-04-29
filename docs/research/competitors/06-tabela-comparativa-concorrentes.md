# Tabela Comparativa — amilplanos.com.br × planodesaudeamil.com.br

**Data:** 2026-04-27
**Fonte:** raspagens documentadas em `02-pages-scraped.md` e `05-planodesaudeamil-deep-scrape.md`

---

## 🏗️ Stack & Arquitetura

| Critério | amilplanos.com.br | planodesaudeamil.com.br | Vencedor |
|----------|-------------------|--------------------------|----------|
| CMS | WordPress | WordPress | Empate |
| Tema | UX Themes | Flatsome | Empate |
| Plugin SEO | Yoast | Yoast | Empate |
| Sub-sitemaps | 8 | 8 | Empate |
| Operador-mãe visível | Não claramente | StarkCorretora (CNPJ + SUSEP) | **PSAmil** |

## 📊 Volume & Inventário

| Critério | amilplanos.com.br | planodesaudeamil.com.br | Vencedor |
|----------|-------------------|--------------------------|----------|
| URLs totais (estimadas) | ~1.500 | ~2.500 | **PSAmil** |
| City pages (municípios) | ~1.500 | ~2.400 | **PSAmil** |
| Páginas de bairro (SP) | 0 | 50+ | **PSAmil** |
| Páginas de produto | 25+ (linhas Fácil/One/Bronze→Black + numéricas) | 15+ (Bronze→Black + S380/450/750/2500) | **AmilPlanos** |
| Posts de blog | 9 | 25 | **PSAmil** |
| Slugs duplicados (`-2`) | SIM (centenas) | NÃO observado | **PSAmil** |
| Páginas-lixo no sitemap | `/test-page/`, `/test/` | `/modelo-pagina-zelas/` | Empate (ambos têm) |

## 🔧 SEO Técnico

| Critério | amilplanos.com.br | planodesaudeamil.com.br | Vencedor |
|----------|-------------------|--------------------------|----------|
| Title tag | Genérico ("X – Planos Amil Saúde") | Genérico ("X – Plano de Saúde Amil") | Empate ❌ |
| Meta description | AUSENTE em todas | AUSENTE em todas | Empate ❌ |
| JSON-LD schema | AUSENTE em todas | AUSENTE em todas | Empate ❌ |
| FAQPage schema | AUSENTE | AUSENTE (apesar de FAQ real!) | Empate ❌ |
| Product/Offer schema | AUSENTE | AUSENTE | Empate ❌ |
| LocalBusiness schema (city pages) | AUSENTE | AUSENTE | Empate ❌ |
| BreadcrumbList schema | AUSENTE | AUSENTE | Empate ❌ |
| Open Graph / Twitter Card | AUSENTE (homepage) | AUSENTE (homepage) | Empate ❌ |
| `lang="pt-BR"` no `<html>` | A confirmar | AUSENTE | — |
| robots.txt | OK (Yoast padrão) | OK (Yoast padrão) | Empate |
| Sitemap-index acessível | Sim | Sim | Empate |

## 🧭 Conteúdo Estratégico

| Critério | amilplanos.com.br | planodesaudeamil.com.br | Vencedor |
|----------|-------------------|--------------------------|----------|
| Pillar `/amil-saude/` profunda | Sim (~1.200 palavras, 95+ links internos) | `/sobre-a-amil/` (~2.500 palavras) | **PSAmil** |
| `/diferenciais/` (USPs) | 17 USPs | 17 USPs (~4.200 palavras) | **PSAmil** (mais denso) |
| Tabela de preços | SIM, mas **setembro/2022** (3+ anos defasada) | SIM, **SP outubro/2025, RJ abril/2025** | **PSAmil** ⭐ |
| Coparticipação dedicada | SIM (~2.100 palavras) | NÃO encontrada (existe `/carencias/` mas não cop) | **AmilPlanos** |
| FAQ dedicada | NÃO (sem URL específica) | SIM `/duvidas-frequentes/` com 45+ Q&A | **PSAmil** ⭐ |
| Página `/por-adesao/` dedicada | NÃO (gap) | SIM `/plano-individual-por-adesao/` + `/familiar/` | **PSAmil** ⭐ |
| Página MEI dedicada | NÃO | Mencionado em menu (URL a confirmar) | **PSAmil** |
| Profundidade de produto | Múltiplas linhas com paridade média | Black profundo, Bronze/Prata/Ouro/Platinum rasos | **AmilPlanos** |

## 📝 Blog Editorial

| Critério | amilplanos.com.br | planodesaudeamil.com.br | Vencedor |
|----------|-------------------|--------------------------|----------|
| Quantidade de posts | 9 | 25 | **PSAmil** |
| % posts on-topic | ~55% (5 de 9) | **100% (25 de 25)** | **PSAmil** ⭐ |
| Posts spam off-topic | 4 (WNBA, Champions, Austin TX, casino) | 0 | **PSAmil** ⭐ |
| Frequência de update | Esparsa | Out/2025 + Jan/2026 (atual) | **PSAmil** |

## 🌎 City Pages (template programático)

| Critério | amilplanos.com.br | planodesaudeamil.com.br | Vencedor |
|----------|-------------------|--------------------------|----------|
| H1 | "Plano Amil [Cidade]" (com qualifier) | "[Cidade]" (genérico) | **AmilPlanos** ⭐ |
| Word count médio | ~2.800 | ~2.500 | **AmilPlanos** |
| Hospitais reais locais | Em capitais (Paulistano, Samaritano, Oswaldo Cruz nominais) | NÃO — lista nacional repetida | **AmilPlanos** ⭐ |
| Sub-marcas mencionadas | Amil, Fácil, One, Dental, Lincx, Medial, Dix, Next | Bronze, Prata, Ouro, Platinum, Black | **AmilPlanos** |
| Hub `/cidade/` central | Existe | Existe `/rede-credenciada/[uf]/` (subpath limpo) | **PSAmil** (URL estrutura) |
| Risco thin content | Médio (saved by qualifier H1 + locais) | **Alto** (lista de hospitais nacionais em município pequeno) | **AmilPlanos** ⭐ |

## 📞 UX & Conversão

| Critério | amilplanos.com.br | planodesaudeamil.com.br | Vencedor |
|----------|-------------------|--------------------------|----------|
| Telefones repetidos | 5 (overload) | 2 (nacional + RJ) | **PSAmil** |
| CTA primário | "CALCULAR PLANO" + "SIMULAR" | "COTAÇÃO ONLINE" + "SIMULE AGORA" | Empate |
| Form de cotação | Sim, FormCraft | Sim, com 200+ opções de profissão + desconto CNPJ | **PSAmil** (ofertas) |
| Imagens carregando | OK | Placeholders base64 quebrados na home | **AmilPlanos** |

## 🛡️ Compliance & Confiança

| Critério | amilplanos.com.br | planodesaudeamil.com.br | Vencedor |
|----------|-------------------|--------------------------|----------|
| CNPJ visível | Não destacado | Sim (27.782.880/0001-51) | **PSAmil** ⭐ |
| SUSEP visível | Não destacado | Sim (202067655) | **PSAmil** ⭐ |
| Disclaimers "corretora autorizada" | Tímido | Explícito | **PSAmil** |
| Dados quantificados verificáveis (sobre operadora) | Genérico ("28 anos tradição") | 6M beneficiários, 26k médicos, 469k empresas | **PSAmil** ⭐ |

## 🎯 Veredito Geral (vencedor por dimensão)

| Dimensão | Vencedor |
|----------|----------|
| Stack & Arquitetura | Empate |
| Volume bruto | **planodesaudeamil** |
| SEO técnico (schema, meta) | Empate ❌ ambos terríveis |
| Conteúdo estratégico | **planodesaudeamil** (5 pontos × 2) |
| Blog | **planodesaudeamil** (limpo + 3× volume) |
| City pages | **amilplanos** (locais reais + H1 qualifier) |
| UX/Conversão | **planodesaudeamil** (menos telefones, mais form) |
| Compliance | **planodesaudeamil** |

**Score final ponderado:**
- amilplanos.com.br: **6,5/10**
- planodesaudeamil.com.br: **7/10**

---

## 🏹 Como o Satélite Astro+Bun ataca AMBOS

| Vetor | Como ganhamos |
|-------|---------------|
| **Schema 100%** | Implementar Organization + LocalBusiness × 5570 + Product × 12+ + FAQPage + BreadcrumbList + Article — ambos têm 0 schema |
| **Meta dinâmica** | Template de meta description gerado por página com keyword + CTA — ambos têm 0 |
| **Core Web Vitals** | Astro SSG + 0 KB JS = LCP <1s, CLS 0 — ambos rodam WordPress pesado |
| **City pages com locais REAIS** | Banco de hospitais por município (gap de planodesaudeamil); H1 qualifier (gap de planodesaudeamil mas não amilplanos) |
| **Blog editorial** | 30+ posts on-topic + AuthorSchema + Article — superar volume do PSAmil mantendo limpeza |
| **Tabela de preços auto-atualizada** | Cron job atualizando mensal — ambos têm defasagem (3 anos amilplanos, 6 meses PSAmil RJ) |
| **FAQPage schema** | PSAmil tem 45 Q&A sem schema — copiamos texto e adicionamos schema → roubamos featured snippets |
| **Compliance** | CNPJ+SUSEP visíveis (replicar PSAmil) |
| **URL limpa** | Subpath `/rede/[uf]/[cidade]/` (sem sufixos `-2` do amilplanos, melhor que `/[cidade]/` raso do PSAmil) |
| **Profundidade paritária produto** | Bronze/Prata/Ouro/Platinum/Black com mesmas seções (gap de PSAmil) |

---

## ⚠️ Avisos sobre métricas

Não é possível afirmar % de tráfego sem dados de Ahrefs/SEMRush — análise acima é estrutural/técnica, não de performance real. Score 6,5 e 7,0 são qualitativos. KPIs reais de SEO devem ser definidos em conjunto com @pm após acesso a GSC + ferramenta de keywords.
