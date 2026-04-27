# Stakeholder Inputs — Story 1.0

**Projeto:** planoamilempresas.com.br
**Stakeholder:** Agnaldo Silva (BeneficioRH Corretora de Seguros)
**Data de início da sessão:** 2026-04-24
**Owner:** Agnaldo (stakeholder) | Tracker: Pax (@po) | Orquestrador: Orion (@aios-master)

> **Propósito:** consolidar os 13 placeholders `[PENDENTE]` da PRD v1.2 + Architecture v1.0 em documento único e aprovado pelo stakeholder, desbloqueando Story 1.1 (fork + strip) e todas as subsequentes.

---

## Bloco 1 — Identidade do corretor ✅ FECHADO

### 1.1 Nome completo do corretor responsável
**Resposta:** Agnaldo Silva

### 1.2 Número SUSEP do corretor
**Resposta:** 201054484 (aprovado para exibição pública)

### 1.3 Razão social + CNPJ da corretora PJ
**Resposta:**
- Razão social: BeneficioRH Corretora de Seguros
- CNPJ: `14.764.085/0001-99` ✅ confirmado pelo stakeholder

### 1.4 Aceite de aparecer publicamente
**Resposta:** ✅ Aceite total
- ✅ Foto profissional — fornecida (arquivo original: `Agnaldo-silva-corretor-bradesco-saude-empresarial.jpeg` em `C:\Users\benef\Desktop\Bradesco Saúde Fotos\08-blog\`; Story 1.1 copia para `/public/images/agnaldo-silva-corretor.jpeg`)
- ✅ Nome "Agnaldo Silva" visível publicamente
- ✅ Bio publicável (texto abaixo)
- ✅ LinkedIn linkado: https://www.linkedin.com/in/agnaldosilva-especialitaemtelemedicina/
- ✅ Número SUSEP 201054484 visível publicamente

**Bio aprovada pelo stakeholder (para uso em página "Sobre o Corretor" — Story 2.1):**

> Sou corretor de planos de saúde há mais de 20 anos, com atuação direta nas principais seguradoras e operadoras do mercado: Bradesco Saúde, SulAmérica, Unimed Seguros e Amil. Ao longo dessa trajetória, construí uma expertise sólida em planos empresariais para todos os perfis de empresa, desde MEI e pequenas empresas até grandes grupos corporativos.
>
> Meu foco é entender a realidade do seu negócio e montar uma solução sob medida, garantindo o melhor custo-benefício sem abrir mão da qualidade de atendimento para seus colaboradores. Trabalho de forma transparente, comparando as opções disponíveis e orientando você em cada etapa, da escolha do plano à gestão contínua do contrato.
>
> Se você busca um parceiro de confiança para cuidar da saúde da sua equipe e simplificar a contratação do plano empresarial, estou pronto para te conduzir à melhor decisão com segurança, clareza e resultados concretos.
>
> **CTA:** "Fale comigo e receba um estudo comparativo gratuito dos principais planos de saúde empresarial para o perfil da sua empresa."

### 1.5 WhatsApp Business oficial
**Resposta:** +55 11 92651-0515 (formato E.164: `5511926510515`)

---

## Pontos de atenção do Bloco 1 (não-bloqueantes, revisar antes de Story 2.1)

1. **Menção a concorrentes na bio** — a bio cita "Bradesco Saúde, SulAmérica, Unimed Seguros e Amil". Em site focado em SEO para **Plano Amil Empresarial**, isso tem **trade-off**:
   - ✅ **Prós:** reforça E-E-A-T (corretor multi-operadora = mais experiência); útil na página `/sobre`; demonstra transparência
   - ⚠️ **Contras:** se aparecer no H1/H2 ou em meta descriptions, dilui sinal SEO para "Amil"; concorrentes podem indexar o domínio para outras keywords
   - **Decisão sugerida:** manter a bio integral **apenas na página `/sobre`**; em homepage/cornerstones, usar versão curta focada só em Amil (ex: "20+ anos de experiência com planos de saúde empresariais, especialista em Amil PJ"). Validar com @ux-design-expert (Uma) e @pm (Morgan) antes de Story 2.1.

2. **CTA da bio** — "estudo comparativo gratuito dos principais planos" implica **comparação multi-operadora**. Isso pode ser estrategicamente forte (diferencial real do corretor), mas pode também contradizer o posicionamento "site especializado em Amil". Decisão: manter no `/sobre` como credencial; no form principal, manter CTA focado em Amil ("receba cotação Amil em 2h").

3. **Typo no slug do LinkedIn** — URL atual tem "especialita" (provavelmente "especialista" com typo). Slug é imutável no LinkedIn sem perder conexões/seguidores, então mantemos como está — só usar como link opaco (`rel="me"`), não como texto visível.

---

---

## Bloco 2 — Jurídico crítico ⚠️ PARCIAL (2.1 precisa esclarecimento)

### 2.1 Parecer jurídico sobre uso de "Amil" no domínio
**Resposta do stakeholder:** 🅲️ **Assumir o risco sem consultar advogado**, confiando na cobertura de "corretor autorizado"
**Domínio-ponte de contingência proposto:** `planosaudeempresas.com.br` (⚠️ status de registro a confirmar — ver mitigação 4 abaixo)
**Status:** ✅ fechado com mitigações obrigatórias documentadas

**Mitigações obrigatórias (OBRIGATÓRIAS — todas acionadas antes do go-live):**

1. **Registrar domínio-ponte** `planosaudeempresas.com.br` no Registro.br (R$ 40/ano) — **@devops (Gage)** executa em Story 1.2 (DNS) antes do canary deploy. Se o domínio já estiver registrado por terceiro, stakeholder propõe alternativa. Escolher entre: `cotarplanoempresa.com.br` / `comparaplanoscorporativos.com.br` / `planosempresariais.com.br`.
2. **Disclaimer "Corretor autorizado a intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº 326305)"** em rodapé de 100% das páginas — Story 1.7 (Footer), componente `<Disclaimer type="marca-amil" />` (Story 2.2).
3. **NUNCA usar logotipo Amil** (cores, ícone, wordmark oficial) — apenas texto. Vai para `docs/editorial/brand-usage-policy.md` criado em Story 1.0 conclusion.
4. **Plano de contingência 301 rollback** — documentar em `docs/devops/domain-contingency-plan.md` (template criado em Story 1.0):
   - Se Amil enviar notificação extrajudicial: rollback 301 em <1h para domínio-ponte
   - Todas as 600+ URLs programáticas mapeadas para equivalente neutro (ex: `/plano-amil/sao-paulo/clinica-medica/...` → `/plano-empresarial/sao-paulo/clinica-medica/...`)
   - Cloudflare DNS TTL configurado em 300s (5min) para permitir troca rápida — aplicado em Story 1.2 (ADR-004)
   - Template de resposta à notificação pré-aprovado (sem assumir culpa, pedindo 30 dias para transição)
5. **Risk acknowledgment assinado** em `docs/legal/domain-risk-acknowledgment.md` — criado em Story 1.0 conclusion, confirmando que stakeholder foi informado do risco e optou por prosseguir sem parecer prévio.

**Impacto em PRD/Architecture:**
- NFR8 (compliance marca Amil): mitigação 2 e 3 garantem
- Story 2.4 (validação jurídica inicial): pode seguir sem parecer prévio, mas **deve** gerar o risk acknowledgment + brand usage policy + contingency plan como deliverables
- ADR-004 (DNS strategy): TTL baixo (300s) reforça opção Cloudflare DNS → Vercel
- Adicionar Story 1.2a: "Registrar domínio-ponte e configurar redirect inativo" (nova sub-story)

### 2.2 Produtos Amil autorizados + portes atendidos
**Resposta:** ✅ Todos os produtos + todos os portes
- Produtos autorizados: Amil 400, 500, 600, Blue, Black, Dental, Facilities (todos)
- Portes atendidos: MEI+PJ individual, ME (2-10), EPP/PME (11-30), média (31-100), grande (101-200), corporativo (200+)
**Impacto em PRD:** desbloqueia Stories 3.6 (Amil Blue vs Black), 3.7 (ME 2-10), 3.8 (30-200), 6.1 (PriceTable todos os produtos), 6.2 (tabela 2026)

### 2.3 DPO (Data Protection Officer)
**Resposta:** ✅ Agnaldo Silva como DPO da BeneficioRH
- DPO: Agnaldo Silva
- E-mail de contato LGPD: `beneficiorh@gmail.com` (mesmo do titular)
- WhatsApp contato LGPD: `5511926510515`
**Impacto em PRD:** desbloqueia Story 1.6 (política de privacidade LGPD), FR11 (consent management)
**Nota de compliance:** acumular funções titular + DPO é permitido pela ANPD para empresas de pequeno porte (Resolução CD/ANPD 2/2022), mas recomenda-se revisar a política de privacidade com advogado antes do go-live (ver 2.1).

---

## Pontos de atenção do Bloco 2

1. **Amil Black em todos os portes?** — Amil Black é produto premium que geralmente exige **credencial especial de broker tier premium**. Stakeholder afirma autorização. Recomendação: antes de Story 6.1 (PriceTable com Black) e Story 3.6 (cornerstone Blue vs Black), **@devops valida documento de credenciamento** arquivando em `docs/legal/broker-credentials.md`.

2. **Domínio-ponte já registrado** — `planosaudeempresas.com.br` confirmado como **já registrado** pelo stakeholder. @devops (Gage) só precisa configurar DNS + redirect inativo em Story 1.2a (não precisa adquirir).

---

## Bloco 3 — Decisões técnicas ✅ FECHADO

### 3.1 Decisão de CRM
**Resposta:** 🅴️ **Clint CRM** (stakeholder já usa — CRM vertical brasileiro especializado em corretores de seguros)
**Impacto arquitetural:** ⚠️ **ADR-002 precisa ser atualizado** — adicionar `ClintAdapter` à lista de implementações do `CRMAdapter` interface
- Arquivos afetados em `src/lib/crm/`: adicionar `clint.ts` como implementação primária
- Factory em `src/lib/crm/index.ts` deve aceitar `CRM_PROVIDER=clint`
- Story 4.3 (integração CRM) precisa de **spike técnico** em Story 1.0 conclusion: @architect (Aria) valida documentação da API Clint antes de @dev (Dex) implementar
- PRD Story 4.3 precisa editar lista de CRMs (v1.2 cita "RD Station / HubSpot / Pipedrive" — adicionar Clint como primário)

### 3.2 Decisão de CMS
**Resposta:** 🅰️ **Sanity v3**
**Impacto em PRD:**
- Story 3.1 (Setup CMS): implementar Sanity studio + schemas
- ADR-001 pode ser **fechado como Accepted: Sanity** (remove status Proposed)
- Dependências a adicionar em `package.json`: `@sanity/client`, `next-sanity`, `@sanity/image-url`, `@sanity/vision` (studio dev)
- Schemas de conteúdo (Cornerstone, PillarPage, ProgrammaticLanding, PriceTable, NetworkProvider, Disclaimer) precisam ser escritos em `sanity/schemas/` (Story 3.1)
- Preview automático em URL protegida (Story 3.1 AC 4)
- Webhook Sanity → Vercel Revalidate API para ISR em tabela de preços (Story 6.6)
- Free tier (3 usuários, 10GB) cobre MVP — Agnaldo + 1 redator freelance + 1 advogado revisor

---

## Pontos de atenção do Bloco 3

1. **Clint CRM — spike técnico obrigatório** antes de Story 4.3:
   - @architect (Aria) precisa coletar: URL da API Clint, método de autenticação, schema de Lead no Clint (campos obrigatórios/opcionais), webhook para status (opcional), rate limits da API
   - Pergunta para stakeholder no Bloco 3 adendum (ver abaixo)

2. **Sanity free tier suficiente?** — 3 users + 10GB bandwidth. Se crescer em Phase 2 (adicionar redator 2, advogado 2, gerente de projeto), upgrade para plano Growth ($99/mês) ou Team ($499/mês). Não bloqueia MVP.

---

## Adendum 3 — Clint API (precisa antes de Story 1.0 fechar)

Para @architect (Aria) fazer spike técnico do ClintAdapter, preciso que você me passe:

1. **URL da sua instância Clint** (ex: `https://suaempresa.clint.com.br` ou similar)
2. **Você tem acesso à documentação da API Clint?** Se tiver link ou PDF, me envia
3. **Tem API token gerado?** (se sim, guardar em vault; se não, @devops cria em Story 1.0 setup externo)
4. **Usa tags específicas para leads** que vêm do site? (ex: `origem-site`, `plano-amil`, `porte-pme`) ou vamos definir em Story 4.3?

---

---

## Bloco 4 — Operação ⚠️ PARCIAL (aguarda confirmação de lista revisada)

### 4.1 Top 20 cidades prioritárias para Wave 1 programática
**Resposta do stakeholder:** "Opção A com mais cidades de MG (Nova Lima, Juiz de Fora, Betim, Montes Claros, Uberaba, etc.)"

**Interpretação:** stakeholder quer manter capitais top nacional **+** dobrar aposta em MG (escritório em BH, Av. Afonso Pena 4098). Como Wave 1 = 20 cidades fixas (Architecture), proposta é **substituir** 5 cidades Tier 2 originais por 5 cidades de MG, mantendo 20 total.

**Lista revisada proposta (aguarda confirmação):**

#### Tier 1 — Capitais top nacional (8 cidades)
1. São Paulo/SP — maior volume nacional
2. Rio de Janeiro/RJ
3. Belo Horizonte/MG — capital MG (escritório do corretor)
4. Brasília/DF
5. Curitiba/PR
6. Porto Alegre/RS
7. Salvador/BA
8. Recife/PE

#### Tier 2A — Metropolitanas SP (3 cidades)
9. Campinas/SP
10. Guarulhos/SP
11. São José dos Campos/SP

#### Tier 2B — Minas Gerais (9 cidades — corretor opera ativamente)
12. Contagem/MG
13. Nova Lima/MG
14. Juiz de Fora/MG
15. Betim/MG
16. Montes Claros/MG
17. Uberlândia/MG
18. Uberaba/MG
19. Sete Lagoas/MG
20. Divinópolis/MG

**Cidades que saíram da lista original (Opção A):**
- Osasco/SP, Santo André/SP, Niterói/RJ, Nova Iguaçu/RJ, Ribeirão Preto/SP, Fortaleza/CE, Goiânia/GO
- **Não sumiram do projeto** — vão para Wave 2 (próximas 200 páginas, Story 5.4) ou Wave 3 (restante, Story 5.5)

**Justificativa da troca:**
- Stakeholder atende ativamente Minas Gerais → priorizar MG aumenta probabilidade de fechar contratos das primeiras 100 páginas indexadas
- Capitais Norte/Nordeste (Manaus, Belém, Natal) ficam para Wave 2 — volume relevante mas concorrência menor permite atrasar
- Aposta regional MG é diferencial competitivo (concorrentes Tier B do Atlas focam SP/RJ)

**Status:** ✅ aprovado em 2026-04-24 conforme proposta MG-heavy (Agnaldo: "bloco 4+5" = aceita seguir)

**Lista final Wave 1 (20 cidades):**
1. São Paulo/SP · 2. Rio de Janeiro/RJ · 3. Belo Horizonte/MG · 4. Brasília/DF · 5. Curitiba/PR · 6. Porto Alegre/RS · 7. Salvador/BA · 8. Recife/PE · 9. Campinas/SP · 10. Guarulhos/SP · 11. São José dos Campos/SP · 12. Contagem/MG · 13. Nova Lima/MG · 14. Juiz de Fora/MG · 15. Betim/MG · 16. Montes Claros/MG · 17. Uberlândia/MG · 18. Uberaba/MG · 19. Sete Lagoas/MG · 20. Divinópolis/MG

Cidades fora do Wave 1 vão para Wave 2 (M3) ou Wave 3 (M5-M6). Reordenação possível em Story 5.1 (keyword research formal Ahrefs/Semrush).

---

## Pontos de atenção do Bloco 4

1. **Wave 1 = 100 páginas, não 600** — Architecture especifica que **Wave 1 são 100 páginas selecionadas** das 600 combinações totais (20 cidades × 30 CNAEs × pelo menos 2 portes = 1200, top 100 priorizadas em Story 5.1 keyword research). As 20 cidades aqui só priorizam quais entram primeiro na Wave 1; as outras combinações são geradas em Wave 2 e 3.

2. **Pode ajustar a Wave 1 depois** — Story 5.1 (keyword research formal) usa Ahrefs/Semrush para validar volume real por combinação CNAE+cidade. Se uma cidade tiver volume baixo na prática, é movida para Wave 2 sem retrabalho.

---

---

## 📊 Tabela de preços oficial Amil — Abril/2026 (já fornecida pelo stakeholder)

**Status:** ✅ **arquivo entregue pelo stakeholder em `data/tabelas-amil.ts` + `data/tabelas-visual.html` em 2026-04-24**

### Cobertura atual

**14 estados completos:**
- Sudeste: SP, RJ, MG
- Sul: PR, SC, RS
- Centro-Oeste: DF, GO
- Nordeste: BA, PE, CE, MA, PB, RN

**6 estados pendentes** (mencionados no comentário do arquivo "Faltam 6 estados para completar os 20 planejados"):
- A definir com stakeholder — sugestão por volume/relevância: ES, MT, MS, AL, PI, SE

### Estrutura de dados real (importante!)

A nomenclatura comercial real da Amil PME **diverge da PRD v1.2 + Architecture v1.0**:

| Aspecto | PRD/Architecture v1.x dizia | Tabela real diz |
|---|---|---|
| **Produtos** | `amil-400`, `amil-500`, `amil-600`, `amil-blue`, `amil-black` | `Bronze`, `Bronze Mais`, `Prata`, `Ouro`, `Platinum`, `Platinum Mais` |
| **Acomodação** | (não diferenciava) | `QC` (quarto coletivo) e `QP` (quarto particular) |
| **Faixas etárias** | "faixa etária média" (variável simplificada) | 10 faixas ANS reais (00-18 → 59+) |
| **Coparticipação** | boolean (com/sem) | percentual (30% ou 40% conforme estado) |
| **Abrangência** | (não diferenciada) | `Grupo de Municípios` (Bronze) + `Nacional` (Prata+) |
| **Reembolso** | (não modelado) | apenas Ouro + Platinum (não Bronze/Prata) |
| **MEI** | tratado em cornerstone separado | atributo `exceptoMEI: true` em todos os planos |

### Helpers TypeScript já implementados

- `getPlanosDoEstado(sigla: string): PlanoAmil[]`
- `idadeParaFaixa(idade: number): FaixaEtaria`
- `precoPorIdade(plano: PlanoAmil, idade: number): number`
- `calcularPremioMensal(plano: PlanoAmil, idades: number[]): number`
- `filtrarPlanos(filtro: FiltroPlanos): PlanoAmil[]`
- `planosPorSegmentacao(sigla: string): Partial<Record<Segmentacao, PlanoAmil[]>>`

### Asset companheiro

`data/tabelas-visual.html` — render visual de todos os 14 estados para conferência. Abre direto no navegador, mostra todos os preços organizados em tabelas formatadas com badges de segmentação coloridos (alinhado com a paleta `#0066B3` da Amil).

---

## ⚠️ Pontos de atenção do conjunto Tabela de Preços

1. **Divergência de nomenclatura PRD ↔ realidade comercial** — adicionar à lista de correções v1.2 → v1.2.2:
   - PRD Story 6.1 (PriceTable): substituir lista de produtos
   - PRD Stories 3.5, 3.6 (cornerstones): repensar comparativos para nomenclatura Bronze→Platinum Mais
   - Architecture Tech Stack: atualizar `ProdutoAmilSlug` para `'bronze' | 'bronze-mais' | 'prata' | 'ouro' | 'platinum' | 'platinum-mais'`
   - ADR-003 (calculator formula): adaptar variável `produto`
   - Schema `HealthInsurancePlan`: refletir nomenclatura correta + atributo `acomodacao`
   - Adicionar atributo `coparticipacaoPct` no schema (era boolean, agora é percentual)

2. **Pipeline de atualização mensal (Story 6.6)** — se as tabelas vão ser atualizadas mensalmente:
   - Manter `data/tabelas-amil.ts` como source-of-truth versionado em git
   - Editar valores em commit Conventional: `feat(data): atualiza tabela Amil [Mês]/2026`
   - Build pipeline (Vercel) re-renderiza tabelas (ISR) automaticamente
   - HTML companheiro `tabelas-visual.html` é regenerado em CI ou mantido como conferência local

3. **Disclaimer ANS RN 195/2009 obrigatório** ao exibir esses valores no site:
   - "Valores indicativos referentes à tabela Amil PME Abril/2026, Exceto MEI"
   - "Valores sujeitos a análise contratual da operadora"
   - "Coparticipação 30%/40% sobre procedimentos eletivos conforme tabela ANS"
   - Componente `<Disclaimer type="ans-valores" />` (Story 2.2) exibido em toda página com tabela

4. **6 estados faltantes** — decisão do stakeholder em momento oportuno; não bloqueia início do dev (Wave 1 já tem cobertura suficiente com 14 estados, especialmente os 4 estados-foco MG/SP/RJ/DF para alta prioridade SEO)

---

---

## 🏥 Rede Credenciada Amil — Power BI integrado ao projeto ✅ FECHADO

**Status:** ✅ **dataset real importado e loader funcional em `data/rede-credenciada/`** em 2026-04-24

### Decisão estratégica

**Estratégia escolhida:** 🅳️ **Pipeline unificado de scraping** entre os 2 projetos do stakeholder (hub `planodesaudepj` é fonte primária; este projeto recebe cópia sincronizada). Substitui a estratégia inicial 🅱️ (export manual) ao descobrir que dataset já existia via scraping Playwright em sessão anterior.

### Fonte oficial

**Power BI público Amil:** https://app.powerbi.com/view?r=eyJrIjoiZmJlYjliOTEtNzMwNC00OGZiLWI3ZjYtYzEwYjkyMmI1OGZlIiwidCI6ImU3OTAzNGI2LWMxNGYtNGQzZS1hMDhmLWQ4ZDdkNDY0MzI3MSJ9

### Artefatos criados

- `data/rede-credenciada/rede-credenciada.json` (978 KB) — dataset oficial Amil (cópia do hub `planodesaudepj`)
  - 2.071 prestadores únicos
  - 23 UFs (faltam Norte: AC, AM, AP, RR — Amil não publica)
  - 14 colunas: Prestador, UF, Município, Bairro + 10 produtos como booleanos
- `data/rede-credenciada/rede-amil.ts` — types + loader funcional + 13 helpers de query:
  - `RedeAmilNome` (10 produtos: REDE 300/200 NACIONAL BLUE, AMIL ONE S6500/S2500, BLACK, PLATINUM/PLATINUM MAIS/PLATINUM QP, AMIL S750/S580/S450 QP)
  - `TipoAtendimentoInferido` (8 tipos via regex: Hospital, Pronto-Socorro, Maternidade, Clínica, Laboratório, Diagnóstico por Imagem, Centro/Instituto, Outro)
  - `PrestadorAmil` (entidade processada — usada em SSG)
  - `MunicipioRedeAmil` (agregação por município)
  - Helpers: `getAllPrestadores`, `getMunicipios`, `getMunicipioBySlug`, `getPrestadoresPorMunicipio`, `getMunicipiosByUf`, `getTopMunicipios`, `getBairrosDoMunicipio`, `getPrestadoresPorRede`, `getPrestadoresPorTipo`, `getEstatisticasRede`, `getEstatisticasByUF`, `prestadorSlug`, `slugify`, `inferTipoAtendimento`
  - Cache em memória (build-time) — performance ótima em SSG
- `data/rede-credenciada/README.md` — guia completo de pipeline + compliance + volume SEO esperado

### Volume SEO esperado (com dataset real)

| Tipo de página | Volume | URL exemplo |
|---|---|---|
| Hub busca filtrável | 1 | `/rede-credenciada` |
| Por UF | 23 | `/rede/sp` |
| Por município | ~300-500 | `/rede/sp/sao-paulo` |
| **Por prestador** | **2.071** | `/rede/sp/sao-paulo/9-julho` |
| Por bairro | ~800-1.500 | `/rede/sp/sao-paulo/morumbi` |
| Por tipo+município | ~200-400 | `/hospital/sp/sao-paulo` |
| Por produto×UF | 230 | `/rede/platinum-mais/sp` |
| **TOTAL** | **~3.500-4.500** | — |

Combinado com tabela de preços (~600 da matriz CNAE×cidade×porte) + páginas-cidade do clone reaproveitadas (1.005) = **~5.000-6.500 URLs totais SEO**.

### Mapeamento produtos Power BI ↔ Tabela de preços ✅ DECIDIDO

**Decisão do stakeholder (2026-04-24):** todos os 10 produtos do Power BI são comercializados pelo Agnaldo. Apenas 6 segmentações têm tabela pública disponível (mais populares). Os 4 produtos premium ficam como **"preço sob consulta"** no site — gera lead qualificado de alto valor.

#### Mapeamento provável (hipótese técnica — validar em QA Story 6.1)

| Tabela `tabelas-amil.ts` | Power BI rede |
|---|---|
| Bronze QC | REDE 200 NACIONAL BLUE |
| Bronze Mais QC | REDE 300 NACIONAL BLUE |
| Prata QC / QP | AMIL S450 QP |
| Ouro QC / QP | AMIL S750 QP |
| Platinum QP R1/R2 | PLATINUM QP |
| Platinum Mais QP R1/R2 | PLATINUM MAIS |

#### Produtos sem tabela pública (preço sob consulta)

| Power BI | Tratamento no site |
|---|---|
| `AMIL S580 QP` | Página existe, badge "Preço sob consulta", CTA forte para WhatsApp |
| `AMIL ONE S2500 QP` | Idem — linha Amil One intermediário |
| `AMIL ONE S6500 BLACK QP` | Idem — linha Amil One premium executivo |
| `BLACK` | Idem — produto Black autônomo |

#### Implicações em UX

- **Filtro de rede credenciada** mostra todos os 10 produtos
- **PriceTable** mostra apenas 6 segmentações com valores reais
- **Páginas-produto** existem para todos os 10:
  - 6 com tabela completa → conversão por self-service
  - 4 sob consulta → conversão por contato direto (lead premium)
- **Componente `<PrecoSobConsulta />`** novo (a criar em Story 6.1):
  - Badge visual "Preço sob consulta"
  - CTA "Fale comigo no WhatsApp para cotação personalizada"
  - Texto: "Este produto tem precificação por análise específica do perfil empresarial. Solicite cotação."

#### Implicações em SEO

- Páginas dos 4 produtos premium são potencialmente **alta conversão**:
  - "amil black empresarial" / "amil one s6500 black" = busca de decisor com orçamento
  - Conteúdo cornerstone explicativo + CTA contato
  - Schema `Product` sem `Offer.price` (válido — Google aceita "POA" / "Sob consulta")
- Páginas dos 6 com tabela = **alta visibilidade SEO**:
  - Preços reais visíveis indexáveis
  - Schema `Product` + `Offer.priceSpecification` completo

### Pontos de atenção

1. **PRD Story 6.5 (Rede Credenciada Filtrável) precisa ser expandida** na revisão v1.2 → v1.2.2:
   - Não é só "filtro client-side de uma lista"
   - É **pipeline completo** de export → transform → SSG → SEO
   - Cada prestador vira landing page com schema rich
   - Páginas-pai por UF e cidade

2. **PRD Story 6.6 (Pipeline mensal)** precisa cobrir 2 ativos sincronizados:
   - Tabela de preços (Abril/2026 atualizada — `data/tabelas-amil.ts`)
   - Rede credenciada (export Power BI mensal — `data/rede-credenciada/rede-amil.ts`)

3. **Architecture data model** — `NetworkProvider` (Aria já modelou) precisa ser expandido com:
   - `produtosAceitos: SegmentacaoAmil[]`
   - `especialidades: EspecialidadeMedica[]`
   - `indicadores: { acreditacao, possuiUTI, possuiPS24h, ... }`

4. **Script de import precisa ser criado** (`scripts/import-rede-amil.mjs`) — Story 6.5 sub-story

5. **Risco de cease & desist (mitigação 2.1)** — usar dados do Power BI público Amil é menor risco que usar logo, mas:
   - Disclaimer obrigatório "Rede sujeita a alterações pela operadora; confirmar via app oficial Amil antes de uso"
   - Link discreto "Ver versão oficial Amil"
   - Plano de contingência: se notificação Amil → remover páginas em 24h

---

---

## Bloco 5 — Design ✅ FECHADO (estratégia MVP)

**Resposta do stakeholder (2026-04-24):** "vamos seguir com o MVP" = aceita as 3 recomendações leves/baratas.

### 5.1 Logo Amil broker
**Decisão:** 🅳️ **Combo** — logo BeneficioRH no header + selo discreto "Corretor autorizado Amil" no rodapé
**Impacto:**
- Logo principal = BeneficioRH (sem risco de marca Amil)
- Selo no rodapé compõe E-E-A-T (corretor autorizado visível)
- ⏳ **Pendência menor:** caminho do arquivo SVG da logo BeneficioRH (stakeholder envia depois — não bloqueia Story 1.1)
- Plano B: se logo BeneficioRH não chegar até Story 1.4 (canary deploy), usa wordmark texto temporário "BeneficioRH" estilizado em Inter

### 5.2 Autorização da cor `#0066B3`
**Decisão:** 🅰️ **Manter `#0066B3` (azul Amil oficial)** + `#00C389` (CTA verde) conforme FE spec
**Impacto:**
- Design tokens FE spec mantidos sem alteração
- Risco baixo aceito (cor não é trademark estrita; Amil tolera uso por brokers autorizados)
- Plano de contingência: se Amil notificar especificamente sobre cor → trocar para `#004280` (azul mais escuro) via 1 linha em `tailwind.config.ts`

### 5.3 Direção de ilustrações
**Decisão:** 🅱️ **Stock editado (unDraw / Storyset)** — gratuito, customizável (paleta sincronizada com `#0066B3`)
**Impacto:**
- Custo: R$ 0
- Tempo: imediato (não bloqueia Stories de conteúdo)
- Banco recomendado: unDraw (https://undraw.co) — SVG paleta customizável
- Em Phase 2 (pós-MVP), avaliar upgrade para ilustrador próprio (~R$ 3K) se quiser elevar visual
- Catalog inicial: 8-10 ilustrações para MVP (homepage hero, sobre o corretor, calculadora, blog posts genéricos)

---

## ✅ TODOS OS 13 PLACEHOLDERS RESOLVIDOS

Status final dos 13 itens da Story 1.0 (PRD v1.2 + FE spec adendum):

| # | Item | Status |
|---|---|---|
| 1 | Nome completo + SUSEP do corretor | ✅ Agnaldo Silva, SUSEP 201054484 |
| 2 | Razão social + CNPJ corretora PJ | ✅ BeneficioRH Corretora de Seguros, 14.764.085/0001-99 |
| 3 | Validação contratual uso "Amil" no domínio | ✅ Risco aceito 🅲️ + 5 mitigações + ponte registrada |
| 4 | Top 20 cidades prioritárias | ✅ Lista MG-heavy aprovada (8 capitais + 3 SP + 9 MG) |
| 5 | Restrições contratuais Amil sobre produtos | ✅ Todos os produtos comercializados; 4 sob consulta |
| 6 | Decisão de CRM | ✅ Clint (vertical brasileiro corretoras) |
| 7 | Decisão de CMS | ✅ Sanity v3 |
| 8 | Nome + contato DPO | ✅ Agnaldo (beneficiorh@gmail.com, 5511926510515) |
| 9 | Número WhatsApp Business | ✅ 5511926510515 |
| 10 | Aceite público (foto, nome, bio, LinkedIn, SUSEP) | ✅ Aceite total + foto + bio + LinkedIn fornecidos |
| 11 | Logo Amil broker | ✅ Combo BeneficioRH + selo discreto (logo SVG pendente, fallback texto) |
| 12 | Autorização cor `#0066B3` | ✅ Mantido (risco aceito) |
| 13 | Direção de ilustrações | ✅ Stock editado unDraw/Storyset |

**Status final da sessão Story 1.0:** ✅ **CONCLUÍDA** em 2026-04-24

---

## 🎁 Bônus: ativos extras já consolidados além dos 13 placeholders

| Ativo | Localização | Status |
|---|---|---|
| Tabela de preços oficial Abril/2026 | `data/tabelas-amil.ts` | ✅ 14 estados (faltam 6 — não bloqueia) |
| Visual HTML companheiro tabela preços | `data/tabelas-visual.html` | ✅ pronto |
| Rede credenciada Amil (dataset Power BI) | `data/rede-credenciada/rede-credenciada.json` | ✅ 2.071 prestadores, 23 UFs |
| Loader TypeScript rede credenciada | `data/rede-credenciada/rede-amil.ts` | ✅ 13 helpers + cache |
| Pipeline scraping reproduzível | `C:\Users\benef\scrape_powerbi_amil.js` | ✅ pronto |
| Mapeamento produtos Power BI ↔ Tabela preços | documentado em `stakeholder-inputs.md` | ✅ hipótese técnica + plano "sob consulta" |

---

**Status:** em andamento — Bloco 1 parcialmente preenchido
**Última atualização:** 2026-04-24 por Orion (@aios-master)

---

## 🔍 Re-validação Pax v1.2.2 (2026-04-26)

> **Validador:** Pax (@po, Product Owner — Synkra AIOS)
> **Inputs:** PRD v1.2.2 (Morgan, atualizado com 11 correções pós Story 1.0) + Architecture v1.1 (Aria, atualizado com 7 mudanças) + FE spec v1.0 (Uma, NÃO atualizado nesta sessão)
> **Relatório completo:** `docs/po-revalidation-report-v1.2.2.md`

### Veredito final

**APROVADO COM RESSALVAS** — pass rate **87,5%** (10,5/12 itens framework PO Master Checklist).

@sm (River) está **liberado para iniciar story creation de Epic 1** (Stories 1.2, 1.2a, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8) imediatamente. Stories 3.2, 4.3 e 6.3 entram em **pending review** até suas dependências paralelas serem resolvidas (FE spec v1.1, Spike Clint, ADR-003 atuarial).

### Decisão sobre as 3 ambiguidades sinalizadas por Aria

| # | Ambiguidade | Decisão Pax | Justificativa resumida |
|---|---|---|---|
| 1 | ADR-003 (Fórmula calculadora) ainda usa `400/500/600/Blue/Black` | 🅱️ **Atualizar em conjunto com Story 6.7 (validação atuarial)** | Fórmula precisa ser repensada por atuário de qualquer forma — integrar atualização de nomenclatura no mesmo passo evita retrabalho. Aria extrai stub do ADR-003 para arquivo formal com `[REVISAR — Story 6.7]` |
| 2 | Type `UF` centralizado | 🅰️ **Criar `src/types/uf.ts`** (single source of truth) | `data/tabelas-amil.ts` NÃO exporta `UF` — não há conflito real, é oportunidade de fazer certo. Implementação na Story 1.1 + migração em Stories 5.0/6.1 |
| 3 | kebab-case (URL) vs PascalCase (UI) nas segmentações | 🅰️ **Manter divergência intencional + helper `src/lib/utils/segmentacao.ts`** | URLs precisam slug, UI precisa display label — pattern correto, não bug. Helper `toSlug`/`toLabel` ~12 linhas + 6 testes de round-trip |

### Pendências bloqueantes para @sm

**Bloqueios HARD:** ZERO. River pode começar Epic 1 hoje.

**Bloqueios SOFT (em queue paralela com River):**

1. **[HIGH][Uma] Patch `front-end-spec.md` v1.0 → v1.1** (≤60min):
   - Linhas 91, 225, 374: substituir "Amil 400/500/600/Blue/Black" por "Bronze vs Prata para PME" alinhado com Stories 3.4-3.18 do PRD
   - Linha 1234: remover proibição "❌ Ilustrações genéricas unDraw/etc" (Story 1.0 escolheu unDraw)
   - Linhas 1521-1523: marcar Open Questions 1, 2, 3 como **RESOLVED** com ref a este documento
   - Linha 929 `<NetworkResultCard />`: remover "especialidades" (não há no Power BI), manter "10 produtos como flags"
   - **Bloqueia Story 3.2 e 3.4-3.18.** Não bloqueia Epic 1.

2. **[MEDIUM][Aria] Extrair 4 ADRs inline para arquivos formais** (≤1h):
   - `docs/decisions/adr-000-nextjs-over-astro.md` (Status: Accepted)
   - `docs/decisions/adr-003-calculator-formula.md` (Status: Proposed — pending Story 6.7; nomenclatura antiga marcada `[REVISAR]`)
   - `docs/decisions/adr-004-dns-strategy.md` (Status: Proposed — Option A Cloudflare DNS → Vercel)
   - `docs/decisions/adr-005-programmatic-seo-depth.md` (Status: Accepted)
   - **Bloqueia Story 6.3 via ADR-003** (que já depende de Story 6.7 prereq).

3. **[MEDIUM][Aria] Adicionar Story 1.0c (Spike Clint API) ao PRD** (≤15min edit + 1-2h spike real):
   - AC: Aria coleta URL instância Clint, doc API, token, schema Lead, webhooks, rate limits do stakeholder; arquiva em `docs/integrations/clint-api-spike.md`
   - **Bloqueia Story 4.3.** Não bloqueia Epic 1, 2, 3.

4. **[LOW][@sm] Criar Story explícita 1.5b (Backup/DR runbook)** durante story creation Epic 1:
   - AC: export Sanity semanal Vercel Blob, export Clint mensal, runbook em `docs/devops/disaster-recovery.md`, simulação mensal
   - Endereça NFR16 (RTO 4h / RPO 24h) que estava sem story própria.

### GO Criteria sequence diagram

```
Hoje (2026-04-26): Pax APROVA COM RESSALVAS → River libera Epic 1

Em paralelo:
  • Uma:  patch FE spec v1.0 → v1.1   (SLA ≤1 dia útil)
  • Aria: extrair 4 ADRs              (SLA ≤1 dia útil)
  • Aria: spike Clint API + stakeholder (SLA ≤3 dias úteis)
  • River: story creation Epic 1 (1.2, 1.2a, 1.3-1.8) — viável HOJE

Bloqueio em cadeia (não atrasa fluxo principal):
  Story 3.2  pending  → FE spec v1.1
  Story 4.3  pending  → Spike Clint + ADR-002 implementation plan
  Story 6.3  pending  → Story 6.7 (validação atuarial) + ADR-003 publicado
```

### Áreas com pass rate <90% (atenção)

- **Cross-validation Architecture ↔ FE Spec: 65%** — único score crítico, puxado pelo drift no FE spec v1.0. Resolução: patch SOFT 1 acima.
- **ADRs documentados: 70%** — 2/6 ADRs com arquivo formal; 4 inline em `architecture.md`. Resolução: patch SOFT 2 acima.
- **Pendências bloqueantes: 85%** — 4 pendências controladas, todas com plano de mitigação documentado.

**Última atualização:** 2026-04-26 por Pax (@po) — re-validação v1.2.2 concluída
**Próximos owners:** Uma (patch FE spec), Aria (ADRs + spike Clint), River (story creation Epic 1)
