/**
 * `<RedeCredenciadaFAQ />` — Story 7.2 AC5.
 *
 * Renderiza 8 FAQs do hub `/rede-credenciada` com:
 *   - HTML semântico (<section> + <h2> + <h3> + <p>)
 *   - FAQPage schema JSON-LD (Schema.org Question/Answer)
 *   - Acessível por padrão (heading hierarchy, sem JS necessário)
 *
 * RSC-friendly: zero `'use client'`, render server-side puro.
 * Para acordeão interativo (collapse/expand), Story 7.x posterior
 * pode envolver com Radix Accordion Client.
 *
 * Conteúdo importado de @/content/rede-credenciada-faq (8 perguntas
 * canônicas, separadas para permitir teste e Story 7.10 atualizar
 * via cron sem code change).
 */

import type { ReactElement } from 'react';

import { REDE_CREDENCIADA_FAQS } from '@/content/rede-credenciada-faq';

export function RedeCredenciadaFAQ(): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: REDE_CREDENCIADA_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="rede-credenciada-faq-heading" className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto max-w-4xl px-4">
        <h2
          id="rede-credenciada-faq-heading"
          className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl"
        >
          Perguntas frequentes sobre a rede credenciada Amil
        </h2>

        <dl className="space-y-6">
          {REDE_CREDENCIADA_FAQS.map((faq, index) => (
            <div
              key={faq.question}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <dt className="mb-2 text-lg font-semibold text-gray-900">
                <h3 className="inline">
                  <span className="mr-2 text-amil-blue" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  {faq.question}
                </h3>
              </dt>
              <dd className="text-base leading-relaxed text-gray-700">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
