import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-vapt-gray">
      
      {/* NÚMERO 404 ANIMADO */}
      <div className="flex items-center text-8xl md:text-9xl font-extrabold text-vapt-blue mb-4 select-none">
        4
        <span className="inline-block mx-2 md:mx-4 animate-bounce text-vapt-green drop-shadow-md">
          0
        </span>
        4
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-vapt-dark mb-3">
        Oops! Página não encontrada.
      </h1>
      
      <p className="text-gray-500 max-w-md mb-8 text-sm md:text-base leading-relaxed">
        Parece que o link que clicaste está quebrado ou a página foi removida. 
        Não te preocupes, o VAPT tem muito mais para explorar.
      </p>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none justify-center">
        <Link
          href="/"
          className="bg-vapt-blue hover:bg-vapt-lightBlue text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
        >
          <ArrowLeft size={18} /> Voltar ao início
        </Link>
        
        <Link
          href="/anuncios"
          className="bg-white border border-gray-300 hover:bg-gray-50 text-vapt-dark font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Search size={18} /> Ver anúncios
        </Link>
      </div>

    </div>
  );
}