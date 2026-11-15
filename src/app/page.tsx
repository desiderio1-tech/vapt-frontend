'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowRight, Shield, Zap, MapPin } from 'lucide-react';

export default function Home() {
  const [recentAds, setRecentAds] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    api.get('/ads')
      .then((res) => {
        setRecentAds(res.data.slice(0, 4));
        setLoadingAds(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar anúncios:', err);
        setLoadingAds(false);
      });
  }, []);

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
      <section className="bg-gradient-to-r from-vapt-blue to-vapt-lightBlue text-white relative">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-24 grid md:grid-cols-2 gap-6 items-center relative z-10">
          <div>
            {/* Texto reduzido no telemóvel (text-3xl) e maior no PC (md:text-5xl) */}
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3 md:mb-4">
              O supermercado de usados mais perto de você.
            </h1>
            
            {/* Descrição escondida no telemóvel para poupar espaço */}
            <p className="hidden md:block text-lg text-blue-100 mb-8 max-w-lg">
              Compra e vende produtos usados de forma simples, segura e rápida. 
              No VAPT, o que você não usa mais, pode valer muito para alguém.
            </p>

            <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
              <div className="flex items-center gap-1.5 text-xs md:text-sm bg-white/10 px-3 py-1.5 md:py-2 rounded-lg backdrop-blur-sm">
                <Shield size={14} className="text-vapt-green md:w-[18px]" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs md:text-sm bg-white/10 px-3 py-1.5 md:py-2 rounded-lg backdrop-blur-sm">
                <Zap size={14} className="text-vapt-green md:w-[18px]" />
                <span>Rápido</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs md:text-sm bg-white/10 px-3 py-1.5 md:py-2 rounded-lg backdrop-blur-sm">
                <MapPin size={14} className="text-vapt-green md:w-[18px]" />
                <span>Em Moçambique</span>
              </div>
            </div>

            {/* BOTÃO VENDER NO HERO (Para quem entra e quer logo vender) */}
            <Link
              href="/criar-anuncio"
              className="inline-flex items-center gap-2 bg-vapt-green hover:bg-green-700 px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-bold transition text-sm md:text-base shadow-lg"
            >
              Vender agora <ArrowRight size={18} />
            </Link>
          </div>

          {/* Cartão do lado direito (Apenas no PC) */}
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
      <section className="max-w-7xl mx-auto px-4 py-6 md:py-12 md:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg md:text-2xl font-bold text-vapt-blue mb-4 md:mb-6">Categorias</h2>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.name}
                href={`/anuncios?categoria=${encodeURIComponent(cat.name)}`}
                className="bg-gray-50 p-2 md:p-4 rounded-xl hover:bg-vapt-blue hover:text-white hover:shadow-md transition group text-center border border-gray-100"
              >
                <div className="text-2xl md:text-3xl mb-1 md:mb-2 group-hover:scale-110 transition">{cat.icon}</div>
                <div className="font-semibold text-[10px] md:text-sm leading-tight">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ANÚNCIOS RECENTES */}
      <section className="max-w-7xl mx-auto px-4 py-2 md:py-6 mb-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-vapt-blue">Novidades</h2>
          <Link
            href="/anuncios"
            className="text-vapt-blue hover:text-vapt-green font-semibold flex items-center gap-1 text-xs md:text-sm transition"
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {loadingAds ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl h-52 md:h-72"></div>
            ))}
          </div>
        ) : recentAds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-500 text-sm md:text-base">Ainda não há anúncios publicados. Sê o primeiro!</p>
            <Link href="/criar-anuncio" className="inline-block mt-4 text-vapt-green font-bold hover:underline text-sm md:text-base">
              Publicar anúncio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {recentAds.map((ad) => (
              <Link
                key={ad.id}
                href={`/anuncios/${ad.id}`}
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition group border border-gray-100 flex flex-col"
              >
                <div className="h-32 md:h-44 bg-gray-100 overflow-hidden relative">
                  {ad.images && ad.images[0] ? (
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl">📦</div>
                  )}
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] md:text-xs font-bold text-vapt-blue px-1.5 md:px-2 py-0.5 md:py-1 rounded-md shadow-sm">
                    {ad.condition}
                  </span>
                </div>
                <div className="p-2 md:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-semibold text-vapt-dark truncate leading-tight text-xs md:text-base">{ad.title}</h3>
                  </div>
                  <div>
                    <p className="text-sm md:text-lg font-bold text-vapt-blue mt-1 md:mt-2">
                      {ad.price.toLocaleString('pt-MZ')} MT
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2 flex items-center gap-1 truncate">
                      <MapPin size={10} className="md:w-3 md:h-3" /> {ad.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA VENDER */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 mb-8">
        <div className="bg-vapt-blue text-white rounded-2xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-xl relative overflow-hidden text-center md:text-left">
          <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-bold mb-2">Vende o que já não usas!</h2>
            <p className="text-blue-100 max-w-md text-xs md:text-base">
              É rápido, seguro e sem complicações. Anuncia agora e ganha dinheiro extra.
            </p>
          </div>
          <Link
            href="/criar-anuncio"
            className="bg-vapt-green hover:bg-green-700 px-6 py-3 rounded-lg font-bold whitespace-nowrap flex items-center justify-center gap-2 transition relative z-10 shadow-lg w-full md:w-auto mt-2 md:mt-0 text-sm md:text-base"
          >
            Anunciar agora <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}