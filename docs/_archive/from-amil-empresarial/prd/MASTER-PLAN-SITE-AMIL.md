# MASTER PLAN: Site Amil Empresarial — Dominação Total

> **Versão:** 1.0 | **Data:** 2026-03-17
> **Autor:** Morgan (PM) — Synkra AIOS
> **Integra:** PRD-001 + Addendum Keywords + Pesquisa OKR + Arquitetura Bradesco
> **Objetivo:** Top 1 Google para planos Amil empresariais em 6-12 meses

---

## VISÃO EXECUTIVA

Criar um **mega-site de 1.200+ páginas** para corretora Amil, unindo:
- **Modelo Bradesco** (portal centralizado + microsites temáticos + 1000+ páginas)
- **Pesquisa de Keywords** (125.000+ buscas/mês mapeadas com volumes SEMrush)
- **3 OKRs de SEO** com KRs mensuráveis
- **Análise de 10 concorrentes** (todos com falhas críticas)
- **Stack técnica moderna** (Next.js 15 + Sanity CMS + Vercel)

**Volume total capturável: 125.000+ buscas/mês**
**Projeção de tráfego em 12 meses: 60.000-125.000 visitas/mês**

---

## PARTE 1: ARQUITETURA DE 1.200+ PÁGINAS (Modelo Bradesco Adaptado)

### Como a Bradesco Escala para 1000+ Páginas

A Bradesco usa **portal centralizado + microsites temáticos**:
- Domínios separados por produto (bradescosaude.com.br, bradescodental.com.br)
- Portais de login especializados por público
- Modularização de componentes reutilizáveis
- Content mapping por produto e persona

### Nossa Adaptação (Melhor que a Bradesco)

Em vez de múltiplos domínios, usamos **1 domínio com silos profundos** — isso concentra toda a autoridade (Domain Authority) num único domínio, ao invés de diluir entre vários.

### Mapa Completo do Site — 1.200+ Páginas

