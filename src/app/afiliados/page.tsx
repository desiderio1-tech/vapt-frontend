'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Copy, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function AfiliadosPage() {
  const { user } = useAuthStore();
  
  // Link de afiliado simulado (na versão real, viria do backend)
  const affiliateCode = user ? `vapt.mz/ref=${user.id.substring(0, 6)}` : 'Faz login para teres o teu link';
  
  const handleCopy = () => {
    if (!user) {
      toast.error('Faz login para copiar o teu link!');
      return;
    }
    navigator.clipboard.writeText(`https://${affiliateCode}`);
    toast.success('Link copiado! Partilha e ganha dinheiro.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[80vh]">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-vapt-blue mb-4">Ganha dinheiro com o VAPT</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Convida os teus amigos para venderem no VAPT e recebe uma comissão por cada venda que eles fizerem.
        </p>
      </div>

      {/* CARDS EXPLICATIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-vapt-blue" />
          </div>
          <h3 className="font-bold text-lg mb-2">1. Partilha</h3>
          <p className="text-gray-500 text-sm">Partilha o teu link único com amigos no WhatsApp e Facebook.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-vapt-green" />
          </div>
          <h3 className="font-bold text-lg mb-2">2. Eles Vendem</h3>
          <p className="text-gray-500 text-sm">Os teus amigos registam-se e começam a vender os produtos deles.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign size={32} className="text-yellow-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">3. Recebes</h3>
          <p className="text-gray-500 text-sm">Ganhas 5% de comissão em cada venda que eles realizarem.</p>
        </div>
      </div>

      {/* ÁREA DO LINK */}
      <div className="bg-vapt-blue rounded-3xl p-8 text-center text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-6">O teu link de afiliado</h2>
        
        <div className="flex flex-col sm:flex-row max-w-xl mx-auto gap-2">
          <input 
            type="text" 
            readOnly 
            value={user ? `https://${affiliateCode}` : 'Inicia sessão primeiro'} 
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-xl outline-none text-center sm:text-left"
          />
          <button 
            onClick={handleCopy}
            className="bg-vapt-green hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Copy size={18} /> Copiar
          </button>
        </div>
        
        <p className="text-sm text-blue-200 mt-4">
          * O sistema de comissões e pagamentos será ativado em breve.
        </p>
      </div>

    </div>
  );
}