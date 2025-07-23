import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavoriteActions } from '../hooks/useFavoriteActions';
import type { User } from '../domain/models/User';

interface FavoriteButtonProps {
  user: User;
  style?: StyleProp<ViewStyle>;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ user, style }) => {
  const { isFavorite, handleFavorite, authUser } = useFavoriteActions();

  if (!authUser) return null;

  return (
    <TouchableOpacity
      onPress={() => handleFavorite(user)}
      style={style}
      activeOpacity={0.7}
    >
      <Icon
        name={isFavorite(user.id) ? 'heart' : 'heart-outline'}
        size={28}
        color={isFavorite(user.id) ? '#e74c3c' : '#bbb'}
      />
    </TouchableOpacity>
  );
};