```
🏠 HOME
│   Keywords: amil plano de saude (18.100), plano de saude amil (14.800)
│   Volume capturável: 48.300/mês
│
├── 📋 SILO 1: PLANOS (/planos/)
│   │   Keywords: amil planos (5.400), planos amil (2.400)
│   │   Volume: 11.600/mês
│   │
│   ├── /planos/amil-facil-s60/          ← página produto
│   ├── /planos/amil-facil-s80/
│   ├── /planos/amil-facil-f110/         ← NOVO (descoberto na análise)
│   ├── /planos/amil-s380/
│   ├── /planos/amil-s450/
│   ├── /planos/amil-s580/
│   ├── /planos/amil-s750/
│   ├── /planos/amil-one-s2500/
│   └── /planos/amil-one-s6500-black/
│       → 9 páginas × 1.500+ palavras = 13.500+ palavras
│       → Schema: Product + FAQPage + BreadcrumbList
│       → 9 PÁGINAS
│
├── 💼 SILO 2: EMPRESARIAL (/empresarial/) ★ FOCO PRINCIPAL
│   │   Keywords: amil empresa (9.900), amil empresas (4.400), amil empresarial (1.900)
│   │   Volume: 16.520/mês
│   │
│   ├── /empresarial/                     ← PILAR (2.500+ palavras)
│   ├── /empresarial/mei/                 ← "amil mei", "plano amil mei"
│   ├── /empresarial/pme-2-a-29-vidas/    ← "amil pme", "amil 2 vidas"
│   ├── /empresarial/pme-30-a-99-vidas/
│   ├── /empresarial/grandes-empresas/    ← "amil corporativo", "amil 100 vidas"
│   ├── /empresarial/como-contratar/      ← "como contratar amil empresarial"
│   ├── /empresarial/beneficios-rh/       ← "benefícios plano saúde empresa"
│   └── /empresarial/carencia-zero/       ← "amil empresarial carência zero"
│       → 8 PÁGINAS
│
├── 🦷 SILO 3: AMIL DENTAL (/amil-dental/)
│   │   Keywords: amil dental (6.600), plano amil dental (1.300)
│   │   Volume: 10.170/mês
│   │
│   ├── /amil-dental/                     ← PILAR
│   ├── /amil-dental-empresarial/         ← amil dental empresarial (720)
│   ├── /amil-dental/rede-credenciada/    ← amil dental rede credenciada (1.300)
│   ├── /amil-dental/precos/              ← tabela preços amil dental
│   ├── /amil-dental/individual/
│   └── /amil-dental/cobertura/           ← "amil dental cobre o que"
│       → 6 PÁGINAS
│
├── 📊 SILO 4: COMPARATIVOS (/comparativos/)
│   │   Keywords: "amil vs unimed", "s380 vs s450"
│   │   Volume: ~5.000/mês (long-tail)
│   │
│   │   INTERNOS (Amil vs Amil):
│   ├── /comparativos/amil-s380-vs-s450/
│   ├── /comparativos/amil-s450-vs-s750/
│   ├── /comparativos/amil-s60-vs-s80/
│   ├── /comparativos/amil-s750-vs-one-s2500/
│   ├── /comparativos/amil-facil-vs-amil/
│   ├── /comparativos/amil-vs-amil-one/
│   ├── /comparativos/amil-one-s2500-vs-s6500/
│   ├── /comparativos/amil-s380-vs-s750/
│   │
│   │   EXTERNOS (Amil vs Concorrentes):
│   ├── /comparativos/amil-vs-unimed/
│   ├── /comparativos/amil-vs-sulamerica/
│   ├── /comparativos/amil-vs-bradesco-saude/
│   ├── /comparativos/amil-vs-hapvida/
│   ├── /comparativos/amil-vs-porto-seguro/
│   ├── /comparativos/amil-vs-notredame/
│   ├── /comparativos/amil-vs-prevent-senior/
│   ├── /comparativos/amil-vs-allianz/
│   │
│   │   EMPRESARIAIS:
│   ├── /comparativos/amil-empresarial-vs-unimed-empresarial/
│   ├── /comparativos/amil-one-vs-bradesco-top/
│   ├── /comparativos/amil-dental-vs-odontoprev/
│   └── /comparativos/amil-dental-vs-sulamerica-odonto/
│       → 20 PÁGINAS
│
├── 💰 SILO 5: TABELA DE PREÇOS (/tabela-de-precos/)
│   │   Keywords: amil tabela de preços (1.900), plano amil preço (2.400)
│   │   Volume: 9.800/mês
│   │
│   ├── /tabela-de-precos/                ← PILAR (hub com todos os planos)
│   ├── /tabela-de-precos/amil-facil/
│   ├── /tabela-de-precos/amil-s380/
│   ├── /tabela-de-precos/amil-s450/
│   ├── /tabela-de-precos/amil-s580/
│   ├── /tabela-de-precos/amil-s750/
│   ├── /tabela-de-precos/amil-one/
│   ├── /tabela-de-precos/amil-dental/
│   ├── /tabela-de-precos/empresarial/    ← tabela preço amil empresarial (390)
│   ├── /tabela-de-precos/mei/
│   ├── /tabela-de-precos/individual/     ← tabela preço amil individual (1.300)
│   ├── /tabela-de-precos/por-faixa-etaria/
│   └── /tabela-de-precos/comparativo-geral/
│       → 13 PÁGINAS
│
├── 🏥 SILO 6: REDE CREDENCIADA (/rede-credenciada/)
│   │   Keywords: amil rede credenciada (4.400), rede credenciada amil (3.600)
│   │   Volume: 8.000/mês + 3.380/mês (especialidades)
│   │
│   ├── /rede-credenciada/                ← PILAR
│   ├── /rede-credenciada/hospitais/
│   ├── /rede-credenciada/laboratorios/
│   ├── /rede-credenciada/clinicas/
│   ├── /rede-credenciada/pronto-socorro/ ← pronto socorro amil (480)
│   ├── /rede-credenciada/amil-espaco-saude/ ← amil espaço saúde (1.300)
│   │
│   │   ESPECIALIDADES (QUICK WIN — nenhum concorrente tem):
│   ├── /rede-credenciada/ginecologista/  ← ginecologista amil (880)
│   ├── /rede-credenciada/dermatologista/ ← dermatologista amil (720)
│   ├── /rede-credenciada/endocrinologista/ ← endocrinologista amil (590)
│   ├── /rede-credenciada/ortopedista/    ← ortopedista amil (480)
│   ├── /rede-credenciada/oftalmologista/ ← oftalmologista amil (390)
│   ├── /rede-credenciada/nutricionista/  ← nutricionista amil (320)
│   ├── /rede-credenciada/dentista/       ← dentista amil (480)
│   ├── /rede-credenciada/pediatra/
│   ├── /rede-credenciada/cardiologista/
│   └── /rede-credenciada/psicologo/      ← saúde mental (tendência)
│       → 16 PÁGINAS
│
├── 🏢 SILO 7: PORTAL EMPRESA (/portal-empresa/)
│   │   Keywords: amil empresa login (2.400), portal amil empresa (2.400)
│   │   Volume: 9.800/mês
│   │
│   ├── /portal-empresa/                  ← PILAR
│   ├── /portal-empresa/como-acessar/
│   ├── /portal-empresa/segunda-via-boleto/ ← amil empresa 2 via boleto
│   ├── /portal-empresa/incluir-beneficiario/
│   └── /portal-empresa/faq/
│       → 5 PÁGINAS
│
├── 📞 SILO 8: CONTATO EMPRESAS (/contato-empresas/)
│   │   Keywords: telefone amil empresa (1.000), amil empresarial telefone (880)
│   │   Volume: 3.640/mês
│   │
│   ├── /contato-empresas/                ← PILAR (telefones regionais)
│   ├── /contato-empresas/whatsapp/
│   └── /contato-empresas/sac-empresarial/
│       → 3 PÁGINAS
│
├── 📍 SILO 9: SEO LOCAL (/plano-amil-[estado]/)
│   │   Keywords: "plano amil são paulo", "amil rio de janeiro", etc.
│   │   Volume: ~30.000/mês (soma de buscas locais)
│   │
│   │   HUBS ESTADUAIS (27):
│   ├── /plano-amil-sao-paulo/
│   │   ├── /plano-amil-sao-paulo/empresarial/
│   │   ├── /plano-amil-sao-paulo/rede-credenciada/
│   │   ├── /plano-amil-guarulhos/
│   │   ├── /plano-amil-campinas/
│   │   ├── /plano-amil-santos/
│   │   ├── /plano-amil-osasco/          ← amil espaço saúde osasco
│   │   ├── /plano-amil-santo-andre/
│   │   ├── /plano-amil-sao-bernardo/
│   │   └── ... (50+ cidades SP)
│   │
│   ├── /plano-amil-rio-de-janeiro/
│   │   ├── /plano-amil-niteroi/
│   │   ├── /plano-amil-nova-iguacu/     ← hospital amil nova iguaçu
│   │   ├── /plano-amil-duque-de-caxias/ ← amil espaço saúde caxias
│   │   └── ... (40+ cidades RJ)
│   │
│   ├── /plano-amil-minas-gerais/
│   │   ├── /plano-amil-belo-horizonte/
│   │   └── ... (30+ cidades MG)
│   │
│   ├── /plano-amil-parana/
│   │   ├── /plano-amil-curitiba/
│   │   ├── /plano-amil-sao-jose-dos-pinhais/ ← amil espaço saúde SJP
│   │   └── ...
│   │
│   ├── /plano-amil-brasilia/
│   ├── /plano-amil-bahia/
│   ├── /plano-amil-pernambuco/
│   ├── /plano-amil-rio-grande-do-sul/
│   ├── /plano-amil-santa-catarina/
│   └── ... (26 estados + DF)
│   │
│   │   ESPAÇO SAÚDE POR BAIRRO/CIDADE:
│   ├── /amil-espaco-saude-tatuape/       ← amil espaço saúde tatuapé
│   ├── /amil-espaco-saude-santana/       ← amil espaço saúde santana
│   ├── /amil-espaco-saude-tijuca/        ← amil espaço saúde tijuca
│   ├── /amil-espaco-saude-botafogo/
│   ├── /amil-espaco-saude-campo-grande/  ← amil espaço saúde campo grande
│   └── ... (todas as unidades)
│       → 550+ PÁGINAS
│
├── ❓ SILO 10: FAQ (/perguntas-frequentes/)
│   │   Volume: ~8.000/mês (long-tail agregado)
│   │
│   │   FAQ GERAIS:
│   ├── /faq/carencia-amil/
│   ├── /faq/coparticipacao-o-que-e/
│   ├── /faq/reembolso-como-funciona/     ← amil reembolso
│   ├── /faq/portabilidade-para-amil/
│   ├── /faq/segunda-via-boleto/          ← amil 2 via boleto
│   ├── /faq/telemedicina-amil/           ← telemedicina amil
│   ├── /faq/elegibilidade-amil/          ← amil elegibilidade
│   ├── /faq/carteirinha-amil/            ← carteirinha amil
│   │
│   │   FAQ PROCEDIMENTOS ("Amil cobre X?"):
│   ├── /faq/amil-cobre-cirurgia-bariatrica/
│   ├── /faq/amil-cobre-fertilizacao/
│   ├── /faq/amil-cobre-aparelho-ortodontico/
│   ├── /faq/amil-cobre-fisioterapia/
│   ├── /faq/amil-cobre-psicoterapia/     ← saúde mental (tendência)
│   ├── /faq/amil-cobre-rpg/
│   ├── /faq/amil-cobre-vacinas/
│   │
│   │   FAQ EMPRESARIAL:
│   ├── /faq/amil-aceita-mei/
│   ├── /faq/amil-empresarial-2-vidas/
│   ├── /faq/amil-empresarial-carencia-zero/
│   ├── /faq/como-cancelar-plano-amil/
│   ├── /faq/amil-e-bom-plano/            ← "amil é bom plano de saúde"
│   │
│   │   FAQ DENTAL:
│   ├── /faq/amil-dental-cobre-implante/
│   ├── /faq/amil-dental-cobre-aparelho/
│   └── ... (50+ FAQs totais)
│       → 50+ PÁGINAS
│
├── 📝 SILO 11: BLOG (/blog/)
│   │   Volume: ~20.000/mês (long-tail agregado)
│   │
│   │   CATEGORIAS:
│   ├── /blog/guias/                       → 40+ posts
│   ├── /blog/noticias/                    → 60+ posts
│   ├── /blog/comparativos/                → 25+ posts
│   ├── /blog/dicas-saude/                 → 35+ posts
│   ├── /blog/legislacao-ans/              → 25+ posts
│   ├── /blog/beneficios-corporativos/     → 35+ posts
│   ├── /blog/amil-dental/                 → 20+ posts
│   └── /blog/faq-long-tail/              → 60+ posts
│       → 300+ POSTS
│
├── 🧮 /cotacao-online/                    ← Formulário multi-step full-page
├── 🏢 /sobre-nos/
├── 📞 /contato/                           ← Contato geral (PF + PJ)
└── 🗺️ /sitemap/
```

