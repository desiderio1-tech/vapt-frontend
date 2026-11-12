'use client';

import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function EsqueciPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgotpassword', { email });
      setSent(true);
      toast.success('Email enviado! Verifica a tua caixa de entrada.');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao enviar o email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-vapt-gray">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <Link href="/login" className="text-sm text-gray-500 hover:text-vapt-blue flex items-center gap-1 mb-6">
          <ArrowLeft size={16} /> Voltar ao login
        </Link>

        <div className="text-center mb-8">
          <div className="bg-vapt-blue text-white font-extrabold text-3xl w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-vapt-blue">Recuperar password</h1>
          <p className="text-gray-500 text-sm mt-1">
            Insere o teu email e enviamos-te um link para criares uma nova password.
          </p>
        </div>

        {sent ? (
          <div className="text-center bg-green-50 text-green-700 p-6 rounded-xl">
            <p className="font-bold mb-2">Verifica o teu email!</p>
            <p className="text-sm">Enviámos um link de recuperação para <strong>{email}</strong>. Não te esqueças de ver a pasta de Spam.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2.5 outline-none text-sm"
                  placeholder="teu@email.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vapt-blue hover:bg-vapt-lightBlue disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'A enviar...' : 'Enviar link de recuperação'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}