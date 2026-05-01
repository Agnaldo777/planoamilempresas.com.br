# Redirect 301: `planosaudeamil.com.br` → `planoamilempresas.com.br`

**Status:** A configurar pelo stakeholder
**Data decisão:** 2026-04-29
**Decisão:** Opção B (escolha do stakeholder em chat)
**Vigência:** durante Fase 2 não iniciada (~3 meses após Fase 1 ao ar)

---

## Contexto

O domínio `planosaudeamil.com.br` foi registrado em 2026-04-28 como **Fase 2** do Caminho C
(escopo amplo PJ+PF+adesão+dental). Conforme PRD v1.3.1 e ADR-009 (ecossistema hub-and-spoke),
Fase 2 só inicia **após Fase 1 (planoamilempresas.com.br) estar validada no ar há 3+ meses**
— para link building hub-and-spoke começar com autoridade real.

Enquanto Fase 2 não chega, o domínio **NÃO fica parado**. Em vez disso, faz **redirect 301 permanente**
para `planoamilempresas.com.br`, transferindo precoce a autoridade SEO de qualquer link orgânico
que aponte para `planosaudeamil.com.br`.

**Motivos:**

1. **SEO:** redirect 301 transfere ~85-95% do PageRank do domínio origem (Google declarado)
2. **UX:** visitante digitando manualmente o domínio não vê 404
3. **Reversível:** quando Fase 2 começar, basta remover o redirect e apontar DNS para Workers
4. **Compliance:** disclaimer ANS/SUSEP fica no destino (Fase 1) durante o redirect
5. **Custo:** R$ 0/mês — Cloudflare Page Rules / Bulk Redirects no free tier

---

## Implementação no Cloudflare

### Pré-requisitos

- Conta Cloudflare ativa (já existe — Bradesco e Fase 1 usam)
- Domínio `planosaudeamil.com.br` adicionado ao Cloudflare como site
- Nameservers do registro.br apontando para Cloudflare (`xxxx.ns.cloudflare.com`)

### Opção 1 — Bulk Redirects (recomendado, moderno)

1. Login Cloudflare → seleciona conta (não o domínio)
2. Menu lateral: **Bulk Redirects** → **Lists** → **Create new list**
3. Configurar:
   - **List name:** `planosaudeamil-to-planoamilempresas`
   - **List description:** "Redirect 301 Fase 2 dormante para Fase 1 ativa (Caminho C 2026-04-29)"
4. Add new redirects → URL Redirect:
   - **Source URL:** `https://planosaudeamil.com.br/*`
   - **Target URL:** `https://planoamilempresas.com.br/$1`
   - **Status code:** `301 - Moved Permanently`
   - **Preserve query string:** ✅ enabled
   - **Include subdomains:** ✅ enabled
5. **Add** → **Save and finish**
6. Menu lateral: **Bulk Redirects** → **Configurations** → **Create configuration**
7. Configurar:
   - **Description:** "Fase 2 dormante → Fase 1"
   - **Lists to use:** `planosaudeamil-to-planoamilempresas`
8. **Save** → ativo imediatamente

### Opção 2 — Page Rule (legado, ainda funciona)

Se preferir usar Page Rules (limite 3 grátis no plano Free):

1. Cloudflare → seleciona `planosaudeamil.com.br`
2. **Rules** → **Page Rules** → **Create Page Rule**
3. Configurar:
   - **URL pattern:** `*planosaudeamil.com.br/*`
   - **Setting:** `Forwarding URL`
   - **Status code:** `301 - Permanent Redirect`
   - **Destination URL:** `https://planoamilempresas.com.br/$2`
4. **Save and Deploy**

### Opção 3 — Cloudflare Worker dedicado (overkill — não recomendado)

Worker dedicado para redirect introduz complexidade desnecessária. Use Bulk Redirects.

---

## Validação

Após configuração, testar:

```bash
# Deve retornar 301 + Location: https://planoamilempresas.com.br/
curl -I https://planosaudeamil.com.br/

# Deve retornar 301 + Location: https://planoamilempresas.com.br/blog
curl -I https://planosaudeamil.com.br/blog

# Path com query string
curl -I "https://planosaudeamil.com.br/comparar?planos=bronze,prata"
# Esperado: Location: https://planoamilempresas.com.br/comparar?planos=bronze,prata
```

