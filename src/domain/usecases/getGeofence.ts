import { Geofence } from '../models/Geofence';
import { geofencesRepository } from '../../data/repositories/geofencesRepository';

export const getGeofences = async (): Promise<Geofence[]> => {
  return await geofencesRepository.getGeofences('admin');
};
