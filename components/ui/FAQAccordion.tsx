'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SchemaGraph } from '@/components/seo/SchemaGraph';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  includeSchema?: boolean;
}

export function FAQAccordion({ items, includeSchema = true }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {includeSchema && (
        <SchemaGraph
          type="faq"
          data={{ questions: items.map((i) => ({ question: i.question, answer: i.answer })) }}
        />
      )}
      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
        {items.map((item, index) => (
          <div key={index}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
              aria-expanded={openIndex === index}
            >
              <h3 className="pr-4 text-sm font-semibold text-gray-900 md:text-base">
                {item.question}
              </h3>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all ${
                openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
              }`}
            >
              <p className="px-6 text-sm leading-relaxed text-gray-600">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
