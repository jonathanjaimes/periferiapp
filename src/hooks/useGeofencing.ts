import { useEffect, useState, useRef, useCallback } from "react";
import Geolocation from '@react-native-community/geolocation';
import { Geofence } from "../domain/models/Geofence";
import { saveGeofence, isWithinGeofence, triggerGeofenceNotification } from "../domain/usecases";
import { Location } from "../domain/models/Location";
import { requestLocationPermission } from "../utils/geo";
import { useGeofenceStore } from "../store/geofenceStore";

export const useGeofencing = () => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [isInside, setIsInside] = useState<boolean>(false);
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const hasNotified = useRef<boolean>(false);
    const hasNotifiedExit = useRef<boolean>(false);

    const addGeofence = useGeofenceStore(state => state.addGeofence);
    const geofences = useGeofenceStore(state => state.geofences);
    const geofence = geofences[geofences.length - 1]

    useEffect(() => {
        (async () => {
            const hasPermission = await requestLocationPermission()
            if (hasPermission){
                setHasPermission(true)
            }
        })()
    }, [])

    useEffect(() => {
        if (!hasPermission) return;

        Geolocation.getCurrentPosition(
            (position)=>{
                const {latitude, longitude} = position.coords;
                setCurrentLocation({latitude, longitude})
            },
            (error)=>{
                console.error('Error obteniendo ubicación', error)
            },
            {
                enableHighAccuracy: true,
            }
        )

        const watchId = Geolocation.watchPosition(
            (position)=>{
                const {latitude, longitude} = position.coords;
                setCurrentLocation({latitude, longitude})
            },
            (error)=>{
                console.error('Error obteniendo ubicación', error)
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 1,
            }
        )
        return ()=> Geolocation.clearWatch(watchId)
    }, [hasPermission])

    useEffect(() => {
        if (currentLocation && geofence){
            const inside = isWithinGeofence(geofence, currentLocation.latitude, currentLocation.longitude)

            setIsInside(inside)

            if(inside){
                if(!hasNotified.current){
                    triggerGeofenceNotification('Has entrado a la zona!', 'Has entrado a la zona objetivo')
                    hasNotified.current = true
                }
                hasNotifiedExit.current = false
            }else {
                if(!hasNotifiedExit.current){
                    triggerGeofenceNotification('Has salido de la zona!', 'Has salido de la zona objetivo')
                    hasNotifiedExit.current = true
                }
                hasNotified.current = false
            }
        }
    }, [currentLocation, geofence])

    const updateGeofence = useCallback(
        async (newGeofence: Geofence) => {
            await saveGeofence('admin', newGeofence)
            addGeofence(newGeofence)
            hasNotified.current = false
        },
        []
    )

    return {
        currentLocation,
        geofence,
        isInside,
        updateGeofence,
    }

}
