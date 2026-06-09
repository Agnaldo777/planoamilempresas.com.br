# Domain Contingency Plan — Rollback 301 ≤1h

**Deliverable:** Story 2.4, Deliverable 3 (referenciado por ADR-006 Mitigação 4 e Story 7.7 AC1.3)
**Autor:** Gage (DevOps) + Aria (Architect) — Synkra AIOS
**Data:** 2026-06-08
**Plataforma de deploy:** Cloudflare Workers (ADR-011 — substitui Vercel do ADR-004)
**DNS:** Cloudflare (ADR-004 Option A — DNS-only / gray cloud)
**Status:** 📋 Plano publicado — **inativo** (acionar somente em caso de notificação Amil)

> Plano de resposta operacional para o cenário de **cease & desist** ou
> notificação extrajudicial da Amil quanto ao uso da marca em domínio/URL. O
> objetivo é **preservar o conteúdo e o tráfego SEO** migrando a URL canônica
> para o **domínio-ponte** em ≤1h, sem assumir culpa e pedindo prazo de transição.

---

## 1. Pré-requisitos (devem estar prontos ANTES de qualquer incidente)

| Pré-requisito | Estado | Responsável |
|---------------|--------|-------------|
| Domínio-ponte `planosaudeempresas.com.br` registrado | ⚠️ Confirmar | Stakeholder (Registro.br) |
| DNS do ponte configurado em Cloudflare (gray cloud) | ⚠️ Confirmar | Stakeholder / Gage |
| **TTL dos registros = 300s** (mudança rápida) | ⚠️ Confirmar | Gage |
| Domínio-ponte adicionado como custom domain no Worker | ⬜ | Gage |
| Template de resposta jurídica pré-aprovado (§5) | ✅ Neste doc | Advogado revisar |
| Mapa de redirects `/plano-amil/*` → `/plano-empresarial/*` (§4) | ✅ Neste doc | Aria |

> Story 1.2a entrega o domínio-ponte com **TTL 300s**. Sem o ponte ativo e o TTL
> baixo, o tempo de rollback excede 1h (propagação DNS).

---

## 2. Gatilho (quando acionar)

Acionar **apenas** mediante:
- Notificação formal (extrajudicial, e-mail jurídico ou citação) da Amil / seu departamento jurídico ou de marcas; **ou**
- Orientação expressa do advogado revisor após avaliar comunicação recebida.

**Não acionar** por: queda de ranking, reclamação de usuário, ou suposição.

---

## 3. Procedimento de rollback (runbook ≤1h)

> Tempo-alvo: **≤60min** do gatilho ao redirect ativo. Pré-condição: §1 pronto.

1. **T+0min — Acionar incidente.** Stakeholder + advogado cientes. Registrar
   data/hora e cópia da notificação em `docs/legal/incidents/`.
2. **T+5min — Congelar deploys.** Pausar pipeline CI (não publicar novas URLs
   com marca durante o incidente).
3. **T+10min — Ativar redirect 301 em massa.** No Cloudflare Workers:
   - Implantar o redirect rule de `planoamilempresas.com.br/*` →
     `planosaudeempresas.com.br/{path-mapeado}` (mapa §4), **301 permanente**.
   - Alternativa imediata (se Worker indisponível): **Cloudflare Bulk Redirect /
     Redirect Rules** no painel DNS — não depende de novo build.
4. **T+20min — Verificar.** `curl -I` em 10 URLs estratificadas confirmando
   `301` + `Location` correto; confirmar SSL do ponte ativo.
5. **T+30min — Sitemap + canonical.** Publicar sitemap do ponte; `<link rel=canonical>`
   das páginas aponta para o ponte. Submeter ponte ao Google Search Console.
6. **T+45min — Resposta jurídica.** Advogado envia resposta §5 (pedido de 30 dias).
7. **T+60min — Pós-incidente.** Documentar em `docs/legal/incidents/AAAA-MM-DD-amil.md`.

> Conteúdo permanece **100% indexável**; apenas a URL canônica muda. O 301
> preserva a maior parte da autoridade SEO acumulada.

---

## 4. Mapa de redirects (URL → URL)

Regra geral: trocar o segmento de marca por segmento neutro, **preservando o
restante do path** (UF, município, slug do prestador) para herdar autoridade.

| Origem (`planoamilempresas.com.br`) | Destino (`planosaudeempresas.com.br`) |
|-------------------------------------|----------------------------------------|
| `/` | `/` |
| `/plano-amil/*` | `/plano-empresarial/*` |
| `/rede/[redeSlug]/[uf]` | `/rede/[uf]` (drop do slug de produto) |
| `/rede/[uf]/[municipio]/[prestador]` | `/rede/[uf]/[municipio]/[prestador]` (igual) |
| `/rede-credenciada/[subRede]` | `/rede-credenciada` (genérico) |
| `/planos/[slug]` | `/planos/[slug]` (avaliar slug com marca) |
| Demais paths | mesmo path |

> ⚠️ As URLs de **maior risco** são justamente as da Story 7.7
> (`/rede/[redeSlug]/[uf]` com slug de produto). O mapa as colapsa para a versão
> neutra por UF, que já existe (Story 7.8) — perda de granularidade, não de
> tráfego total.

---

## 5. Template de resposta a notificação (pré-aprovado — revisar com advogado)

> ⚖️ **Minuta técnica — NÃO é peça jurídica final.** O advogado revisor deve
> validar/ajustar antes de qualquer envio. Não assumir culpa.

```
Ref.: Notificação recebida em [DATA] — uso de marca

Prezados,

Acusamos o recebimento de sua comunicação. [BeneficioRH / Razão social],
corretor de seguros devidamente habilitado (SUSEP nº 201054484) e autorizado a
intermediar planos da Amil (ANS nº 326305), reitera sua atuação de boa-fé e em
caráter meramente informativo/descritivo, sem qualquer intenção de sugerir
vínculo oficial ou de propriedade da marca.

Sem reconhecer procedência quanto a eventual irregularidade, e em espírito de
cooperação, colocamo-nos à disposição para realizar os ajustes que se mostrarem
pertinentes. Solicitamos o prazo de 30 (trinta) dias para eventual transição
técnica de endereços, período durante o qual permaneceremos abertos ao diálogo.

Permanecemos à disposição para tratativas.

Atenciosamente,
[Nome / OAB do advogado] — em nome de [BeneficioRH]
```

---

## 6. Checklist de prontidão (revisar trimestralmente)

- [ ] Domínio-ponte registrado e válido (não expirado)
- [ ] DNS do ponte em Cloudflare, gray cloud, **TTL 300s**
- [ ] Ponte como custom domain no Worker (SSL ativo)
- [ ] Redirect rule testada em staging (dry-run)
- [ ] Template §5 revisado pelo advogado
- [ ] Contato do advogado atualizado

---

## Referências

- `docs/decisions/adr-006-url-as-trademark-policy.md` — Mitigação 4
- `docs/decisions/adr-004-dns-strategy.md` — DNS Cloudflare
- `docs/decisions/adr-011-deployment-platform-cloudflare-workers.md` — plataforma atual
- `docs/stories/1.2a.dns-dominio-ponte.story.md` — setup do ponte
- `docs/stories/7.7.cluster-e-rede-uf.story.md` — AC1.3
