const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function buildBreadcrumb(items: BreadcrumbItem[]) {
  const allItems = [{ name: 'Home', href: '/' }, ...items];

  return {
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };
}
