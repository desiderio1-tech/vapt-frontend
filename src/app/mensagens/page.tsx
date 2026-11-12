'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { MessageCircle } from 'lucide-react';

export default function MensagensPage() {
  const router = useRouter();
  const { user, loadUser, token } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    if (!token) {
      router.push('/login');
      return;
    }

    api.get('/chat/minhas')
      .then((res) => {
        setConversations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token, router]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-vapt-blue mb-6">As minhas mensagens</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-500">A carregar conversas...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-700">Ainda não tens mensagens</h3>
          <p className="text-gray-500 mt-2">
            Quando contactares um vendedor, a conversa vai aparecer aqui.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {conversations.map((conv) => {
            // Encontrar a outra pessoa na conversa (não eu)
            const otherUser = conv.users.find((u: any) => u.id !== user.id);
            const lastMessage = conv.messages[0];

            return (
              <Link
                key={conv.id}
                href={`/mensagens/${conv.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 transition"
              >
                <div className="bg-vapt-blue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  {otherUser?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-vapt-dark">{otherUser?.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage ? lastMessage.text : 'Nova conversa'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}