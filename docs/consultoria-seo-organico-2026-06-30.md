# Consultoria SEO Organico - planoamilempresas.com.br

Data: 2026-06-30  
Escopo: auditoria local do repositorio + verificacao do site publicado + estrategia de crescimento organico.  
Objetivo declarado: disputar Top 1 organico no Google para buscas comerciais de Amil empresarial, com qualidade e sem inflar paginas fracas.

## 1. Diagnostico executivo

O site esta bem acima de um projeto SEO comum. Ele ja possui uma arquitetura programatica relevante, Next.js 16, deploy Cloudflare/OpenNext, robots e sitemaps separados, paginas comerciais, comparativos, blog, dados de rede credenciada e schema estruturado.

O ativo mais forte e a rede credenciada. O sitemap publicado expande o dominio para uma malha de cauda longa:

- `sitemap.xml`: 84 URLs principais aproximadas.
- `sitemap-prestadores.xml`: 9.325 URLs.
- `sitemap-rede-bairros.xml`: 571 URLs.
- `sitemap-tipos.xml`: 164 URLs.
- `sitemap-rede-produto.xml`: 216 URLs.

Isso cria escala, mas tambem cria risco de diluicao. O projeto nao precisa simplesmente "publicar mais paginas"; precisa transformar escala em paginas que o Google entende como uteis, confiaveis, distintas e comercialmente conectadas.

Minha recomendacao central:

1. Manter e fortalecer a arquitetura de cauda longa da rede credenciada.
2. Podar do sitemap tudo que ja e tratado como thin/noindex.
3. Elevar paginas comerciais e fundos de funil para o nivel de "money pages".
4. Usar rede credenciada como prova concreta em cada pagina comercial.
5. Transformar calculadora, reajuste e comparativos em paginas de captura.
6. Organizar execucao em squads com metas por cluster, nao por tarefa solta.

## 2. O que esta forte

### 2.1 Arquitetura tecnica

O projeto tem boa fundacao:

- Next.js com App Router.
- Metadata por rota.
- Canonicals presentes nas paginas auditadas.
- Robots index/follow nas paginas comerciais principais.
- Sitemaps separados por tipo de inventario.
- Cache via Cloudflare/OpenNext com `s-maxage`.
- Scripts de auditoria internos: rede, cookie-cutter, schema, sitemap routing.
- Dados estruturados: Organization, FAQPage, BreadcrumbList, ItemList, AggregateOffer, Product e WebSite helpers.

### 2.2 Malha de rede credenciada

O dataset local tem:

- 9.325 prestadores.
- 26 UFs.
- 438 cidades.
- 1.687 combinacoes cidade/bairro.
- 11 redes/produtos no dataset normalizado.

Concentracao:

- RJ: 3.696 prestadores.
- SP: 2.996 prestadores.
- DF: 447 prestadores.
- PR: 394 prestadores.
- MG: 393 prestadores.

Top cidades:

- RJ/Rio de Janeiro: 2.202.
- SP/Sao Paulo: 1.194.
- DF/Brasilia: 447.
- RJ/Niteroi: 369.
- PR/Curitiba: 229.
- CE/Fortaleza: 224.
- SP/Campinas: 182.
- GO/Goiania: 156.
- SP/Jundiai: 145.
- RJ/Petropolis: 135.

Esta distribuicao mostra onde esta o maior potencial de SEO local e conversao: RJ, SP, DF, PR, MG, CE, GO, PE e BA.

### 2.3 Paginas comerciais ja existem

Paginas prioritarias auditadas e indexaveis:

- `/empresarial`
- `/empresarial/mei`
- `/empresarial/pme-2-a-29-vidas`
- `/cotacao-online`
- `/tabela-de-precos`
- `/calculadora-economia`
- `/reduzir-reajuste-amil`
- `/rede-credenciada`
- `/comparativos/amil-vs-bradesco`
- `/comparativos/amil-vs-sulamerica`
- `/comparativos/amil-vs-porto-seguro`
- `/comparativos/amil-vs-unimed`

O site ja contempla boa parte da recomendacao inicial do usuario. O proximo ganho nao esta em "criar qualquer pagina", mas em aumentar profundidade, interlinking, prova e captura.

## 3. Riscos e gargalos

### 3.1 Sitemaps de prestadores listam paginas que podem ser noindex

O template de prestador marca como thin as paginas em cidades com menos de 5 prestadores:

- `robots: { index: false, follow: true }`
- canonical para a cidade-pai.

Porem o `sitemap-prestadores.xml` publica todas as 9.325 URLs.

Pelos dados locais:

- 286 cidades tem menos de 5 prestadores.
- 490 prestadores estao nessas cidades thin.
- 8.835 prestadores estao em cidades com 5+ prestadores.

