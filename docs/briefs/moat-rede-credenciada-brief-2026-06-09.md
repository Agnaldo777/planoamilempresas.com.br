# Project Brief — Moat Rede Credenciada Amil & Próximo Ataque (Hospital × Rede)

**Autor:** Atlas (Business Analyst) — Synkra AIOS
**Data:** 2026-06-09
**Consumidores:** @pm (Morgan), @po (Pax), @architect (Aria), @dev (Dex)
**Status:** Pronto para decisão / formalização de stories
**Método:** análise do dataset real (9.325 prestadores) + 4 rodadas de evidência de SERP (junho/2026)

---

## 1. Executive Summary

O Epic 7 já construiu um **moat de ~2.318 páginas SSG** de rede credenciada Amil (produto×UF, bairro, tipo×cidade, prestador, cidade, UF, sub-redes) — build verde, sem regressão. A investigação estratégica conclui:

1. **O gargalo não é construir mais — é publicar.** Nada gera tráfego até o **deploy** (Cloudflare Workers). ROI de tudo já feito = 0 até lá.
2. **Existe um oceano azul real:** a query de alta intenção **"Hospital X aceita Amil?"** está **saturada nos hospitais-âncora famosos de SP**, mas **aberta na cauda** (RJ/GO/MG/DF e cidades médias — 157 dos 231 hospitais).
3. **O melhor ataque de conteúdo não é uma faceta nova** — é **turbinar a página-prestador existente** (que já indexa) para vencer essa query, focando a cauda.
4. **Risco de nomenclatura decifrado:** o dataset usa códigos de rede (S380/S450/S750) enquanto a SERP mistura nomes comerciais e legados (200/400/700; 30/130/160). Mapeá-los vira **ativo SEO** (captura busca legada).

**Sequência recomendada:** `Deploy → Frescor + Nomenclatura → Upgrade hospital (cauda)`.

---

## 2. Estado atual do moat (factual)

Dataset `geradoEm 2026-04-26`: **9.325 prestadores · 26 UFs · 438 municípios · ~231 hospitais · 117 municípios com hospital**.

| Faceta | Páginas | Rota | Status |
|--------|---------|------|--------|
| Produto × UF (7.7) | 216 | `/rede/produto/[redeSlug]/[uf]` | ✅ build |
| Bairro (7.6) | 571 idx + ~1.116 noindex | `/rede/[uf]/[municipio]/bairro/[bairro]` | ✅ build |
| Tipo × cidade (7.8) | 164 | `/[tipo]/[uf]/[municipio]` | ✅ build |
| Prestador (7.4) | 9.325 (sitemap) | `/rede/[uf]/[municipio]/[prestadorSlug]` | ✅ build / deploy pend. |
| Cidade / UF / sub-redes | ~530 | `/rede/...` | ✅ build |

Distribuição de hospitais: **SP 74 · RJ 35 · GO 29 · MG 26 · DF 11** + cauda.

---

## 3. Análise competitiva (evidência SERP — junho/2026)

### Hospitais-âncora de SP → SATURADO 🔴
Query "Samaritano/São Camilo/Santa Catarina aceita Amil" retorna:
- **Satélites Amil com página-por-hospital** (`planosamil.com.br/hospital-samaritano/`, `amilplanos.com.br/...`)
- **Domínio mono-hospital** (`planodesaudesamaritano.com.br/amil/`)
- **Agregadores** (compareplanodesaude, busqueplanodesaude)

→ **Não competir de frente** nos ~6 nomes famosos de SP.

### Cauda (GO/MG/DF/RJ-interior) → ABERTO 🟢
Query em Monte Sinai (JF), Anchieta (Brasília), Serrano (Nova Friburgo) revela só concorrentes fracos:
1. Sites oficiais dos hospitais (`/convenios` genérico, não otimizado para "amil")
2. Agregadores horizontais (doctoralia, ubs.med.br) — fichas finas, sem dado de linha
3. Satélites Amil que **param na granularidade cidade/UF**, não descem ao hospital

→ **Ninguém faz "página-hospital × Amil com dado de linha + conversão PJ" na cauda.**

---

## 4. Mapa de nomenclatura (ativo SEO)