### Contagem Total de Páginas

| Silo | Páginas | Volume Capturável |
|------|:-:|:-:|
| Home | 1 | 48.300/mês |
| Planos (produto) | 9 | ~15.000/mês |
| **Empresarial** | **8** | **16.520/mês** |
| **Amil Dental** | **6** | **10.170/mês** |
| Comparativos | 20 | ~5.000/mês |
| Tabela de preços | 13 | 9.800/mês |
| Rede credenciada + Especialidades | 16 | 11.380/mês |
| **Portal empresa** | **5** | **9.800/mês** |
| Contato empresas | 3 | 3.640/mês |
| **Páginas locais (estados + cidades)** | **550+** | **~30.000/mês** |
| FAQ | 50+ | ~8.000/mês |
| Blog | 300+ | ~20.000/mês |
| Utilitárias | 5 | — |
| **TOTAL** | **~1.200+** | **~125.000+/mês** |

---

## PARTE 2: KEYWORD MAPPING POR SILO (Volumes SEMrush)

### Mapeamento: Keyword → Página → Volume

#### TIER 1 — Keywords com 5.000+ buscas/mês (Prioridade Absoluta)

| Keyword | Volume | Página Alvo | Silo |
|---------|:-:|-------------|------|
| amil plano de saude | 18.100 | HOME | Home |
| plano de saude amil | 14.800 | HOME | Home |
| amil empresa | 9.900 | /empresarial/ | Empresarial |
| amil saude | 9.900 | HOME | Home |
| plano amil | 6.600 | HOME | Home |
| amil dental | 6.600 | /amil-dental/ | Dental |
| amil planos | 5.400 | /planos/ | Planos |

