'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aqui podes ligar um serviço de logs (ex: Sentry) no futuro
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertTriangle size={64} className="text-red-500" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-vapt-dark mb-3">
        Algo correu mal do nosso lado.
      </h1>
      <p className="text-gray-500 max-w-md mb-8">
        Desculpa pelo inconveniente. Ocorreu um erro inesperado ao carregar esta página. Tenta novamente.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => reset()}
          className="bg-vapt-blue hover:bg-vapt-lightBlue text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <RefreshCw size={18} /> Tentar novamente
        </button>
        <Link
          href="/"
          className="bg-white border border-gray-300 hover:bg-gray-50 text-vapt-dark font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          Ir para o início
        </Link>
      </div>
    </div>
  );
}