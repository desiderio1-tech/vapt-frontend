'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import PushNotificationButton from '@/components/PushNotificationButton';
import {
  PlusCircle,
  Eye,
  Trash2,
  CheckCircle,
  PauseCircle,
  BarChart3,
  MapPin,
  Tag,
  Star,
} from 'lucide-react';

export default function PainelPage() {
  const router = useRouter();
  const { user, loadUser, token } = useAuthStore();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'active' | 'sold'>('todos');

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    api
      .get('/ads/meus')
      .then((res) => {
        setAds(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error('Erro ao carregar os teus anúncios.');
      });
  }, [token, router]);

  const filteredAds = ads.filter((ad) => {
    if (filter === 'todos') return true;
    return ad.status === filter;
  });

  const stats = {
    total: ads.length,
    ativos: ads.filter((a) => a.status === 'active').length,
    vendidos: ads.filter((a) => a.status === 'sold').length,
    receita: ads
      .filter((a) => a.status === 'sold')
      .reduce((sum, a) => sum + a.price, 0),
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres apagar este anúncio? Esta ação não pode ser desfeita.')) return;

    try {
      await api.delete(`/ads/${id}`);
      setAds(ads.filter((ad) => ad.id !== id));
      toast.success('Anúncio apagado com sucesso.');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao apagar o anúncio.');
    }
  };

  const handleToggleStatus = async (ad: any) => {
    const newStatus = ad.status === 'active' ? 'sold' : 'active';
    try {
      await api.put(`/ads/${ad.id}`, { status: newStatus });
      setAds(ads.map((a) => (a.id === ad.id ? { ...a, status: newStatus } : a)));
      toast.success(newStatus === 'sold' ? 'Marcado como vendido! 🎉' : 'Anúncio reativado!');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao atualizar o estado.');
    }
  };

  const handleFeatureAd = async (ad: any) => {
    if (!confirm('Simular o pagamento de 100 MT para destacar este anúncio no topo da página inicial?')) return;
    
    try {
      await api.put(`/ads/${ad.id}`, { isFeatured: true });
      setAds(ads.map(a => a.id === ad.id ? {...a, isFeatured: true} : a));
      toast.success('Anúncio destacado com sucesso! ⭐');
    } catch (error) {
      toast.error('Erro ao destacar o anúncio.');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-vapt-blue">Painel do vendedor</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Bem-vindo, <strong>{user.name}</strong>
          </p>
        </div>
        <Link
          href="/criar-anuncio"
          className="bg-vapt-green hover:bg-green-700 text-white font-bold px-4 py-2.5 md:px-5 md:py-3 rounded-lg flex items-center gap-2 transition shadow-sm text-sm md:text-base"
        >
          <PlusCircle size={18} /> Publicar novo
        </Link>
      </div>

      {/* ATIVAR NOTIFICAÇÕES PUSH */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-vapt-blue flex items-center gap-2">
            🔔 Fica a saber tudo primeiro!
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Ativa as notificações para receberes um alerta no telemóvel quando alguém te contactar.
          </p>
        </div>
        <PushNotificationButton />
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-500">Total</span>
            <BarChart3 size={16} className="text-vapt-blue" />
          </div>
          <p className="text-xl md:text-3xl font-bold text-vapt-blue">{stats.total}</p>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-500">Ativos</span>
            <CheckCircle size={16} className="text-green-500" />
          </div>
          <p className="text-xl md:text-3xl font-bold text-green-600">{stats.ativos}</p>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-500">Vendidos</span>
            <CheckCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-xl md:text-3xl font-bold text-gray-600">{stats.vendidos}</p>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-500">Receita</span>
            <span className="text-[10px] bg-vapt-green text-white px-1.5 py-0.5 rounded font-bold">MT</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-vapt-green truncate">
            {stats.receita.toLocaleString('pt-MZ')}
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
        <button onClick={() => setFilter('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${filter === 'todos' ? 'bg-vapt-blue text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
        >
          Todos ({stats.total})
        </button>
        <button onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${filter === 'active' ? 'bg-vapt-blue text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
        >
          Ativos ({stats.ativos})
        </button>
        <button onClick={() => setFilter('sold')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${filter === 'sold' ? 'bg-vapt-blue text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
        >
          Vendidos ({stats.vendidos})
        </button>
      </div>

      {/* LISTA DE ANÚNCIOS */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">A carregar os teus anúncios...</div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-700">Sem anúncios aqui</h3>
          <p className="text-gray-500 mt-2 mb-6 text-sm md:text-base">
            {ads.length === 0 ? 'Ainda não publicaste nenhum produto. Começa agora!' : 'Não tens anúncios com este filtro.'}
          </p>
          {ads.length === 0 && (
            <Link href="/criar-anuncio" className="inline-block bg-vapt-green hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition">
              Criar o meu primeiro anúncio
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAds.map((ad) => (
            <div key={ad.id} className={`bg-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition border ${ad.isFeatured ? 'border-yellow-400' : 'border-gray-100'}`}>
              
              {/* IMAGEM */}
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                {ad.images && ad.images[0] ? (
                  <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📦</div>
                )}
                {ad.isFeatured && (
                  <span className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    ⭐ Destaque
                  </span>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${ad.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {ad.status === 'active' ? 'Ativo' : 'Vendido'}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <Tag size={10} className="md:w-3 md:h-3" /> {ad.category?.name}
                  </span>
                </div>
                <h3 className="font-bold text-base md:text-lg text-vapt-dark truncate mt-2">{ad.title}</h3>
                <p className="text-lg md:text-xl font-bold text-vapt-blue">
                  {ad.price.toLocaleString('pt-MZ')} MT
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {ad.location}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {ad.views} visitas</span>
                </div>
              </div>

              {/* AÇÕES */}
              <div className="flex sm:flex-col flex-wrap gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                
                {/* BOTÃO DESTACAR (Se não for destaque) */}
                {!ad.isFeatured && (
                  <button onClick={() => handleFeatureAd(ad)}
                    className="flex-1 sm:flex-none bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition border border-yellow-200"
                  >
                    <Star size={16} /> Destacar (100 MT)
                  </button>
                )}

                <Link href={`/anuncios/${ad.id}`}
                  className="flex-1 sm:flex-none bg-gray-50 hover:bg-gray-100 text-vapt-dark px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition border border-gray-200"
                >
                  <Eye size={16} /> Ver
                </Link>
                
                <button onClick={() => handleToggleStatus(ad)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition border ${
                    ad.status === 'active' ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                  }`}
                >
                  {ad.status === 'active' ? <><CheckCircle size={16} /> Vendido</> : <><PauseCircle size={16} /> Reativar</>}
                </button>
                
                <button onClick={() => handleDelete(ad.id)}
                  className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition border border-red-100"
                >
                  <Trash2 size={16} /> Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}