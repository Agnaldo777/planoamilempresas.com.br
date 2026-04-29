/**
 * /comparar — Story 3.21 (FR38)
 *
 * Comparador de Planos Amil com URL shareable
 * (`/comparar?planos=bronze,prata,ouro`).
 *
 * **Estrutura:**
 *   - SSR/SSG via App Router (Next.js 16)
 *   - `searchParams` é Promise (App Router pattern)
 *   - Schema Product × N + WebPage com mainEntity
 *   - CTAs por plano linkam `/cotacao-online?plano={slug}`
 *   - Compatível com FR54: Organization=BeneficioRH, Brand=Amil
 *
 * **Decisões:**
 *   - Top-10 combinações canônicas (AC9) ficam para Story de copy editorial
 *     dedicada (@po Pax). Este MVP cobre fallback + parser robusto.
 *   - URL normalization: ordem por tier ascendente.
 *
 * **Compliance:**
 *   - FR38: rota dedicada + URL params + Product × N
 *   - FR54: Organization root sempre BeneficioRH
 *   - NFR23: disclaimer obrigatório (delegado ao componente)
 *   - WCAG AA: navegação semântica via PlanComparison
 */

import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/seo';
import { SchemaGraph } from '@/components/seo/SchemaGraph';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { PlanComparison } from '@/components/ui/PlanComparison';
import { buildOrganization } from '@/lib/schema/organization';
import { buildBreadcrumb } from '@/lib/schema/breadcrumb';
import { getCurrentYear } from '@/lib/seo/title';
import {
  PLANOS_COMPARISON_BY_SLUG,
  parsePlanosQuery,
  type PlanoSlug,
} from '@/data/planos-comparison';

const CURRENT_YEAR = getCurrentYear();
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://planoamilempresas.com.br';

interface ComparePageProps {
  searchParams: Promise<{ planos?: string | string[] }>;
}

function pickPlanosParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({
  searchParams,
}: ComparePageProps): Promise<Metadata> {
  const params = await searchParams;
  const slugs = parsePlanosQuery(pickPlanosParam(params.planos));
  const planosLabel = slugs
    .map((s) => PLANOS_COMPARISON_BY_SLUG[s].nome)
    .join(' × ');
  const canonical = `/comparar?planos=${slugs.join(',')}`;

  return generatePageMetadata({
    type: 'comparativo',
    title: `Comparador de Planos Amil ${CURRENT_YEAR}: ${planosLabel}`,
    description: `Compare Amil ${planosLabel} lado a lado: cobertura, rede credenciada, hospitais premium, telemedicina e reembolso. Cotação grátis.`,
    canonical,
    planoA: slugs[0],
    planoB: slugs[1],
  });
}

/**
 * Schema Product × N — emitido como nó standalone porque o SchemaGraph
 * legado ainda não suporta `products: ProductSchemaData[]`. Estratégia:
 * incluir Organization + Breadcrumb + WebPage + Product[] em um único
 * `@graph` inline.
 */
function buildComparePageSchema(slugs: PlanoSlug[]) {
  const planos = slugs.map((s) => PLANOS_COMPARISON_BY_SLUG[s]);
  const breadcrumb = buildBreadcrumb([
    { name: 'Comparar Planos', href: '/comparar' },
  ]);

  const products = planos.map((plano) => ({
    '@type': 'Product',
    name: plano.nomeCompleto,
    description: plano.descricao,
    brand: { '@type': 'Brand', name: 'Amil' },
    provider: { '@id': `${BASE_URL}#organization` },
    category: 'Plano de Saúde Empresarial',
  }));

  const itemList = {
    '@type': 'ItemList',
    name: `Comparativo Amil — ${planos.map((p) => p.nome).join(' × ')}`,
    numberOfItems: planos.length,
    itemListElement: planos.map((plano, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: plano.nomeCompleto,
      },
    })),
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': `${BASE_URL}/comparar?planos=${slugs.join(',')}`,
    name: `Comparador de Planos Amil ${CURRENT_YEAR}`,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${BASE_URL}#website` },
    mainEntity: itemList,
    breadcrumb,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(),
      webPage,
      breadcrumb,
      ...products,
    ],
  };
}

