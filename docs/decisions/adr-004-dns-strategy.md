# ADR-004: DNS Strategy

**Status:** 📝 **Proposed**
**Data:** 2026-04-16 (PRD v1.1 inicial)
**Autor:** Aria (Architect) — Synkra AIOS
**Última atualização:** 2026-04-26 (Pax re-validação — extração inline → arquivo formal)

---

## Context

O domínio `planoamilempresas.com.br` (e potencialmente subdomínios futuros — `studio.`, `api.`) precisa de uma estratégia de DNS robusta que combine:

- **DDoS protection** (site público de alto tráfego SEO, alvo potencial de scraping/ataques)
- **Deploy tooling nativo** com Vercel (preview deploys automáticos em branches/PRs)
- **TTL controle** para mudanças rápidas em emergência
- **SSL automático** sem fricção operacional
- **Compatibilidade com `.com.br`** (registrar Registro.br)

## Decision

**Option A — Cloudflare DNS pointing to Vercel (DNS-only, gray cloud / pass-through sem proxy).**

Combina DDoS protection robusto e ferramentas DNS maduras do **Cloudflare** com deploy tooling nativo, SSL automático e edge benefits do **Vercel**.

### Setup operacional

1. Registrar domínio em registrar (**Registro.br** se `.com.br`)
2. Nameservers do registrar → **Cloudflare**
3. Cloudflare DNS records (todos em modo **DNS-only / gray cloud**, sem proxy):
   - A/AAAA → Vercel IPs (automático com Vercel domain verification)
   - CNAME (`www`) → `cname.vercel-dns.com`
4. Vercel adiciona domínio no projeto, valida via TXT record temporário
5. SSL automático (Vercel) — Let's Encrypt provisionado pelo Vercel

## Consequences

- ✅ **Best-of-both:** DDoS protection Cloudflare + deploy Vercel
- ✅ Cloudflare DNS é **mais confiável e rico em recursos** que Vercel DNS (analytics, bulk edit, API maduro)
- ✅ Preserva **preview deploys automáticos** Vercel em subdomains (não quebra com proxy)
- ✅ SSL automático e renovação sem intervenção
- ✅ Compatível com `.com.br` via Registro.br
- ⚠️ Configuração inicial requer 2 painéis (Cloudflare + Vercel) — documentar em Story 1.2a
- ⚠️ Mudança de provider de hosting no futuro requer atualização em Cloudflare DNS (não em registrar)

## Alternatives Considered

| Opção | Veredito | Por quê |
|---|---|---|
| **A — Cloudflare DNS → Vercel (gray cloud / DNS-only)** | ✅ **Escolhido** | DDoS Cloudflare + edge Vercel sem perda de features |
| B — Vercel DNS direto (tudo em Vercel dashboard) | ❌ Rejeitado | Sem DDoS protection; Vercel DNS menos rico em features que Cloudflare |
| C — Cloudflare com proxy (Orange Cloud, pass-through proxying Vercel) | ❌ Rejeitado | Quebra preview deploys automáticos em subdomains; perde alguns benefícios edge Vercel; double-edge desnecessário |

## References

- `docs/architecture.md` (seção ADRs inline — fonte original)
- `docs/prd.md` v1.2.2 Story 1.2a — DNS bridge setup
- Vercel docs: https://vercel.com/docs/projects/domains
- Cloudflare DNS docs: https://developers.cloudflare.com/dns/
- Registro.br: https://registro.br
