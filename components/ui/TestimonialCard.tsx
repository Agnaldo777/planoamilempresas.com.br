import { Star } from 'lucide-react';

interface TestimonialCardProps {
  nome: string;
  cargo: string;
  empresa: string;
  texto: string;
  rating: number;
}

export function TestimonialCard({ nome, cargo, empresa, texto, rating }: TestimonialCardProps) {
  const initials = nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-gray-600">&ldquo;{texto}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amil-blue text-sm font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{nome}</p>
          <p className="text-xs text-gray-500">
            {cargo} — {empresa}
          </p>
        </div>
      </div>
    </div>
  );
}
