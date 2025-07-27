import { favoritesRepository } from '../../data/repositories/favoritesRepository';
import { Geofence } from '../models/Geofence';

export async function getUserFavorites(username: string): Promise<Geofence[]> {
  return await favoritesRepository.getFavorites(username);
}
