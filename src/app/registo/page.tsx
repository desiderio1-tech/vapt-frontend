'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react';

export default function RegistoPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Conta criada com sucesso! Bem-vindo ao VAPT 🎉');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao criar conta.');
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
          <h1 className="text-2xl font-bold text-vapt-blue">Criar conta</h1>
          <p className="text-gray-500 text-sm mt-1">Junta-te à comunidade VAPT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nome completo</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="flex-1 px-3 py-2.5 outline-none text-sm"
                placeholder="Ex: Carlos Mabjaia"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="flex-1 px-3 py-2.5 outline-none text-sm"
                placeholder="teu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="flex-1 px-3 py-2.5 outline-none text-sm"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Telefone</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue">
                <Phone size={16} className="text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="flex-1 px-2 py-2.5 outline-none text-sm"
                  placeholder="84 000 0000"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Cidade</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-vapt-blue">
                <MapPin size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="flex-1 px-2 py-2.5 outline-none text-sm"
                  placeholder="Maputo"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vapt-green hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? 'A criar conta...' : 'Criar conta grátis'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tens conta?{' '}
          <Link href="/login" className="text-vapt-blue font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}