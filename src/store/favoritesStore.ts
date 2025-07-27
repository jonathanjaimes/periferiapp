import { create } from 'zustand';
import { getFavoritesForUser, addFavorite as addFavoriteUseCase, removeFavorite as removeFavoriteUseCase } from '../domain/usecases';
import { Geofence } from '../domain/models/Geofence';

interface FavoritesState {
  favorites: Geofence[];
  loadFavorites: (username: string) => Promise<void>;
  addFavorite: (username: string, geofence: Geofence) => Promise<void>;
  removeFavorite: (username: string, geofenceId: number) => Promise<void>;
  isFavorite: (geofenceId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loadFavorites: async (username) => {
    const data = await getFavoritesForUser(username);
    set({ favorites: data });
  },
  addFavorite: async (username, geofence) => {
    const newFavorites = await addFavoriteUseCase(username, geofence);
    set({ favorites: newFavorites });
  },
  removeFavorite: async (username, geofenceId) => {
    const newFavorites = await removeFavoriteUseCase(username, geofenceId);
    set({ favorites: newFavorites });
  },
  isFavorite: (geofenceId) => {
    return get().favorites.some(g => g.id === geofenceId);
  },
}));
