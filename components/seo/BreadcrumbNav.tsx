import Link from 'next/link';
import { SchemaGraph } from './SchemaGraph';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seusite.com.br';
  const allItems = [{ label: 'Home', href: '/' }, ...items];

  return (
    <>
      <SchemaGraph
        type="breadcrumb"
        data={{
          items: allItems.map((item) => ({
            name: item.label,
            url: `${baseUrl}${item.href}`,
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className="px-4 py-3 text-sm text-gray-500">
        <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && <span>/</span>}
              {index === allItems.length - 1 ? (
                <span className="text-gray-900">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-sky-600">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
