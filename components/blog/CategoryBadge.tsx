/**
 * <CategoryBadge /> — Story 6.11.a
 *
 * Badge de categoria usado em PostCard e PostBody. Link para
 * `/blog/categoria/[slug]/`. Paleta Opção A — teal/sky tokens.
 */

import Link from 'next/link';
import {
  getBlogCategory,
  type BlogCategorySlug,
} from '@/data/blog/categories';

interface CategoryBadgeProps {
  slug: BlogCategorySlug;
  /** Link envolvente. Default true. */
  asLink?: boolean;
  /** Tamanho compact em PostCard. */
  size?: 'sm' | 'md';
}

export function CategoryBadge({
  slug,
  asLink = true,
  size = 'sm',
}: CategoryBadgeProps): React.JSX.Element | null {
  const category = getBlogCategory(slug);
  if (!category) return null;

  const sizeClass =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const baseClass =
    'inline-flex items-center rounded-full bg-teal-50 font-medium text-teal-700 ring-1 ring-inset ring-teal-200';
  const linkClass = `${baseClass} ${sizeClass} hover:bg-teal-100 hover:text-teal-800`;
  const staticClass = `${baseClass} ${sizeClass}`;

  if (asLink) {
    return (
      <Link
        href={`/blog/categoria/${category.slug}/`}
        className={linkClass}
        data-testid="category-badge"
      >
        {category.title}
      </Link>
    );
  }
  return (
    <span className={staticClass} data-testid="category-badge">
      {category.title}
    </span>
  );
}
