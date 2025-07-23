import { useFavoritesStore } from '../store/favoritesStore';
import { useAuthStore } from '../store/authStore';
import type { User } from '../domain/models/User';

export function useFavoriteActions() {
  const authUser = useAuthStore(state => state.user);
  const favorites = useFavoritesStore(state => state.favorites);
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);

  const isFavorite = (userId: number) => favorites.some(u => u.id === userId);

  const handleFavorite = async (userObj: User) => {
    if (!authUser) return;
    if (isFavorite(userObj.id)) {
      await removeFavorite(authUser, userObj.id);
    } else {
      await addFavorite(authUser, userObj);
    }
  };

  return { isFavorite, handleFavorite, authUser };
}
