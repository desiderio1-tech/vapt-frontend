'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowRight, MapPin, Heart, Search, Timer, BadgeCheck, Smartphone, Laptop, Sofa, Home as HomeIcon, Shirt, Car, BookOpen, MoreHorizontal } from 'lucide-react';

export default function Home() {
  const [recentAds, setRecentAds] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    api.get('/ads').then((res) => {
      setRecentAds(res.data.slice(0, 4));
      setLoadingAds(false);
    }).catch(() => setLoadingAds(false));
  }, []);

  const categorias = [
    { icon: Smartphone, name: 'Telemóveis', color: 'text-blue-500' },
    { icon: Laptop, name: 'Computadores', color: 'text-purple-500' },
    { icon: Sofa, name: 'Móveis', color: 'text-orange-500' },
    { icon: HomeIcon, name: 'Casa', color: 'text-yellow-500' },
    { icon: Shirt, name: 'Moda', color: 'text-pink-500' },
    { icon: Car, name: 'Veículos', color: 'text-red-500' },
    { icon: BookOpen, name: 'Livros', color: 'text-green-500' },
    { icon: MoreHorizontal, name: 'Outros', color: 'text-gray-500' },
  ];

  return (
    <div className="bg-vapt-gray min-h-screen pb-10">
      
      {/* HERO BANNER */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="relative bg-gradient-to-r from-vapt-blue to-blue-800 rounded-3xl overflow-hidden p-6 md:p-10 text-white shadow-lg">
          <div className="relative z-10 md:w-1/2">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-2">
              Compre melhor. <br/>
              <span className="text-yellow-400">Venda mais fácil.</span>
            </h1>
            <p className="text-blue-100 mb-6 text-sm md:text-base">
              Milhares de oportunidades de compra e venda perto de si.
            </p>
            <Link href="/anuncios" className="inline-flex items-center gap-2 bg-vapt-green hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full transition shadow-md">
              Explorar produtos <ArrowRight size={18} />
            </Link>
          </div>
          {/* Imagem do Banner (Exemplo) */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden md:block opacity-90">
             {/* Podes substituir este emoji por uma imagem real do teu produto */}
             <div className="w-full h-full flex items-center justify-center text-[150px] translate-x-10 translate-y-10">📱</div>
          </div>
        </div>
      </div>

      {/* CATEGORIAS */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-vapt-dark flex items-center gap-2">
            <span className="text-vapt-blue text-2xl">⠿</span> Explore categorias
          </h2>
          <Link href="/anuncios" className="text-vapt-blue text-sm font-semibold hover:underline">Ver todas →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {categorias.map((cat, i) => (
            <Link key={i} href={`/anuncios?categoria=${cat.name}`} className="flex flex-col items-center justify-center min-w-[80px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition">
              <cat.icon size={28} className={`${cat.color} mb-2`} />
              <span className="text-[10px] font-medium text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* OFERTAS EM DESTAQUE */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-vapt-dark flex items-center gap-2">
            <span className="text-orange-500 text-2xl">🔥</span> Ofertas em destaque
          </h2>
          <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
            <Timer size={14} /> Termina em: 12h 34m
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {loadingAds ? (
             <div className="col-span-full text-center text-gray-500 py-10">A carregar ofertas...</div>
          ) : recentAds.map(ad => (
            <Link href={`/anuncios/${ad.id}`} key={ad.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
              <div className="relative h-40 bg-gray-50 rounded-xl overflow-hidden mb-3">
                <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover" />
                <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm">
                  <Heart size={16} />
                </button>
                <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {ad.condition}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-sm text-vapt-dark truncate">{ad.title}</h3>
                <p className="text-xl font-extrabold text-vapt-blue mt-1">{ad.price.toLocaleString('pt-MZ')} MT</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <MapPin size={12} /> {ad.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* BANNER VENDEDORES VERIFICADOS */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-vapt-green rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="bg-white/20 p-3 rounded-full">
              <BadgeCheck size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Vendedores Verificados</h3>
              <p className="text-sm text-green-50">Compre com mais segurança!</p>
            </div>
          </div>
          <Link href="#" className="bg-white text-vapt-green px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition">
            Saiba mais →
          </Link>
        </div>
      </div>

    </div>
  );
}