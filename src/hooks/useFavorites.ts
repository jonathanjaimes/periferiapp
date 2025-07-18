import { useState, useEffect } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAuthStore } from '../store/authStore';

export function useFavorites() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const favorites = useFavoritesStore(state => state.favorites);
  const loadFavorites = useFavoritesStore.getState().loadFavorites;
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);
  const isFavorite = useFavoritesStore(state => state.isFavorite);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadFavorites(user).finally(() => setLoading(false));
    }
  }, [user]);

  return {
    user,
    logout,
    favorites,
    removeFavorite,
    isFavorite,
    loading,
  };
}
