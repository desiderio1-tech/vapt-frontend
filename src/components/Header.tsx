'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, PlusCircle, LogOut, Heart, Bell, MapPin, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const router = useRouter();
  const { user, logout, loadUser, notifications, unreadCount, fetchNotifications, markNotificationsRead } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(`/anuncios?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="bg-vapt-blue text-white sticky top-0 z-50 shadow-md">
      {/* TOPO: Logo, Localização, Notificações */}
      <div className="max-w-7xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="text-3xl font-black italic tracking-tighter text-white flex items-center gap-1">
            <span className="text-vapt-green text-4xl">🛒</span> VAPT
          </div>
        </Link>

        {/* LOCALIZAÇÃO (Escondido no telemóvel se não houver espaço) */}
        {user?.city && (
          <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-100">
            <MapPin size={16} className="text-vapt-green" />
            {user.city}
            <ChevronDown size={14} />
          </div>
        )}

        {/* ÍCONES À DIREITA */}
        <div className="flex items-center gap-3">
          {/* Notificações */}
          {user && (
            <div className="relative">
              <button onClick={() => { setShowNotif(!showNotif); if(unreadCount > 0) markNotificationsRead(); }} className="relative hover:opacity-80 transition">
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-vapt-blue">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Favoritos */}
          <Link href="/favoritos" className="hover:opacity-80 transition hidden sm:block">
            <Heart size={24} />
          </Link>

          {/* Perfil / Login */}
          {user ? (
            <Link href="/painel" className="bg-white text-vapt-blue p-1.5 rounded-full hover:bg-gray-100 transition">
              <User size={20} />
            </Link>
          ) : (
            <Link href="/login" className="bg-vapt-green text-white px-4 py-1.5 rounded-lg text-sm font-bold">
              Entrar
            </Link>
          )}
        </div>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="max-w-7xl mx-auto px-4 pb-3">
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full overflow-hidden shadow-sm">
          <div className="pl-4 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar produtos, categorias..."
            className="flex-1 px-3 py-2.5 text-vapt-dark outline-none text-sm placeholder-gray-400"
          />
          <button type="submit" className="bg-vapt-green hover:bg-green-700 px-6 py-2.5 text-white font-semibold transition m-1 rounded-full">
            <Search size={20} className="hidden sm:block" />
            <span className="sm:hidden">Ir</span>
          </button>
        </form>
      </div>
    </header>
  );
}