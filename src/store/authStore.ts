import { create } from 'zustand';
import api from '@/lib/api';

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
  notifications: any[];
  unreadCount: number;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  fetchNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  addNotification: (notif: any) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  notifications: [],
  unreadCount: 0,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('vapt_token', res.data.token);
    localStorage.setItem('vapt_user', JSON.stringify(res.data));
    set({ user: res.data, token: res.data.token });
    get().fetchNotifications();
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
    set({ user: null, token: null, notifications: [], unreadCount: 0 });
  },

  loadUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('vapt_token');
      const user = localStorage.getItem('vapt_user');
      if (token && user) {
        set({ token, user: JSON.parse(user) });
        get().fetchNotifications();
      }
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      set({ 
        notifications: res.data, 
        unreadCount: res.data.filter((n: any) => !n.isRead).length 
      });
    } catch (error) {}
  },

  markNotificationsRead: async () => {
    try {
      await api.put('/notifications/read');
      set((state) => ({
        notifications: state.notifications.map(n => ({...n, isRead: true})),
        unreadCount: 0
      }));
    } catch (error) {}
  },

  addNotification: (notif: any) => {
    set((state) => ({
      notifications: [notif, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  }
}));