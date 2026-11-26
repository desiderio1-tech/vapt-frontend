'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';

function AnunciosContent() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '');
  const [minhaCidade, setMinhaCidade] = useState(false);

  const categorias = [
    { name: 'Telemóveis', icon: '📱' },
    { name: 'Computadores', icon: '💻' },
    { name: 'Móveis', icon: '🛋️' },
    { name: 'Eletrodomésticos', icon: '🔌' },
    { name: 'Moda', icon: '👕' },
    { name: 'Veículos', icon: '🚗' },
    { name: 'Livros', icon: '📚' },
    { name: 'Outros', icon: '📦' },
  ];

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoria) params.append('category', categoria);
      if (minhaCidade && user?.city) params.append('city', user.city);
      
      const res = await api.get(`/ads?${params.toString()}`);
      setAds(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [categoria, minhaCidade]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAds();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-vapt-blue">Todos os anúncios</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Encontra o que precisas em todo Moçambique.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="flex-1 flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden focus-within:border-vapt-blue">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por título ou descrição..."
              className="flex-1 px-4 py-2.5 outline-none text-sm"
            />
          </div>
          <button type="submit" className="bg-vapt-blue hover:bg-vapt-lightBlue text-white px-4 md:px-6 rounded-lg font-semibold flex items-center gap-2 transition">
            <Search size={18} /> <span className="hidden md:block">Pesquisar</span>
          </button>
        </form>

        {user?.city && (
          <button
            onClick={() => setMinhaCidade(!minhaCidade)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition border ${
              minhaCidade 
                ? 'bg-vapt-green text-white border-vapt-green' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <MapPin size={18} /> 
            {minhaCidade ? `Só em ${user.city}` : 'Perto de mim'}
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 hide-scrollbar">
        <button
          onClick={() => setCategoria('')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition ${
            categoria === '' ? 'bg-vapt-blue text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategoria(cat.name)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition ${
              categoria === cat.name ? 'bg-vapt-blue text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-xl h-56 md:h-72"></div>
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <div className="text-7xl mb-4 opacity-50">📭</div>
          <h3 className="text-2xl font-bold text-vapt-dark mb-2">Nenhum resultado</h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">
            Não encontrámos nada com esses filtros. Tenta usar palavras mais simples ou limpar os filtros.
          </p>
          <button 
            onClick={() => { setSearch(''); setCategoria(''); setMinhaCidade(false); }}
            className="bg-vapt-blue hover:bg-vapt-lightBlue text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {ads.map((ad) => (
            <Link
              key={ad.id}
              href={`/anuncios/${ad.id}`}
              className={`bg-white rounded-xl overflow-hidden hover:shadow-lg transition group border flex flex-col ${
                ad.isFeatured ? 'border-yellow-400 shadow-md' : 'border-gray-100'
              }`}
            >
              <div className="h-32 md:h-48 bg-gray-100 overflow-hidden relative">
                {ad.images && ad.images[0] ? (
                  <img
                    src={ad.images[0]}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl">📦</div>
                )}
                
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {ad.isFeatured && (
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      ⭐ Destaque
                    </span>
                  )}
                  {!ad.isFeatured && ad.isTrending && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      🔥 Em Alta
                    </span>
                  )}
                </div>
                
                <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-[10px] font-bold text-vapt-blue px-2 py-0.5 rounded shadow-sm">
                  {ad.condition}
                </span>
              </div>
              
              <div className="p-2 md:p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-semibold text-vapt-dark truncate leading-tight text-xs md:text-base">{ad.title}</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1 truncate">{ad.category?.name}</p>
                </div>
                <div>
                  <p className="text-sm md:text-lg font-bold text-vapt-blue mt-1 md:mt-2">
                    {ad.price.toLocaleString('pt-MZ')} MT
                  </p>
                  <div className="flex items-center justify-between mt-1 md:mt-2">
                    <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1 truncate">
                      <MapPin size={10} className="md:w-3 md:h-3" /> {ad.location}
                    </p>
                    {ad.favoriteCount > 0 && (
                      <p className="text-[10px] md:text-xs text-red-500 font-medium flex items-center gap-1">
                        ❤️ {ad.favoriteCount}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AnunciosPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">A carregar...</div>}>
      <AnunciosContent />
    </Suspense>
  );
}