**Subtotal TIER 1: 71.300 buscas/mês em 4 páginas pilares**

#### TIER 2 — Keywords com 1.000-4.999 buscas/mês (Alta Prioridade)

| Keyword | Volume | Página Alvo | Silo |
|---------|:-:|-------------|------|
| amil empresas | 4.400 | /empresarial/ | Empresarial |
| amil convenio | 4.400 | HOME | Home |
| convenio amil | 4.400 | HOME | Home |
| plano de saúde amil | 4.400 | HOME | Home |
| amil rede credenciada | 4.400 | /rede-credenciada/ | Rede |
| rede credenciada amil | 3.600 | /rede-credenciada/ | Rede |
| amil planos de saude | 2.900 | /planos/ | Planos |
| amil empresa login | 2.400 | /portal-empresa/ | Portal |
| portal amil empresa | 2.400 | /portal-empresa/ | Portal |
| amil portal empresa | 2.400 | /portal-empresa/ | Portal |
| plano de saude amil preço | 2.400 | /tabela-de-precos/ | Preços |
| planos amil | 2.400 | /planos/ | Planos |
| amil tabela de preços | 1.900 | /tabela-de-precos/ | Preços |
| amil empresarial | 1.900 | /empresarial/ | Empresarial |
| planos da amil | 1.900 | /planos/ | Planos |
| plano de saúde da amil | 1.900 | HOME | Home |
| plano saude amil | 1.900 | HOME | Home |
| planos de saude amil | 1.900 | /planos/ | Planos |
| amil empresas login | 1.600 | /portal-empresa/ | Portal |
| hospital amil | 1.600 | /rede-credenciada/hospitais/ | Rede |
| tabela preços plano amil | 1.600 | /tabela-de-precos/ | Preços |
| amil espaço saúde | 1.300 | /rede-credenciada/amil-espaco-saude/ | Rede |
| plano amil dental | 1.300 | /amil-dental/ | Dental |
| amil dental rede credenciada | 1.300 | /amil-dental/rede-credenciada/ | Dental |
| convênio amil | 1.300 | HOME | Home |
| planos da amil saude | 1.300 | /planos/ | Planos |
| tabela preço amil individual | 1.300 | /tabela-de-precos/individual/ | Preços |
| valor plano amil | 1.000 | /tabela-de-precos/ | Preços |
| portal empresa amil | 1.000 | /portal-empresa/ | Portal |
| telefone amil empresa | 1.000 | /contato-empresas/ | Contato |
| hospitais amil | 1.000 | /rede-credenciada/hospitais/ | Rede |
| amil saúde planos | 1.000 | /planos/ | Planos |