Recomendacao: remover do sitemap de prestadores as 490 URLs que o proprio template trata como `noindex`. O Google nao deve receber sitemap como convite para crawlear paginas que depois recebem sinal de nao-indexacao. A regra deve ser:

- Indexavel: listar em sitemap.
- Noindex/canonicalizado: nao listar em sitemap.
- Ainda pode existir para usuario e link equity: sim, mas fora do sitemap.

Impacto esperado: crawl budget mais limpo, menor ruído no GSC, melhor consolidacao de sinais nas paginas cidade.

### 3.2 Titles estao longos e com sufixo repetitivo

Exemplo auditado:

`Plano de Saude Amil Empresarial 2026 | Cotacao PJ - BeneficioRH - Plano Amil 2026 | BeneficioRH`

O helper global adiciona:

`%s - Plano Amil 2026 | BeneficioRH`

Algumas rotas ja incluem marca/ano no proprio title. Resultado: duplicidade e title truncado em SERP. Em busca competitiva, CTR e um fator pratico de crescimento.

Recomendacao:

- Money pages devem ter title manual sem redundancia.
- Template global deve ser menor, por exemplo: `%s | BeneficioRH`.
- Padrao sugerido:
  - Home: `Plano Amil Empresarial 2026 | Cotacao PJ`
  - MEI: `Plano Amil MEI 2026 | Cotacao para CNPJ`
  - PME 2-29: `Plano Amil PME 2 a 29 vidas | Cotacao 2026`
  - Tabela: `Tabela Amil Empresarial 2026 | Precos por faixa`
  - Rede RJ: `Rede Amil Rio de Janeiro | 2.202 prestadores`

### 3.3 Pagina `/cotacao-online` e muito curta para a importancia comercial

Hoje ela funciona como formulario com headline e pouca sustentacao. Para fundo de funil, isso e insuficiente.

Ela deve virar uma pagina de captura completa:

- Hero direto com promessa.
- Form acima da dobra.
- Blocos de confianca: corretora autorizada, SUSEP, atendimento por WhatsApp, sem custo de corretagem.
- Prova de utilidade: o que sera comparado na cotacao.
- FAQ transacional.
- Links para tabela, rede e segmentos.
- Parametros de entrada preservados: `uf`, `cidade`, `segmento`, `plano`, `prestador`.

### 3.4 A rede e forte, mas precisa virar argumento comercial nas money pages

O site possui rede por cidade, bairro, tipo e prestador, mas as paginas comerciais precisam usar isso como prova.

Exemplos:

- `/empresarial/mei`: mostrar top cidades onde o MEI mais se beneficia da rede Amil e links para rede local.
- `/empresarial/pme-2-a-29-vidas`: usar a rede como argumento de retencao de talento e previsibilidade.
- `/tabela-de-precos`: conectar preco a rede minima: "qual linha da acesso ao hospital X?".
- `/calculadora-economia`: apos o calculo, sugerir rede por cidade/UF.
- `/reduzir-reajuste-amil`: inserir caminho de renegociacao: comparar rede atual, cotar alternativa e preservar hospitais importantes.

### 3.5 Conteudo programatico ainda pode parecer repetitivo

As paginas de rede sao boas, mas muitas seguem estrutura semelhante. Isso e esperado em programmatic SEO, mas precisa de camadas de diferenciação.

Prioridades:

- Inserir blocos especificos por cidade densa: hospitais top, bairros mais relevantes, tipo dominante, linhas de produto mais frequentes.
- Criar "blocos de decisao" por pagina: melhor linha para custo, melhor linha para rede premium, quando nao contratar.
- Para prestadores hospitalares, priorizar respostas curtas do tipo "aceita Amil?" com redes aceitas e plano empresarial minimo.

## 4. Estrategia para Top 1

Top 1 nao vem de uma unica pagina. Vem de cluster, autoridade interna e satisfacao do intent. A estrategia deve ser por frentes.

### Frente A - Money pages comerciais

Prioridade maxima:

- `/empresarial`
- `/empresarial/mei`
- `/empresarial/pme-2-a-29-vidas`
- `/cotacao-online`
- `/tabela-de-precos`

Objetivo: ranquear para termos com intencao de contratacao:

- plano Amil empresarial
- plano Amil MEI
- Amil PME
- plano Amil CNPJ
- tabela Amil empresarial
- cotacao Amil empresarial
- plano de saude Amil para empresa

Backlog recomendado:

1. Revisar titles e descriptions para CTR.
2. Aumentar densidade comercial sem exagero: preco, rede, carencias, documentos, minimos.
3. Inserir CTA contextual em 3 pontos por pagina.
4. Incluir comparacao de linhas S380, S450, S750, One com links para planos.
5. Adicionar blocos de prova local: top cidades/UFs com rede forte.
6. Criar schema FAQPage e, quando aplicavel, Product/AggregateOffer.

