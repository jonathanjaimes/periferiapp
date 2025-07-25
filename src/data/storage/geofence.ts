import AsyncStorage from "@react-native-async-storage/async-storage";
import { Geofence } from "../../domain/models/Geofence";


export const saveGeofenceToStorage = async (geofence: Geofence) => {
    await AsyncStorage.setItem('geofence', JSON.stringify(geofence));
}

export const getGeofenceFromStorage = async (): Promise<Geofence | null> => {
    const geofence = await AsyncStorage.getItem('geofence');
    return geofence ? JSON.parse(geofence) : null;
}