**Subtotal TIER 2: ~63.000 buscas/mês em 8 páginas**

#### TIER 3 — Keywords com 300-999 buscas/mês (Quick Wins)

| Keyword | Volume | Página Alvo | Competição |
|---------|:-:|-------------|:-:|
| ginecologista amil | 880 | /rede-credenciada/ginecologista/ | BAIXA |
| amil dental empresarial | 720 | /amil-dental-empresarial/ | BAIXA |
| amil empresarial telefone | 880 | /contato-empresas/ | BAIXA |
| rede credenciada amil dental | 880 | /amil-dental/rede-credenciada/ | BAIXA |
| plano dental amil | 880 | /amil-dental/ | MÉDIA |
| amil convenios | 880 | HOME | MÉDIA |
| dermatologista amil | 720 | /rede-credenciada/dermatologista/ | BAIXA |
| convenio medico amil | 720 | HOME | MÉDIA |
| amil empresa telefone | 720 | /contato-empresas/ | BAIXA |
| telefone amil empresarial | 720 | /contato-empresas/ | BAIXA |
| tabela amil 2026 | 720 | /tabela-de-precos/ | BAIXA |
| amil dental empresarial | 720 | /amil-dental-empresarial/ | BAIXA |
| endocrinologista amil | 590 | /rede-credenciada/endocrinologista/ | BAIXA |
| plano odontológico amil | 590 | /amil-dental/ | MÉDIA |
| convênio médico amil | 590 | HOME | MÉDIA |
| ortopedista amil | 480 | /rede-credenciada/ortopedista/ | BAIXA |
| dentista amil | 480 | /rede-credenciada/dentista/ | BAIXA |
| pronto socorro amil | 480 | /rede-credenciada/pronto-socorro/ | BAIXA |
| convenio amil dental | 480 | /amil-dental/ | MÉDIA |
| oftalmologista amil | 390 | /rede-credenciada/oftalmologista/ | BAIXA |
| tabela preço amil empresarial | 390 | /tabela-de-precos/empresarial/ | BAIXA |
| convênio dental amil | 390 | /amil-dental/ | BAIXA |
| convenios amil | 390 | HOME | MÉDIA |
| amil pj | 320 | /empresarial/ | BAIXA |
| amil dental empresa | 320 | /amil-dental-empresarial/ | BAIXA |
| telefone empresa amil | 320 | /contato-empresas/ | BAIXA |
| nutricionista amil | 320 | /rede-credenciada/nutricionista/ | BAIXA |