### Frente B - Fundo de funil ainda ausente ou subexplorado

Criar/otimizar paginas:

- `/amil-pme`
- `/amil-cnpj`
- `/amil-mei` ou consolidar com `/empresarial/mei` via redirect/canonical.
- `/amil-empresarial-rj`
- `/amil-empresarial-sp`
- `/amil-empresarial-df`
- `/plano-amil-2-vidas`
- `/plano-amil-para-cnpj`

Cuidados:

- Nao criar duplicatas de `/empresarial/mei` e `/empresarial/pme-2-a-29-vidas`.
- Se criar slug curto comercial, decidir canonical/redirect.
- Cada pagina deve ter intencao propria:
  - `amil-cnpj`: elegibilidade/documentos.
  - `amil-pme`: porte e faixas de vidas.
  - `amil-empresarial-rj/sp/df`: rede e precos regionais.

### Frente C - Rede credenciada como moat

Manter a rede como ativo defensavel, mas com poda.

Regras sugeridas:

- Cidade com 5+ prestadores: indexar.
- Cidade com menos de 5: canonical para UF ou cidade-pai equivalente e fora do sitemap de prestadores.
- Bairro com 3+ prestadores: indexar.
- Bairro com 1-2: noindex/follow e fora do sitemap.
- Tipo x cidade com 3+ prestadores: indexar.
- Produto x UF com 2+ prestadores: indexar, mas priorizar UFs densas em links internos.

Paginas de maior potencial:

- `/rede/rj/rio-de-janeiro`
- `/rede/sp/sao-paulo`
- `/rede/df/brasilia`
- `/rede/rj/niteroi`
- `/rede/pr/curitiba`
- `/rede/ce/fortaleza`
- `/rede/sp/campinas`
- `/rede/go/goiania`
- `/rede/sp/jundiai`
- `/rede/rj/petropolis`

### Frente D - Comparativos

Os comparativos ja existem e sao bons para capturar decisao lateral.

Prioridade:

- Amil vs Bradesco
- Amil vs SulAmerica
- Amil vs Porto Seguro
- Amil vs Unimed

Reforcos:

- Tabela comparativa acima da dobra.
- Veredicto por perfil: MEI, PME, 30+ vidas, executivo, RJ/SP/DF.
- Links para cotacao prefiltrada: `?comparativo=amil-vs-bradesco`.
- Bloco "compare pela rede que importa": levar para busca de hospitais/cidade.

### Frente E - Captura e conversao

Transformar:

- `/calculadora-economia`
- `/reduzir-reajuste-amil`

em paginas de captura fortes.

Calculadora:

- Resultado deve gerar CTA personalizado.
- Capturar estado, vidas, faixa etaria e objetivo.
- Gerar links para tabela e rede daquela UF.
- Criar conteudo "quanto economiza por ano" com exemplos.

Reajuste:

- Fluxo de decisao: manter, renegociar, migrar, portar.
- Checklist antes de cancelar.
- Explicar RN 309 e RN 438 com linguagem simples.
- CTA "analisar reajuste pelo WhatsApp".

## 5. Plano de poda e priorizacao

### P0 - Corrigir desalinhamento sitemap/noindex

Alterar `sitemap-prestadores.xml` para listar apenas prestadores em cidades com 5+ prestadores.

Resultado esperado:

- Sair de 9.325 para aproximadamente 8.835 URLs de prestador no sitemap.
- Manter 490 paginas acessiveis, mas fora do sitemap e com noindex/canonical.

### P0 - Corrigir title template

Evitar sufixo redundante nos titles.

Arquivos provaveis:

- `lib/seo/title.ts`
- `app/layout.tsx`
- paginas com title manual ja contendo marca/ano.

### P0 - Reforcar `/cotacao-online`

Esta e a pagina onde o trafego deve virar lead. Hoje ela e funcional, mas curta.

### P1 - Fortalecer `/empresarial/mei` e `/empresarial/pme-2-a-29-vidas`

Essas paginas devem ser tratadas como landings comerciais principais, nao apenas conteudo de suporte.

### P1 - Criar hub "Amil CNPJ / Amil PME"

Antes de criar, decidir arquitetura:

- Opção 1: slugs curtos como paginas canonicas comerciais.
- Opção 2: slugs curtos redirecionam para `/empresarial/...`.

Minha recomendacao: criar slugs curtos somente se cada um tiver intent clara e conteudo distinto. Caso contrario, usar redirect 301 para concentrar autoridade.

### P1 - Interlinking por clusters

Criar blocos padronizados:

- Money page -> rede local.
- Rede local -> cotacao.
- Prestador -> plano minimo + cotacao.
- Comparativo -> cotacao + rede.
- Blog -> money page.

