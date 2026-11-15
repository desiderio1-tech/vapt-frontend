'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { MapPin, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { toggleFavorite, isFavorite } from '@/lib/favorites';
import { useAuthStore } from '@/store/authStore';

export default function ExplorarPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get('/ads').then((res) => {
      setAds(res.data);
      setLoading(false);
    });
  }, []);

  const handleFavorite = (ad: any) => {
    if (!user) {
      toast.error('Faz login para guardar favoritos.');
      return;
    }

    const added = toggleFavorite({
      id: ad.id,
      title: ad.title,
      price: ad.price,
      image: ad.images?.[0] || '',
      location: ad.location,
      condition: ad.condition,
    });
    
    if (added) toast.success('Adicionado aos favoritos! ❤️');
    else toast.success('Removido dos favoritos.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-vapt-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-lg mx-auto px-4">
        
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-vapt-blue">Descobre o VAPT</h1>
          <span className="text-sm text-gray-500">{ads.length} produtos</span>
        </div>

        {/* FEED ESTILO INSTAGRAM */}
        <div className="space-y-8">
          {ads.map((ad) => {
            const isFav = isFavorite(ad.id);
            
            return (
              <div key={ad.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* CABEÇALHO DO POST (Vendedor) */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-vapt-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {ad.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-vapt-dark">{ad.user.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} /> {ad.location}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* IMAGEM DO PRODUTO */}
                <Link href={`/anuncios/${ad.id}`} className="block relative bg-gray-100">
                  {ad.images && ad.images[0] ? (
                    <img 
                      src={ad.images[0]} 
                      alt={ad.title} 
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center text-8xl bg-gray-100">📦</div>
                  )}
                  {/* Etiqueta do Estado */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold text-vapt-blue px-2 py-1 rounded-md shadow-sm">
                    {ad.condition}
                  </span>
                </Link>

                {/* BOTÕES DE AÇÃO (Like / Chat) */}
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <button 
                      onClick={() => handleFavorite(ad)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Heart 
                        size={28} 
                        className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-700'} 
                      />
                    </button>
                    <Link href={`/anuncios/${ad.id}`} className="hover:scale-110 transition-transform">
                      <MessageCircle size={28} className="text-gray-700" />
                    </Link>
                  </div>

                  {/* PREÇO E TÍTULO */}
                  <p className="text-2xl font-black text-vapt-green mb-1">
                    {ad.price.toLocaleString('pt-MZ')} MT
                  </p>
                  <div className="text-sm text-gray-800">
                    <span className="font-bold mr-1">{ad.user.name.split(' ')[0]}</span>
                    {ad.title}
                  </div>
                  
                  {/* CATEGORIA E LINK */}
                  <p className="text-xs text-vapt-blue mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded-md">
                    #{ad.category?.name.replace(/\s+/g, '')}
                  </p>

                  <Link 
                    href={`/anuncios/${ad.id}`}
                    className="block mt-4 text-center w-full bg-vapt-blue hover:bg-vapt-lightBlue text-white text-sm font-bold py-2.5 rounded-lg transition"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}