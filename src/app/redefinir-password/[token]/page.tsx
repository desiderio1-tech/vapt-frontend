'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

export default function RedefinirPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As passwords não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/resetpassword/${token}`, { password });
      toast.success('Password redefinida com sucesso! Faz login agora.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao redefinir a password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-vapt-gray">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-vapt-blue text-white font-extrabold text-3xl w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-vapt-blue">Nova password</h1>
          <p className="text-gray-500 text-sm mt-1">
            Escolhe uma nova password para a tua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nova password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-3 py-2.5 outline-none text-sm"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Confirmar password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 px-3 py-2.5 outline-none text-sm"
                placeholder="Repete a password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vapt-green hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? 'A redefinir...' : 'Redefinir password'}
          </button>
        </form>
      </div>
    </div>
  );
}