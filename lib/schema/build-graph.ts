import { buildOrganization } from './organization';
import { buildWebSite } from './website';
import { buildBreadcrumb, type BreadcrumbItem } from './breadcrumb';
import { buildFAQPage, type FAQSchemaItem } from './faq';
import { buildProduct, type ProductSchemaData } from './product';
import { buildLocalBusiness, type LocalBusinessData } from './local-business';

type PageType = 'home' | 'plano' | 'local' | 'faq' | 'blog' | 'comparativo' | 'page';

interface GraphConfig {
  type: PageType;
  breadcrumb?: BreadcrumbItem[];
  faq?: FAQSchemaItem[];
  product?: ProductSchemaData;
  localBusiness?: LocalBusinessData;
}

export function buildSchemaGraph(config: GraphConfig) {
  const graph: Record<string, unknown>[] = [];

  // Organization is always included
  graph.push(buildOrganization());

  // WebSite only on home
  if (config.type === 'home') {
    graph.push(buildWebSite());
  }

  // Breadcrumb on all pages except home
  if (config.breadcrumb && config.type !== 'home') {
    graph.push(buildBreadcrumb(config.breadcrumb));
  }

  // FAQ when provided
  if (config.faq && config.faq.length > 0) {
    graph.push(buildFAQPage(config.faq));
  }

  // Product for plan pages
  if (config.product) {
    graph.push(buildProduct(config.product));
  }

  // LocalBusiness for city pages
  if (config.localBusiness) {
    graph.push(buildLocalBusiness(config.localBusiness));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export type { BreadcrumbItem, FAQSchemaItem, ProductSchemaData, LocalBusinessData, PageType };
