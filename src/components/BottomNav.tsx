'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Plus, Heart, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user || pathname === '/login' || pathname === '/registo') return null;

  const navItems = [
    { name: 'Início', icon: Home, path: '/' },
    { name: 'Categorias', icon: Grid, path: '/anuncios' },
    { name: 'Publicar', icon: Plus, path: '/criar-anuncio', isPrimary: true },
    { name: 'Favoritos', icon: Heart, path: '/favoritos' },
    { name: 'Perfil', icon: User, path: '/painel' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 relative">
        
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          // O Botão Central "Publicar"
          if (item.isPrimary) {
            return (
              <Link
                key={item.name}
                href={item.path}
                className="absolute -top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center"
              >
                <div className="bg-vapt-green text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white hover:scale-105 transition">
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold text-vapt-green mt-1">Publicar</span>
              </Link>
            );
          }

          // Outros Ícones
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-vapt-green' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}