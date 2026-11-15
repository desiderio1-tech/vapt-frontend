'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, PlusCircle, LogOut, Menu, X, MessageSquare, Heart, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const router = useRouter();
  const { user, logout, loadUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/anuncios?search=${encodeURIComponent(searchTerm)}`);
      setMenuOpen(false); 
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-vapt-blue text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-white text-vapt-blue font-extrabold text-2xl px-3 py-1 rounded">V</div>
          <span className="text-2xl font-extrabold tracking-tight hidden sm:block">VAPT</span>
        </Link>

        {/* BARRA DE PESQUISA */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white rounded-lg overflow-hidden">
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
          
          {/* BOTÃO EXPLORAR (Sempre visível) */}
          <Link 
            href="/explorar" 
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm"
          >
            <Compass size={18} /> Explorar
          </Link>

          {user ? (
            <>
              {/* FAVORITOS */}
              <Link href="/favoritos" className="hover:bg-white/10 px-3 py-2 rounded-lg transition text-gray-200 hover:text-white" title="Favoritos">
                <Heart size={18} />
              </Link>

              {/* MENSAGENS */}
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

        {/* BOTÃO MENU MOBILE */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="md:hidden bg-vapt-lightBlue px-4 py-3 flex flex-col gap-2 border-t border-white/10">
          
          {/* BOTÃO EXPLORAR MOBILE */}
          <Link 
            href="/explorar" 
            onClick={() => setMenuOpen(false)} 
            className="flex items-center gap-2 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg px-3 font-bold text-white mb-2"
          >
            <Compass size={18} /> Explorar Feed
          </Link>

          {user ? (
            <>
              <Link href="/favoritos" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 hover:bg-white/10 rounded-lg px-3">
                <Heart size={18} /> Favoritos
              </Link>
              <Link href="/mensagens" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 hover:bg-white/10 rounded-lg px-3">
                <MessageSquare size={18} /> Mensagens
              </Link>
              <Link href="/criar-anuncio" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 hover:bg-white/10 rounded-lg px-3">
                <PlusCircle size={18} /> Vender
              </Link>
              <Link href="/painel" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 hover:bg-white/10 rounded-lg px-3">
                <User size={18} /> {user.name}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 py-2 hover:bg-white/10 rounded-lg px-3 text-left">
                <LogOut size={18} /> Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2 hover:bg-white/10 rounded-lg px-3">Entrar</Link>
              <Link href="/registo" onClick={() => setMenuOpen(false)} className="py-2 bg-vapt-green rounded-lg px-3 font-semibold text-center mt-2">Criar conta</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}