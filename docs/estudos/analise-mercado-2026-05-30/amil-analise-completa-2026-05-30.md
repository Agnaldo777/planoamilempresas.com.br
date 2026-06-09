# Análise Estratégica — Satélite Amil Empresarial (2026-05-30)

**Analista:** Atlas (AIOS Decoder) + Squad AIOS — 8 agentes, 153 buscas web
**Cliente:** BeneficioRH — Agnaldo Silva · Corretor autorizado SUSEP 201054484
**Projeto:** `planoamilempresas.com.br` · Next.js 16 + React 19 + Sanity + Cloudflare/Vercel · Operadora-alvo: Amil (ANS 326305)

---

## TL;DR — GO CONDICIONAL

Mercado quente (coletivo = 84% das vidas; individual em extinção -5,5%/ano; boom MEI 13,1 mi ativos, +3,8 mi em 2025) + Amil em turnaround (lucro R$ 619,8 mi em 2024, +874 mil vidas em 2025 = a que mais cresceu, líder RJ/vice SP) + site oficial cego no transacional. **2 condições inegociáveis:** (1) blindagem de marca + desbloquear Story 7.7 (ADR-006); (2) atacar só meio/fundo de funil + geo + HOSPITAL×CIDADE via data moat (nunca o head saturado).

## Bloco 1 — Mercado empresarial/PME

| Indicador | Valor |
|---|---|
| Beneficiários (BR) | 53,18 mi (dez/2025, recorde) |
| Coletivos | **84%** das vidas (mar/2026) |
| Individual | 16,4% (8,6 mi), -5,5%/ano |
| MEIs ativos / novos 2025 | 13,1 mi / +3,8 mi (+22,1%) |
| Contratos ≤5 vidas | 15,3% (era 4,7% em 2014) |
| Economia PJ vs PF | ~30% (até 30-50%) |
| Ticket / entrada Amil MEI | R$ 180-600 / R$ 127 |
| Mínimo de vidas | 2 (CNPJ ativo 6+ meses) |
| Churn do setor | 27,9% (12 meses) |

## Bloco 2 — Regulatório

- Reajuste coletivo SEM teto (por sinistralidade): médio 10,76% (2025) → 9,9% (2026). Individual: teto 5,11% (2026).
- **RN 309/2012 (pool de risco <30 vidas):** reajuste único obrigatório; <30 vidas = 14,24% vs >30 vidas = 9,62% (2025).
- **Amil teve o MAIOR reajuste coletivo de 2025 entre top 10: 15,75%** — objeção a tratar com honestidade.
- Portabilidade RN 438/2018 (sem nova carência) capta insatisfeito; carência isenta com 3+ vidas.

## Bloco 3 — Amil 2026: turnaround

- Fundada 1978 (Edson Bueno), ~47 anos.
- **Venda dez/2023 por R$ 11 bi: UnitedHealth → José Seripieri Filho** (fundador Qualicorp). NÃO "Fiord Capital".
- **2024: lucro R$ 619,8 mi** (reverteu prejuízo R$ 4,1 bi); receita R$ 31 bi (+21%); EBITDA +R$ 858 mi; MLR 84,8%.
- **2025: +874 mil vidas (a que mais cresceu no BR)**; ~6,1 mi clientes (+17%); líder RJ, vice SP.
- IDSS ~0,78 (8,2/10); Reclame Aqui 7,2-7,7 (BOA); rede +1.700 hospitais, ~14 próprios + TotalCare (19 hosp).
- Linha: comercial 200/400/700 ≠ dataset oficial **AMIL 30-160 NACIONAL / S380-S750 / ONE 1500/2500/6500 BLACK / BLUE** (usar SKU real, anti-thin). PME Porte I (2-29) e II (30-99).
- **6 gaps SEO no oficial:** sem tabela preço PME, sem páginas por cidade, sem profissão/porte, sem simulador, rede não-indexável, sem comparativos.

## Bloco 4 — Raspagem do nosso /planoamilempresas

