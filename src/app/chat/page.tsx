'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { user, loadUser } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchConversations() {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-vapt-blue hover:underline mb-6">
        <ArrowLeft size={18} /> Voltar
      </Link>

      <h1 className="text-2xl font-bold text-vapt-blue mb-6">As minhas conversas</h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500">A carregar conversas...</p>
        ) : conversations.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-bold text-vapt-dark mb-2">Ainda não tens conversas</p>
            <p className="text-gray-500 mb-6">
              Explora anúncios e contacta vendedores para começar.
            </p>
            <Link
              href="/anuncios"
              className="inline-block bg-vapt-green text-white px-6 py-3 rounded-lg font-bold"
            >
              Explorar anúncios
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conv) => (
              <Link
                key={conv.user.id}
                href={`/chat/${conv.user.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12 rounded-full bg-vapt-blue text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {conv.user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-vapt-dark truncate">{conv.user.name}</p>
                    {conv.unread > 0 && (
                      <span className="bg-vapt-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  {conv.ad && (
                    <p className="text-xs text-vapt-blue truncate mt-1">
                      📦 {conv.ad.title}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}