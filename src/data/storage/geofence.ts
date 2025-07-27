import AsyncStorage from "@react-native-async-storage/async-storage";
import { Geofence } from "../../domain/models/Geofence";

const USERNAME = 'admin'
const GEOFENCE_KEY = `geofences_${USERNAME}`

export const saveGeofenceToStorage = async (geofence: Geofence) => {
    const geofencesRaw = await AsyncStorage.getItem(GEOFENCE_KEY)
    const geofences: Geofence[] = geofencesRaw ? JSON.parse(geofencesRaw) : []
    geofences.push(geofence)
    await AsyncStorage.setItem(GEOFENCE_KEY, JSON.stringify(geofences))
}

export const getGeofencesFromStorage = async (): Promise<Geofence[]> => {
    const geofences = await AsyncStorage.getItem(GEOFENCE_KEY)
    return geofences ? JSON.parse(geofences) : []
}