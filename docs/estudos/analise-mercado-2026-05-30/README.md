# 📦 ARQUIVADO — Análise de Mercado: Satélite Amil Empresarial

> **Status:** Arquivado · Estudo concluído em 2026-05-30 · Decisão tomada
> **Analista:** Atlas (AIOS Decoder) + Squad AIOS — 8 agentes, 153 buscas web
> **Cliente:** BeneficioRH — Agnaldo Silva · SUSEP 201054484 · Operadora-alvo: Amil (ANS 326305)

Análise estratégica de mercado do projeto `planoamilempresas.com.br`, no mesmo padrão dos estudos SulAmérica, Bradesco-Adesão e MedSênior.

## Veredicto: **GO CONDICIONAL**

Amil em turnaround (lucro R$ 619 mi em 2024; +874 mil vidas em 2025 = a que mais cresceu no Brasil; líder RJ, vice SP) + mercado coletivo = 84% das vidas + boom MEI. **2 condições inegociáveis:**

1. Blindagem de marca de terceiro + **desbloquear a Story 7.7 (ADR-006 "URL-as-Trademark")** antes de escalar tráfego.
2. Atacar **só meio/fundo de funil + geo + HOSPITAL×CIDADE via data moat** (dataset de 9.325 prestadores × 49 redes) — nunca o head saturado (SERP 8/10).

**Gap nº1 (oceano azul):** "Hospital X aceita Amil?" — nenhum dos 10+ satélites EMD concorrentes gera páginas por hospital individual.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `relatorio-amil-empresarial.pdf` | Relatório completo (capa azul-Amil, 10 blocos + plano P0/P1/P2) |
| `relatorio-amil-empresarial.html` | Fonte HTML do PDF |
| `amil-analise-completa-2026-05-30.md` | Markdown-fonte resumido |
| `amil-concorrentes.csv` | 8 operadoras × tempo de mercado / vidas / posição B2B |
| `amil-serp-keywords.csv` | Volume × intent × dificuldade |
| `amil-comparacao-lado-a-lado.csv` | Nós × site oficial × satélites EMD × agregadores |
| `amil-reclame-aqui.csv` | Reputação comparada |
| `gerar-pdf-amil-empresarial.js` | Regenerador do PDF (Playwright) |

## Como regenerar o PDF

```bash
node docs/estudos/analise-mercado-2026-05-30/gerar-pdf-amil-empresarial.js
```

## Próximos passos (roadmap do relatório)

- **P0:** blindagem de marca · desbloquear Story 7.7 (ADR-006) · camada HOSPITAL×CIDADE (batch 1 SP+RJ) · páginas-cidade de rede real SP/RJ/DF.
- **P1:** `/tabela-amil-empresarial-2026` (SKU real do dataset, não 200/400/700 comercial) · simulador PME · cluster reajuste/portabilidade · guia MEI · comparador vs Bradesco/SulAmérica/Hapvida.
- **P2:** porte×cidade (espelhar `/grandes-empresas` do Bradesco; landing Amil One premium) · canonical com o hub planodesaudepj · MVP 200-400 páginas · compliance ANS.

---

⚠️ **Nota factual importante:** a Amil teve o **MAIOR reajuste coletivo de 2025 entre as top 10 (15,75%)** — tratar essa objeção com honestidade no conteúdo. Comprador da Amil (dez/2023, R$ 11 bi) foi **José Seripieri Filho** (fundador da Qualicorp), não "Fiord Capital".

*Cópia-mestre também em `C:\Users\benef\analises-seo\` (INDICE.md item #6) e memória `project_amil_empresarial_analise_mercado_2026_05_30`.*
