import { Geofence } from '../models/Geofence';
import { geofencesRepository } from '../../data/repositories/geofencesRepository';

export const saveGeofence = async (username: string, geofence: Geofence) => {
  return await geofencesRepository.addGeofence(username, geofence);
};
