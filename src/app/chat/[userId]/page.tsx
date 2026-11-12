'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, Send } from 'lucide-react';

export default function ConversationPage() {
  const { userId } = useParams();
  const router = useRouter();
  const { user, loadUser } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUser();
  }, []);

  // Buscar mensagens
  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchOtherUser() {
      try {
        // Vamos buscar as mensagens e extrair o nome do interlocutor
        const res = await api.get(`/messages/${userId}`);
        setMessages(res.data);

        // Procurar o interlocutor nas mensagens
        const msgWithOther = res.data.find(
          (m: any) => m.senderId === userId || m.receiverId === userId
        );
        if (msgWithOther) {
          const other = msgWithOther.senderId === userId ? msgWithOther.sender : msgWithOther.receiver;
          setOtherUser(other);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchOtherUser();

    // Polling a cada 5 segundos para novas mensagens
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId, user]);

  // Scroll para o fim quando há novas mensagens
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post('/messages', {
        receiverId: userId,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user || loading) {
    return <p className="text-center py-16 text-gray-500">A carregar conversa...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-200px)] flex flex-col">
      {/* CABEÇALHO */}
      <div className="bg-white rounded-t-2xl border-b px-4 py-3 flex items-center gap-3">
        <Link href="/chat" className="text-gray-500 hover:text-vapt-blue">
          <ArrowLeft size={20} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-vapt-blue text-white flex items-center justify-center font-bold">
          {otherUser?.name?.charAt(0) || '?'}
        </div>
        <div>
          <p className="font-bold text-vapt-dark">{otherUser?.name || 'Utilizador'}</p>
          <p className="text-xs text-gray-500">Conversa em tempo real</p>
        </div>
      </div>

      {/* MENSAGENS */}
      <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            Ainda não há mensagens. Começa a conversa!
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isMine
                      ? 'bg-vapt-blue text-white rounded-br-sm'
                      : 'bg-white text-vapt-dark border rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                  <div className={`text-[10px] mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString('pt-MZ', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="bg-white rounded-b-2xl border-t p-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escreve uma mensagem..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-vapt-blue"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-vapt-blue hover:bg-vapt-lightBlue disabled:opacity-50 text-white p-3 rounded-full transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}