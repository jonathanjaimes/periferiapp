import { useRoute } from '@react-navigation/native';
import { useUserDetailQuery } from '../data/api';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAuthStore } from '../store/authStore';
import type { User } from '../domain/models/User';

export function useUserDetail(): {
  userDetail: User | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  addFavorite: (username: string, user: User) => Promise<void>;
  removeFavorite: (username: string, userId: number) => Promise<void>;
  isFavorite: (userId: number) => boolean;
  user: string | null;
  userId: number;
} {
  const route = useRoute();
  // Se asume que la ruta tiene un parámetro userId
  const { userId } = route.params as { userId: number };
  const { data, isLoading, isError, error } = useUserDetailQuery(userId);

  const user = useAuthStore(state => state.user);
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);
  const isFavorite = useFavoritesStore(state => state.isFavorite);

  return {
    userDetail: data,
    isLoading,
    isError,
    error: error ?? null,
    addFavorite,
    removeFavorite,
    isFavorite,
    user,
    userId,
  };
}