**Subtotal TIER 3: ~16.000 buscas/mês — maioria com competição BAIXA**

---

## PARTE 3: OKRs CONSOLIDADOS (3 Objetivos, 15 Key Results)

### OKR 1: DOMINAR "PLANO AMIL" (48.300/mês)

**Objetivo:** Alcançar Top 3 para as 10 principais keywords de plano Amil em 6 meses

| KR | Métrica | Mês 3 | Mês 6 | Mês 12 |
|----|---------|:-:|:-:|:-:|
| KR1.1 | Share de cliques do cluster | 10% | 40% | **60%** |
| KR1.2 | Keywords Top 3 (de 10) | 3 | 8 | **10** |
| KR1.3 | CTR orgânico médio | 8% | 15% | **20%** |
| KR1.4 | Conversões orgânicas (leads) | +20% | +50% | **+100%** |
| KR1.5 | Keywords Total em Top 10 | 30 | 80 | **200** |

**Keywords foco:**
1. amil plano de saude — 18.100
2. plano de saude amil — 14.800
3. plano amil — 6.600
4. amil planos — 5.400
5. amil convenio — 4.400
6. convenio amil — 4.400
7. plano de saúde amil — 4.400
8. amil planos de saude — 2.900
9. planos amil — 2.400
10. planos de saude amil — 1.900

**Medição:** Google Search Console (regex cluster) + SEMrush (posições)

---

### OKR 2: DOMINAR "AMIL EMPRESARIAL" (28.000/mês) ★ FOCO

**Objetivo:** Alcançar Top 1 para keywords de plano empresarial Amil em 6 meses

| KR | Métrica | Mês 3 | Mês 6 | Mês 12 |
|----|---------|:-:|:-:|:-:|
| KR2.1 | Share de cliques empresarial | 15% | 45% | **65%** |
| KR2.2 | Posição média top 5 keywords | ≤ 5.0 | **≤ 3.0** | **≤ 1.5** |
| KR2.3 | Cliques portal empresa | +25% | +50% | **+80%** |
| KR2.4 | Cliques telefone empresa | +15% | +30% | **+50%** |
| KR2.5 | Leads B2B orgânicos/mês | 50 | 250 | **1.000** |

**Keywords foco:**
1. amil empresa — 9.900
2. amil empresas — 4.400
3. amil empresa login — 2.400
4. portal amil empresa — 2.400
5. amil portal empresa — 2.400
6. amil empresarial — 1.900
7. amil empresas login — 1.600
8. telefone amil empresa — 1.000
9. portal empresa amil — 1.000
10. amil empresarial telefone — 880

**Medição:** GSC + GA4 (eventos B2B) + SEMrush

---

### OKR 3: DOMINAR "AMIL DENTAL EMPRESARIAL" (12.000/mês)

**Objetivo:** Capturar tráfego dental empresarial Amil em 6 meses

| KR | Métrica | Mês 3 | Mês 6 | Mês 12 |
|----|---------|:-:|:-:|:-:|
| KR3.1 | Posição "amil dental" | Top 10 | Top 5 | **Top 3** |
| KR3.2 | Posição "amil dental empresarial" | Top 5 | **Top 3** | **Top 1** |
| KR3.3 | Keywords dental em Top 10 | 5 | 15 | **30** |
| KR3.4 | Leads dental empresarial/mês | 20 | 80 | **300** |
| KR3.5 | Tráfego silo dental | 500 | 2.000 | **5.000** |

**Keywords foco:**
1. amil dental — 6.600
2. amil dental rede credenciada — 1.300
3. plano amil dental — 1.300
4. rede credenciada amil dental — 880
5. plano dental amil — 880
6. amil dental empresarial — 720
7. plano odontológico amil — 590
8. convenio amil dental — 480
9. convênio dental amil — 390
10. amil dental empresa — 320

---

## PARTE 4: ESTRATÉGIA DE RANKING RÁPIDO — 3 Fases

### FASE 1: QUICK WINS (Semanas 1-4)

**Alvo: Keywords com competição BAIXA que nenhum concorrente ataca**

