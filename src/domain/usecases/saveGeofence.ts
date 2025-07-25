import { Geofence } from '../models/Geofence'
import { saveGeofenceToStorage } from '../../data/storage/geofence'

export const saveGeofence = async (geofence: Geofence) => {
    return await saveGeofenceToStorage(geofence);
}