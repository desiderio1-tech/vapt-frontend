'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Users, Package, MessageSquare, DollarSign, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, loadUser, token } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'stats' | 'users' | 'ads'>('stats');

  useEffect(() => {
    loadUser();
    if (!token) {
      router.push('/login');
      return;
    }

    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/ads'),
    ])
      .then(([statsRes, usersRes, adsRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setAds(adsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          toast.error('Acesso restrito a administradores.');
          router.push('/');
        }
        setLoading(false);
      });
  }, [token, router]);

  if (loading) return <div className="text-center py-20">A carregar painel de admin...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <ShieldAlert size={32} className="text-red-600" />
        <h1 className="text-3xl font-bold text-gray-800">Painel de Administração</h1>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('stats')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === 'stats' ? 'bg-vapt-blue text-white' : 'bg-white text-gray-600'}`}>Visão Geral</button>
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === 'users' ? 'bg-vapt-blue text-white' : 'bg-white text-gray-600'}`}>Utilizadores ({users.length})</button>
        <button onClick={() => setTab('ads')} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === 'ads' ? 'bg-vapt-blue text-white' : 'bg-white text-gray-600'}`}>Anúncios ({ads.length})</button>
      </div>

      {/* CONTEÚDO: STATS */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Users className="text-blue-500 mb-2" size={24} />
            <p className="text-sm text-gray-500">Utilizadores</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Package className="text-green-500 mb-2" size={24} />
            <p className="text-sm text-gray-500">Anúncios Ativos</p>
            <p className="text-3xl font-bold">{stats.totalActiveAds}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <MessageSquare className="text-purple-500 mb-2" size={24} />
            <p className="text-sm text-gray-500">Mensagens</p>
            <p className="text-3xl font-bold">{stats.totalMessages}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <DollarSign className="text-yellow-500 mb-2" size={24} />
            <p className="text-sm text-gray-500">Receita (Vendidos)</p>
            <p className="text-2xl font-bold text-vapt-green">{stats.revenue.toLocaleString('pt-MZ')} MT</p>
          </div>
        </div>
      )}

      {/* CONTEÚDO: USERS */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Cidade</th>
                <th className="p-4 font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">{u.name} {u.role === 'admin' && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Admin</span>}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.city || '-'}</td>
                  <td className="p-4">
                    <button onClick={() => {}} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Apagar"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTEÚDO: ADS */}
      {tab === 'ads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map(ad => (
            <div key={ad.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
              <img src={ad.images[0]} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-bold truncate">{ad.title}</h3>
                <p className="text-sm text-vapt-blue font-bold">{ad.price} MT</p>
                <p className="text-xs text-gray-500">Por: {ad.user.name}</p>
                <button onClick={async () => {
                  if(confirm('Apagar este anúncio?')) {
                    await api.delete(`/admin/ads/${ad.id}`);
                    setAds(ads.filter(a => a.id !== ad.id));
                    toast.success('Apagado.');
                  }
                }} className="text-red-500 text-xs mt-2 font-semibold hover:underline">Apagar Anúncio</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}