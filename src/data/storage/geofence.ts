import AsyncStorage from '@react-native-async-storage/async-storage';
import { Geofence } from '../../domain/models/Geofence';

const getGeofenceKey = (username: string) => `geofences_${username}`;

export const saveGeofenceToStorage = async (
  username: string,
  geofence: Geofence,
) => {
  const geofencesRaw = await AsyncStorage.getItem(getGeofenceKey(username));
  const geofences: Geofence[] = geofencesRaw ? JSON.parse(geofencesRaw) : [];
  geofences.push(geofence);
  await AsyncStorage.setItem(
    getGeofenceKey(username),
    JSON.stringify(geofences),
  );
};

export const getGeofencesFromStorage = async ({
  username,
}: {
  username: string;
}): Promise<Geofence[]> => {
  const geofences = await AsyncStorage.getItem(getGeofenceKey(username));
  return geofences ? JSON.parse(geofences) : [];
};
