import { Geofence } from '../../domain/models/Geofence';
import {
  getGeofencesForUserApi,
  addGeofenceForUserApi,
} from '../api/geofencesApi';
import { IGeofencesRepository } from '../../domain/repositories';

export const geofencesRepository: IGeofencesRepository = {
  async getGeofences(username: string): Promise<Geofence[]> {
    return await getGeofencesForUserApi(username);
  },
  async addGeofence(username: string, geofence: Geofence): Promise<Geofence[]> {
    return await addGeofenceForUserApi(username, geofence);
  },
};
