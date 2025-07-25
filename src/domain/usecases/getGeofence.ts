import { Geofence } from "../models/Geofence";
import { getGeofenceFromStorage } from '../../data/storage/geofence'

export const getGeofence = async (): Promise<Geofence | null> => {
    return await getGeofenceFromStorage();
}
    