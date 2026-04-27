'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils/format';

interface PriceRow {
  faixa_etaria: string;
  preco: number;
}

interface PriceTableProps {
  planoNome: string;
  precos: PriceRow[];
}

export function PriceTable({ planoNome, precos }: PriceTableProps) {
  const [selectedFaixa, setSelectedFaixa] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-amil-blue text-white">
          <tr>
            <th className="px-4 py-3 font-semibold">Faixa Etária</th>
            <th className="px-4 py-3 font-semibold text-right">{planoNome}</th>
          </tr>
        </thead>
        <tbody>
          {precos.map((row) => (
            <tr
              key={row.faixa_etaria}
              className={`cursor-pointer border-t border-gray-100 transition-colors hover:bg-amil-blue-light ${
                selectedFaixa === row.faixa_etaria ? 'bg-amil-blue-light' : ''
              }`}
              onClick={() => setSelectedFaixa(row.faixa_etaria)}
            >
              <td className="px-4 py-3 font-medium text-gray-700">{row.faixa_etaria} anos</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(row.preco)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2 text-xs text-gray-400">
        * Valores sujeitos a alteração. Consulte condições.
      </p>
    </div>
  );
}
