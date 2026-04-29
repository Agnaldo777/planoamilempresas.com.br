import Link from 'next/link';
import { MapPin, Hospital } from 'lucide-react';

interface LocalHeroProps {
  cidade: string;
  estado: string;
  totalHospitais: number;
  temEspacoSaude: boolean;
}

export function LocalHero({ cidade, estado, totalHospitais, temEspacoSaude }: LocalHeroProps) {
  return (
    <section className="bg-slate-900 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-3">
          {totalHospitais > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm">
              <Hospital className="h-4 w-4" /> {totalHospitais} hospitais credenciados
            </span>
          )}
          {temEspacoSaude && (
            <span className="flex items-center gap-1 rounded-full bg-cta-green/20 px-3 py-1 text-sm">
              <MapPin className="h-4 w-4" /> Amil Espaço Saúde
            </span>
          )}
        </div>

        <h1 className="mt-6 text-3xl font-bold md:text-4xl lg:text-5xl">
          Plano de Saúde Amil Empresarial em {cidade}
        </h1>
        <p className="mt-3 text-lg text-slate-200">
          Cotação 2026 — Melhores planos para empresas em {cidade}, {estado}
        </p>

        <Link
          href="/cotacao-online"
          className="mt-8 inline-block rounded-lg bg-cta-green px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-cta-green-hover"
        >
          Simular plano em {cidade} →
        </Link>
      </div>
    </section>
  );
}
