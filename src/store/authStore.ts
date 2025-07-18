import { create } from 'zustand';
import { getUser, removeUser } from '../data/storage';
import { loginUser } from '../domain/usecases';

export interface AuthState {
  user: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  setError: (error: string | null) => set({ error }),
  user: null,
  loading: false,
  error: null,
  login: async (username: string, password: string): Promise<void> => {
    set({ loading: true, error: null });
    try {
      // Validación estricta: solo usuario admin y contraseña 1234
      if (username !== 'admin' || password !== '1234') {
        set({ error: 'Usuario o contraseña incorrectos', loading: false });
        return;
      }
      await loginUser(username);
      set({ user: username, loading: false });
    } catch (error) {
      set({ error: 'Error al iniciar sesión', loading: false });
    }
  },
  logout: async (): Promise<void> => {
    try {
      await removeUser();
      set({ user: null });
    } catch (error) {
      set({ error: 'Error al cerrar sesión' });
    }
  },
  loadUser: async (): Promise<void> => {
    set({ loading: true });
    try {
      const user = await getUser();
      set({ user, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar usuario', loading: false });
    }
  },
}));

