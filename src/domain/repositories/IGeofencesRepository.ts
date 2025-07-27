import { Geofence } from '../models/Geofence';

export interface IGeofencesRepository {
  getGeofences(username: string): Promise<Geofence[]>;
  addGeofence(username: string, geofence: Geofence): Promise<Geofence[]>;
}
