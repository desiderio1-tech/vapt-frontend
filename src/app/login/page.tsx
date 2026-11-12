'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Bem-vindo de volta! 👋');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-vapt-gray">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-vapt-blue text-white font-extrabold text-3xl w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            V
          </div>
          <h1 className="text-2xl font-bold text-vapt-blue">Entrar</h1>
          <p className="text-gray-500 text-sm mt-1">Acede à tua conta VAPT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue transition">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="flex-1 px-3 py-2.5 outline-none text-sm bg-transparent"
                placeholder="teu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue transition">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="flex-1 px-3 py-2.5 outline-none text-sm bg-transparent"
                placeholder="A tua password"
              />
            </div>
            {/* LINK DE RECUPERAÇÃO AQUI */}
            <div className="flex justify-end mt-2">
              <Link 
                href="/esqueci-password" 
                className="text-xs text-vapt-blue hover:underline font-medium"
              >
                Esqueci-me da password
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vapt-blue hover:bg-vapt-lightBlue disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ainda não tens conta?{' '}
          <Link href="/registo" className="text-vapt-blue font-semibold hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}