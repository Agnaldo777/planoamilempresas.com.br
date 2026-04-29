/**
 * Schema Graph builder — orquestra Organization root + nós contextuais
 * por tipo de página. Story 3.26 (FR54) alinhamento.
 *
 * Organization é SEMPRE incluído como nó root (BeneficioRH); WebSite
 * sempre presente para fechar o grafo (publisher → Organization).
 */

import { buildOrganization } from './organization';
import { buildWebSite } from './website';
import { buildBreadcrumb, type BreadcrumbItem } from './breadcrumb';
import { buildFAQPage, type FAQSchemaItem } from './faq';
import { buildProduct, type ProductSchemaData } from './product';
import { buildLocalBusiness, type LocalBusinessData } from './local-business';
import { buildArticleNode, type ArticleSchemaInput } from './author';
import {
  buildAggregateOfferNode,
  type AggregateOfferInput,
} from './aggregate-offer';

type PageType = 'home' | 'plano' | 'local' | 'faq' | 'blog' | 'comparativo' | 'page';

interface GraphConfig {
  type: PageType;
  breadcrumb?: BreadcrumbItem[];
  faq?: FAQSchemaItem[];
  product?: ProductSchemaData;
  localBusiness?: LocalBusinessData;
  /** Story 6.9 — Article schema com author + reviewedBy (NFR22 YMYL). */
  article?: ArticleSchemaInput;
  /** Story 3.23 — AggregateOffer per-estado (FR51). */
  aggregateOffer?: AggregateOfferInput;
}

export function buildSchemaGraph(config: GraphConfig) {
  const graph: Record<string, unknown>[] = [];

  // Organization root — SEMPRE primeiro nó (FR54).
  graph.push(buildOrganization() as unknown as Record<string, unknown>);

  // WebSite — sempre presente (publisher → Organization).
  graph.push(buildWebSite());

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

  // Article (blog, cornerstones, programmatic landings YMYL) — Story 6.9
  if (config.article) {
    graph.push(buildArticleNode(config.article));
  }

  // AggregateOffer per-estado — Story 3.23 (FR51)
  // Caller injeta lowPrice/highPrice/offerCount derivados de tabelas-amil.ts
  if (config.aggregateOffer) {
    graph.push(buildAggregateOfferNode(config.aggregateOffer) as unknown as Record<string, unknown>);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export type {
  BreadcrumbItem,
  FAQSchemaItem,
  ProductSchemaData,
  LocalBusinessData,
  PageType,
  ArticleSchemaInput,
  AggregateOfferInput,
};