```
SEMANA 1-2: Fundação Técnica
├── Next.js 15 + Sanity CMS + Schema Engine
├── Design System + QuoteForm multi-step
├── PageSpeed 95+ configurado
└── Schema @graph (5 tipos) implementado

SEMANA 3-4: 80 Páginas Core
├── 5 pilares (Home, Empresarial, Planos, Preços, Dental)
├── 9 páginas de plano (1.500+ palavras cada)
├── 8 empresarial (MEI, PME, 100+, como contratar, etc.)
├── 6 Amil Dental (empresarial, rede, preços)
├── 20 comparativos
├── 13 tabelas de preço
├── 16 rede credenciada + 10 especialidades ← QUICK WIN
├── 5 portal empresa
├── 3 contato empresas
└── Total: ~80 páginas publicadas

RESULTADO ESPERADO (Semana 4):
→ 80 páginas indexadas
→ Keywords TIER 3 (especialidades) ranqueando em Top 10
→ PageSpeed 95+ em todas
→ Schema validado no Google Rich Results Test
→ Google Search Console + GA4 ativos
```

### FASE 2: AUTORIDADE TOPICAL (Meses 2-3)

**Alvo: Construir relevância para keywords TIER 1 e TIER 2**

```
MÊS 2: Expansão Local + Blog
├── 27 hubs estaduais
├── 100 cidades grandes (dados reais de hospitais)
├── 15 páginas Espaço Saúde por bairro
├── 30 FAQ individuais
├── 32 blog posts (8/semana)
└── Total: +200 páginas (280 total)

MÊS 3: Volume + Link Building
├── +150 cidades médias
├── +20 FAQ de procedimentos
├── +32 blog posts
├── Google Business Profile 100% otimizado
├── 10 diretórios (Reclame Aqui, LinkedIn, etc.)
├── 5 guest posts em blogs de RH/contabilidade
└── Total: +200 páginas (480 total)

RESULTADO ESPERADO (Mês 3):
→ 480 páginas indexadas
→ Keywords TIER 2 em Top 10
→ Keywords TIER 1 em Top 10-20 (subindo)
→ Tráfego: 5.000-12.000 visitas/mês
→ 50-100 leads/mês
→ Autoridade topical estabelecida
```

### FASE 3: DOMINAÇÃO (Meses 4-12)

**Alvo: Top 1-3 nas keywords principais + escala**

```
MESES 4-6:
├── +200 cidades menores
├── +50 FAQ de procedimentos
├── +128 blog posts (8/semana × 16 semanas)
├── 8 guest posts/mês (link building)
├── 3 publicações em portais de saúde/negócios
├── A/B tests (formulário, CTAs)
└── Total: +378 páginas (858 total)

MESES 7-12:
├── +200 cidades adicionais
├── +150 blog posts
├── Link building contínuo
├── Atualização trimestral de preços
├── Refresh de conteúdo antigo
├── Integrações (CRM, heatmaps, email)
└── Total: +350 páginas (1.200+ total)

RESULTADO ESPERADO (Mês 12):
→ 1.200+ páginas indexadas
→ Keywords TIER 1: Top 3 (8 de 10)
→ "amil empresa": TOP 1
→ "amil dental empresarial": TOP 1
→ Tráfego: 60.000-125.000 visitas/mês
→ 2.000+ leads/mês
→ Dominação total do nicho
```

---

## PARTE 5: VANTAGENS COMPETITIVAS CONSOLIDADAS

### Por que vamos vencer (dados concretos)

| Vantagem | Nós | Melhor Concorrente | Ratio |
|----------|-----|-------------------|:-:|
| Total de páginas | 1.200+ | 50 (planodesaudeamil) | **24:1** |
| Schema markup | 5 tipos @graph | 0 (TODOS) | **∞** |
| Meta descriptions | 100% | 0% (TODOS) | **∞** |
| PageSpeed Mobile | 95+ | 65 (amilassistencia) | **+46%** |
| Blog posts | 300+ | 8 (planodesaudeamil) | **37:1** |
| Páginas locais | 550+ | 30 (planosdesaudeamilrj) | **18:1** |
| FAQ com Schema | 50+ | 0 (TODOS) | **∞** |
| Comparativos | 20 | 0 (TODOS) | **∞** |
| Especialidades (gineco, dermato...) | 10 | 0 (TODOS) | **∞** |
| Portal empresa (orientação) | 5 páginas | 0 (TODOS) | **∞** |
| Amil Dental Empresarial | Silo completo | 0 (TODOS) | **∞** |
| Formulário (campos) | 4 multi-step | 16 (planodesaudeamil) | **4x menos** |
| Core Web Vitals | ✅✅✅ | ❌❌❌ (TODOS) | **Total** |
| Dados atualizados | 2026 | 2023 (amilassistencia!) | **3 anos à frente** |

