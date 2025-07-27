import {
  saveGeofenceToStorage,
  getGeofencesFromStorage,
} from '../storage/geofence';
import { Geofence } from '../../domain/models/Geofence';

export async function getGeofencesForUserApi(
  username: string,
): Promise<Geofence[]> {
  try {
    return await getGeofencesFromStorage({ username });
  } catch (error) {
    console.error('Error al obtener geocercas:', error);
    return [];
  }
}

export async function addGeofenceForUserApi(
  username: string,
  geofence: Geofence,
): Promise<Geofence[]> {
  try {
    await saveGeofenceToStorage(username, geofence);
    return await getGeofencesForUserApi(username);
  } catch (error) {
    console.error('Error al agregar geocerca:', error);
    return [];
  }
}
