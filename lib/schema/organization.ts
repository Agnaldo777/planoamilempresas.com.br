/**
 * Schema Organization — Story 3.26 (FR54)
 *
 * Declara a Organization root como BENEFICIORH Corretora de Seguros
 * (CNPJ 14.764.085/0001-99 + SUSEP 201054484), nunca como "Amil".
 *
 * **Anti-padrão proibido**: usar `name: "Amil"` no schema Organization.
 * Amil é trademark da UnitedHealth — só pode aparecer como:
 *   - `Product.brand` (`{ "@type": "Brand", "name": "Amil" }`)
 *   - `Article.about` (`{ "@type": "Organization", "name": "Amil Assistência Médica Internacional S.A." }`)
 *   - `Organization.knowsAbout` ou `Organization.category` (string)
 *
 * Compliance:
 *   - ADR-006: URL-as-trademark policy
 *   - ADR-009: ecossistema hub-spoke (parentOrganization → planodesaudepj.com.br)
 *   - NFR8: uso restrito da marca Amil
 *   - NFR21: schema coverage mínimo
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://planodesaudepj.com.br';

export const ORGANIZATION_NAME = 'BeneficioRH Corretora de Seguros' as const;
export const ORGANIZATION_LEGAL_NAME = 'BENEFICIO RH CORRETORA DE SEGUROS LTDA' as const;
export const ORGANIZATION_CNPJ = '14.764.085/0001-99' as const;
export const ORGANIZATION_SUSEP = '201054484' as const;

/**
 * Sentinel — substring que NUNCA pode aparecer em Organization.name.
 * Usado por scripts/audit-schema-organization.mjs para enforcement.
 */
export const FORBIDDEN_ORG_NAME_SUBSTRING = 'Amil' as const;

interface OrganizationSchema {
  '@type': 'Organization';
  '@id': string;
  name: string;
  legalName: string;
  url: string;
  logo: string;
  taxID: string;
  identifier: Array<{
    '@type': 'PropertyValue';
    propertyID: string;
    name: string;
    value: string;
  }>;
  parentOrganization: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  sameAs: string[];
  contactPoint: Array<{
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string;
  }>;
  category: string[];
  knowsAbout: string[];
}

/**
 * Constrói o nó Organization para JSON-LD `@graph`.
 *
 * **Invariantes** (testados em audit-schema-organization.mjs):
 * - `name` SEMPRE inicia com "BeneficioRH"
 * - `name` NUNCA contém "Amil" como token isolado
 * - `taxID` no formato CNPJ.
 * - `identifier` tem entrada SUSEP + CNPJ.
 * - `parentOrganization.url` aponta o hub planodesaudepj.com.br.
 */
export function buildOrganization(): OrganizationSchema {
  return {
    '@type': 'Organization',
    '@id': `${BASE_URL}#organization`,
    name: ORGANIZATION_NAME,
    legalName: ORGANIZATION_LEGAL_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo-beneficiorh.svg`,
    taxID: ORGANIZATION_CNPJ,
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'SUSEP',
        name: 'SUSEP',
        value: ORGANIZATION_SUSEP,
      },
      {
        '@type': 'PropertyValue',
        propertyID: 'CNPJ',
        name: 'CNPJ',
        value: ORGANIZATION_CNPJ,
      },
    ],
    parentOrganization: {
      '@type': 'Organization',
      name: 'BeneficioRH Hub',
      url: HUB_URL,
    },
    sameAs: [
      HUB_URL,
      'https://www.bradescosaudeempresas.com.br',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+55-11-4200-7866',
        contactType: 'sales',
        areaServed: 'BR',
        availableLanguage: 'pt-BR',
      },
    ],
    category: [
      'Plano de Saúde Empresarial',
      'Corretora SUSEP',
      'Amil PJ',
    ],
    knowsAbout: [
      'Amil Assistência Médica Internacional S.A.',
      'Bradesco Saúde',
      'SulAmérica Saúde',
    ],
  };
}

export type { OrganizationSchema };
