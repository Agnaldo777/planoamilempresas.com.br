import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-amil-blue">404</h1>
      <p className="mt-4 text-lg text-gray-500">Página não encontrada</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-amil-blue px-6 py-3 text-white hover:bg-amil-blue-dark"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
