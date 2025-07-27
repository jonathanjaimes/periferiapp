import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Geofence } from '../../domain/models/Geofence';

interface UserSearchOverlayProps {
  results: Geofence[];
  onSelect: (geofence: Geofence) => void;
  onClose: () => void;
  query: string;
}

export default function UserSearchOverlay({
  results,
  onSelect,
  onClose,
  query,
}: UserSearchOverlayProps) {
  return (
    <View style={styles.overlay}>
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={item =>
            item.latitude.toString() +
            item.longitude.toString() +
            item.radius.toString()
          }
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : query.length > 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No hay resultados</Text>
        </View>
      ) : null}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 84, // Altura ajustada del área de búsqueda
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.97)',
    zIndex: 10,
    paddingTop: 0,
  },
  item: {
    backgroundColor: '#f5f5f5',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    color: '#888',
    fontSize: 18,
    marginTop: 40,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
