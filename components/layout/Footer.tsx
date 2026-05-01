import Link from 'next/link';

const footerSections = [
  {
    title: 'Planos',
    links: [
      { href: '/planos/amil-facil-s80', label: 'Amil Fácil S80' },
      { href: '/planos/amil-s450', label: 'Amil S450' },
      { href: '/planos/amil-s750', label: 'Amil S750' },
      { href: '/planos/amil-one-s2500', label: 'Amil One' },
      { href: '/amil-dental', label: 'Amil Dental' },
    ],
  },
  {
    title: 'Empresarial',
    links: [
      { href: '/empresarial', label: 'Planos Empresariais' },
      { href: '/empresarial/mei', label: 'Plano MEI' },
      { href: '/empresarial/pme-2-a-29-vidas', label: 'PME (2-29 vidas)' },
      { href: '/empresarial/grandes-empresas', label: 'Grandes Empresas' },
      { href: '/portal-empresa', label: 'Portal Empresa' },
    ],
  },
  {
    title: 'Informações',
    links: [
      { href: '/tabela-de-precos', label: 'Tabela de Preços' },
      { href: '/rede-credenciada', label: 'Rede Credenciada' },
      { href: '/perguntas-frequentes', label: 'Perguntas Frequentes' },
      { href: '/blog', label: 'Blog' },
      { href: '/contato', label: 'Contato' },
    ],
  },
];

const phoneNumbers = [
  { city: 'São Paulo', phone: '(11) 4200-7866' },
  { city: 'Rio de Janeiro', phone: '(21) 2042-2690' },
  { city: 'Belo Horizonte', phone: '(31) 2342-0743' },
  { city: 'Curitiba', phone: '(41) 3542-1590' },
  { city: 'Brasília', phone: '(61) 3142-0100' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Central de Vendas
            </h3>
            <ul className="space-y-2">
              {phoneNumbers.map((item) => (
                <li key={item.city} className="text-sm text-gray-300">
                  <span className="font-medium text-white">{item.city}:</span>{' '}
                  <a href={`tel:${item.phone.replace(/\D/g, '')}`} className="hover:text-cta-green">
                    {item.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-8 text-center text-xs text-gray-400">
          <p>
            Operado por <strong>BeneficioRH Corretora de Seguros</strong> — corretor autorizado a
            intermediar planos da Amil Assistência Médica Internacional S.A. (registro ANS nº
            326305).
          </p>
          <p className="mt-1">
            CNPJ 14.764.085/0001-99 · SUSEP 201054484 · Site independente, não substitui canais
            oficiais Amil.
          </p>
          <p className="mt-1">&copy; {new Date().getFullYear()} BeneficioRH. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
