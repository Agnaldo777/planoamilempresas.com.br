# ADR-011: Plataforma de deploy — Cloudflare Workers (não Pages)

| Field | Value |
|-------|-------|
| **Status** | ✅ **Accepted** — co-signed pelo stakeholder em 2026-04-29 |
| **Date** | 2026-04-29 (revisão 2026-04-29: pivot Pages → Workers durante implementação) |
| **Decisores** | Aria (Architect) · Dex (recommendation + deployment report) · Agnaldo Silva (stakeholder) |
| **Author** | Aria (Architect) — Synkra AIOS |
| **Co-sign** | Agnaldo Silva (stakeholder) — 2026-04-29 via decisão registrada em chat ("C" autorizando migração Vercel → Cloudflare) |
| **Estende** | ADR-004 (DNS Strategy), ADR-008 (stack unificada Next.js), ADR-009 (ecossistema hub-and-spoke) |
| **Não substitui** | ADR-008 — stack Next.js 16 segue válida; muda apenas a plataforma de hosting/deploy |

---

## 1. Context

ADR-004 (DNS) e ADR-008 (stack) assumiam **Vercel** como plataforma de deploy (Hobby ou Pro). Em 2026-04-29, revisão honesta dos termos de uso e dos limites quantitativos das plataformas levantou três bloqueadores para manter Vercel:

