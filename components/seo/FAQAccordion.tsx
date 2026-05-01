/**
 * <FAQAccordion /> — Story 4.7 (FR36)
 *
 * React Server Component que renderiza Q&A com:
 *   - HTML semântico (<details>/<summary> nativos — zero JS client)
 *   - JSON-LD FAQPage inline via <script type="application/ld+json">
 *   - Acessibilidade WCAG 2.1 AA (foco visível, ARIA implícito do <details>)
 *
 * Diferente do `components/ui/FAQAccordion.tsx` (legacy, client-side com
 * useState e ChevronDown). Este SEO component é SSR/SSG puro, single
 * source of truth para JSON-LD em cornerstones e programmatic landings.
 *
 * Uso típico:
 *   <FAQAccordion
 *     items={faqs}
 *     headingLevel="h2"
 *     id="faq-carencia"
 *     emitSchema
 *   />
 */

import type { CSSProperties } from 'react';
import type { FAQItem } from '@/data/faqs/faq-amil-empresarial';

export type { FAQItem };

interface FAQAccordionProps {
  items: FAQItem[];
  /** Heading level dos H?. Default 'h2'. */
  headingLevel?: 'h2' | 'h3';
  /** ID do <section>. */
  id?: string;
  /** Emite JSON-LD FAQPage. Default true. */
  emitSchema?: boolean;
  /** Class extra no wrapper. */
  className?: string;
  /** Style inline (raríssimo, default undefined). */
  style?: CSSProperties;
}

/**
 * Escape de strings para JSON-LD seguro.
 * `JSON.stringify` já escapa aspas duplas e \n; só precisamos garantir
 * que o `<` e `</script>` em answers não fechem tag.
 *
 * Estratégia padrão Next.js: substituir `<` por `<` no output.
 */
function safeJsonStringify(payload: unknown): string {
  return JSON.stringify(payload).replace(/</g, '\\u003c');
}

function buildFaqPageSchema(items: FAQItem[]) {
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

export function FAQAccordion({
  items,
  headingLevel = 'h2',
  id,
  emitSchema = true,
  className,
  style,
}: FAQAccordionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const Heading = headingLevel;
  const schema = emitSchema ? buildFaqPageSchema(items) : null;

  return (
    <section
      id={id}
      className={className}
      style={style}
      aria-label="Perguntas frequentes"
    >
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonStringify(schema) }}
        />
      )}

      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {items.map((item, index) => (
          <li key={item.id ?? `faq-${index}`} className="group">
            <details className="group/details">
              <summary className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                <Heading className="text-base font-semibold text-slate-900 md:text-lg">
                  {item.question}
                </Heading>
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none text-teal-600 transition-transform group-open/details:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 pt-1 text-sm leading-relaxed text-slate-700 md:text-base">
                <p>{item.answer}</p>
                {item.source && (
                  <p className="mt-3 text-xs text-slate-500">
                    Fonte: <span className="font-medium">{item.source}</span>
                  </p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Helper para gerar JSON-LD diretamente (útil em testes ou quando o
 * schema precisa ser emitido fora do componente, ex: <head>).
 */
export function buildFaqPageJsonLd(items: FAQItem[]) {
  return buildFaqPageSchema(items);
}
