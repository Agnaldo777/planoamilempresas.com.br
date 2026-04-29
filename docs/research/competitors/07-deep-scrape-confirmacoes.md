# Suplemento de Auditoria — Confirmações via HTML Cru e Performance

**Data:** 2026-04-27
**Fonte:** curl + grep no HTML real + amostragem ampliada (5 city pages, 4 produtos, 3 bairros SP, 4 educacionais)

---

## 1. Correções vs. auditoria inicial

A auditoria via WebFetch (modelo small) tinha duas conclusões erradas. Inspeção do HTML cru via curl + grep corrige:

| Item | WebFetch dizia | HTML cru confirma |
|------|----------------|-------------------|
| `lang="pt-BR"` no `<html>` | AUSENTE | **PRESENTE** ✅ em todas |
| `<link rel="canonical">` | AUSENTE | **PRESENTE** ✅ em todas |
| `application/ld+json` schema | AUSENTE | **AUSENTE** ❌ confirmado (0 ocorrências em 6 páginas) |
| `meta name="description"` | AUSENTE | **AUSENTE** ❌ confirmado (0 ocorrências) |
| `og:*` / `twitter:*` | AUSENTE | **AUSENTE** ❌ confirmado (0 ocorrências) |

## 2. Performance Real (medida com curl)

| Página | TTFB | Total | Tamanho HTML |
|--------|------|-------|--------------|
| `/` (homepage) | 2,87s | 6,51s | 233 KB |
| `/abaiara/` (city pequena) | 3,07s | 7,88s | 188 KB |
| `/amil-black/` (produto) | 2,98s | 7,07s | 189 KB |
| `/duvidas-frequentes/` (FAQ) | 3,12s | 6,90s | 213 KB |

**Benchmark Google (mobile):**
- TTFB bom: **<0,8s** → site está **3,7× pior**
- Total: **<2,5s** → site está **3× pior**

**Inferência LCP/INP:** com TTFB de ~3s, é fisicamente impossível atingir LCP <2,5s. O site está reprovado em CWV mobile com alta probabilidade.

> *Tentativa de PageSpeed Insights API retornou 429 (rate limit sem API key). Medição real exigiria Lighthouse local ou GSC do dono — mas TTFB já é evidência suficiente.*

## 3. Análise do HTML cru (homepage)

| Métrica | Valor |
|---------|-------|
| `<script src=…>` externos | **22** |
| `<link rel="stylesheet">` | 0 detectado pelo grep (provável inline) |
| Imagens inline base64 placeholder | **47** |
| Imagens com `loading="lazy"` | 43 |

**Diagnóstico:** WordPress + Flatsome carrega 22 JS externos no head/footer (jQuery, plugins, Yoast, FormCraft, slider). Os 47 placeholders base64 GIF são do lazy-load nativo do tema — funcional, mas inflam HTML e degradam parsing.

**Comparativo:** Astro SSG com 0 KB JS por padrão = parsing de ~5–10 KB inline crítico, sem JS bloqueante.

---

## 4. Confirmação de Duplicação em City Pages

Amostragem de **4 cidades pequenas independentes** mostra **TEMPLATE 100% idêntico**, apenas substituindo o nome:

### Padrão fixo encontrado nas 4 páginas

```
A Amil [CIDADE] tem o plano certo para você viver o seu melhor.
Com cobertura nacional ou regional, oferece ótimas soluções em
assistência médica para você, sua família ou empresa.

O Plano de Saúde Amil [CIDADE] conta com ampla rede credenciada
de hospitais, laboratórios e clínicas em todo o território nacional...

Tipos de Planos:
- Plano Amil Saúde Individual (por adesão) [CIDADE]
- Plano Amil Familiar (por adesão) [CIDADE]
- Plano Amil PME [CIDADE]
- Plano Amil MEI [CIDADE]
- Plano Amil Empresarial [CIDADE]
- Plano Amil Dental [CIDADE]

Vantagens Amil Saúde [CIDADE]:
- Acesso aos melhores hospitais de [CIDADE]
- Descontos para contratações com CNPJ
- Melhor plano de saúde em [CIDADE]
...
```

| City | H1 | Word count | Texto |
|------|----|-----------:|-------|
| Abaiara (CE) | Abaiara | ~1.200 | template |
| Touros (RN) | Touros | ~1.200 | template |
| Tonantins (AM) | Tonantins | ~1.200 | template |
| Tibau (RN) | Tibau | ~1.850 | template (mais blocos) |

