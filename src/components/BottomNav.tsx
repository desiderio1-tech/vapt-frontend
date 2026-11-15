'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Não mostrar a barra se não estiver logado ou se estiver em páginas de login/registo
  if (!user || pathname === '/login' || pathname === '/registo') return null;

  const navItems = [
    { name: 'Início', icon: Home, path: '/' },
    { name: 'Explorar', icon: Compass, path: '/explorar' },
    { name: 'Vender', icon: PlusCircle, path: '/criar-anuncio', isPrimary: true },
    { name: 'Chat', icon: MessageSquare, path: '/mensagens' },
    { name: 'Perfil', icon: User, path: '/painel' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          // Ícone Central (Vender) destaca-se
          if (item.isPrimary) {
            return (
              <Link
                key={item.name}
                href={item.path}
                className="flex items-center justify-center bg-vapt-green text-white w-12 h-12 rounded-full -mt-6 shadow-lg border-4 border-white transform hover:scale-105 transition"
              >
                <Icon size={24} />
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-vapt-blue' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}