| Dataset | Comercial 2026 | Abrangência | Status |
|---|---|---|---|
| S380 QP/QC | Selecionada S380 (PME mais vendido) | Nacional | ✅ |
| S450 QP/QC | Selecionada S450 | Nacional | ✅ |
| S580 QP | Selecionada S580 | Nacional | ⚠️ **descontinuado** |
| S750 QP | Selecionada S750 (topo) | Nacional | ✅ |
| ONE S6500 BLACK QP | Amil One S6500 Black (ex-Lincx LT4) | Nac.+Intl | ✅ premium |
| BLACK | Clássica Black | Nacional | ✅ |
| ADESÃO OURO MAIS / BRONZE RJ/SP | Clássica Ouro/Bronze (adesão) | Nac./Reg. | ✅ |

- **QP/QC** = Quarto Particular (apartamento) / Quarto Coletivo (enfermaria).
- **Legado vivo na busca:** 200/400/500/700 (≈ S450/S750) e 30/130/160 (nacional empresarial por porte) → **capturar como sinônimos** ("Amil 400, atual S450").

---

## 5. Recomendação estratégica

### Sequência (ordem de ROI)
1. **Deploy (Cloudflare Workers)** — inegociável; destrava ~2.318 páginas + gates Lighthouse (7.6/7.7/7.8/7.4b). *Owner: @devops Gage.*
2. **Frescor + nomenclatura** — pipeline 7.10 (re-raspar dataset, hoje >6 semanas) + materializar `nomenclatura-redes.ts`. *Resolve o risco antes de escalar.*
3. **Upgrade hospital (cauda)** — turbinar a página-prestador quando `tipoInferido === 'Hospital'`: title/H1/FAQ "aceita Amil?", schema `Hospital`+`FAQPage`, bloco "linha Amil mínima de acesso", internal linking hospital↔cidade↔tipo↔produto. *Foco: 157 hospitais fora-SP.*

### O que NÃO fazer
- ❌ Criar faceta `/hospital/...` nova (duplica/canibaliza a página-prestador + conflita com 7.8).
- ❌ Disputar os âncoras de SP de frente.
- ❌ Escalar conteúdo antes do deploy e da correção de frescor/nomenclatura.

---

## 6. Riscos

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Dataset desatualizado (26/04) | Média | Pipeline 7.10 antes de escalar |
| Nomenclatura divergente (S vs 400/700) | Média | `nomenclatura-redes.ts` + sinônimos |
| "Aceita Amil" tem condições (ex.: Anchieta só FIPEQ) | Média | Conteúdo honesto ("via linha X, sob condição Y") — `feedback_claims_metricas` |
| S580 descontinuado mas no dataset | Baixa | Sinalizar "linha em transição"; despriorizar CTA |
| Tudo depende de deploy | Alta | Priorizar deploy (item 1) |

---

## 7. Métricas de sucesso (diretrizes, sem claim sem fonte)

- **Indexação:** % das ~2.318 páginas indexadas pós-deploy (Search Console).
- **Cobertura de cauda:** nº de hospitais fora-SP rankeando para "hospital X aceita amil".
- **Conversão:** leads PJ originados de páginas hospital/produto (tag `cluster` no CRM).
- Validar hipóteses por A/B + dados reais — **não** assumir CR fixo a priori.

---

## 8. Próximos passos / handoffs

1. **@devops (Gage):** executar deploy Cloudflare Workers + Lighthouse CI dos gates.
2. **@dev (Dex):** materializar `src/data/operadoras/amil/nomenclatura-redes.ts` (quick win, alimenta páginas atuais).
3. **@po (Pax) / @sm (River):** formalizar story "Upgrade hospital na página-prestador (cauda fora-SP)".
4. **@data-engineer (Dara):** pipeline 7.10 (refresh do dataset).

---

## Sources (evidência SERP — junho/2026)

- https://amilsaudebr.com.br/amil-linha-selecionada-2026.html
- https://www.amilsa.com.br/duvidas-812065-qual-diferenca-entre-os-planos-s380-s450-s580-plano-amil-saude.html
- https://amilplanos.com.br/amil-one-s6500-black/ · https://amilplanos.com.br/amil-400/ · https://amilplanos.com.br/amil-700/
- https://planosamil.com.br/hospital-samaritano/ · https://planodesaudesamaritano.com.br/amil/
- https://www.hospitalmontesinai.com.br/convenios/ · https://www.hospitalanchieta.com.br/amil/ · https://hospitalserrano.com/convenios/

---

*Decifrado por Atlas — Synkra AIOS. Registro de análise; não substitui PRD (→ @pm) nem stories (→ @po/@sm).*
