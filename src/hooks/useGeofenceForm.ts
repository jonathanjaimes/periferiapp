import { useState, useEffect } from "react";
import { Geofence } from "../domain/models/Geofence";
import { Location } from "../domain/models/Location";

export function useGeofenceForm( currentLocation: Location | null) {
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [radius, setRadius] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(false);

    useEffect(()=>{
        if(useCurrentLocation && currentLocation){
            setLatitude(currentLocation.latitude.toString());
            setLongitude(currentLocation.longitude.toString());
        }
    }, [useCurrentLocation, currentLocation])

    const reset = () => {
        setLatitude('');
        setLongitude('');
        setRadius('');
        setUseCurrentLocation(false);
    }

    return {
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        radius,
        setRadius,
        name,
        setName,
        id,
        setId,
        useCurrentLocation,
        setUseCurrentLocation,
        reset
    }
}