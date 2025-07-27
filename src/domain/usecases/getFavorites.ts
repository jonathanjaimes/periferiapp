import { getFavorites } from '../../data/storage/favorites';
import { Geofence } from '../models/Geofence';

export async function getFavoritesForUser(username: string): Promise<Geofence[]> {
  return await getFavorites(username);
}
