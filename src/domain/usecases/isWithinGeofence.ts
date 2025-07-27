import { Geofence } from '../models/Geofence';
import { haversineDistance } from '../../utils/geo';

export function isWithinGeofence(
  geofence: Geofence,
  currentLat: number,
  currentLon: number,
): boolean {
  const distance = haversineDistance(
    currentLat,
    currentLon,
    geofence.latitude,
    geofence.longitude,
  );

  return distance <= geofence.radius;
}
