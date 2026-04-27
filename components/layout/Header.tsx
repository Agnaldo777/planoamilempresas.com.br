import Link from 'next/link';

const navItems = [
  { href: '/planos', label: 'Planos' },
  { href: '/empresarial', label: 'Empresarial' },
  { href: '/amil-dental', label: 'Amil Dental' },
  { href: '/tabela-de-precos', label: 'Preços' },
  { href: '/rede-credenciada', label: 'Rede Credenciada' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-amil-blue">
          Amil Saúde
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-amil-blue"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/cotacao-online"
            className="rounded-lg bg-cta-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-green-hover"
          >
            Cotação Grátis
          </Link>
        </nav>
      </div>
    </header>
  );
}
