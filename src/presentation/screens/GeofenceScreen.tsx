import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { useGeofencing } from '../../hooks/useGeofencing';
import CustomButton from '../components/CustomButton';
import ModalGeofenceForm from '../components/ModalGeofenceForm';
import { useModal } from '../../hooks/useModal';
import Map from '../components/Map';

import React, { useRef } from 'react';
import MapView from 'react-native-maps';
import { useMapRegion } from '../../hooks/useMapRegion';
import { useMapVisibility } from '../../hooks/useMapVisibility';
import { useMapCamera } from '../../hooks/useMapCamera';

export default function GeofenceScreen() {
  const { visible, openModal, closeModal } = useModal();
  const { geofence, currentLocation, isInside, updateGeofence } =
    useGeofencing();

  const mapRef = useRef<MapView>(null);

  const initialRegion = useMapRegion({ geofence, currentLocation });

  const { mapVisible } = useMapVisibility();

  useMapCamera(mapRef, initialRegion);

  return (
    <View style={styles.container}>
      <CustomButton
        title="Configurar geocerca"
        onPress={openModal}
        style={styles.geofenceButton}
      />
      {visible && (
        <ModalGeofenceForm
          onClose={closeModal}
          geofence={
            geofence || {
              latitude: 0,
              longitude: 0,
              radius: 0,
              name: '',
              id: 0,
            }
          }
          updateGeofence={updateGeofence}
          currentLocation={currentLocation}
        />
      )}
      <View style={styles.mapContainer}>
        {geofence || currentLocation ? (
          mapVisible ? (
            <Map
              key={
                geofence
                  ? `geo-${geofence.latitude}-${geofence.longitude}-${geofence.radius}`
                  : currentLocation
                  ? `loc-${currentLocation.latitude}-${currentLocation.longitude}`
                  : 'default'
              }
              ref={mapRef}
              geofence={geofence || undefined}
              initialRegion={initialRegion}
              // @ts-ignore
              removeClippedSubviews={false}
              enableReinitialize={true}
            />
          ) : null
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text>Obteniendo ubicación...</Text>
          </View>
        )}
        <View style={styles.panel}>
          <Text
            style={[
              styles.statusText,
              { color: isInside ? '#1db83c' : '#cd3422' },
            ]}
          >
            {isInside ? '¡Estás dentro de la zona!' : 'Estás fuera de la zona.'}
          </Text>
          {geofence && (
            <Text style={styles.geofenceInfo}>
              Zona: {'\n'}
              lat {geofence.latitude} {'\n'}
              lon {geofence.longitude} {'\n'}
              radio {geofence.radius}m
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  geofenceButton: {
    backgroundColor: '#cd3422',
  },
  mapContainer: {
    flex: 1,
    paddingTop: 16,
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.6,
  },
  panel: {
    marginTop: 16,
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  geofenceInfo: {
    marginTop: 8,
    color: '#555',
  },
});