### P2 - Atualizar blog e E-E-A-T

O blog tem poucos posts publicados no sitemap. Para YMYL, cadencia e revisao importam.

Criar conteudos com alta utilidade:

- documentos para contratar Amil CNPJ.
- Amil MEI precisa de 2 vidas?
- carencia Amil empresarial.
- portabilidade para Amil empresarial.
- como escolher entre S380, S450 e S750.
- rede Amil RJ: hospitais principais.
- rede Amil SP: hospitais principais.

## 6. Squad recomendado

### Squad SEO Tecnico

Missao: limpar sinais para Google e proteger indexacao.

Entregas:

- Ajuste sitemap/noindex de prestadores.
- Auditoria de canonical por cluster.
- Title template e metas.
- Validacao de JSON-LD.
- GSC monitor: indexadas, rastreadas, excluidas por noindex, duplicadas.

KPI:

- Reduzir URLs enviadas que retornam noindex para zero.
- Aumentar taxa de URLs validas/indexadas em clusters priorizados.

### Squad Conteudo Comercial

Missao: elevar money pages para padrao Top 1.

Entregas:

- Reescrita de `/empresarial`, `/mei`, `/pme-2-a-29`, `/cotacao-online`, `/tabela-de-precos`.
- Blocos de prova com rede.
- CTAs contextuais.
- FAQs transacionais.

KPI:

- CTR organico por pagina.
- Conversao organica em lead.
- Posicao media para termos comerciais.

### Squad Programmatic SEO / Rede

Missao: transformar rede credenciada em moat util, nao em massa thin.

Entregas:

- Priorizacao RJ/SP/DF/PR/MG.
- Templates por cidade densa.
- Enriquecimento de hospitais.
- Regras de poda por densidade.
- Links entre produto, cidade, bairro e prestador.

KPI:

- Impressoes long-tail por cluster.
- Cliques de paginas de rede para cotacao.
- Indexacao de paginas cidade/bairro/produto.

### Squad CRO e Leads

Missao: converter trafego SEO em oportunidades comerciais.

Entregas:

- Formulario com contexto preservado.
- CTA por origem: prestador, cidade, comparativo, reajuste, calculadora.
- Eventos GA4.
- Funil: visualizacao -> interacao -> envio -> WhatsApp.

KPI:

- Taxa de envio do formulario.
- Cliques WhatsApp.
- Leads por landing.
- Conversao por cluster.

### Squad Autoridade e E-E-A-T

Missao: sustentar confianca em YMYL.

Entregas:

- Autores/revisores visiveis.
- Politica editorial e revisao.
- Fontes regulatórias e disclaimers.
- Atualizacao mensal de tabelas/rede.
- Paginas "sobre", SUSEP, corretor autorizado.

KPI:

- Melhor CTR em queries YMYL.
- Menos rejeicao em paginas informacionais.
- Maior tempo util em conteudos de decisao.

## 7. Roadmap 30/60/90 dias

### Primeiros 30 dias

1. Corrigir sitemap de prestadores para excluir paginas noindex.
2. Revisar title template e titles das money pages.
3. Reforcar `/cotacao-online`.
4. Inserir blocos de rede nas paginas `/empresarial/mei` e `/empresarial/pme-2-a-29-vidas`.
5. Configurar painel GSC/GA4 por cluster.

### 31 a 60 dias

1. Enriquecer top 10 cidades de rede.
2. Fortalecer comparativos com tabela, veredicto por perfil e CTA.
3. Criar ou consolidar slugs: Amil PME, Amil CNPJ, Amil Empresarial RJ/SP/DF.
4. Transformar calculadora em captura personalizada.
5. Criar 8-12 artigos de suporte com interlinking para money pages.

### 61 a 90 dias

1. Expandir top 30 cidades com conteudo unico.
2. Criar paginas hospitalares prioritarias com tratamento especial.
3. Rodar poda mensal baseada em GSC: impressao zero + thin + duplicidade.
4. Otimizar CTR por Search Console.
5. Criar rotina editorial e tecnica mensal: rede, precos, schema, sitemap, GSC.

## 8. Decisao estrategica

O dominio nao deve tentar vencer apenas por volume. Ele deve vencer por combinacao de:

- paginas comerciais fortes;
- rede credenciada como prova real;
- programmatic SEO com poda;
- comparativos honestos;
- capturas inteligentes;
- confianca YMYL.

O caminho para Top 1 e concentrar autoridade onde ha dinheiro e usar a cauda longa para alimentar esses centros. A rede credenciada e o moat, mas as money pages sao o caixa. O proximo ciclo deve limpar sinal tecnico e aumentar conversao antes de abrir novas frentes massivas.

