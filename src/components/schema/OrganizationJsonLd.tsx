/**
 * `<OrganizationJsonLd />` — primitive transversal Epic 7.
 *
 * Renderiza JSON-LD Schema.org `Organization` com `sameAs` apontando
 * para o canal oficial Amil (https://www.amil.com.br) — mitigação 2 do
 * ADR-006 (URL-as-Trademark Policy).
 *
 * Story 7.2 AC5-bis (amendment O-2 do PO Pax 2026-04-28):
 *   - Criada aqui como primitive transversal
 *   - Reusada por Stories 7.4 (páginas-prestador), 7.6 (páginas-bairro),
 *     7.7 (Cluster E rede × UF) e 7.8 (tipo × UF × município)
 *   - DRY enforced — uma única source-of-truth do schema
 *
 * ADR-006 §"Schema markup" prescribed shape:
 *   { @type: 'Organization', name: 'BeneficioRH (corretor)', sameAs: [...] }
 *
 * NUNCA usar `name: 'Amil'` (FR54 + NFR8 + ADR-006 mit. 2):
 *   o site é independente; corretor BeneficioRH intermedeia, não é a operadora.
 */

import type { ReactElement } from 'react';

interface OrganizationJsonLdProps {
  /** Organization name. Default: 'BeneficioRH (corretor)'. */
  name?: string;
  /** sameAs URLs. Default: ['https://www.amil.com.br']. */
  sameAs?: readonly string[];
}

const DEFAULT_NAME = 'BeneficioRH (corretor)';
const DEFAULT_SAMEAS = ['https://www.amil.com.br'] as const;

export function OrganizationJsonLd({
  name = DEFAULT_NAME,
  sameAs = DEFAULT_SAMEAS,
}: OrganizationJsonLdProps = {}): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    sameAs: [...sameAs],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
