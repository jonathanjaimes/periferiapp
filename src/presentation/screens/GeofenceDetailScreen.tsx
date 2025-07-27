import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { FavoriteButton } from '../../components/FavoriteButton';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useGeofenceDetail } from '../../hooks/useGeofenceDetail';
import MapView, { Marker, Circle } from 'react-native-maps';
import { getMapRegion } from '../../utils/geo';
import Map from '../components/Map';

export default function GeofenceDetailScreen() {
  const { geofenceDetail, isLoading, isError } = useGeofenceDetail();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#cd3422" />
        <Text>Cargando geocerca...</Text>
      </View>
    );
  }

  if (geofenceDetail === undefined) {
    return (
      <View style={styles.centered}>
        <Text>Geocerca no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleMapContainer}>
        {/* <Icon name="person-circle" size={170} color="#cd3422" /> */}
        <Text style={styles.title}>DETALLE DE LA GEOCERCA</Text>
        <Map
          geofence={geofenceDetail}
          initialRegion={{
            latitude: geofenceDetail.latitude,
            longitude: geofenceDetail.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        />
      </View>
      {/* <View style={styles.infoContainer}>
        <Text style={styles.name}>{geofenceDetail.name}</Text>
        <FavoriteButton
          geofence={geofenceDetail}
          style={styles.favoriteIconButton}
        />
      </View> */}
      <Text style={styles.name}>Nombre: {geofenceDetail.name}</Text>
      <Text style={styles.latitude}>Latitud: {geofenceDetail.latitude}</Text>
      <Text style={styles.longitude}>Longitud: {geofenceDetail.longitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  titleMapContainer: {
    marginBottom: 28,
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.6,
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteIconButton: {
    marginLeft: 12,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingHorizontal: 34,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
    color: '#888',
  },
  latitude: {
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  longitude: {
    color: '#888',
    marginBottom: 12,
    textAlign: 'center',
  },
  section: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  errorText: {
    color: '#ff0000',
  },
});
