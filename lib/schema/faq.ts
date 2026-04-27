export interface FAQSchemaItem {
  question: string;
  answer: string;
}

export function buildFAQPage(items: FAQSchemaItem[]) {
  return {
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
