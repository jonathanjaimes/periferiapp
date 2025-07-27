import { useRoute } from '@react-navigation/native';
import { useFavoriteActions } from './useFavoriteActions';
import type { Geofence } from '../domain/models/Geofence';
import { useState, useEffect } from 'react';
import { getGeofences } from '../domain/usecases';
import { useGeofenceStore } from '../store/geofenceStore';

export function useGeofenceDetail(): {
  geofenceDetail: Geofence | undefined;
  isLoading: boolean;
  isError: boolean;
  isFavorite: boolean;
  handleFavorite: () => Promise<void>;
  user: string | null;
} {
  const route = useRoute();
  // Se asume que la ruta tiene un parámetro userId
  const { geofenceId } = route.params as { geofenceId: number };

      const [geofence, setGeofence] = useState<Geofence>();
      const [isLoading, setIsLoading] = useState(false);
      const [isError, setIsError] = useState(false);

      const geofences = useGeofenceStore(state => state.geofences);
  
      useEffect(() => {
          (async () => {
              try {
                  setIsLoading(true);

                  const geofenceFromStore = geofences.find(g => g.id === geofenceId);

                  if (geofenceFromStore) {
                      setGeofence(geofenceFromStore);
                  }else {
                    const geofenceList = await getGeofences();
                    const geofence = geofenceList.find(g => g.id === geofenceId);
                    setGeofence(geofence);
                  }
              } catch (error) {
                  setIsError(true);
              } finally {
                  setIsLoading(false);
              }
          })();
      }, []);

  const { isFavorite: isFavoriteRaw, handleFavorite: handleFavoriteRaw, authUser: user } = useFavoriteActions();

  const isFavorite = geofence ? isFavoriteRaw(geofence.id) : false;
  const handleFavorite = async () => {
    if (geofence) await handleFavoriteRaw(geofence);
  };

  return {
    geofenceDetail: geofence,
    isLoading,
    isError,
    isFavorite,
    handleFavorite,
    user
  };
}
