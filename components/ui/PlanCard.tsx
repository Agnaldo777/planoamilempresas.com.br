import Link from 'next/link';
import { Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface PlanCardProps {
  nome: string;
  slug: string;
  linha: 'amil-facil' | 'amil' | 'amil-one';
  cobertura: string;
  precoBase: number;
  features: string[];
}

const linhaConfig = {
  'amil-facil': { label: 'Amil Fácil', bg: 'bg-teal-600', border: 'hover:border-teal-600' },
  amil: { label: 'Amil Saúde', bg: 'bg-slate-900', border: 'hover:border-slate-900' },
  'amil-one': { label: 'Amil One', bg: 'bg-slate-800', border: 'hover:border-slate-800' },
};

export function PlanCard({ nome, slug, linha, cobertura, precoBase, features }: PlanCardProps) {
  const config = linhaConfig[linha];

  return (
    <Link
      href={`/planos/${slug}`}
      className={`group flex flex-col rounded-xl border border-gray-200 p-6 transition-all hover:shadow-lg ${config.border}`}
    >
      <div className="flex items-center justify-between">
        <span className={`rounded-full ${config.bg} px-3 py-1 text-xs font-semibold text-white`}>
          {config.label}
        </span>
        <span className="text-xs text-gray-500">{cobertura === 'nacional' ? 'Nacional' : 'Regional'}</span>
      </div>

      <h3 className="mt-4 text-xl font-bold text-gray-900">{nome}</h3>

      <p className="mt-2 text-sm text-gray-500">A partir de</p>
      <p className="text-3xl font-bold text-gray-900">
        {formatCurrency(precoBase)}
        <span className="text-sm font-normal text-gray-500">/mês</span>
      </p>

      <ul className="mt-6 flex-1 space-y-2">
        {features.slice(0, 5).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-cta-green" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-lg bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors group-hover:bg-teal-500">
        Simular plano →
      </div>
    </Link>
  );
}
