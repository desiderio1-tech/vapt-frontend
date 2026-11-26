'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, LogOut, Heart, Bell, MapPin, ChevronDown, Menu, X, Users, ShieldAlert, MessageSquare, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const router = useRouter();
  const { user, logout, loadUser, notifications, unreadCount, fetchNotifications, markNotificationsRead } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Estado do menu lateral

  useEffect(() => {
    loadUser();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(`/anuncios?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      <header className="bg-vapt-blue text-white sticky top-0 z-50 shadow-md">
        {/* TOPO */}
        <div className="max-w-7xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-3">
            {/* BOTÃO DOS 3 TRAÇOS */}
            <button onClick={() => setMenuOpen(true)} className="hover:bg-white/10 p-1 rounded-lg transition">
              <Menu size={28} />
            </button>

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="text-3xl font-black italic tracking-tighter text-white flex items-center gap-1">
                <span className="text-vapt-green text-4xl">🛒</span> VAPT
              </div>
            </Link>
          </div>

          {/* ÍCONES À DIREITA */}
          <div className="flex items-center gap-3">
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

            <Link href="/favoritos" className="hover:opacity-80 transition hidden sm:block">
              <Heart size={24} />
            </Link>

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

      {/* MENU LATERAL (SIDEBAR) */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Fundo escuro */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)}></div>
          
          {/* Conteúdo do Menu */}
          <div className="relative w-80 max-w-[80%] bg-white h-full shadow-2xl flex flex-col animate-slide-right">
            <div className="bg-vapt-blue p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-200">Bem-vindo,</p>
                <p className="font-bold text-lg">{user ? user.name.split(' ')[0] : 'Visitante'}</p>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium">
                <span className="text-xl">🏠</span> Início
              </Link>
              <Link href="/explorar" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium">
                <span className="text-xl">🧭</span> Explorar Feed
              </Link>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              {user ? (
                <>
                  <Link href="/criar-anuncio" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium">
                    <PlusCircle size={20} className="text-vapt-green" /> Publicar Anúncio
                  </Link>
                  <Link href="/mensagens" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium">
                    <MessageSquare size={20} className="text-blue-500" /> Mensagens
                  </Link>
                </>
              ) : null}

              <div className="border-t border-gray-100 my-2"></div>

              {/* BOTÃO DO SISTEMA DE AFILIADOS */}
              <Link href="/afiliados" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium">
                <Users size={20} className="text-orange-500" /> 
                <div className="flex flex-col">
                  <span>Programa de Afiliados</span>
                  <span className="text-xs text-vapt-green font-bold">Ganha dinheiro!</span>
                </div>
              </Link>

              {user?.role === 'admin' && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-red-600 font-medium">
                  <ShieldAlert size={20} /> Painel Admin
                </Link>
              )}
            </div>

            {user && (
              <div className="p-4 border-t border-gray-100">
                <button onClick={() => { logout(); setMenuOpen(false); router.push('/'); }} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition">
                  <LogOut size={18} /> Terminar Sessão
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}