1. **Vercel Hobby proíbe uso comercial** ([Vercel ToS — Hobby Tier](https://vercel.com/legal/terms)): "personal, non-commercial use only". `BeneficioRH` é corretora real que opera leads pagos via WhatsApp/CRM — usar Hobby é violação direta de ToS, com risco de banimento súbito que derrubaria todo o pipeline SEO programático.
2. **Vercel Pro custa USD 20/mês/seat** + custos variáveis de bandwidth e function invocations. Em fase pré-validação de SEO (zero ARR confirmado), o custo recorrente não se justifica.
3. **Vercel Hobby tem cap de 100 GB bandwidth/mês**. Story 7.4 (expansão SSG completa) estima geração de páginas estáticas para 9.325 prestadores × páginas relacionadas — em cenário SEO ativo, o cap pode ser atingido em poucos meses sem upgrade forçado.

ADR-008 já antecipava reconsideração caso "tráfego Fase 2 ultrapassar ~500k pv/mês" ou "custo Vercel se tornar bloqueante". Os pontos 1 e 2 antecipam o gatilho — a barreira não é mais tráfego, é compliance ToS e custo fixo inicial.

### Por que Workers (não Pages)

Esta versão do ADR foi originalmente redigida recomendando **Cloudflare Pages** com `@cloudflare/next-on-pages`. Durante a implementação (mesma data, 2026-04-29), Dex identificou bloqueador concreto:

- **`@cloudflare/next-on-pages` exige Next ≤ 15.5.2** — incompatível com Next 16.2.4 fixado por ADR-008. Manter Pages exigiria downgrade da stack, contrariando ADR-008.
- **`@opennextjs/cloudflare@1.19.4`** (peer `next ≥16.2.3`) é o caminho **oficial e atualmente recomendado pela própria Cloudflare** para Next 14+/15+/16+ rodando na borda. Adapter mantido em parceria entre OpenNext e Cloudflare.
- **Workers** oferece equivalência funcional a Pages para Next.js, com superfície adicional: bindings nativos para **R2** (object storage), **Durable Objects**, **KV** e **Queues** sem proxy.
- Cloudflare anunciou em 2025 que a stack Pages-for-Next.js está em manutenção, e que **Workers + OpenNext é o caminho forward**. Pivotar agora alinha o projeto ao roadmap oficial.

A decisão técnica de fundo (Cloudflare como vendor) **não muda** — apenas o produto (Workers em vez de Pages) e o adapter (`@opennextjs/cloudflare` em vez de `@cloudflare/next-on-pages`).

### Comparação de plataformas (free tiers e limites comerciais)

| Plataforma | Free tier permite uso comercial? | Bandwidth | Requests / Build | Bundle limit | Custo entry pago |
|---|---|---|---|---|---|
| **Vercel Hobby** | ❌ Não (ToS personal-only) | 100 GB/mês | 6.000 build min/mês | — | Pro USD 20/seat/mês |
| **Vercel Pro** | ✅ Sim | 1 TB/mês incluído + overage | 24.000 build min/mês | — | USD 20/seat/mês + overage |
| **Cloudflare Workers Free** | ✅ Sim (explícito nos ToS) | **Ilimitado** | **100k requests/dia** · 10 ms CPU/request | 1 MB Worker compressed (3 MB paid) | Workers Paid USD 5/mês |
| **Cloudflare Workers Paid** | ✅ Sim | **Ilimitado** | **10M requests/mês incluído** · 30 s CPU/request | 3 MB Worker compressed | USD 5/mês + overage marginal |
| **Netlify Free** | ✅ Sim | 100 GB/mês | 300 build min/mês | — | Pro USD 19/seat/mês |
| **Self-hosted VPS (Hetzner CX22)** | ✅ Sim | ~20 TB/mês | infra própria | — | EUR ~4/mês + ops |

Adicional Cloudflare gratuito utilizado neste ADR:
- **R2 Free:** 10 GB armazenamento + 1M Class A operations/mês + 10M Class B operations/mês + egress gratuito.

Fonte: páginas oficiais de pricing/limits Cloudflare (2026-04, públicas). Não inclui descontos sazonais ou tiers customizados.

### Trigger da decisão

ADR-008 já listava "em ≥500k pv/mês avaliar migração para Cloudflare + Next.js export estático ou OpenNext". O trigger antecipou-se por compliance, não por escala. Cloudflare Workers emerge como vencedora pelos seguintes motivos:

- **Gratuidade comercial explícita** — elimina o risco de ToS de Vercel Hobby.
- **Bandwidth ilimitado** — destrava Story 7.4 expansão sem teto operacional.
- **ADR-004 já adota Cloudflare DNS** — consolidar Workers + DNS + CDN + R2 em vendor único reduz superfície operacional.
- **Edge global Cloudflare (~330 PoPs)** — TTFB baixo globalmente, alinhado às mitigações de performance da ADR-008. Workers tem cobertura PoP maior que Pages.
- **Caminho oficial Cloudflare para Next 16** — `@opennextjs/cloudflare` é o adapter mantido pela própria Cloudflare para Next.js moderno.

---

## 2. Decision

1. **Plataforma de deploy:** **Cloudflare Workers** (free tier, comercial OK).
2. **Adapter:** `@opennextjs/cloudflare@1.19.4` (oficial Cloudflare, peer `next ≥16.2.3`).
3. **Stack:** **Next.js 16.2.4 mantida** — ADR-008 segue válida; este ADR muda só a plataforma de hosting.
4. **DNS:** **Cloudflare DNS mantido** — ADR-004 segue válida, agora apontando para Workers route (custom domain ou `*.workers.dev`) em vez de Vercel ou `*.pages.dev`.
5. **Infra adicional Cloudflare:**
   - **R2 bucket** `planoamilempresas-isr-cache` para cache ISR incremental (substitui Vercel On-Demand ISR).
6. **Compatibility flags Workers:**
   - `nodejs_compat` — habilita APIs Node necessárias ao Sanity client e libs Node (`fs`/`path` virtualizados).
   - `global_fetch_strictly_public` — segurança: bloqueia fetches a IPs privados/loopback no runtime Worker.
7. **Sanity Studio (`/studio`)** roda fora dos Workers — opção primária `*.sanity.studio` hosted (gratuito, oficial Sanity); fallback é subdomínio Vercel isolado se Visual Editing exigir mesma origem.

---

## 3. Consequences

### Positivas

- ✅ **Custo R$ 0/mês** até alta escala — alinhado com fase pré-validação SEO (zero ARR confirmado). Upgrade Workers Paid (USD 5/mês) destrava 10M req/mês + 30 s CPU se necessário.
- ✅ **Uso comercial 100% OK** — corretora pode operar legalmente sem risco ToS.
- ✅ **Bandwidth ilimitado** — Story 7.4 expansão completa (9.325 prestadores SSG) viável sem teto.
- ✅ **Edge global ~330 PoPs Cloudflare Workers** — TTFB baixo globalmente; reforça mitigação de performance da ADR-008.
- ✅ **Vendor único:** DNS (ADR-004) + CDN + Workers + R2 na mesma conta — reduz painéis e ponto de coordenação.
- ✅ **Adapter oficial alinhado a Next 16** — `@opennextjs/cloudflare` mantido pela Cloudflare, suporte garantido para versões modernas do Next.
- ✅ **R2 gratuito (10 GB + 1M ops)** absorve cache ISR sem custo até escala material.

### Negativas / Trade-offs

- ⚠️ **Adapter `@opennextjs/cloudflare` adiciona camada** vs deploy nativo Vercel. Fluxo de build passa por step adicional (`opennextjs-cloudflare build`).
- ⚠️ **Bundle size limit 1 MB compressed** (Workers free) / 3 MB compressed (Workers paid). Exige bundle analyzer no CI e cuidado com deps pesadas. Já existe guardrail parcial em workflow `search-index-budget.yml` (Story 7.2) — estender para tracking de Worker bundle.
- ⚠️ **CPU time limit 10 ms/request (free) / 30 ms iniciais e 30 s burst (paid)**. SSR com queries Sanity pesadas pode encostar no limite free tier — mitigação: ISR via R2 reduz CPU/request para hits de cache.
- ⚠️ **APIs Node não-edge incompatíveis sem flag.** Algumas libs (que usem `fs`, `child_process`, ou bindings nativos) precisam `nodejs_compat` ou alternativa Edge-compatible. Auditoria de deps obrigatória pré-cutover.
- ⚠️ **ISR baseado em R2** vs Vercel On-Demand ISR nativo. Estratégia: `revalidatePath` via cron Cloudflare Workers ou webhook Sanity → endpoint de invalidação que escreve no bucket `planoamilempresas-isr-cache`.
- ⚠️ **Sanity Studio (`/studio`) não roda nativo em Workers** — schema runtime do Studio depende de APIs Node não cobertas por `nodejs_compat`. Mitigação: hosting separado (preferência: `*.sanity.studio` oficial).
- ⚠️ **Workerd Windows arm64 dev local** apresenta issues conhecidas. Mitigação: dev local via `npx next dev` padrão (Node); Workers runtime usado apenas em CI e produção.
- ⚠️ **Preview deploys** em Workers funcionam via versions/preview URLs `*.workers.dev` — se ADR-004 prevê preview em subdomínio próprio, configurar custom preview domain.

### Mitigações declaradas

1. **Chunking de build** — já implementado Story 7.4 (env vars `BUILD_FULL_PROVIDERS`, `PHASE_2_ENABLED`). Validar que cada chunk fica abaixo do limite de tempo do GitHub Actions runner.
2. **Sanity Studio em hosting próprio Sanity** (`*.sanity.studio`, gratuito). Fallback: instância Vercel isolada apenas para `/studio` se Visual Editing same-origin for crítico.
3. **Bundle analyzer no CI** — estender `search-index-budget.yml` (Story 7.2) para também medir Worker bundle ≤ 1 MB compressed (free) ou ≤ 3 MB (paid); falhar PR ao ultrapassar warning threshold.
4. **`nodejs_compat` flag** habilitado em `wrangler.jsonc` para Sanity client e APIs Node necessárias.
5. **`global_fetch_strictly_public` flag** habilitado para hardening de segurança (bloqueia fetches a IPs privados/loopback do runtime Worker — mitiga SSRF).
6. **Workerd Windows arm64 issue:** dev local roda via `npx next dev` (Node padrão). Workers runtime é exercitado apenas em CI (Linux runners) e produção. Dex documenta workaround em `docs/devops/cloudflare-workers-setup.md`.
7. **Polyfills e auditoria de APIs Node** documentados em `docs/devops/cloudflare-workers-setup.md` (substitui `vercel-setup.md`).
8. **`wrangler.jsonc` + headers/redirects via Next config + middleware** assumem o papel funcional de `vercel.json` (rewrites, headers de segurança, redirects 301 dormentes).

---

## 4. Alternatives Considered

| Opção | Custo inicial | Comercial OK | Bandwidth | Veredito |
|---|---|---|---|---|
| **A) Cloudflare Workers free + `@opennextjs/cloudflare`** | R$ 0 | ✅ Sim | Ilimitado | ✅ **Escolhido** |
| A.1) Cloudflare Pages + `@cloudflare/next-on-pages` | R$ 0 | ✅ Sim | Ilimitado | ❌ Rejeitado durante implementação — exige Next ≤15.5.2, viola ADR-008 (Next 16) |
| B) Vercel Hobby | R$ 0 | ❌ Não (ToS) | 100 GB | ❌ Rejeitado — viola ToS |
| C) Vercel Pro | USD 20/mês | ✅ Sim | 1 TB | ❌ Rejeitado — custo fixo pré-validação |
| D) Netlify Free | R$ 0 | ✅ Sim | 100 GB | ❌ Rejeitado — bandwidth limitada vs CF |
| E) Self-hosted VPS (Hetzner CX22) | EUR ~4/mês | ✅ Sim | ~20 TB | ❌ Rejeitado — overhead operacional + foge da stack managed (ADR-008) |

