import { Geofence } from '../models/Geofence'
import { saveGeofenceToStorage } from '../../data/storage'

export const saveGeofence = async (geofence: Geofence) => {
    return await saveGeofenceToStorage(geofence);
}