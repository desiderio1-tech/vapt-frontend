'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowRight, Shield, Zap, MapPin, Search } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [recentAds, setRecentAds] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar os 4 anúncios mais recentes
  useEffect(() => {
    api.get('/ads')
      .then((res) => {
        // Pega apenas os primeiros 4 para a montra
        setRecentAds(res.data.slice(0, 4));
        setLoadingAds(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar anúncios:', err);
        setLoadingAds(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/anuncios?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/anuncios');
    }
  };

  // Categorias com os nomes exatos para o filtro
  const categorias = [
    { icon: '📱', name: 'Telemóveis' },
    { icon: '💻', name: 'Computadores' },
    { icon: '🛋️', name: 'Móveis' },
    { icon: '🔌', name: 'Eletrodomésticos' },
    { icon: '👕', name: 'Moda' },
    { icon: '🚗', name: 'Veículos' },
    { icon: '📚', name: 'Livros' },
    { icon: '📦', name: 'Outros' },
  ];

  return (
    <div className="bg-vapt-gray min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-vapt-blue to-vapt-lightBlue text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              O supermercado de usados mais perto de você.
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-lg">
              Compra e vende produtos usados de forma simples, segura e rápida. 
              No VAPT, o que você não usa mais, pode valer muito para alguém.
            </p>

            {/* PESQUISA NA HERO */}
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg overflow-hidden max-w-md mb-8 shadow-lg">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="O que procuras hoje?"
                className="flex-1 px-4 py-3 text-vapt-dark outline-none text-sm"
              />
              <button type="submit" className="bg-vapt-green hover:bg-green-700 px-6 py-3 text-white transition flex items-center gap-2 font-semibold">
                <Search size={18} /> Procurar
              </button>
            </form>

            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Shield size={18} className="text-vapt-green" />
                <span>Seguro e confiável</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Zap size={18} className="text-vapt-green" />
                <span>Rápido e prático</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <MapPin size={18} className="text-vapt-green" />
                <span>Em todo Moçambique</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-sm transform rotate-2 hover:rotate-0 transition duration-300">
              <div className="text-6xl mb-4 text-center">📱</div>
              <h3 className="text-2xl font-bold mb-2 text-center">Dê uma nova vida ao que já existe!</h3>
              <p className="text-blue-100 text-center text-sm">
                Milhares de produtos à espera de um novo dono. Junta-te à comunidade VAPT e começa a poupar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-vapt-blue mb-6">Categorias</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.name}
                href={`/anuncios?categoria=${encodeURIComponent(cat.name)}`}
                className="bg-gray-50 p-4 rounded-xl hover:bg-vapt-blue hover:text-white hover:shadow-md transition group text-center border border-gray-100"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition">{cat.icon}</div>
                <div className="font-semibold text-xs md:text-sm">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ANÚNCIOS RECENTES (DINÂMICO) */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-vapt-blue">Novidades no VAPT</h2>
          <Link
            href="/anuncios"
            className="text-vapt-blue hover:text-vapt-green font-semibold flex items-center gap-1 text-sm transition"
          >
            Ver todos <ArrowRight size={18} />
          </Link>
        </div>

        {loadingAds ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl h-72"></div>
            ))}
          </div>
        ) : recentAds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-500">Ainda não há anúncios publicados. Sê o primeiro!</p>
            <Link href="/criar-anuncio" className="inline-block mt-4 text-vapt-green font-bold hover:underline">
              Publicar anúncio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentAds.map((ad) => (
              <Link
                key={ad.id}
                href={`/anuncios/${ad.id}`}
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition group border border-gray-100 flex flex-col"
              >
                <div className="h-44 bg-gray-100 overflow-hidden relative">
                  {ad.images && ad.images[0] ? (
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold text-vapt-blue px-2 py-1 rounded-md shadow-sm">
                    {ad.condition}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-semibold text-vapt-dark truncate leading-tight">{ad.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{ad.category?.name}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-vapt-blue mt-2">
                      {ad.price.toLocaleString('pt-MZ')} MT
                    </p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <MapPin size={12} /> {ad.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA VENDER */}
      <section className="max-w-7xl mx-auto px-4 py-12 mb-8">
        <div className="bg-vapt-blue text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Vende o que já não usas!</h2>
            <p className="text-blue-100 max-w-md">
              É rápido, seguro e sem complicações. Anuncia os teus produtos agora e ganha dinheiro extra.
            </p>
          </div>
          <Link
            href="/criar-anuncio"
            className="bg-vapt-green hover:bg-green-700 px-6 py-3 rounded-lg font-bold whitespace-nowrap flex items-center gap-2 transition relative z-10 shadow-lg"
          >
            Anunciar agora <ArrowRight size={20} />
          </Link>
          
          {/* Detalhe visual de fundo */}
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}