'use client'; // Necessário para usares o alert/onClick

import Link from 'next/link';
import toast from 'react-hot-toast';
import { Download, Smartphone } from 'lucide-react';

export default function Footer() {
  
  const handleInstallAndroid = () => {
    toast.success('Para instalar no Android:\n1. Abre o menu do Chrome (3 pontos).\n2. Clica em "Instalar aplicação".', { 
      duration: 6000, 
      icon: '🤖' 
    });
  };

  const handleInstalliOS = () => {
    toast.success('Para instalar no iPhone:\n1. Clica no botão Partilhar do Safari.\n2. Escolhe "Adicionar ao ecrã principal".', { 
      duration: 6000, 
      icon: '🍎' 
    });
  };

  return (
    <footer className="bg-vapt-blue text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* ... (Mantém as colunas 1, 2 e 3 iguais) ... */}

        {/* COLUNA 4 - INSTALAR APP */}
        <div>
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Smartphone size={18} /> Instala o VAPT
          </h4>
          <p className="text-sm text-blue-200 mb-4">
            Adiciona o VAPT ao ecrã inicial do teu telemóvel e usa como uma app nativa.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleInstallAndroid}
              className="flex-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download size={14} /> Android
            </button>
            <button 
              onClick={handleInstalliOS}
              className="flex-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download size={14} /> iOS
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-blue-200">
        © 2026 VAPT — Feito em Moçambique 🇲🇿 | Usados hoje, valem amanhã.
      </div>
    </footer>
  );
}