export default async function CompararPage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const slugs = parsePlanosQuery(pickPlanosParam(params.planos));
  const planos = slugs.map((s) => PLANOS_COMPARISON_BY_SLUG[s]);
  const planosLabel = planos.map((p) => p.nome).join(' × ');

  const schema = buildComparePageSchema(slugs);

  return (
    <>
      {/* Schema standalone — supersede SchemaGraph default para emitir Product × N */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb visual + Breadcrumb schema legacy (duplicado no @graph,
          mas isso é tolerado pelo Google para BreadcrumbList) */}
      <SchemaGraph
        pageType="comparativo"
        breadcrumb={[{ name: 'Comparar Planos', href: '/comparar' }]}
      />
      <BreadcrumbNav items={[{ label: 'Comparar Planos', href: '/comparar' }]} />

      <section className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-balance text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
            Comparador de Planos Amil {CURRENT_YEAR}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-700">
            Compare lado a lado os planos{' '}
            <strong className="text-slate-900">{planosLabel}</strong>:
            cobertura, rede credenciada, hospitais premium, telemedicina,
            reembolso e mais. Solicite cotação personalizada para o seu CNPJ
            ao final.
          </p>
        </div>
      </section>

      <section className="px-4 py-12" aria-labelledby="comparativo-heading">
        <div className="mx-auto max-w-6xl">
          <h2
            id="comparativo-heading"
            className="text-2xl font-semibold text-slate-900"
          >
            Tabela comparativa
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {planos.length} planos selecionados. Use{' '}
            <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-800">
              ?planos=bronze,prata,ouro
            </code>{' '}
            na URL para personalizar.
          </p>
          <div className="mt-6">
            <PlanComparison planos={planos} />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12" aria-labelledby="contexto-heading">
        <div className="mx-auto max-w-4xl space-y-6 text-base leading-relaxed text-slate-800">
          <h2
            id="contexto-heading"
            className="text-2xl font-semibold text-slate-900"
          >
            Como escolher entre os planos Amil
          </h2>
          <p>
            A escolha entre os tiers Amil (Bronze, Prata, Ouro, Platinum, Black)
            depende de quatro variáveis principais: <strong>(a)</strong> faixa
            de orçamento por vida, <strong>(b)</strong> abrangência geográfica
            necessária, <strong>(c)</strong> exigência de acomodação privativa
            (apartamento) versus enfermaria, e <strong>(d)</strong> acesso
            desejado a hospitais top-tier (Albert Einstein, Sírio-Libanês,
            Oswaldo Cruz). Empresas com perfil corporativo (executivos, alta
            sinistralidade, expectativa de viagens internacionais) tipicamente
            migram para Platinum ou Black, enquanto PMEs em fase de expansão
            equilibram custo via Bronze ou Prata.
          </p>
          <p>
            Use o comparativo acima como guia de partida. A proposta comercial
            real depende do porte da empresa, perfil etário do grupo, região
            de cobertura desejada e modalidade de coparticipação. Para uma
            cotação precisa, clique em <em>"Quero esse"</em> abaixo do plano
            de interesse — a BeneficioRH (corretora autorizada SUSEP 201054484)
            retorna em até 1 dia útil com tabela de preços por faixa etária e
            condições contratuais detalhadas.
          </p>
        </div>
      </section>

      <aside
        role="note"
        className="mx-auto my-12 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900"
      >
        <p>
          <strong>Comparativo informativo</strong> — valores e coberturas
          sujeitos a análise contratual da operadora. Última atualização:{' '}
          {CURRENT_YEAR}. Algumas características marcadas como "Premium"
          (★) podem requerer contrato sob consulta. Para informações
          oficiais, consulte o site da Amil ou solicite cotação personalizada.
        </p>
      </aside>
    </>
  );
}
