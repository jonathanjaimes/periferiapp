import { favoritesRepository } from '../../data/repositories/favoritesRepository';
import { Geofence } from '../models/Geofence';

export async function removeFavorite(username: string, geofence: Geofence) {
  return await favoritesRepository.removeFavorite(username, geofence);
}
