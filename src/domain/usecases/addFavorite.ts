import { saveFavorites, getFavorites } from '../../data/storage/favorites';
import { User } from '../models/User';

export async function addFavorite(username: string, favorite: User) {
  const currentFavorites = await getFavorites(username);
  const updatedFavorites = [...currentFavorites, favorite];
  await saveFavorites(username, updatedFavorites);
  return updatedFavorites;
}

