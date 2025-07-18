import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../presentation/navigation/AppNavigator';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useUsersQuery } from '../data/api';

export function useUserList() {
  // Data fetching
  const {
    data: usersRaw,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useUsersQuery();
  const users = usersRaw ?? [];

  // Navigation
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Auth
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  // Favorites
  const favorites = useFavoritesStore(state => state.favorites);
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);
  const isFavorite = useFavoritesStore(state => state.isFavorite);
  const loadFavorites = useFavoritesStore.getState().loadFavorites;

  // Side effects encapsulados
  React.useEffect(() => {
    if (user) {
      loadFavorites(user);
    }
  }, [user]);

  return {
    users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    navigation,
    user,
    logout,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
