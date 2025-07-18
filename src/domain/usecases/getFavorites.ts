import { getFavorites } from '../../data/storage/favorites';
import { User } from '../models/User';

export async function getFavoritesForUser(username: string): Promise<User[]> {
  return await getFavorites(username);
}
