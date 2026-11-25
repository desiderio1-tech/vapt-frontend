'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(!!sub);
      });
    }
  }, []);

  const subscribe = async () => {
    if (!('serviceWorker' in navigator)) return toast.error('Browser não suporta notificações.');
    
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Permissão negada.');
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      await api.post('/push/subscribe', sub.toJSON());
      setIsSubscribed(true);
      toast.success('Notificações ativadas! 🔔');
    } catch (error) {
      toast.error('Erro ao ativar notificações.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed) return <span className="text-xs text-green-600 flex items-center gap-1"><Bell size={12}/> Notificações ON</span>;

  return (
    <button onClick={subscribe} disabled={loading} className="text-xs bg-vapt-green text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
      <Bell size={14} /> Ativar Notificações
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}