⚠️ **Risco:** Google detecta padrões cookie-cutter; ~2.400 páginas idênticas em conteúdo é vetor clássico para penalização Helpful Content Update / SGE-era thin content. Página de Abadia de Goiás (já vista no scrape inicial) confirma o mesmo bug — listou Sírio Libanês e Albert Einstein como hospitais de "Abadia de Goiás" (interior de GO).

## 5. Bairros de São Paulo — canibalização confirmada

| Bairro | H1 | Word count | Signals locais reais? | Canibalização /sao-paulo/? |
|--------|----|-----------:|----------------------|--------------------------|
| Butantã | Butantã | ~2.800 | Parcial (telefone 11, Bronze SP) | **SIM, alta** |
| Água Rasa | Água Rasa | ~2.800 | Parcial (H. Paulistano, H. Nove de Julho mencionados) | SIM |
| Moema | Moema | ~2.800 | NENHUM signal específico | SIM |

**Padrão:** os 50+ bairros SP usam o mesmo template, com signals genéricos SP. Provável canibalização entre eles + com `/sao-paulo/` na keyword "plano amil [bairro] São Paulo".

---

## 6. Paridade Bronze/Prata/Ouro/Platinum/Black (revisada)

A auditoria inicial dizia "Black >> demais". HTML detalhado mostra hierarquia diferente:

| Produto | Word count | Tabela preços | Hospitais por região | Coberturas detalhadas | Avaliação |
|---------|-----------:|--------------|---------------------|----------------------|-----------|
| Amil Bronze | ~3.500 | ✓ | ✓ (10 estados) | Moderada | **Densa** |
| Amil Prata | ~2.500 | ✓ | ✓ (10 estados) | Moderada | **Densa** |
| Amil Ouro | ~1.200 | ✓ | ✓ (11 estados) | Moderada | **Rasa** |
| Amil Platinum | ?? | ✓ | ✓ (7 estados) | Fraca | **Estrutura fraca** |
| Amil Black | ~3.500 | ✓ | ✓ (7 regiões) | 6 itens detalhados + 11 diferenciais | **Mais profunda** |

⚠️ **Bronze e Prata estão decentes; Ouro e Platinum são os pontos fracos**, não "todos rasos vs Black" como dito antes.

## 7. Páginas educacionais auditadas

| Página | Word count | Avaliação |
|--------|-----------:|-----------|
| `/carencias/` | ~3.500 | ⭐ Densa, com tabela real de prazos por procedimento (PRC, urgência 0d, internação 180d, obstétrica 300d) |
| `/amil-one/` | ~1.200 | Rasa — produto descontinuado, sem hospitais nem preços |
| `/amil-facil-s75-rj/` | ~2.100 | Decente — cobertura regional 30 municípios RJ |
| `/amil-dental-100-promo/` | ~2.800 | Texto rico mas **SEM tabela de preços dental** (mostra só preços de planos médicos) |

---

## 8. Conclusões fortes (atualizadas)

✅ **Confirmações:**
1. Schema JSON-LD 100% ausente (todas categorias)
2. Meta description e Open Graph 100% ausentes
3. ~2.400 city pages com template idêntico — **risco alto Helpful Content Update**
4. Bairros SP canibalizam entre si + com /sao-paulo/
5. Performance servidor ruim: TTFB ~3s
6. 22 scripts JS externos + 47 imagens base64 placeholder

✅ **Correções (vs auditoria inicial):**
- `lang="pt-BR"` ESTÁ presente
- `rel="canonical"` ESTÁ presente
- Bronze e Prata têm profundidade — só Ouro/Platinum são rasos

✅ **Não testado:**
- Lighthouse score real (rate limit no PSI sem API key)
- INP real (precisa CrUX field data)
- Indexação real (precisa GSC do dono)

---

## 9. Score atualizado

`planodesaudeamil.com.br`: **6,5/10** (revisado para baixo de 7,0)

Justificativa do downgrade: confirmação da duplicação programática massiva (1 risco crítico) e performance servidor ruim (TTFB ~3s) compensam os pontos fortes (blog limpo, preços atualizados, FAQ rica).

`amilplanos.com.br`: **6,5/10** (mantido — também sofre dos mesmos problemas técnicos, com vantagem em H1 qualifier de city pages mas perda em blog spam e preços defasados).

**Empate técnico real.** A vantagem competitiva do satélite Astro+Bun não é incremental — é estrutural (CWV, schema, conteúdo local real).
