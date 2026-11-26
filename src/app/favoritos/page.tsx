'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFavorites, toggleFavorite, FavoriteAd } from '@/lib/favorites';
import { MapPin, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<FavoriteAd[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setMounted(true);
  }, []);

  const removeFavorite = (id: string) => {
    const adToRemove = favorites.find(a => a.id === id);
    if (adToRemove) {
      toggleFavorite(adToRemove);
      setFavorites(getFavorites());
      toast.success('Removido dos favoritos.');
    }
  };

  if (!mounted) return null; 

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-vapt-blue mb-6">Os meus favoritos</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto">
          <div className="text-7xl mb-4">💔</div>
          <h3 className="text-2xl font-bold text-vapt-dark mb-2">Sem favoritos</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Guarda os produtos que mais gostas para os encontrares mais tarde.
          </p>
          <Link href="/explorar" className="inline-block bg-vapt-blue hover:bg-vapt-lightBlue text-white font-bold px-8 py-3 rounded-xl transition shadow-md">
            Explorar Feed
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {favorites.map((ad) => (
            <div key={ad.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition">
              <Link href={`/anuncios/${ad.id}`} className="h-44 bg-gray-100 overflow-hidden relative block">
                {ad.image ? (
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                )}
                <span className="absolute top-2 left-2 bg-white/90 text-xs font-bold text-vapt-blue px-2 py-1 rounded-md shadow-sm">
                  {ad.condition}
                </span>
              </Link>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <Link href={`/anuncios/${ad.id}`}>
                  <h3 className="font-semibold text-vapt-dark truncate">{ad.title}</h3>
                </Link>
                <div>
                  <p className="text-lg font-bold text-vapt-blue mt-2">
                    {ad.price.toLocaleString('pt-MZ')} MT
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} /> {ad.location}
                    </p>
                    <button
                      onClick={() => removeFavorite(ad.id)}
                      className="text-red-400 hover:text-red-600 p-1.5 bg-red-50 rounded-lg transition"
                      title="Remover dos favoritos"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}