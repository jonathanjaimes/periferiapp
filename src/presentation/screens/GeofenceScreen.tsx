import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useGeofencing } from '../../hooks/useGeofencing';
import CustomButton from '../components/CustomButton';
import MapView, { Marker, Circle } from 'react-native-maps';
import { getMapRegion } from '../../utils/geo';
import ModalGeofenceForm from '../components/ModalGeofenceForm';
import { useModal } from '../../hooks/useModal';

export default function GeofenceScreen() {
  const { visible, openModal, closeModal } = useModal();
  const { geofence, currentLocation, isInside, updateGeofence } =
    useGeofencing();

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
          geofence={geofence || { latitude: 0, longitude: 0, radius: 0 }}
          updateGeofence={updateGeofence}
          currentLocation={currentLocation}
        />
      )}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          customMapStyle={[]}
          showsUserLocation={true}
          initialRegion={
            geofence
              ? getMapRegion({
                  latitude: geofence.latitude,
                  longitude: geofence.longitude,
                  radius: geofence.radius,
                })
              : {
                  latitude: 4.60971,
                  longitude: -74.08175,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
          }
          region={
            geofence
              ? getMapRegion({
                  latitude: geofence.latitude,
                  longitude: geofence.longitude,
                  radius: geofence.radius,
                })
              : undefined
          }
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
