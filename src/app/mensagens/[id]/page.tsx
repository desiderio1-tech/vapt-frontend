'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { getSocket } from '@/lib/socket';
import { ArrowLeft, Send } from 'lucide-react';

export default function ChatRoomPage() {
  const { id: conversationId } = useParams();
  const router = useRouter();
  const { user, loadUser, token } = useAuthStore();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // 1. Buscar histórico de mensagens
    api.get(`/chat/messages/${conversationId}`).then((res) => {
      setMessages(res.data);
      setLoading(false);
      // Descobrir quem é a outra pessoa
      if (res.data.length > 0) {
        const msg = res.data[0];
        // Como não temos o user na msg diretamente, vamos buscar as conversas
        api.get('/chat/minhas').then((convRes) => {
          const currentConv = convRes.data.find((c: any) => c.id === conversationId);
          if (currentConv) {
            const other = currentConv.users.find((u: any) => u.id !== user?.id);
            setOtherUser(other);
          }
        });
      }
    });

    // 2. Ligar ao Socket
    if (!socket.connected) socket.connect();

    socket.emit('join_room', conversationId);

    // 3. Escutar por novas mensagens
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Limpeza ao sair
    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [conversationId, token, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      text: newMessage,
      senderId: user.id,
      conversationId: conversationId as string,
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  if (loading) return <div className="text-center py-20">A carregar chat...</div>;

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white md:rounded-2xl md:shadow-lg overflow-hidden border border-gray-200 my-4">
      
      {/* CABEÇALHO */}
      <div className="bg-vapt-blue text-white p-4 flex items-center gap-3 shrink-0">
        <button onClick={() => router.push('/mensagens')} className="md:hidden">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold">
          {otherUser ? otherUser.name.charAt(0).toUpperCase() : '?'}
        </div>
        <h2 className="font-bold text-lg">{otherUser ? otherUser.name : 'Conversa'}</h2>
      </div>

      {/* MENSAGENS */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">Diz olá! 👋</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-vapt-green text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2 shrink-0">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escreve uma mensagem..."
          className="flex-1 bg-gray-100 px-4 py-3 rounded-full outline-none text-sm focus:bg-white focus:border focus:border-vapt-blue transition"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-vapt-blue hover:bg-vapt-lightBlue disabled:bg-gray-300 text-white w-12 h-12 rounded-full flex items-center justify-center transition shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}