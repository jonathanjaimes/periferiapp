import { useMemo } from 'react';
import { Geofence } from '../domain/models/Geofence';

interface Params {
  geofence?: Omit<Geofence, 'id' | 'name'>;
  currentLocation?: { latitude: number; longitude: number } | null;
}

export function useMapRegion({ geofence, currentLocation }: Params) {
  return useMemo(() => {
    if (geofence) {
      return {
        latitude: geofence.latitude,
        longitude: geofence.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    if (currentLocation) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return undefined;
  }, [geofence, currentLocation]);
}
