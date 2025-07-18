import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../domain/models/User';

const getFavoritesKey = (username: string) => `favorites_${username}`;

export const saveFavorites = async (username: string, favorites: User[]): Promise<void> => {
  const key = getFavoritesKey(username);
  await AsyncStorage.setItem(key, JSON.stringify(favorites));
};

export const getFavorites = async (username: string): Promise<User[]> => {
  const key = getFavoritesKey(username);
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