- **~10.500 URLs de rede** (9.325 prestadores × 49 redes em 26 UFs — dataset Power BI canônico 2026-04-26)
- **5 sub-redes canonizadas** (eixo produto): hospitais-dor · amil-one-rede-selecionada · amil-facil-rede-selecionada · classica · amil-medial (ADR-006)
- ~600 URLs programmatic (CNAE/segmento × cidade × porte)
- 12 comparativos · planos · rede por especialidade/sub-rede · blog + **autores (E-E-A-T)** · cotação-online · comparar · portal-empresa · carências · FAQs · glossário · amil-dental · amil-espaço-saúde
- Stack: Next 16 · React 19 · Tailwind 4 · Sanity v3 · Upstash Redis · Cloudflare/Vercel · GA4/Clarity/Sentry · CRM Clint. Compliance LGPD + ANS RN 195/2009 + 593/2024 + SUSEP. Titular BeneficioRH (SUSEP 201054484).
- **Story 7.7 BLOCKED por ADR-006** (URL-as-Trademark) — pré-requisito da camada de rede.
- É o satélite mais ambicioso do portfólio. Projeto ~80% pronto (Caminho C).

## Bloco 5 — Comparação lado a lado
Vencemos em rede (10.500 pgs), ferramentas, comparativos e E-E-A-T; perdemos em autoridade de domínio (novos). Oficial forte em marca mas cego no transacional. EMDs têm head-start mas são thin. (ver `amil-comparacao-lado-a-lado.csv`)

## Bloco 6 — Concorrentes & tempo de mercado
Hapvida/GNDI (1979/1968), Unimed (1967), Bradesco (1984), SulAmérica (1895), Porto (1945), Omint (1980), Care Plus (1992), Amil (1978). Ver `amil-concorrentes.csv`. Amil = única grande verticalizada em forte expansão, foco coletivo SP/RJ/DF.

## Bloco 7 — SERP
Saturação 8/10 no head; 4-5/10 no fundo de funil; 2-4/10 no geo/hospital. Dominam o top 10: agregadores (Quero/Joov/Bidu) + Qualicorp + Amil oficial (só marca) + 10+ satélites EMD thin. Ver `amil-serp-keywords.csv`.

## Bloco 8 — Os 3 gaps mais lucrativos
1. **HOSPITAL×PRODUTO×CIDADE** ("Hospital X aceita Amil?") — oceano azul; nenhum EMD faz; gerável do dataset.
2. **Tabela de preço + simulador** Amil empresarial — maior fundo de funil órfão (oficial não publica, EMD desatualiza).
3. **Profissão/CNAE × cidade × porte + objeção** (reduzir reajuste, portabilidade, pool RN 309).

## Bloco 9 — Vantagens da estrutura
Data moat (9.325 prestadores), E-E-A-T corretora SUSEP, lead exclusivo, especialização, controle/velocidade, programmatic scale.

## Bloco 10 — Reputação
SulAmérica 8,3 > Bradesco 7,7-8,4 > **Amil 7,2-7,7 (BOA)** > Hapvida 7,0-7,5. Boa notícia: Amil tem reputação BOA — só o reajuste é objeção real.

---

## VEREDICTO: GO CONDICIONAL

**Condições:** (1) blindagem de marca + desbloquear Story 7.7 ADR-006; (2) atacar só meio/fundo + geo + HOSPITAL×CIDADE via data moat.

### Roadmap
**P0:** blindagem jurídica de marca · desbloquear 7.7 (ADR-006) + refinar heurística D'or · camada HOSPITAL×CIDADE (batch 1 SP+RJ) · páginas-cidade de rede real SP/RJ/DF.
**P1:** /tabela-amil-empresarial-2026 (SKU real) · simulador PME · ângulo reajuste/churn/portabilidade · guia MEI + regras (pool RN 309) · comparador Amil vs Bradesco/SulAmérica/Hapvida.
**P2:** porte×cidade (espelhar /grandes-empresas do Bradesco; landing Amil One premium) · canonical/relacionamento com hub planodesaudepj · MVP 200-400 pgs · compliance ANS publicidade.

### Riscos
Dependência de operadora única (mitigar via hub) · marca de terceiro no domínio · instabilidade Amil (atenuada) · SERP saturada no topo · objeção de reajuste 15,75% · zero-click/AI Overviews.

---

*Atlas (AIOS Decoder) + Squad AIOS · BeneficioRH (SUSEP 201054484) · 30 de maio de 2026.*