---

## 5. Implementation Plan

Re-emissão de stories (v2) sob coordenação de **Pax (PO)** e execução de **Dex (Dev)**:

- **Story 1.2 v2:** migrar deploy config Vercel → Cloudflare Workers (build via `opennextjs-cloudflare build`, env vars/secrets via `wrangler secret put`, R2 bucket criado e bound como `NEXT_INC_CACHE_R2_BUCKET`).
- **Story 1.2a v2:** redirect 301 dormente via Next middleware ou config (substitui rewrite Vercel; em Workers, redirects ficam no app, não em config externo).
- **Story 1.3 v2:** workflows GitHub Actions usando `cloudflare/wrangler-action@v3` para deploy Workers.
- **Documentação:** `docs/devops/cloudflare-workers-setup.md` (substitui `vercel-setup.md` se existir).
- **Arquivos de config reais criados:**
  - `wrangler.jsonc` (config Workers — substitui `wrangler.toml` planejado e `vercel.json`)
  - `open-next.config.ts` (config OpenNext — incluindo R2 incremental cache)
  - `.github/workflows/cloudflare-pages-deploy.yml` → **renomear para `cloudflare-workers-deploy.yml`** (sinalizado a Dex/Gage)

Stakeholders informados: **Pax (PO)** para re-priorização das stories 1.2 / 1.2a / 1.3 v2 já com nome correto (Workers, não Pages); **Dex (Dev)** para execução em paralelo a este ADR; **Gage (DevOps)** para adicionar permissões deny/allow de `wrangler` em `.claude/settings.json` se necessário e renomear o workflow.

