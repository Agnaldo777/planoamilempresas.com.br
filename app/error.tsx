'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-urgency">Ops!</h1>
      <p className="mt-4 text-lg text-gray-500">Algo deu errado. Tente novamente.</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-amil-blue px-6 py-3 text-white hover:bg-amil-blue-dark"
      >
        Tentar novamente
      </button>
    </div>
  );
}
