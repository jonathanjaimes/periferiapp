import { Geofence } from '../models/Geofence';

export interface IFavoritesRepository {
  getFavorites(username: string): Promise<Geofence[]>;
  addFavorite(username: string, geofence: Geofence): Promise<Geofence[]>;
  removeFavorite(username: string, geofence: Geofence): Promise<Geofence[]>;
}
