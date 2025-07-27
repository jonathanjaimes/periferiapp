import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavoriteActions } from '../hooks/useFavoriteActions';
import type { Geofence } from '../domain/models/Geofence';

interface FavoriteButtonProps {
  geofence: Geofence;
  style?: StyleProp<ViewStyle>;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  geofence,
  style,
}) => {
  const { isFavorite, handleFavorite, authUser } = useFavoriteActions();

  if (!authUser) return null;

  return (
    <TouchableOpacity
      onPress={() => handleFavorite(geofence)}
      style={{}}
      activeOpacity={0.7}
    >
      <Icon
        name={isFavorite(geofence.id) ? 'heart' : 'heart-outline'}
        size={28}
        color={isFavorite(geofence.id) ? '#e74c3c' : '#bbb'}
      />
    </TouchableOpacity>
  );
};
