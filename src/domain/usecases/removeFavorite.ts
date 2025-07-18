import { saveFavorites, getFavorites } from '../../data/storage/favorites';
import { User } from '../models/User';

export async function removeFavorite(username: string, userId: number) {
  const currentFavorites = await getFavorites(username);
  const updatedFavorites = currentFavorites.filter((fav: User) => fav.id !== userId);
  await saveFavorites(username, updatedFavorites);
  return updatedFavorites;
}

