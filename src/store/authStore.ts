import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('vapt_token', res.data.token);
    localStorage.setItem('vapt_user', JSON.stringify(res.data));
    set({ user: res.data, token: res.data.token });
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('vapt_token', res.data.token);
    localStorage.setItem('vapt_user', JSON.stringify(res.data));
    set({ user: res.data, token: res.data.token });
  },

  logout: () => {
    localStorage.removeItem('vapt_token');
    localStorage.removeItem('vapt_user');
    set({ user: null, token: null });
  },

  loadUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('vapt_token');
      const user = localStorage.getItem('vapt_user');
      if (token && user) {
        set({ token, user: JSON.parse(user) });
      }
    }
  },
}));