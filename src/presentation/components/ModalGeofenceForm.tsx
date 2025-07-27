import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { Geofence } from '../../domain/models/Geofence';
import { Location } from '../../domain/models/Location';
import CustomButton from '../components/CustomButton';
import { useGeofenceForm } from '../../hooks/useGeofenceForm';

export default function ModalGeofenceForm({
  onClose,
  updateGeofence,
  currentLocation,
}: {
  onClose: () => void;
  updateGeofence: (geofence: Geofence) => void;
  currentLocation: Location | null;
}) {
  const {
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    radius,
    setRadius,
    name,
    setName,
    id,
    useCurrentLocation,
    setUseCurrentLocation,
    reset,
  } = useGeofenceForm(currentLocation);

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Ingresa los datos de la geocerca:</Text>
        <View style={styles.inputsContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            keyboardType="numeric"
            placeholder="Latitud"
            value={latitude}
            onChangeText={setLatitude}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            keyboardType="numeric"
            placeholder="Longitud"
            value={longitude}
            onChangeText={setLongitude}
          />
          <View style={styles.switchRow}>
            <Text>Usar ubicación actual</Text>
            <Switch
              value={useCurrentLocation}
              onValueChange={setUseCurrentLocation}
              trackColor={{ false: '#ccc', true: '#52c934' }}
              thumbColor={'#fff'}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            keyboardType="numeric"
            placeholder="Radio"
            value={radius}
            onChangeText={setRadius}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#888"
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.buttonRow}>
          <CustomButton
            title="Cancelar"
            textStyle={styles.cancelText}
            style={styles.cancelButton}
            onPress={() => {
              reset();
              onClose();
            }}
          />

          <CustomButton
            title="Guardar"
            style={styles.saveButton}
            onPress={() => {
              updateGeofence({
                latitude: Number(latitude),
                longitude: Number(longitude),
                radius: Number(radius),
                name: name,
                id: id,
              });
              onClose();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderRadius: 8,
    minWidth: 300,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputsContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  geofenceInfo: {
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelText: {
    color: '#cd3422',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#cd3422',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#cd3422',
  },
});
