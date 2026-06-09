/**
 * Gerador das 5 FAQs por rede × UF — Story 7.7 AC7.
 *
 * Perguntas templated para alimentar tanto o `FAQPage` JSON-LD quanto o
 * bloco visual de perguntas frequentes na página Cluster E.
 */

export interface FaqItem {
  pergunta: string;
  resposta: string;
}

/**
 * Constrói as 5 FAQs canônicas para uma combinação rede × UF.
 *
 * @param redeLabel  Nome de exibição da rede (ex.: "Amil S750 QP")
 * @param ufNome     Nome por extenso da UF (ex.: "São Paulo")
 * @param total      Total de prestadores credenciados na rede × UF
 * @param topCidades Nomes das principais cidades (já ordenadas), p/ contexto
 */
export function buildClusterEFaqs(
  redeLabel: string,
  ufNome: string,
  total: number,
  topCidades: string[]
): FaqItem[] {
  const cidades = topCidades.slice(0, 3);
  const cidadesTexto =
    cidades.length > 0 ? cidades.join(', ') : `nas principais cidades de ${ufNome}`;

  return [
    {
      pergunta: `Quanto custa o plano Amil ${redeLabel} em ${ufNome}?`,
      resposta:
        `O valor do Amil ${redeLabel} em ${ufNome} varia conforme a faixa etária, ` +
        `o número de vidas e o tipo de contratação (PME ou empresarial). Solicite uma ` +
        `cotação personalizada com um corretor autorizado para receber o preço exato ` +
        `do seu perfil — não há tabela fixa pública.`,
    },
    {
      pergunta: `Quais hospitais e clínicas aceitam o Amil ${redeLabel} em ${ufNome}?`,
      resposta:
        `Atualmente há ${total.toLocaleString('pt-BR')} prestadores credenciados ao ` +
        `Amil ${redeLabel} em ${ufNome}, com maior concentração em ${cidadesTexto}. ` +
        `A rede está sujeita a alterações pela operadora; confirme sempre no app oficial ` +
        `Amil antes de utilizar.`,
    },
    {
      pergunta: `Como contratar o Amil ${redeLabel} para a minha empresa em ${ufNome}?`,
      resposta:
        `A contratação empresarial do Amil ${redeLabel} é feita via corretor autorizado ` +
        `(SUSEP). Informe CNPJ, número de vidas e perfil etário dos colaboradores para ` +
        `receber a proposta. O processo inclui análise de carências e formalização do contrato.`,
    },
    {
      pergunta: `O Amil ${redeLabel} tem cobertura em todo o estado de ${ufNome}?`,
      resposta:
        `A cobertura do Amil ${redeLabel} se concentra onde há prestadores credenciados — ` +
        `em ${ufNome}, principalmente em ${cidadesTexto}. Empresas com colaboradores em ` +
        `municípios sem rede própria podem avaliar outras linhas Amil ou cobertura nacional.`,
    },
    {
      pergunta: `Existe carência no Amil ${redeLabel}?`,
      resposta:
        `Sim. Como todo plano de saúde regulamentado pela ANS, o Amil ${redeLabel} possui ` +
        `prazos de carência que variam por tipo de procedimento. Em contratações ` +
        `empresariais com número mínimo de vidas, pode haver redução ou isenção de carências — ` +
        `confirme as condições com o corretor.`,
    },
  ];
}
