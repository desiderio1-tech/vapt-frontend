'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, PlusCircle, LogOut, MessageSquare, Heart, Compass, Bell } from 'lucide-react';
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
    if (searchTerm.trim()) {
      router.push(`/anuncios?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleOpenNotifs = () => {
    setShowNotif(!showNotif);
    if (!showNotif && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  return (
    <header className="bg-vapt-blue text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-white text-vapt-blue font-extrabold text-2xl px-3 py-1 rounded">V</div>
          <span className="text-2xl font-extrabold tracking-tight hidden sm:block">VAPT</span>
        </Link>

        {/* BARRA DE PESQUISA */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center bg-white rounded-lg overflow-hidden">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="O que você procura?"
            className="flex-1 px-4 py-2 text-vapt-dark outline-none text-sm"
          />
          <button type="submit" className="bg-vapt-green hover:bg-green-700 px-4 py-2 text-white transition">
            <Search size={18} />
          </button>
        </form>

        {/* BOTÕES DESKTOP */}
        <div className="hidden md:flex items-center gap-2">
          
          <Link href="/explorar" className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm">
            <Compass size={18} /> Explorar
          </Link>

          {user ? (
            <>
              {/* NOTIFICAÇÕES */}
              <div className="relative">
                <button onClick={handleOpenNotifs} className="relative hover:bg-white/10 p-2 rounded-lg transition text-gray-200 hover:text-white" title="Notificações">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* DROPDOWN */}
                {showNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-100 font-bold text-vapt-blue flex justify-between items-center">
                      <span>Notificações</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-gray-500">Sem notificações.</p>
                      ) : (
                        notifications.map((n: any) => (
                          <Link 
                            key={n.id} 
                            href={n.link || '#'} 
                            onClick={() => setShowNotif(false)}
                            className={`block p-4 border-b border-gray-50 hover:bg-gray-50 transition ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                          >
                            <p className="text-sm font-bold text-vapt-dark">{n.title}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/favoritos" className="hover:bg-white/10 px-3 py-2 rounded-lg transition text-gray-200 hover:text-white" title="Favoritos">
                <Heart size={18} />
              </Link>

              <Link href="/mensagens" className="hover:bg-white/10 px-3 py-2 rounded-lg transition text-gray-200 hover:text-white" title="Mensagens">
                <MessageSquare size={18} />
              </Link>

              <Link href="/criar-anuncio" className="flex items-center gap-2 bg-vapt-green hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-sm transition">
                <PlusCircle size={18} /> Vender
              </Link>
              
              <Link href="/painel" className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg text-sm transition">
                <User size={18} /> {user.name.split(' ')[0]}
              </Link>
              
              <button onClick={handleLogout} className="hover:bg-white/10 px-3 py-2 rounded-lg transition text-gray-300 hover:text-white" title="Sair">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition">Entrar</Link>
              <Link href="/registo" className="bg-vapt-green hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-sm transition">Criar conta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}