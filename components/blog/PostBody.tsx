/**
 * <PostBody /> — Story 6.11.a
 *
 * Renderizador minimal de Portable Text (Sanity) com classes Tailwind.
 * Subset suportado:
 *   - block style: normal, h2, h3, h4, blockquote
 *   - listItem: bullet, number
 *   - mark: link (markDefs)
 *
 * Não usa `@portabletext/react` — implementação enxuta para evitar
 * dependência extra. Em v2, migrar quando precisar de blocos custom
 * (callout, video embed, etc.).
 */

import Link from 'next/link';
import type { PortableTextBlock } from '@/data/blog/types';

interface PostBodyProps {
  blocks: PortableTextBlock[];
}

interface MarkLink {
  _type: 'link';
  _key: string;
  href: string;
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function renderText(
  block: PortableTextBlock,
): React.ReactNode {
  return block.children.map((span) => {
    const { _key, text, marks } = span;
    let element: React.ReactNode = text;

    if (marks && marks.length > 0 && block.markDefs) {
      for (const mark of marks) {
        const def = block.markDefs.find((m) => m._key === mark) as
          | MarkLink
          | undefined;
        if (def && def._type === 'link') {
          element = isExternalHref(def.href) ? (
            <a
              key={_key}
              href={def.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 underline decoration-sky-300 underline-offset-2 hover:text-sky-700"
            >
              {element}
            </a>
          ) : (
            <Link
              key={_key}
              href={def.href}
              className="text-sky-600 underline decoration-sky-300 underline-offset-2 hover:text-sky-700"
            >
              {element}
            </Link>
          );
        }
      }
    }

    return <span key={_key}>{element}</span>;
  });
}

function groupBlocks(
  blocks: PortableTextBlock[],
): Array<{ type: 'list'; ordered: boolean; items: PortableTextBlock[] } | { type: 'block'; block: PortableTextBlock }> {
  const result: Array<
    | { type: 'list'; ordered: boolean; items: PortableTextBlock[] }
    | { type: 'block'; block: PortableTextBlock }
  > = [];
  let currentList: { type: 'list'; ordered: boolean; items: PortableTextBlock[] } | null = null;

  for (const block of blocks) {
    if (block.listItem) {
      const ordered = block.listItem === 'number';
      if (!currentList || currentList.ordered !== ordered) {
        currentList = { type: 'list', ordered, items: [block] };
        result.push(currentList);
      } else {
        currentList.items.push(block);
      }
    } else {
      currentList = null;
      result.push({ type: 'block', block });
    }
  }
  return result;
}

export function PostBody({ blocks }: PostBodyProps): React.JSX.Element {
  const grouped = groupBlocks(blocks);

  return (
    <div
      className="prose prose-slate max-w-none text-slate-800"
      data-testid="post-body"
    >
      {grouped.map((entry, idx) => {
        if (entry.type === 'list') {
          const ListTag = entry.ordered ? 'ol' : 'ul';
          return (
            <ListTag
              key={`list-${idx}`}
              className={
                entry.ordered
                  ? 'my-4 list-decimal space-y-1 pl-6'
                  : 'my-4 list-disc space-y-1 pl-6'
              }
            >
              {entry.items.map((item) => (
                <li key={item._key}>{renderText(item)}</li>
              ))}
            </ListTag>
          );
        }

        const { block } = entry;
        const content = renderText(block);
        switch (block.style) {
          case 'h2':
            return (
              <h2
                key={block._key}
                className="mt-8 text-2xl font-bold text-slate-900"
              >
                {content}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={block._key}
                className="mt-6 text-xl font-semibold text-slate-900"
              >
                {content}
              </h3>
            );
          case 'h4':
            return (
              <h4
                key={block._key}
                className="mt-4 text-lg font-semibold text-slate-900"
              >
                {content}
              </h4>
            );
          case 'blockquote':
            return (
              <blockquote
                key={block._key}
                className="my-4 border-l-4 border-amber-500 bg-amber-50 px-4 py-2 italic text-slate-700"
              >
                {content}
              </blockquote>
            );
          case 'normal':
          default:
            return (
              <p key={block._key} className="my-4 leading-7">
                {content}
              </p>
            );
        }
      })}
    </div>
  );
}
