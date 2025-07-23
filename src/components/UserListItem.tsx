import React from 'react';
import { TouchableOpacity, View, Text, StyleProp, ViewStyle } from 'react-native';
import { FavoriteButton } from './FavoriteButton';

interface UserListItemProps {
  user: any;
  onPress: (user: any) => void;
  style?: StyleProp<ViewStyle>;
  favoriteIconStyle?: StyleProp<ViewStyle>;
}

export const UserListItem: React.FC<UserListItemProps> = ({ user, onPress, style, favoriteIconStyle }) => {
  return (
    <TouchableOpacity
      style={style}
      onPress={() => onPress(user)}
      activeOpacity={0.8}
    >
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{user.name}</Text>
        <Text style={{ color: '#555' }}>@{user.username}</Text>
        <Text style={{ color: '#888' }}>{user.email}</Text>
      </View>
      <FavoriteButton user={user} style={favoriteIconStyle} />
    </TouchableOpacity>
  );
};
