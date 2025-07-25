import { useEffect, useState, useRef, useCallback } from "react";
import Geolocation from '@react-native-community/geolocation';
import { Geofence } from "../domain/models/Geofence";
import { getGeofence } from "../domain/usecases/getGeofence";
import { saveGeofence } from "../domain/usecases/saveGeofence";
import { isWithinGeofence } from "../domain/usecases/isWithinGeofence";
import { triggerGeofenceNotification } from "../domain/usecases/triggerGeofenceNotification";
import { Location } from "../domain/models/Location";
import { requestLocationPermission } from "../utils/geo";

export const useGeofencing = () => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [geofence, setGeofence] = useState<Geofence | null>(null);
    const [isInside, setIsInside] = useState<boolean>(false);
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const hasNotified = useRef<boolean>(false);
    const hasNotifiedExit = useRef<boolean>(false);

    useEffect(() => {
        (async () => {
            const hasPermission = await requestLocationPermission()
            console.log('hasPermissionnn', hasPermission)
            if (hasPermission){
                setHasPermission(true)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const storeGeofence = await getGeofence();
            if (storeGeofence) setGeofence(storeGeofence)
        })()
    }, [])

    useEffect(() => {
        if (!hasPermission) return;

        Geolocation.getCurrentPosition(
            (position)=>{
                const {latitude, longitude} = position.coords;
                console.log('positionnnnn inicialll', latitude, longitude)
                setCurrentLocation({latitude, longitude})
            },
            (error)=>{
                console.error('Error obteniendo ubicación', error)
                console.log('AMOGO ERRROR posicion inicial')
            },
            {
                enableHighAccuracy: true,
            }
        )

        const watchId = Geolocation.watchPosition(
            (position)=>{
                const {latitude, longitude} = position.coords;
                console.log('positionnnnn watcher', latitude, longitude)
                setCurrentLocation({latitude, longitude})
            },
            (error)=>{
                console.error('Error obteniendo ubicación', error)
                console.log('AMOGO ERRROR watcher')
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
            await saveGeofence(newGeofence)
            setGeofence(newGeofence)
            hasNotified.current = false
        },
        []
    )

    return {
        currentLocation,
        geofence,
        isInside,
        updateGeofence,
        setGeofence
    }

}