### Território Exclusivo (ninguém mais compete)

| Território | Volume/mês | Concorrentes |
|------------|:-:|:-:|
| Páginas de especialidade médica | 3.380 | **ZERO** |
| Portal empresa (orientação) | 9.800 | **ZERO** |
| Amil Dental Empresarial dedicada | 1.040 | **ZERO** |
| FAQ de procedimentos ("Amil cobre X?") | ~5.000 | **ZERO** |
| Espaço Saúde por bairro | ~3.000 | **ZERO** |
| Comparativos Amil vs Concorrentes | ~5.000 | **ZERO** |
| **Total território exclusivo** | **~27.220** | **ZERO** |

---

## PARTE 6: CRONOGRAMA EXECUTIVO

| Semana | Entregável | Páginas | Acumulado |
|--------|-----------|:-:|:-:|
| 1-2 | Fundação técnica (Next.js, Sanity, Schema, Design) | 0 | 0 |
| 3-4 | 80 páginas core (pilares + planos + comparativos + FAQ) | 80 | **80** |
| 4 | **DEPLOY** + Search Console + GA4 | — | 80 |
| 5-8 | Expansão local (estados + 100 cidades) + 32 blog posts | 160 | **240** |
| 9-12 | +150 cidades + 20 FAQ + 32 blog posts + link building | 202 | **442** |
| 13-24 | +200 cidades + 50 FAQ + 300 blog posts + escala | 558 | **1.000** |
| 24-48 | +200 cidades + 150 posts + otimização contínua | 350 | **1.200+** |

---

## PARTE 7: INVESTIMENTO E ROI

### Custos Mensais

| Item | Custo/mês | Notas |
|------|:-:|-------|
| Vercel Pro | R$ 100 | Hosting + CI/CD |
| Sanity CMS | R$ 0-500 | Free tier cobre MVP |
| Domínio .com.br | R$ 4 | ~R$ 50/ano |
| Google Workspace | R$ 30 | Email profissional |
| Redator freelancer | R$ 3.000-5.000 | 32 posts/mês (2000 palavras) |
| SEMrush/Ahrefs | R$ 500 | Monitoramento SEO |
| Link building | R$ 1.000-2.000 | Guest posts, assessoria |
| **Total mensal** | **R$ 5.000-8.000** | |

### ROI Projetado

| Métrica | Mês 6 | Mês 12 |
|---------|-------|--------|
| Tráfego orgânico/mês | 10.000-25.000 | 60.000-125.000 |
| Leads/mês | 300-500 | 1.500-2.500 |
| Valor por lead (plano empresarial) | R$ 50-150 | R$ 50-150 |
| **Receita potencial de leads/mês** | **R$ 15.000-75.000** | **R$ 75.000-375.000** |
| Investimento acumulado | R$ 30.000-48.000 | R$ 60.000-96.000 |
| **ROI** | **1x-5x** | **5x-25x** |

---

## REFERÊNCIAS DO PROJETO

| Documento | Localização |
|-----------|-------------|
| PRD completo | `docs/prd/PRD-001-amil-empresarial-site.md` |
| Addendum Keywords (volumes SEMrush) | `docs/prd/ADDENDUM-SEO-KEYWORDS-STRATEGY.md` |
| **Este Master Plan** | `docs/prd/MASTER-PLAN-SITE-AMIL.md` |
| Epic (execution plan) | `docs/epics/EPIC-001-EXECUTION.yaml` |
| Stories Wave 1 | `docs/stories/1.1-1.5.story.md` |
| Stories Wave 2 | `docs/stories/2.1-2.3.story.md` |
| Stories Wave 3 | `docs/stories/3.1-3.2.story.md` |
| Stories Wave 4 | `docs/stories/4.1.story.md` |

---

> **"O mercado de sites de corretoras Amil está na idade da pedra. Com 1.200+ páginas, SEO técnico perfeito, e uma estratégia baseada em 125.000+ buscas/mês mapeadas, vamos não apenas ultrapassar os concorrentes — vamos criar um fosso intransponível."**
>
> — Morgan, planejando o futuro 📊
