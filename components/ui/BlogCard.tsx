import Link from 'next/link';

interface BlogCardProps {
  titulo: string;
  slug: string;
  categoria: string;
  excerpt: string;
  publishedAt: string;
}

const categoriaColors: Record<string, string> = {
  guias: 'bg-slate-900',
  noticias: 'bg-urgency',
  comparativos: 'bg-slate-800',
  'dicas-saude': 'bg-teal-600',
  'legislacao-ans': 'bg-gray-700',
  'beneficios-corporativos': 'bg-slate-900',
  faq: 'bg-gray-500',
};

export function BlogCard({ titulo, slug, categoria, excerpt, publishedAt }: BlogCardProps) {
  const date = new Date(publishedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col rounded-xl border border-gray-200 transition-shadow hover:shadow-lg"
    >
      <div className="aspect-video w-full rounded-t-xl bg-gray-100" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${categoriaColors[categoria] || 'bg-gray-500'}`}
          >
            {categoria}
          </span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-base font-bold text-gray-900 group-hover:text-sky-600">
          {titulo}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-500">{excerpt}</p>
        <span className="mt-4 text-sm font-medium text-sky-600 group-hover:underline">
          Ler mais →
        </span>
      </div>
    </Link>
  );
}
