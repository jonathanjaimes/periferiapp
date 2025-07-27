import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../domain/models/User';

const FAVORITES_KEY_PREFIX = 'favorites_';

export async function getFavoritesForUser(username: string): Promise<User[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY_PREFIX + username);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
}

export async function addFavoriteUseCase(username: string, user: User): Promise<User[]> {
  try {
    const current = await getFavoritesForUser(username);
    if (!current.find(u => u.username === user.username)) {
      const updated = [...current, user];
      await AsyncStorage.setItem(FAVORITES_KEY_PREFIX + username, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    return [];
  }
}

export async function removeFavoriteUseCase(username: string, user: User): Promise<User[]> {
  try {
    const current = await getFavoritesForUser(username);
    const updated = current.filter(u => u.username !== user.username);
    await AsyncStorage.setItem(FAVORITES_KEY_PREFIX + username, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    return [];
  }
}
