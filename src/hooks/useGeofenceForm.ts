import { useState, useEffect, useRef } from 'react';
import { Location } from '../domain/models/Location';
import { uuidv4 } from '../utils/geo';

export function useGeofenceForm(currentLocation: Location | null) {
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [radius, setRadius] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(false);

  const idRef = useRef<string>(uuidv4());

  useEffect(() => {
    if (useCurrentLocation && currentLocation) {
      setLatitude(currentLocation.latitude.toString());
      setLongitude(currentLocation.longitude.toString());
    }
  }, [useCurrentLocation, currentLocation]);

  const reset = () => {
    setLatitude('');
    setLongitude('');
    setRadius('');
    setUseCurrentLocation(false);
    idRef.current = uuidv4();
  };

  return {
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    radius,
    setRadius,
    name,
    setName,
    id: idRef.current,
    useCurrentLocation,
    setUseCurrentLocation,
    reset,
  };
}