---

## 6. Reconsideração

Reabrir esta decisão se uma das condições ocorrer:

1. **Cloudflare Workers mudar política de free tier** (introduzir cap de bandwidth, restringir uso comercial, ou reduzir tier free abaixo de 100k req/dia).
2. **Sanity Studio integration via Workers virar bloqueador real** — caso `*.sanity.studio` deixe de atender ou Visual Editing exigir same-origin obrigatório sem alternativa edge-compatible.
3. **Tráfego justificar Vercel Pro** (1M+ pv/mês com ROI claro e equipe ≥2 seats), tornando o trade-off de custo absorvível e o ecossistema Vercel (Edge Functions, ISR nativo, Speed Insights) materialmente vantajoso.
4. **`@opennextjs/cloudflare` ser descontinuado** ou cair em estado de manutenção crítica.
5. **Workers bundle/CPU limits** se tornarem bloqueio real para SSR atual (mesmo após otimizações), forçando avaliação de tier paid ou plataforma alternativa.

Sem nenhuma dessas, a decisão fica fixa.

---

## 7. Não substitui — estende

Este ADR **estende** ADR-004 (DNS Strategy), ADR-008 (stack unificada Next.js) e ADR-009 (ecossistema hub-and-spoke):

- **ADR-004:** Cloudflare DNS segue como camada DNS oficial; muda apenas o destino (Cloudflare Workers em vez de Vercel — CNAME/route para custom domain Workers, não `*.pages.dev` nem Vercel). Modo DNS-only / gray cloud segue válido. Re-validar setup operacional descrito em ADR-004 §"Setup operacional" com novos targets Workers.
- **ADR-008:** stack Next.js 16.2.4 + React 19 + Tailwind 4 + Sanity v3 segue 100% válida. Apenas a linha "stack 100% Vercel" da ADR-008 (mencionada em ADR-010 §Restrições) é refinada — leia-se "stack 100% managed edge"; as restrições derivadas (SSG agressivo, RSC, dynamic imports) seguem aplicáveis.
- **ADR-009:** estratégia hub-and-spoke não muda; só a plataforma de hosting de cada nó da topologia. Hub `planodesaudepj` e satélites Amil podem migrar em waves coordenadas pelo ecossistema (decisão por nó, não atômica).

