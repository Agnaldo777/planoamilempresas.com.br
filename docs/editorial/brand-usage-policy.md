# Brand Usage Policy — Marca Amil em planoamilempresas.com.br

**Deliverable:** Story 2.4, Deliverable 2
**Autor:** Uma (UX) + Aria (Architect) — Synkra AIOS
**Data:** 2026-06-08
**Aplicação:** obrigatória para todo conteúdo, template e asset do projeto.

> Esta política operacionaliza o **NFR8** do PRD e a **Mitigação 3** do
> **ADR-006**. Ela define o que **pode** e o que **não pode** ser feito com a
> marca Amil, em coerência com o status de **corretor autorizado** (BeneficioRH,
> SUSEP 201054484) a intermediar planos da Amil Assistência Médica Internacional
> S.A. (ANS nº 326305).

---

## Princípio orientador

Uso **descritivo e de boa-fé** da marca, para **identificar o produto
legitimamente comercializado** pelo corretor — nunca para sugerir que o site é
um canal oficial, afiliado ou de propriedade da Amil.

---

## ✅ PERMITIDO

| Uso | Condição |
|-----|----------|
| Termo "Amil" em **texto** (títulos, parágrafos, FAQs) | Sempre em contexto descritivo |
| Nomes de **produtos/redes** Amil em texto (S380, S450, S750, Black, One, Adesão, etc.) | Nomenclatura factual, sem alteração |
| Termo "amil" no **domínio** e em **slugs de URL** | Sujeito ao ADR-006 (slug de produto pendente co-sign) |
| **Cores** institucionais aproximadas em elementos de UI | Sem reproduzir o logotipo |
| Citar **registro ANS 326305** da operadora | Como dado factual de identificação |
| Link para `https://www.amil.com.br` como canal oficial | Atribuição de origem (reforça boa-fé) |

## 🚫 PROIBIDO

| Uso | Motivo |
|-----|--------|
| **Logotipo / wordmark / ícone oficial Amil** | Trade dress — risco de confusão de origem |
| Logo da Amil em favicon, OG image, header, footer ou qualquer asset | Idem |
| Afirmar ou sugerir ser "site oficial", "canal oficial" ou "Amil" | Concorrência desleal / publicidade enganosa |
| Usar identidade visual que imite o site oficial Amil (layout, tipografia-assinatura) | Trade dress |
| Omitir o disclaimer de corretor independente | Quebra a mitigação 1 do ADR-006 |
| Prometer cobertura/preço como se fosse a operadora | Responsabilidade + LGPD/CDC |

---

## Disclaimer obrigatório (Mitigação 1 — ADR-006)

Texto canônico, **fonte única** em `src/content/disclaimers/amil-rede.ts`:

> Corretor autorizado a intermediar planos da Amil Assistência Médica
> Internacional S.A. (registro ANS nº 326305). Este site é independente; não
> substitui canais oficiais Amil.

**Onde renderizar:**
- Rodapé de **todas** as páginas do site.
- **Topo** de toda página de rede credenciada (`/rede/**`, `/rede-credenciada/**`).
- Página "Sobre".

---

## Atribuição de origem (Mitigação 2 — ADR-006)

Toda página de rede deve emitir JSON-LD `Organization` com:

```json
{ "@type": "Organization", "name": "BeneficioRH (corretor)", "sameAs": ["https://www.amil.com.br"] }
```

Primitive reusável: `<OrganizationJsonLd />` (Story 7.2). Defaults canônicos em
`src/content/disclaimers/amil-rede.ts` (`ORGANIZATION_JSONLD_DEFAULTS`).

---

## Checklist de auditoria por página

- [ ] Disclaimer canônico presente (topo + rodapé)
- [ ] `Organization.sameAs` → `amil.com.br`
- [ ] Zero logo/wordmark/ícone Amil em qualquer asset
- [ ] Identificação do corretor (SUSEP 201054484) visível
- [ ] Nenhuma alegação de canal oficial
- [ ] Sem claims de métricas sem fonte (`feedback_claims_metricas`)

> Auditoria automatizável: `scripts/audit/cluster-e-compliance.ts` (Story 7.7,
> Task 10) deve varrer estas asserções em amostra de páginas geradas.

---

## Referências

- `docs/decisions/adr-006-url-as-trademark-policy.md`
- `docs/prd.md` — NFR8, NFR22
- `src/content/disclaimers/amil-rede.ts`
- Lei nº 9.279/96 (LPI) — uso descritivo de boa-fé
- Lei nº 13.709/18 (LGPD)
