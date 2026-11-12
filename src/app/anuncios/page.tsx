'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';

function AnunciosContent() {
  const searchParams = useSearchParams();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '');

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
  }, [categoria]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAds();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* CABEÇALHO */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-vapt-blue">Todos os anúncios</h1>
        <p className="text-gray-500 mt-1">Encontra o que precisas em todo Moçambique.</p>
      </div>

      {/* PESQUISA */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="flex-1 flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por título ou descrição..."
            className="flex-1 px-4 py-3 outline-none text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-vapt-blue hover:bg-vapt-lightBlue text-white px-6 rounded-lg font-semibold flex items-center gap-2"
        >
          <Search size={18} /> Pesquisar
        </button>
      </form>

      {/* FILTROS DE CATEGORIA */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        <button
          onClick={() => setCategoria('')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition ${
            categoria === '' ? 'bg-vapt-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategoria(cat.name)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition ${
              categoria === cat.name ? 'bg-vapt-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* LISTA */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">A carregar anúncios...</div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700">Nenhum anúncio encontrado</h3>
          <p className="text-gray-500 mt-2">Tenta ajustar a tua pesquisa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ads.map((ad) => (
            <Link
              key={ad.id}
              href={`/anuncios/${ad.id}`}
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition group"
            >
              <div className="h-44 bg-gray-100 overflow-hidden">
                {ad.images && ad.images[0] ? (
                  <img
                    src={ad.images[0]}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {ad.condition}
                  </span>
                </div>
                <h3 className="font-semibold text-vapt-dark truncate">{ad.title}</h3>
                <p className="text-lg font-bold text-vapt-blue mt-1">
                  {ad.price.toLocaleString('pt-MZ')} MT
                </p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <MapPin size={12} /> {ad.location}
                </p>
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