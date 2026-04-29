# Plano de Contingência de Domínio — Rollback de Marca Amil

> **Story 1.2a — Deliverable principal.**
> **Story 2.4 — Deliverable 3 (validação jurídica).**
>
> **SLA:** Rollback completo em **<1h** após notificação Amil.
> **Mitigação 4** da Story 1.0 Bloco 2 (risco aceito stakeholder — opção 🅲️).

---

## Contexto

O projeto `planoamilempresas.com.br` opera sem parecer jurídico prévio sobre
uso da marca "Amil" no domínio. Caso a Amil envie notificação extrajudicial,
o time precisa migrar todo o tráfego para o domínio-ponte
`planosaudeempresas.com.br` em <1h, preservando posicionamento orgânico via
redirects 301.

Esta capacidade é assegurada por:
1. Domínio-ponte registrado e DNS pré-configurado (TTL 300s).
2. `vercel.contingency.json` com mapping completo `/plano-amil/* → /plano-empresarial/*` pronto para cópia.
3. Landing minimalista em `app/dominio-ponte/page.tsx` já deployada.

---

## WHOIS — confirmação de registro

> **TODO stakeholder:** capturar screenshot WHOIS de
> `planosaudeempresas.com.br` em https://registro.br/tecnologia/ferramentas/whois/
> e arquivar em `docs/legal/whois-planosaudeempresas.png`.
>
> Confirmar:
> - Owner: BeneficioRH (Agnaldo Silva) — CNPJ 14.764.085/0001-99
> - Status: published / active
> - Expiry > 12 meses

| Campo | Valor esperado |
|-------|----------------|
| Domain | `planosaudeempresas.com.br` |
| Owner | BeneficioRH — Agnaldo Silva |
| CNPJ | 14.764.085/0001-99 |
| Nameservers | Cloudflare (após Task 2) |
| Expiry | (preencher) |

---

## DNS Cloudflare — domínio-ponte

| Record | Type | Name | Target | TTL | Proxy |
|--------|------|------|--------|-----|-------|
| 1 | A | `@` | `76.76.21.21` (Vercel) | **300s** | DNS only (gray) |
| 2 | CNAME | `www` | `cname.vercel-dns.com` | **300s** | DNS only (gray) |

> TTL 300s é constraint da Mitigação 4 (consistência com ADR-004).
> Proxy DNS-only obrigatório (Cloudflare Proxy laranja quebra Vercel).

---

## Mapping de URLs (resumo)

Mapping completo em [`vercel.contingency.json`](../../vercel.contingency.json) — 50+ regras cobrindo:

| Padrão origem (planoamilempresas) | Padrão destino (planosaudeempresas) | Qtd estimada |
|-----------------------------------|-------------------------------------|--------------|
| `/plano-amil/*` | `/plano-empresarial/*` | catch-all |
| `/empresarial/*` | `/plano-empresarial/*` | 1 + path |
| `/planos/*` | `/tabela-planos/*` | 1 + path |
| `/cotacao-online/*` | `/cotacao/*` | 1 + path |
| `/rede-credenciada/*` | `/rede-prestadores/*` | 1 + path |
| `/rede/:uf/:municipio/:slug*` | `/rede-prestadores/:uf/:municipio/:slug*` | ~10.500 (SSG/ISR) |
| `/amil-dental/*` | `/dental-empresarial/*` | 1 + path |
| `/amil-espaco-saude-:unidade` | `/espaco-saude/:unidade` | ~80 |
| `/blog/:slug*` | `/conteudo/:slug*` | ~50 |
| `/plano-amil-:estado/*` | `/plano-empresarial-:estado/*` | 26 estados |
| Programáticas CNAE × cidade × porte | mantém slug (`/segmento/:codigo`, etc) | ~600 (Wave 1) |
| Produtos Amil-S380, S450, S750, One | nomes genéricos (`/produtos/master`, etc) | 4 |

> **Limitação Wave 2/3:** mapping atual cobre Wave 1 (~600 programáticas
> + ~10.500 rede). Quando Wave 2 (~2.400) e Wave 3 (~5.700) forem geradas
> em Stories 5.x/7.x, atualizar `vercel.contingency.json` via script
> `scripts/generate-contingency-redirects.mjs` (TODO Story 5.x).

---

## Procedimento de Rollback (SLA <1h)

### Fase 1 — Detecção e decisão (5min)

