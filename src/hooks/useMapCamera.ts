import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import MapView from 'react-native-maps';

export function useMapCamera(mapRef: React.RefObject<MapView | null>, initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}) {
    useFocusEffect(
        useCallback(() => {
            if (!mapRef.current || !initialRegion) return;
            const timeout = setTimeout(() => {
                if (mapRef.current && initialRegion){
                    mapRef.current.animateToRegion(initialRegion, 800);
                }
            }, 400);
            return () => clearTimeout(timeout);
        }, [initialRegion, mapRef])
    )
}