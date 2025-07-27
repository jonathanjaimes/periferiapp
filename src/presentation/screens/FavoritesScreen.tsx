import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../navigation/navigationTypes';
import { useFavorites } from '../../hooks/useFavorites';

export default function FavoritesScreen() {
  const { user, favorites, loading } = useFavorites();
  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParamList>>();

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loginText}>
          Debes iniciar sesión para administrar tus favoritos.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#cd3422" />
        <Text>Cargando favoritos...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No tienes usuarios favoritos aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() =>
            navigation.navigate('GeofenceDetail', { geofenceId: item.id })
          }
        >
          <Text style={styles.name}>Nombre: {item.name}</Text>
          <Text style={styles.latitude}>Latitud: {item.latitude}</Text>
          <Text style={styles.longitude}>Longitud: {item.longitude}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 54,
  },
  loginText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  latitude: {
    color: '#888',
    marginBottom: 2,
  },
  longitude: {
    color: '#888',
  },
});
