import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useUserDetail } from '../../hooks/useUserDetail';

export default function UserDetailScreen() {
  const {
    userDetail,
    isLoading,
    isError,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    user,
    userId,
  } = useUserDetail();
  const authUser = useAuthStore(state => state.user);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#cd3422" />
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar el usuario.</Text>
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </View>
    );
  }

  if (!userDetail) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Usuario no encontrado.</Text>
      </View>
    );
  }

  const handleFavorite = async () => {
    if (!user || !userDetail) return;
    if (isFavorite(userId)) {
      await removeFavorite(user, userDetail.id);
    } else {
      await addFavorite(user, userDetail);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Icon name="person-circle" size={170} color="#cd3422" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{userDetail.name}</Text>
        {authUser && (
          <TouchableOpacity
            onPress={handleFavorite}
            style={styles.favoriteIconButton}
          >
            <Icon
              name={isFavorite(userId) ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite(userId) ? '#e74c3c' : '#bbb'}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.username}>@{userDetail.username}</Text>
      <Text style={styles.email}>{userDetail.email}</Text>
      <Text style={styles.section}>Dirección:</Text>
      <Text>
        {userDetail.address.street}, {userDetail.address.suite},{' '}
        {userDetail.address.city}, {userDetail.address.zipcode}
      </Text>
      <Text style={styles.section}>Teléfono:</Text>
      <Text>{userDetail.phone}</Text>
      <Text style={styles.section}>Sitio web:</Text>
      <Text>{userDetail.website}</Text>
      <Text style={styles.section}>Compañía:</Text>
      <Text>{userDetail.company.name}</Text>
      <Text>{userDetail.company.catchPhrase}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 50,
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
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  username: {
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    color: '#cd3422',
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
