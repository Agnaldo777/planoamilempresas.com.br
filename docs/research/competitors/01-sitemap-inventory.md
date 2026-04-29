# Inventory de URLs — amilplanos.com.br

**Data da coleta:** 2026-04-27
**Fonte:** sitemap.xml + 8 sub-sitemaps WordPress (Yoast)
**Tecnologia detectada:** WordPress + UX Themes + FormCraft

## robots.txt
```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Sitemap: https://amilplanos.com.br/sitemap.xml
Sitemap: https://amilplanos.com.br/sitemap.html
```

## Estrutura de Sitemaps
- `/sitemap-misc.xml` — homepage + sitemap.html
- `/post-sitemap.xml` — 9 posts de blog
- `/page-sitemap.xml` — páginas estratégicas + iniciais city pages (~330 entries)
- `/page-sitemap2.xml` a `/page-sitemap6.xml` — continuação de páginas (predomínio: city pages programáticas)

## INSIGHT ESTRATÉGICO PRINCIPAL

**SEO Programático Massivo:** o concorrente tem ~1500+ páginas geradas, sendo a maioria **uma página por município brasileiro** (de `/sao-paulo/` a `/abadia-de-goias/`). Isso permite ranquear no formato "plano de saúde amil em [cidade]".

Há sufixo `-2` em muitas cidades (ex: `/sao-paulo-2/`, `/abaetetuba-2/`) — sugere **duplicação intencional** para variações de keyword OU geração automatizada com colisão de slugs.

## Categorias de URLs (não-city)

### A. Páginas Estratégicas (alta prioridade SEO)
| URL | Função |
|-----|--------|
| `/` | Homepage |
| `/amil-saude/` | Pillar page principal |
| `/diferenciais/` | Differentiators / value prop |
| `/rede-credenciada/` | Hospital/clinic network |
| `/contato/` | Contact + form |
| `/orcamento/` | Quote / lead capture |
| `/vendas/` | Sales / conversion |

### B. Audiência (segmentação)
- `/plano-individual/`
- `/plano-familiar/`
- `/plano-pme/`
- `/plano-empresarial/`

### C. Linha de Produtos Amil (catálogo completo)
**Tier numérico (legado):**
- `/amil-200/`, `/amil-400/`, `/amil-500/`, `/amil-700/`
- `/amil-s380/`, `/amil-s450/`, `/amil-s750/`
- `/amil-co330/`

**Linha Fácil (entry-level):**
- `/plano-amil-facil/`
- `/amil-facil-s40/`, `/amil-facil-s60/`, `/amil-facil-s80/`, `/amil-facil-s80bh/`
- `/amil-facil-s60-sp-mais/`, `/amil-facil-rj/`, `/amil-facil-f110-sp/`
- `/amil-facil-rede-selecionada/`

**Linha Bronze/Prata/Ouro/Platinum/Black (nova grade):**
- `/amil-plano-bronze/`, `/amil-plano-bronze-sp/`, `/amil-plano-bronze-sp-mais/`
- `/amil-plano-bronze-rj/`, `/amil-plano-bronze-rj-mais/`
- `/amil-plano-prata/`, `/amil-plano-ouro/`
- `/amil-plano-platinum/`, `/amil-plano-platinum-mais/`
- `/amil-plano-black/`

**Linha One (premium):**
- `/amil-one-s1500/`, `/amil-one-s2500/`, `/amil-one-s6500-black/`
- `/amil-one-rede-selecionada/`

**Outras linhas:**
- `/amil-next/` (futurista/digital)
- `/plano-saude-medial/` (Medial)
- `/amil-rede-selecionada/`

### D. Dental
- `/amil-dental-odontologico/`
- `/amil-dental-individual/`
- `/amil-dental-empresarial/`
- `/amil-dental-e60-protese-clinica/`
- `/amil-dental-e80-ortodontia/`
- `/amil-dental-e90-protese-estetica/`
- `/amil-dental-e170-protese-orto/`

### E. Suporte / Educacional (alvo informacional)
- `/tabela-de-precos-amil/` ⭐ keyword high-intent
- `/coparticipacao-amil/` ⭐ keyword informacional
- `/reembolso-amil/`
- `/reducao-de-carencias/`
- `/telemedicina-amil/`
- `/rede-de-hospitais-dor-amil/`
- `/amil-agencias-de-atendimento/`
- `/amil-resgate/`
- `/amil-multiviagem/`
- `/blog/`
- `/cidade/` (provavelmente hub de city pages)

### F. Blog (escasso, 9 posts)
- 5 posts relevantes (Amil/saúde/dental)
- 4 posts off-topic (WNBA, Champions League, Austin TX, Turkey, Argentina casino) — **possível conteúdo gerado por IA / spam ou tentativa de domain authority externa**

### G. Páginas-Lixo (devem ser ignoradas)
- `/test-page/`
- `/test/`

### H. SEO Programático (city pages) — ~1500 URLs
Todos os municípios brasileiros (estimativa). Capitais e cidades médias têm slug limpo (`/sao-paulo/`); muitas cidades aparecem com sufixo `-2` (`/sao-paulo-2/`), sugerindo geração automatizada.

**Exemplos de top capitais:** sao-paulo, rio-de-janeiro, brasilia, salvador, fortaleza, belo-horizonte, manaus, curitiba, recife, goiania, belem, porto-alegre.

**Hub central:** `/cidade/` (a confirmar)

## Próximos passos (Fase 2)
Scraping de pelo menos 12 landing pages estratégicas:
1. `/` (homepage — já parcialmente feito)
2. `/amil-saude/`
3. `/plano-individual/`, `/plano-familiar/`, `/plano-pme/`, `/plano-empresarial/`
4. `/rede-credenciada/`, `/diferenciais/`
5. `/tabela-de-precos-amil/`, `/coparticipacao-amil/`
6. `/sao-paulo/` (sample city page para entender template)
7. `/blog/` (estrutura editorial)
