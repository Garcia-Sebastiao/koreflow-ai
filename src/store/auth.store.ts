import { create } from 'zustand';
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import type { User } from '@/types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!parseCookies()['koreflow.token'], 

  setUser: (user, token) => {
    if (token) {
      setCookie(null, 'koreflow.token', token, {
        maxAge: 30 * 24 * 60 * 60, 
        path: '/',
      });
    }
    set({ user, isAuthenticated: !!user });
  },

  logout: () => {
    destroyCookie(null, 'koreflow.token');
    set({ user: null, isAuthenticated: false });
  },
}));