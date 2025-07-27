import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../presentation/navigation/AppNavigator';
import { getGeofences } from '../domain/usecases';
import { useGeofenceStore } from '../store/geofenceStore';

export function useGeofenceList() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const addGeofence = useGeofenceStore(state => state.addGeofence);
    const geofences = useGeofenceStore(state => state.geofences);
    useEffect(() => {
        if (geofences.length === 0) {
            setIsLoading(true);
            getGeofences().then(geofences => {
                geofences.forEach(geofence => {
                    addGeofence(geofence);
                });
            }).catch(error => {
                setIsError(true);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [geofences.length, addGeofence]);

  // Navigation
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();

 

  return {
    geofences,
    isLoading,
    isError,
    navigation,

  };
}
