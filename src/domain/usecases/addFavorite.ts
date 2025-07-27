import { favoritesRepository } from '../../data/repositories/favoritesRepository';
import { Geofence } from '../models/Geofence';

export async function addFavorite(username: string, favorite: Geofence) {
  return await favoritesRepository.addFavorite(username, favorite);
}
