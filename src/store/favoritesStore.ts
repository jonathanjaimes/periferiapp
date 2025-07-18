import { create } from 'zustand';
import { getFavoritesForUser, addFavorite as addFavoriteUseCase, removeFavorite as removeFavoriteUseCase } from '../domain/usecases';
import { User } from '../domain/models/User';

interface FavoritesState {
  favorites: User[];
  loadFavorites: (username: string) => Promise<void>;
  addFavorite: (username: string, user: User) => Promise<void>;
  removeFavorite: (username: string, userId: number) => Promise<void>;
  isFavorite: (userId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loadFavorites: async (username) => {
    const data = await getFavoritesForUser(username);
    set({ favorites: data });
  },
  addFavorite: async (username, user) => {
    const newFavorites = await addFavoriteUseCase(username, user);
    set({ favorites: newFavorites });
  },
  removeFavorite: async (username, userId) => {
    const newFavorites = await removeFavoriteUseCase(username, userId);
    set({ favorites: newFavorites });
  },
  isFavorite: (userId) => {
    return get().favorites.some(u => u.id === userId);
  },
}));
