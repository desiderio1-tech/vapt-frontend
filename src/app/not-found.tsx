import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-vapt-gray">
      <div className="relative mb-6">
        <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🕵️‍♂️</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-vapt-blue mb-2">Página não encontrada</h2>
      <p className="text-gray-500 max-w-sm mb-8 text-sm">
        O link que clicaste pode estar quebrado ou o produto já foi removido. Não desistas, há mais coisas no VAPT!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link href="/" className="flex-1 bg-vapt-blue hover:bg-vapt-lightBlue text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md">
          <ArrowLeft size={18} /> Início
        </Link>
        <Link href="/anuncios" className="flex-1 bg-white border border-gray-200 text-vapt-dark hover:bg-gray-50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm">
          <Search size={18} /> Procurar
        </Link>
      </div>
    </div>
  );
}