1. **T+0:** stakeholder recebe notificação extrajudicial Amil.
2. **T+1:** stakeholder aciona @devops (Gage) por canal pré-acordado (WhatsApp/email).
3. **T+5:** decisão go/no-go (ver "Critérios de acionamento" abaixo).

### Fase 2 — Ativar redirects (10min)

```bash
# 1. Renomear contingência → produção
cd /c/Users/benef/planoamilempresas
git checkout -b emergency/amil-rollback-$(date +%Y%m%d)
mv vercel.json vercel.json.backup
cp vercel.contingency.json vercel.json

# 2. Push direto (bypass branch protection com permissão admin)
git add vercel.json vercel.json.backup
git commit -m "chore(emergency): activate domain rollback to planosaudeempresas [Story 1.2a]"
git push origin emergency/amil-rollback-YYYYMMDD

# 3. Merge fast-forward em main (ou abrir PR + auto-approve admin)
gh pr create --base main --title "EMERGENCY: rollback Amil notification"
gh pr merge --merge --admin

# 4. Vercel deploya production em ~2min
```

### Fase 3 — Atualizar DNS principal (10min)

```
Cloudflare → Zone planoamilempresas.com.br → DNS

Opção A (preservar tráfego, redirect server-side):
  → manter A record apontando para Vercel; redirects de vercel.json fazem o trabalho.

Opção B (cortar tráfego completamente, "morrer rápido"):
  → mudar A record para IP de página estática 410 Gone.
  → recomendada apenas se Amil exigir takedown total.
```

> Padrão: **Opção A** (preserva SEO equity migrando 301 para domínio-ponte).
> Opção B apenas se notificação exigir takedown total e advogado autorizar.

### Fase 4 — Apontar domínio-ponte como canônico (10min)

```
Vercel Project → Settings → Domains
→ Set primary domain: planosaudeempresas.com.br
→ planoamilempresas.com.br vira "Redirect to primary"
```

### Fase 5 — Validação pós-rollback (15min)

Checklist obrigatório (ver "Checklist" abaixo).

### Fase 6 — Comunicação (10min, paralelo)

- Email/WhatsApp resposta à notificação Amil (template abaixo)
- Notificar leads ativos (CRM Clint) sobre nova URL
- Atualizar Google Search Console (re-verificar nova propriedade)
- Atualizar GA4 (filtro hostname)

**Tempo total estimado:** ~50min. Margem 10min para imprevistos.

---

## Critérios de acionamento

| Tipo de comunicação | Acionar rollback? | Ação |
|---------------------|-------------------|------|
| Email amigável Amil pedindo conversa | NÃO | Responder formal, agendar reunião |
| Notificação extrajudicial via cartório | SIM (após advogado revisar) | Rollback + resposta formal |
| Decisão liminar judicial | SIM (imediato) | Rollback + cumprir prazo legal |
| Tweet/post pessoal sem caráter formal | NÃO | Monitorar, sem ação |

---

## Template de Resposta à Notificação Amil

> Validar com advogado antes de enviar. Salvar versão final assinada em
> `docs/legal/template-resposta-amil.md` (Story 2.4).

```
[CABEÇALHO BENEFICIORH]

À Amil Assistência Médica Internacional S.A.
A/C: Departamento Jurídico
Ref: Notificação extrajudicial nº [XXX]

Prezados Senhores,

Em resposta à V/notificação datada de [DATA], referente ao uso do termo
"Amil" no domínio planoamilempresas.com.br, esclarecemos:

1. A BeneficioRH, CNPJ 14.764.085/0001-99, é corretora de seguros
   regularmente habilitada pela SUSEP sob o registro nº 201054484, com
   autorização para intermediar planos de saúde de diversas operadoras,
   incluindo a Amil Assistência Médica Internacional S.A. (registro ANS
   nº 326305).

2. O uso do termo "Amil" no domínio referido tem natureza meramente
   descritiva — informa ao consumidor que oferecemos cotações de planos
   da operadora Amil — sem qualquer intenção de associação institucional
   ou de uso de marca para identificação de origem dos serviços.

3. Não obstante a divergência interpretativa sobre a aplicação do art.
   132 da Lei 9.279/96 ao caso, e em respeito à V/posição, comunicamos
   que adotamos as seguintes medidas em caráter precaucional:

   a) Migração de todo o conteúdo para o domínio
      planosaudeempresas.com.br, sem qualquer referência a marca de
      operadora específica no domínio;
   b) Manutenção dos redirecionamentos 301 do domínio anterior por
      período de 90 dias, exclusivamente para preservar a navegação
      dos usuários já em jornada;
   c) Atualização de todos os disclaimers para reforçar a posição de
      corretor independente, distinto da operadora.

4. Permanecemos à disposição para esclarecimentos adicionais e abertos
   ao diálogo construtivo, ratificando nosso compromisso com práticas
   éticas e em conformidade com a legislação aplicável.

Atenciosamente,

Agnaldo Silva
BeneficioRH — SUSEP 201054484
beneficiorh@gmail.com
```

