import { StyleSheet } from 'react-native';
import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Geofence } from '../../domain/models/Geofence';
import { Dimensions } from 'react-native';

interface MapProps {
  geofence?: Omit<Geofence, 'id' | 'name'>;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const Map = forwardRef<MapView, MapProps>(
  ({ geofence, initialRegion }, ref) => {
    // Referencia interna para exponer imperativamente
    useImperativeHandle(ref, () => mapRef.current as MapView);
    const mapRef = React.useRef<MapView>(null);

    const handleMapReady = () => {
      if (mapRef.current && initialRegion) {
        mapRef.current.animateToRegion(initialRegion, 800);
      }
    };

    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={[]}
        showsUserLocation={true}
        initialRegion={initialRegion}
        onMapReady={handleMapReady}
      >
        {geofence && (
          <>
            <Marker
              coordinate={{
                latitude: geofence.latitude,
                longitude: geofence.longitude,
              }}
              title="Zona objetivo"
            />
            <Circle
              center={{
                latitude: geofence.latitude,
                longitude: geofence.longitude,
              }}
              radius={geofence.radius}
              strokeColor="rgba(205,52,34,0.8)"
              fillColor="rgba(205,52,34,0.2)"
            />
          </>
        )}
      </MapView>
    );
  },
);

export default Map;

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.6,
  },
});
