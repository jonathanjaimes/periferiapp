import { saveFavorites, getFavorites } from '../../data/storage/favorites';
import { Geofence } from '../models/Geofence';

export async function addFavorite(username: string, favorite: Geofence) {
  const currentFavorites = await getFavorites(username);
  const updatedFavorites = [...currentFavorites, favorite];
  await saveFavorites(username, updatedFavorites);
  return updatedFavorites;
}