> **Não assumir culpa.** Não usar "pedimos desculpas" ou "reconhecemos a
> infração". Mencionar parceria autorizada de corretagem como contexto.

---

## Checklist de validação pós-rollback

Após Fase 5, executar todos os itens:

```bash
# 1. Redirects 301 funcionando (sample 10 URLs)
for path in "/plano-amil" "/empresarial/cnae/8610" "/cotacao-online" \
            "/rede-credenciada" "/rede/SP/sao-paulo" "/amil-dental" \
            "/perguntas-frequentes" "/blog" "/amil-one" "/portal-empresa"; do
  echo "Testing: $path"
  curl -sI "https://planoamilempresas.com.br$path" | head -3
  echo "---"
done
# Esperado: HTTP/2 301 Location: https://planosaudeempresas.com.br/...

# 2. Domínio-ponte servindo conteúdo
curl -s https://planosaudeempresas.com.br/ | grep -i "<title>"
# Esperado: título customizado, não landing minimalista (a essa altura
# já é o site principal).

# 3. HSTS ativo no novo domínio
curl -sI https://planosaudeempresas.com.br/ | grep -i strict-transport
# Esperado: max-age=63072000; includeSubDomains; preload

# 4. SSL válido
echo | openssl s_client -connect planosaudeempresas.com.br:443 -servername planosaudeempresas.com.br 2>/dev/null | openssl x509 -noout -dates
# Esperado: notAfter > hoje
```

Manual:

- [ ] Google Search Console: nova propriedade `planosaudeempresas.com.br` verificada
- [ ] GSC: submitar sitemap atualizado em <24h
- [ ] GSC: registrar Change of Address (planoamilempresas → planosaudeempresas)
- [ ] GA4: novo Stream para hostname `planosaudeempresas.com.br` configurado
- [ ] Sanity: domain config atualizado (`SANITY_REVALIDATE_SECRET` re-emitido se exposto)
- [ ] Vercel: env var `NEXT_PUBLIC_SITE_URL=https://planosaudeempresas.com.br` em production
- [ ] DNS antigo: TTL voltado a 300s mantido (caso novo rollback necessário)
- [ ] Backup `vercel.json.backup` arquivado em `/c/Users/benef/backups/`
- [ ] Email enviado a todos os leads ativos (CRM Clint export)
- [ ] Resposta à Amil enviada via cartório/AR (manter rastro)
- [ ] @architect (Aria) revisou e aprovou checklist final

---

## Tempo medido em DR simulation (Task 6 da Story 1.2a)

> **TODO @devops:** registrar aqui após rodar simulação de rollback em
> ambiente preview (sem afetar produção).

| Fase | Estimado | Medido | Delta |
|------|----------|--------|-------|
| Detecção+decisão | 5min | TBD | TBD |
| Ativar redirects | 10min | TBD | TBD |
| Atualizar DNS | 10min | TBD | TBD |
| Domínio-ponte canônico | 10min | TBD | TBD |
| Validação | 15min | TBD | TBD |
| **Total** | **<1h** | **TBD** | **TBD** |

---

## Referências

- ADR-004: `docs/decisions/adr-004-dns-strategy.md`
- ADR-006 (URL-as-trademark): `docs/decisions/adr-006-url-as-trademark-policy.md`
- Story 1.0 — Bloco 2: aceitação de risco + 5 mitigações
- Story 1.2a: `docs/stories/1.2a.dns-dominio-ponte.story.md`
- Story 2.4 (validação jurídica): consumirá este documento como Deliverable 3
- `vercel.contingency.json` na raiz: mapping completo dormente
- `app/dominio-ponte/page.tsx`: landing minimalista atual

---

## Owner

@devops (Gage) operacional, @architect (Aria) quality gate, advogado (TBD)
revisão da carta-resposta.
