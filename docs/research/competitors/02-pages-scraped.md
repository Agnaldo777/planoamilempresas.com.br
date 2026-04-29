# Páginas Estratégicas Raspadas — amilplanos.com.br

**Data:** 2026-04-27
**Método:** WebFetch (HTML→markdown), 10 páginas estratégicas

## Padrões repetidos (template comum)

Toda página de produto segue:
- **Title:** `{Nome do Produto} – Planos Amil Saúde`
- **Meta description:** AUSENTE em quase todas
- **JSON-LD Schema:** AUSENTE em todas as páginas testadas
- **H2 padrão:** `Conheça o Amil X, Tabela de Preços Amil X, orçamento online`
- **H3 padrão (footer/sidebar):** 5 CTAs telefônicos repetidos em todas as páginas:
  - Central de Vendas Amil (11 3256-1000)
  - Amil Ligue Saúde (0800-073-2121)
  - Central de Atendimento AMIL (3004-1000)
  - SAC AMIL (0800-073-2121)
  - Agendamento de Consultas (3003-1333)
- **CTAs primários:** "CALCULAR PLANO" + "SIMULAR PLANO"

## Páginas auditadas

### `/amil-saude/` — Pillar Page
- **Title:** Amil Saúde – Planos Amil Saúde
- **H1:** "A Amil é uma empresa criada e administrada por médicos que fazem da Medicina a sua razão de ser."
- **H2:** Amil Saúde, Missão Amil, orçamento online
- **Word count:** ~1.200
- **Internal links:** 95+
- **Tópicos:** tiers (Bronze→Black), histórico médico, segmentação, dental, telemedicina, rede

### `/plano-individual/`
- **Title:** Plano Individual – Planos Amil Saúde
- **H1:** Plano Amil Individual
- **H2:** Conheça o Amil Individual, Tabela de Preços Amil Individual, orçamento online
- **Foco:** rede credenciada, faixas etárias 0–59+, tradição 28 anos
- **Profundidade:** RASA (3 H2s)

### `/plano-familiar/`
- **Title:** Plano Familiar – Planos Amil Saúde
- **H1:** Plano Amil Familiar
- **Key phrase de ouro:** "plano de saúde por adesão" (alta intenção)

### `/plano-pme/`
- **Title:** Plano PME – Planos Amil Saúde
- **H1:** Plano Amil PME
- **USP:** "Pequenas e Médias Empresas com 02 a 99 vidas"
- **Diferencial mencionado:** Atendimento Internacional PREMIUM

### `/plano-empresarial/`
- **Title:** Plano Empresarial – Planos Amil Saúde
- **H1:** Plano Amil Empresarial
- **USP:** "no mínimo 100 indivíduos"

### `/rede-credenciada/`
- **Title:** Rede Credenciada – Planos Amil Saúde
- **H1:** Rede Credenciada
- **Sub-redes documentadas:** Hospitais D'or Amil, Amil Rede Selecionada, Amil Fácil Rede Selecionada, Amil One Rede Selecionada, Rede Credenciada Clássica
- **Lacuna:** somente um único H2 (orçamento online) — página pobre em conteúdo

### `/diferenciais/` ⭐ RICO
- **Title:** Diferenciais – Planos Amil Saúde
- **17 diferenciais listados em H3:**
  - Agências de Atendimento (em grandes hospitais)
  - Os menores prazos de carência (PRC)
  - Assistência Médica no Exterior
  - O melhor sistema de resgate (ambulâncias + helicóptero + jato)
  - Os melhores médicos e hospitais
  - Redes de Tratamento Exclusivo
  - Amil Espaço Saúde (clínica integrada)
  - Programas de Saúde
  - Telemedicina Amil One (24/7 sem agendamento)
  - Vacinas e Vacinas do Viajante
  - Coleta Domiciliar
  - Seguro e Assistência Viagem Internacional
  - Amil Resgate
  - Atendimento Pré-Hospitalar e Orientação Médica por Telefone
  - Check-up
  - Desconto Farmácia
  - Concierge Exclusivo (Black)

### `/tabela-de-precos-amil/` ⭐ HIGH-INTENT
- **Title:** Tabela de Preços Amil – Planos Amil Saúde
- **H1:** Tabela de Preços Amil
- **H2:** valores planos amil, Coparticipação Amil, Valores Planos Amil Fácil, Valores Planos Amil One, Modalidades dos Produtos
- **Tem tabela de preços real** com colunas: Faixa Etária × Plano × Valor (BRL)
- **Granularidade:** SP, RJ, PR, DF, MG; Enfermaria/Apartamento; 0–18, …, 49–53, …, 59+
- **Exemplo:** "AMIL S380 Enfermaria SP, faixa 0–18: R$ 226,66"
- **PROBLEMA:** preços de **setembro/2022** (desatualizados >3 anos)

### `/coparticipacao-amil/` ⭐ INFORMACIONAL
- **Title:** Coparticipação Amil – Planos Amil Saúde
- **H1:** Coparticipação Amil
- **Word count:** ~2.100 (denso)
- **Conteúdo:** explicação do mecanismo (30% do custo, limite por grupo de procedimento), tabelas de limites por plano (S40 até One S6500 R3), exemplos de procedimentos com cálculo

### `/sao-paulo/` — Sample City Page (template)
- **Title:** São Paulo – Planos Amil Saúde
- **H1:** Plano Amil São Paulo
- **H2 ricos:** "Convênio médico amil em São Paulo, PLANOS AMIL, PLANOS AMIL FÁCIL, PLANOS AMIL ONE, Corretor Amil São Paulo, Rede Credenciada amil São Paulo"
- **Word count:** ~2.800 (denso, surpreendente para template)
- **Local signals fortes:** hospitais regionais nominados (Paulistano, Samaritano, Oswaldo Cruz), cobertura metropolitana enumerada, telefone local
- **Sub-marcas mencionadas:** Amil, Amil Fácil, Amil One, Dental, One Health, Amil Lincx, Medial, Dix, Amil Next
- **Confirmação:** SIM, é template programático rico — replica conteúdo base + insere variáveis locais

## Comparativo rápido — planodesaudeamil.com.br (StarkCorretora)

(Análise leve, conforme briefing)

| Aspecto | amilplanos.com.br | planodesaudeamil.com.br |
|---------|-------------------|--------------------------|
| Tema WP | UX Themes | Flatsome |
| Taxonomia | Amil 200/400/500/700 + Bronze/Prata/Ouro/Platinum/Black | Bronze/Prata/Ouro/Platinum/Black (foco simplificado) |
| Blog | 9 posts (4 off-topic spam) | "Saiba mais sobre os planos da Amil no blog" (mais ativo) |
| FAQ | Não detectada | "Dúvidas Frequentes" (página dedicada) ⭐ |
| Numerologia | "28+ anos de tradição" | "Amil em Números" (seção dedicada) |
| Footer link | `starkcorretora.com.br` | corretora-mãe explícita |
| H1 homepage | "Planos Amil" | "Plano de saúde amil" (keyword pura) |
| Quantidade páginas | ~1500 (massivo programático) | Menor escala (não enumerado) |
