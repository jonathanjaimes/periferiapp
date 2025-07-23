import { useRoute } from '@react-navigation/native';
import { useUserDetailQuery } from '../data/api';
import { useFavoriteActions } from './useFavoriteActions';
import type { User } from '../domain/models/User';

export function useUserDetail(): {
  userDetail: User | null | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFavorite: boolean;
  handleFavorite: () => Promise<void>;
  user: string | null;
  userId: number;
} {
  const route = useRoute();
  // Se asume que la ruta tiene un parámetro userId
  const { userId } = route.params as { userId: number };
  const { data, isLoading, isError, error } = useUserDetailQuery(userId);

  const { isFavorite: isFavoriteRaw, handleFavorite: handleFavoriteRaw, authUser: user } = useFavoriteActions();

  const isFavorite = data ? isFavoriteRaw(data.id) : false;
  const handleFavorite = async () => {
    if (data) await handleFavoriteRaw(data);
  };

  return {
    userDetail: data,
    isLoading,
    isError,
    error: error ?? null,
    isFavorite,
    handleFavorite,
    user,
    userId,
  };
}
