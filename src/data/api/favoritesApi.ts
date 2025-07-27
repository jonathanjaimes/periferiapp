import { getFavorites, saveFavorites } from '../storage/favorites';
import { Geofence } from '../../domain/models/Geofence';

export async function getFavoritesForUserApi(
  username: string,
): Promise<Geofence[]> {
  try {
    return await getFavorites(username);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
}

export async function addFavoriteApi(
  username: string,
  geofence: Geofence,
): Promise<Geofence[]> {
  try {
    const current = await getFavorites(username);
    if (!current.find(g => g.id === geofence.id)) {
      const updated = [...current, geofence];
      await saveFavorites(username, updated);
      return updated;
    }
    return current;
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    return [];
  }
}

export async function removeFavoriteApi(
  username: string,
  geofence: Geofence,
): Promise<Geofence[]> {
  try {
    const current = await getFavorites(username);
    const updated = current.filter(g => g.id !== geofence.id);
    await saveFavorites(username, updated);
    return updated;
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    return [];
  }
}
