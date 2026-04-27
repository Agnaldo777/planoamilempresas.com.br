import {
  buildSchemaGraph,
  type PageType,
  type BreadcrumbItem,
  type FAQSchemaItem,
  type ProductSchemaData,
  type LocalBusinessData,
} from '@/lib/schema/build-graph';

// Legacy single-type support (used by BreadcrumbNav and FAQAccordion)
type LegacySchemaType = 'organization' | 'website' | 'breadcrumb' | 'faq' | 'product' | 'local-business';

interface LegacySchemaGraphProps {
  type: LegacySchemaType;
  data: Record<string, unknown>;
}

// New @graph-based support (used by page layouts)
interface GraphSchemaProps {
  pageType: PageType;
  breadcrumb?: BreadcrumbItem[];
  faq?: FAQSchemaItem[];
  product?: ProductSchemaData;
  localBusiness?: LocalBusinessData;
}

function buildLegacySchema(type: LegacySchemaType, data: Record<string, unknown>) {
  switch (type) {
    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: (data.items as Array<{ name: string; url: string }>).map(
          (item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          }),
        ),
      };
    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (data.questions as Array<{ question: string; answer: string }>).map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
      };
    default:
      return null;
  }
}

// Legacy component (backward compatible with BreadcrumbNav and FAQAccordion)
export function SchemaGraph(props: LegacySchemaGraphProps | GraphSchemaProps) {
  let schema: Record<string, unknown> | null;

  if ('pageType' in props) {
    // New @graph mode
    schema = buildSchemaGraph({
      type: props.pageType,
      breadcrumb: props.breadcrumb,
      faq: props.faq,
      product: props.product,
      localBusiness: props.localBusiness,
    });
  } else {
    // Legacy single-type mode
    schema = buildLegacySchema(props.type, props.data);
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
