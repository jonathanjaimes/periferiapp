import { useFavoritesStore } from '../store/favoritesStore';
import { useAuthStore } from '../store/authStore';
import type { Geofence } from '../domain/models/Geofence';

export function useFavoriteActions() {
  const authUser = useAuthStore(state => state.user);
  const favorites = useFavoritesStore(state => state.favorites);
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);

  const isFavorite = (geofenceId: string) =>
    favorites.some(g => g.id === geofenceId);

  const handleFavorite = async (geofenceObj: Geofence) => {
    if (!authUser) return;
    if (isFavorite(geofenceObj.id)) {
      await removeFavorite(authUser, geofenceObj);
    } else {
      await addFavorite(authUser, geofenceObj);
    }
  };

  return { isFavorite, handleFavorite, authUser };
}
