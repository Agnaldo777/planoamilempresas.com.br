import { Check, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface ComparisonFeature {
  label: string;
  planoA: boolean | string;
  planoB: boolean | string;
}

interface ComparisonTableProps {
  planoA: { nome: string; preco: number };
  planoB: { nome: string; preco: number };
  features: ComparisonFeature[];
  veredicto?: string;
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-cta-green" />
    ) : (
      <X className="mx-auto h-5 w-5 text-gray-300" />
    );
  }
  return <span className="text-sm text-gray-700">{value}</span>;
}

export function ComparisonTable({ planoA, planoB, features, veredicto }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="px-4 py-3 text-left text-gray-500">Característica</th>
            <th className="px-4 py-3 text-center">
              <span className="font-bold text-amil-blue">{planoA.nome}</span>
              <br />
              <span className="text-xs text-gray-500">{formatCurrency(planoA.preco)}/mês</span>
            </th>
            <th className="px-4 py-3 text-center">
              <span className="font-bold text-amil-blue-dark">{planoB.nome}</span>
              <br />
              <span className="text-xs text-gray-500">{formatCurrency(planoB.preco)}/mês</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.label} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-700">{feature.label}</td>
              <td className="px-4 py-3 text-center">
                <FeatureValue value={feature.planoA} />
              </td>
              <td className="px-4 py-3 text-center">
                <FeatureValue value={feature.planoB} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {veredicto && (
        <div className="mt-4 rounded-lg bg-amil-blue-light p-4">
          <p className="text-sm font-semibold text-amil-blue-dark">Veredicto: {veredicto}</p>
        </div>
      )}
    </div>
  );
}
