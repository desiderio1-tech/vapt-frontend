'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { MapPin, Phone, ArrowLeft, Heart, Share2, MessageCircle, Tag, Eye, Star } from 'lucide-react';

export default function AnuncioDetalhePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loadUser } = useAuthStore(); 
  
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startingChat, setStartingChat] = useState(false);
  const [isFav, setIsFav] = useState(false);
  
  // Estados para a avaliação do vendedor
  const [sellerRating, setSellerRating] = useState({ average: 0, total: 0 });

  useEffect(() => {
    loadUser();
    if (!id) return;
    
    // Registar a visita (não precisa de esperar resposta)
    api.put(`/ads/${id}/view`).catch(() => {});

    api.get(`/ads/${id}`)
      .then((res) => {
        setAd(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Anúncio não encontrado.');
        router.push('/anuncios');
      });
  }, [id, router]);

  // Ir buscar a avaliação do vendedor assim que o anúncio carregar
  useEffect(() => {
    if (ad?.user?.id) {
      api.get(`/reviews/seller/${ad.user.id}`)
        .then(res => {
          setSellerRating({ average: res.data.average, total: res.data.total });
        })
        .catch(() => {});
    }
  }, [ad]);

  if (loading) return <div className="text-center py-20 text-gray-500 animate-pulse">A carregar anúncio...</div>;
  if (!ad) return null;

  const isOwner = user?.id === ad.user.id;

  const handleContactar = async () => {
    if (!user) { toast.error('Faz login para contactar.'); router.push('/login'); return; }
    if (isOwner) { toast.error('Este é o teu anúncio.'); return; }
    setStartingChat(true);
    try {
      const res = await api.post('/chat/conversation', { receiverId: ad.user.id });
      router.push(`/mensagens/${res.data.id}`);
    } catch (error: any) {
      toast.error('Erro ao abrir chat.');
      setStartingChat(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) { toast.error('Faz login para guardar.'); router.push('/login'); return; }
    try {
      const res = await api.post(`/ads/${ad.id}/favorite`);
      setIsFav(res.data.favorited);
      setAd({ ...ad, favoriteCount: ad.favoriteCount + (res.data.favorited ? 1 : -1) });
      toast.success(res.data.favorited ? 'Guardado nos favoritos! ❤️' : 'Removido dos favoritos.');
    } catch (error) {
      toast.error('Erro ao favoritar.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-vapt-blue hover:underline mb-4 text-sm font-medium">
        <ArrowLeft size={18} /> Voltar atrás
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-100 h-96 flex items-center justify-center relative">
              {ad.images && ad.images[selectedImage] ? (
                <img src={ad.images[selectedImage]} alt={ad.title} className="w-full h-full object-contain" />
              ) : (
                <div className="text-8xl">📦</div>
              )}
              {ad.isFeatured && (
                <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-lg shadow-md">
                  ⭐ Anúncio em Destaque
                </span>
              )}
            </div>
            {ad.images && ad.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {ad.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${selectedImage === i ? 'border-vapt-blue' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl p-6 mt-6 shadow-sm">
            <h2 className="font-bold text-lg mb-3 text-vapt-dark">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{ad.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="inline-block text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                {ad.condition}
              </span>
              {ad.isTrending && (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">🔥 Em Alta</span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-vapt-dark leading-tight">{ad.title}</h1>
            <p className="text-3xl font-bold text-vapt-blue mt-3">{ad.price.toLocaleString('pt-MZ')} MT</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 mb-4 pb-4 border-b border-gray-100">
              <span className="flex items-center gap-1"><Eye size={14} /> {ad.views} visualizações</span>
              <span className="flex items-center gap-1 text-red-500 font-medium"><Heart size={14} /> {ad.favoriteCount} guardaram</span>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin size={16} /> {ad.location}</p>
              <p className="text-sm text-gray-600 flex items-center gap-2"><Tag size={16} /> {ad.category?.name}</p>
            </div>

            <div className="space-y-2">
              {isOwner ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-sm text-blue-800">
                  Este é o teu anúncio.
                </div>
              ) : (
                <button onClick={handleContactar} disabled={startingChat}
                  className="w-full bg-vapt-green hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <MessageCircle size={18} /> {startingChat ? 'A abrir chat...' : 'Conversar com o Vendedor'}
                </button>
              )}
              
              <button onClick={handleFavorite}
                className={`w-full font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition border ${
                  isFav ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 border-gray-200 text-vapt-dark hover:bg-gray-100'
                }`}
              >
                <Heart size={18} className={isFav ? 'fill-red-600' : ''} /> 
                {isFav ? 'Guardado' : 'Guardar Anúncio'}
              </button>
              
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copiado!'); }}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-vapt-dark font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Share2 size={18} /> Partilhar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-vapt-dark">Vendedor</h3>
            <div className="flex items-center gap-3">
              <div className="bg-vapt-blue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                {ad.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-vapt-dark">{ad.user.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {ad.user.city || 'Moçambique'}</p>
                
                {/* AVALIAÇÃO DO VENDEDOR */}
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-gray-700">{sellerRating.average}</span>
                  <span className="text-xs text-gray-500">({sellerRating.total} avaliações)</span>
                </div>
              </div>
            </div>
            {ad.user.phone && !isOwner && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <Phone size={14} className="text-vapt-green" /> {ad.user.phone}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}