import { create } from 'zustand';
import {
  getUserFavorites,
  addFavorite as addFavoriteUseCase,
  removeFavorite as removeFavoriteUseCase,
} from '../domain/usecases';
import { Geofence } from '../domain/models/Geofence';

interface FavoritesState {
  favorites: Geofence[];
  loadFavorites: (username: string) => Promise<void>;
  addFavorite: (username: string, geofence: Geofence) => Promise<void>;
  removeFavorite: (username: string, geofence: Geofence) => Promise<void>;
  isFavorite: (geofence: Geofence) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loadFavorites: async username => {
    const data = await getUserFavorites(username);
    set({ favorites: data });
  },
  addFavorite: async (username, geofence) => {
    const newFavorites = await addFavoriteUseCase(username, geofence);
    set({ favorites: newFavorites });
  },
  removeFavorite: async (username, geofence) => {
    const newFavorites = await removeFavoriteUseCase(username, geofence);
    set({ favorites: newFavorites });
  },
  isFavorite: geofence => {
    return get().favorites.some(g => g.id === geofence.id);
  },
}));
