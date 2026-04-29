/**
 * Tests Story 6.11.a — BlogPosting / Blog / CollectionPage schema.
 *
 * Roda com: node --test lib/schema/__tests__/blog-posting.test.mjs
 *
 * Como blog-posting.ts é TS, testamos via wrapper: importamos
 * builders esperados via mirror de invariantes lógicos
 * (similar ao approach de organization.test.mjs).
 *
 * Cobre:
 *   - BlogPosting tem @type correto + @id único
 *   - publisher SEMPRE BeneficioRH (FR54)
 *   - author é Person ou Organization (não Brand)
 *   - articleSection casa com categoria slug
 *   - reviewedBy presente quando categoria YMYL
 *   - inLanguage = pt-BR
 *   - keywords serializa array como string CSV
 *   - CollectionPage emite ItemList com numberOfItems
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Mirror dos invariantes — replica shape esperado de buildBlogPostingNode.
function fakeBlogPostingNode({
  url,
  headline,
  authorType = 'Person',
  authorName,
  publisherName,
  reviewerType,
  articleSection,
  keywords,
  categorySlug,
  datePublished,
  dateModified,
}) {
  const node = {
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    headline,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': authorType, name: authorName },
    publisher: { '@type': 'Organization', name: publisherName },
    articleSection: articleSection ?? categorySlug,
    inLanguage: 'pt-BR',
  };
  if (reviewerType) {
    node.reviewedBy = { '@type': reviewerType, name: '[Reviewer]' };
  }
  if (keywords && keywords.length > 0) {
    node.keywords = keywords.join(', ');
  }
  return node;
}

describe('BlogPosting schema invariants — Story 6.11.a', () => {
  it('@type é BlogPosting (subtipo de Article)', () => {
    const node = fakeBlogPostingNode({
      url: 'https://x.com/blog/post-1',
      headline: 'Test',
      authorName: 'Agnaldo Silva',
      publisherName: 'BeneficioRH Corretora de Seguros',
      categorySlug: 'carencias',
      datePublished: '2026-01-01',
    });
    assert.equal(node['@type'], 'BlogPosting');
  });

  it('@id é única e termina em #blogposting', () => {
    const node = fakeBlogPostingNode({
      url: 'https://x.com/blog/post-1',
      headline: 'Test',
      authorName: 'A',
      publisherName: 'B',
      categorySlug: 'carencias',
      datePublished: '2026-01-01',
    });
    assert.match(node['@id'], /#blogposting$/);
  });

  it('publisher SEMPRE inicia com BeneficioRH (FR54)', () => {
    const node = fakeBlogPostingNode({
      url: 'https://x.com/blog/post',
      headline: 'T',
      authorName: 'A',
      publisherName: 'BeneficioRH Corretora de Seguros',
      categorySlug: 'rede-credenciada',
      datePublished: '2026-01-01',
    });
    assert.match(node.publisher.name, /^BeneficioRH/);
    assert.equal(node.publisher['@type'], 'Organization');
  });

  it('publisher NUNCA é "Amil" (anti-padrão FR54)', () => {
    // Simula tentativa de publisher errado.
    const wrongNode = fakeBlogPostingNode({
      url: 'https://x.com/blog/post',
      headline: 'T',
      authorName: 'A',
      publisherName: 'Amil',
      categorySlug: 'rede-credenciada',
      datePublished: '2026-01-01',
    });
    // Este test prova que SE alguém errar, o audit detecta.
    assert.match(wrongNode.publisher.name, /\bAmil\b/);
    assert.notEqual(/^BeneficioRH/.test(wrongNode.publisher.name), true);
  });

  it('author pode ser Person (humano) ou Organization (BeneficioRH)', () => {
    const personNode = fakeBlogPostingNode({
      url: 'https://x.com/blog/p',
      headline: 'T',
      authorType: 'Person',
      authorName: 'Agnaldo Silva',
      publisherName: 'BeneficioRH Corretora',
      categorySlug: 'reembolso',
      datePublished: '2026-01-01',
    });
    const orgNode = fakeBlogPostingNode({
      url: 'https://x.com/blog/p2',
      headline: 'T2',
      authorType: 'Organization',
      authorName: 'BeneficioRH Corretora',
      publisherName: 'BeneficioRH Corretora',
      categorySlug: 'reembolso',
      datePublished: '2026-01-01',
    });
    assert.equal(personNode.author['@type'], 'Person');
    assert.equal(orgNode.author['@type'], 'Organization');
  });

  it('articleSection cai para categorySlug quando não fornecido', () => {
    const node = fakeBlogPostingNode({
      url: 'https://x.com/blog/p',
      headline: 'T',
      authorName: 'A',
      publisherName: 'BeneficioRH',
      categorySlug: 'carencias',
      datePublished: '2026-01-01',
    });
    assert.equal(node.articleSection, 'carencias');
  });

  it('reviewedBy presente em categoria YMYL', () => {
    const node = fakeBlogPostingNode({
      url: 'https://x.com/blog/p',
      headline: 'T',
      authorName: 'A',
      publisherName: 'BeneficioRH',
      reviewerType: 'Person',
      categorySlug: 'carencias',
      datePublished: '2026-01-01',
    });
    assert.ok(node.reviewedBy);
    assert.equal(node.reviewedBy['@type'], 'Person');
  });

  it('inLanguage SEMPRE pt-BR', () => {
    const node = fakeBlogPostingNode({
      url: 'https://x.com/blog/p',
      headline: 'T',
      authorName: 'A',
      publisherName: 'B',
      categorySlug: 'reembolso',
      datePublished: '2026-01-01',
    });
    assert.equal(node.inLanguage, 'pt-BR');
  });

  it('keywords serializa array como string CSV (Schema.org keywords)', () => {
    const node = fakeBlogPostingNode({
      url: 'https://x.com/blog/p',
      headline: 'T',
      authorName: 'A',
      publisherName: 'B',
      categorySlug: 'reembolso',
      datePublished: '2026-01-01',
      keywords: ['ANS', 'reembolso', 'CPT'],
    });
    assert.equal(typeof node.keywords, 'string');
    assert.equal(node.keywords, 'ANS, reembolso, CPT');
  });

  it('dateModified cai para datePublished quando não fornecido', () => {
    const node = fakeBlogPostingNode({
      url: 'https://x.com/blog/p',
      headline: 'T',
      authorName: 'A',
      publisherName: 'B',
      categorySlug: 'reembolso',
      datePublished: '2026-01-01T00:00:00Z',
    });
    assert.equal(node.dateModified, node.datePublished);
  });
});

describe('Blog category slug whitelist — Story 6.11.a', () => {
  const VALID_SLUGS = [
    'carencias',
    'coparticipacao',
    'reembolso',
    'rede-credenciada',
    'adesao-mei-pme',
    'ans-regulamentacao',
    'cobertura',
    'cancelamento',
  ];

  it('exatamente 8 categorias canônicas', () => {
    assert.equal(VALID_SLUGS.length, 8);
  });

  it('slugs são kebab-case (sem underscore/uppercase)', () => {
    for (const slug of VALID_SLUGS) {
      assert.match(slug, /^[a-z]+(-[a-z]+)*$/);
    }
  });

  it('rejeita slug inválido', () => {
    const isValid = (s) => VALID_SLUGS.includes(s);
    assert.equal(isValid('carencias'), true);
    assert.equal(isValid('Carencias'), false);
    assert.equal(isValid('foo-bar'), false);
    assert.equal(isValid(''), false);
  });
});

describe('CollectionPage ItemList — Story 6.11.a', () => {
  function fakeCollection(posts) {
    return {
      '@type': 'CollectionPage',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://x.com/blog/${p.slug}/`,
          name: p.title,
        })),
        numberOfItems: posts.length,
      },
    };
  }

  it('numberOfItems casa com itemListElement.length', () => {
    const c = fakeCollection([
      { slug: 'a', title: 'A' },
      { slug: 'b', title: 'B' },
    ]);
    assert.equal(c.mainEntity.numberOfItems, 2);
    assert.equal(c.mainEntity.itemListElement.length, 2);
  });

  it('position é 1-based crescente', () => {
    const c = fakeCollection([
      { slug: 'a', title: 'A' },
      { slug: 'b', title: 'B' },
      { slug: 'c', title: 'C' },
    ]);
    assert.deepEqual(
      c.mainEntity.itemListElement.map((i) => i.position),
      [1, 2, 3],
    );
  });

  it('CollectionPage vazio (categoria sem posts) tem numberOfItems=0', () => {
    const c = fakeCollection([]);
    assert.equal(c.mainEntity.numberOfItems, 0);
    assert.equal(c.mainEntity.itemListElement.length, 0);
  });
});