---

## 8. Workers vs Pages — por que pivotamos durante implementação

**Data do pivot:** 2026-04-29 (mesmo dia da emissão original do ADR — pivot intra-ciclo de implementação).

**Origem:** Dex (Dev) iniciou implementação seguindo a recomendação original do ADR (Cloudflare Pages + `@cloudflare/next-on-pages`). Ao instalar o adapter, o resolver de peer dependencies retornou bloqueio:

- `@cloudflare/next-on-pages` declara peer `next: <=15.5.2`.
- Projeto está em `next@16.2.4` (fixado por ADR-008).
- Downgrade para Next 15.5.2 contrariaria ADR-008 (que documenta a escolha pela linha 16 explicitamente).

**Investigação:** Dex levantou que a Cloudflare moveu o suporte oficial para Next.js 14+/15+/16+ para o adapter `@opennextjs/cloudflare` (peer `next ≥16.2.3`), rodando sobre **Workers** em vez de Pages. O OpenNext é mantido em parceria entre comunidade OpenNext e Cloudflare; é o caminho documentado nas docs oficiais Cloudflare para Next.js moderno.

**Decisão de pivot:** manter Cloudflare como vendor (vendor unique alinhado a ADR-004), trocar produto Pages → Workers, trocar adapter `@cloudflare/next-on-pages` → `@opennextjs/cloudflare@1.19.4`. Adicionar R2 bucket para cobrir ISR incremental cache. Filosofia (free comercial OK + zero custo + edge global) **preservada integralmente**.

**Status pós-pivot (2026-04-29):**
- `wrangler.jsonc` configurado com `nodejs_compat` + `global_fetch_strictly_public` + R2 binding.
- `open-next.config.ts` configurado com R2 incremental cache provider.
- `package.json` com `@opennextjs/cloudflare@1.19.4` instalado.
- Workflow `cloudflare-pages-deploy.yml` ainda com nome legado — sinalizado para rename.

Referência: Dex deployment report 2026-04-29 (logs de implementação da Story 1.2 v2).

---

## 9. References

- `docs/decisions/adr-004-dns-strategy.md` — DNS Cloudflare (mantido)
- `docs/decisions/adr-008-stack-unificada-nextjs-satelites-amil.md` — stack Next.js (mantida)
- `docs/decisions/adr-009-estrategia-ecossistema-hub-spoke.md` — topologia ecossistema
- Vercel ToS — https://vercel.com/legal/terms (Hobby restrictions)
- Cloudflare Workers docs — https://developers.cloudflare.com/workers/
- Cloudflare Workers limits/pricing — https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare R2 docs — https://developers.cloudflare.com/r2/
- `@opennextjs/cloudflare` — https://opennext.js.org/cloudflare
- Compatibility flags (`nodejs_compat`, `global_fetch_strictly_public`) — https://developers.cloudflare.com/workers/configuration/compatibility-flags/
- Memória global `project_satelites_amil_caminho_c.md` — decisão consolidada satélites Amil
- Memória global `project_plano_amil_empresas.md` — projeto SEO PJ

---

## Change Log

| Data | Versão | Autor | Mudança |
|---|---|---|---|
| 2026-04-29 | v1.0 | Aria | Emissão original recomendando **Cloudflare Pages + `@cloudflare/next-on-pages`**. Co-sign Agnaldo Silva. |
| 2026-04-29 | v1.1 | Aria | **Pivot para Cloudflare Workers + `@opennextjs/cloudflare@1.19.4`** após Dex identificar incompatibilidade do adapter Pages com Next 16 (peer `<=15.5.2`). Adicionado R2 para ISR cache, compatibility flags `nodejs_compat` e `global_fetch_strictly_public`. Renomeado arquivo `adr-011-deployment-platform-cloudflare-pages.md` → `adr-011-deployment-platform-cloudflare-workers.md`. Adicionada Section 8 documentando o pivot. Status ✅ Accepted preservado — decisão de fundo (Cloudflare) não muda. |