Browser test:
- Abrir `https://planosaudeamil.com.br` → URL muda para `https://planoamilempresas.com.br`
- DevTools Network: primeira request status `301`, second request `200`

---

## DNS

Cloudflare DNS para `planosaudeamil.com.br`:

| Tipo | Nome | Valor | Proxy | TTL |
|------|------|-------|-------|-----|
| A | `@` | `192.0.2.1` (qualquer IP — Bulk Redirects intercepta antes de chegar lá) | ✅ Proxied | Auto |
| CNAME | `www` | `planosaudeamil.com.br` | ✅ Proxied | Auto |

**Importante:** o IP `192.0.2.1` é placeholder reservado RFC 5737 (TEST-NET-1). Bulk Redirects funcionam mesmo sem origin server real porque interceptam na camada Cloudflare antes de proxy. Cloudflare aceita qualquer IP — o redirect dispara primeiro.

---

## Rollback (quando Fase 2 começar)

Quando estiver pronto para iniciar Fase 2 (~3 meses após Fase 1 ao ar):

1. Cloudflare → Bulk Redirects → desabilitar configuração `Fase 2 dormante → Fase 1`
2. Atualizar DNS de `planosaudeamil.com.br` para apontar Cloudflare Workers da Fase 2
3. `wrangler deploy` da Fase 2 (após fork de planoamilempresas)
4. Validar `planosaudeamil.com.br` serve site Fase 2 ao vivo

Tempo de propagação: TTL Auto + cache CDN = ~5-10 min.

---

## Riscos & Mitigações

| Risco | Mitigação |
|-------|-----------|
| Search Console pode penalizar redirect 301 longo se conteúdo destino for muito diferente | Fase 1 é ESCOPO PARCIAL da Fase 2 (apenas PJ) — destino tem conteúdo Amil relevante. OK. |
| Backlinks externos para `planosaudeamil.com.br` durante redirect transferem para Fase 1 (não Fase 2 quando vier) | **Reverso:** quando Fase 2 começar, conteúdo PF/adesão/dental será o destino real — backlinks ainda úteis. |
| Visitante PF buscando "plano amil individual" cai em página PJ | Fase 1 tem `/sobre-nos` + `/comparar` que cobre menus para PF (mesmo limitado). Considerar adicionar disclaimer no Header de Fase 1 enquanto redirect ativo |
| Redirect "preso" se esquecer de remover quando Fase 2 começar | Tarefa explícita na Story 1.X de inicialização Fase 2 (criar quando chegar a hora) |

---

## Compliance

Conforme ADR-006 (URL-as-Trademark):
- Domínio `planosaudeamil.com.br` é registrado pela BeneficioRH (compliance OK)
- Não usa logo Amil oficial
- Disclaimer "corretora autorizada SUSEP" fica no destino (Fase 1)

ADR-009 (ecossistema):
- Redirect 301 sinaliza ao Google que `planosaudeamil` é variante de `planoamilempresas`
- **Risco PBN:** baixo — são domínios complementares do mesmo operador, não rede artificial
- Manter footer cross-domain links após Fase 2 iniciar (FR48)

---

## Cronograma

| Quando | Ação | Owner |
|--------|------|-------|
| 2026-04-29 (hoje) | Decisão B registrada | stakeholder |
| Após Fase 1 ao ar | Stakeholder configura Bulk Redirects no Cloudflare | stakeholder |
| Validação | `curl -I` confirma 301 | stakeholder |
| ~3 meses após Fase 1 validada (M+3) | Avaliar inicialização Fase 2 | Pax + stakeholder |
| M+3 a M+5 | Fork Fase 1 → Fase 2, deploy próprio | Dex + Gage |
| M+5 | Remover redirect, ativar site Fase 2 | Gage |

---

## Referências

- **ADR-009** Estratégia ecossistema hub-and-spoke
- **ADR-011** Cloudflare Workers deployment
- **PRD v1.3.1** seção "Fase 2 Roadmap — `planosaudeamil.com.br` (OUT OF SCOPE MVP v1)"
- Memória `project_satelites_amil_caminho_c.md`
- [Cloudflare Bulk Redirects docs](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/)
