/**
 * Tests Story 4.7 — FAQAccordion JSON-LD geração.
 *
 * Roda com: node --test components/seo/__tests__/FAQAccordion.test.mjs
 *
 * Como FAQAccordion.tsx é RSC + JSX, testamos as funções puras de
 * schema-building via mirror (paridade com o source).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Mirror das funções puras de components/seo/FAQAccordion.tsx
function safeJsonStringify(payload) {
  return JSON.stringify(payload).replace(/</g, '\\u003c');
}

function buildFaqPageSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

describe('buildFaqPageSchema (Story 4.7)', () => {
  it('1. shape básico FAQPage com mainEntity array', () => {
    const items = [{ question: 'Q1?', answer: 'A1.' }];
    const schema = buildFaqPageSchema(items);
    assert.equal(schema['@context'], 'https://schema.org');
    assert.equal(schema['@type'], 'FAQPage');
    assert.ok(Array.isArray(schema.mainEntity));
    assert.equal(schema.mainEntity.length, 1);
  });

  it('2. cada Question tem name e acceptedAnswer', () => {
    const items = [
      { question: 'Q1?', answer: 'A1.' },
      { question: 'Q2?', answer: 'A2.' },
    ];
    const schema = buildFaqPageSchema(items);
    for (const q of schema.mainEntity) {
      assert.equal(q['@type'], 'Question');
      assert.ok(typeof q.name === 'string');
      assert.equal(q.acceptedAnswer['@type'], 'Answer');
      assert.ok(typeof q.acceptedAnswer.text === 'string');
    }
  });

  it('3. 45+ Q&A renderizadas (smoke)', () => {
    const items = Array.from({ length: 45 }, (_, i) => ({
      question: `Pergunta ${i + 1}?`,
      answer: `Resposta ${i + 1}.`,
    }));
    const schema = buildFaqPageSchema(items);
    assert.equal(schema.mainEntity.length, 45);
  });

  it('4. answer com aspas duplas é stringificada com escape correto', () => {
    const items = [
      {
        question: 'Item?',
        answer: 'Resposta com "aspas" e \\backslash\\.',
      },
    ];
    const schema = buildFaqPageSchema(items);
    const json = safeJsonStringify(schema);
    // JSON.stringify naturalmente escapa "
    assert.ok(!json.includes('"aspas"'));
    assert.ok(json.includes('\\"aspas\\"'));
  });

  it('5. answer com tag <script> é escape para evitar XSS no inline JSON-LD', () => {
    const items = [
      {
        question: 'Test?',
        answer: 'Bloco </script><script>alert(1)</script>',
      },
    ];
    const json = safeJsonStringify(buildFaqPageSchema(items));
    // safeJsonStringify substitui < por <
    assert.ok(!json.includes('</script>'));
    assert.ok(json.includes('\\u003c'));
  });

  it('6. parse round-trip mantém integridade', () => {
    const items = [
      { question: 'Q1?', answer: 'A com <html> & "aspas".' },
      { question: 'Q2?', answer: 'A2.' },
    ];
    const json = safeJsonStringify(buildFaqPageSchema(items));
    // Re-parse remove escape < → <
    const parsed = JSON.parse(json);
    assert.equal(parsed.mainEntity[0].acceptedAnswer.text, 'A com <html> & "aspas".');
    assert.equal(parsed.mainEntity[1].name, 'Q2?');
  });

  it('7. items vazio gera mainEntity = []', () => {
    const schema = buildFaqPageSchema([]);
    assert.equal(schema.mainEntity.length, 0);
  });

  it('8. answer com quebra de linha preservada no schema', () => {
    const items = [{ question: 'Q?', answer: 'Linha 1.\nLinha 2.' }];
    const json = safeJsonStringify(buildFaqPageSchema(items));
    // \n é escapado pelo JSON.stringify para \\n
    assert.ok(json.includes('\\n'));
  });
});
