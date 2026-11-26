'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { Download, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // O Chrome do Android dispara este evento quando o site está pronto para ser instalado
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    // Se o browser Android suportar instalação nativa
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('VAPT instalado com sucesso!');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: Se for iPhone ou o browser não suportar
      toast('Para instalar, usa o menu do teu browser e escolhe "Adicionar ao ecrã inicial".', {
        icon: '📲',
        duration: 6000,
      });
    }
  };

  return (
    <footer className="bg-vapt-blue text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ... (As tuas 3 colunas anteriores mantêm-se) ... */}
        
        {/* COLUNA 4 - INSTALAR APP */}
        <div>
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Smartphone size={18} /> Instala o VAPT
          </h4>
          <p className="text-sm text-blue-200 mb-4">
            Adiciona o VAPT ao teu telemóvel para uma experiência mais rápida.
          </p>
          
          <button 
            onClick={handleInstall}
            className="w-full bg-vapt-green hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition shadow-md"
          >
            <Download size={18} /> Instalar Aplicação
          </button>
          
          <p className="text-[10px] text-blue-300 mt-3 text-center">
            Funciona no Android e iOS (via menu do browser).
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-blue-200">
        © 2026 VAPT — Feito em Moçambique 🇲🇿 | Usados hoje, valem amanhã.
      </div>
    </footer>
  );
}