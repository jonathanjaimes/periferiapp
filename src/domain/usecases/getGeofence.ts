import { Geofence } from "../models/Geofence";
import { getGeofencesFromStorage } from '../../data/storage/geofence'

export const getGeofences = async (): Promise<Geofence[]> => {
    return await getGeofencesFromStorage();
}
    