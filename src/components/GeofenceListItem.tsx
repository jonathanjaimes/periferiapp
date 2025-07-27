import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FavoriteButton } from './FavoriteButton';

interface GeofenceListItemProps {
  geofence: any;
  onPress: (geofence: any) => void;
  style?: StyleProp<ViewStyle>;
  favoriteIconStyle?: StyleProp<ViewStyle>;
}

export const GeofenceListItem: React.FC<GeofenceListItemProps> = ({
  geofence,
  onPress,
  style,
  favoriteIconStyle,
}) => {
  return (
    <TouchableOpacity
      style={style}
      onPress={() => onPress(geofence)}
      activeOpacity={0.8}
    >
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {geofence.name}
        </Text>
        <Text style={{ color: '#555' }}>Latitud: {geofence.latitude}</Text>
        <Text style={{ color: '#888' }}>Longitud: {geofence.longitude}</Text>
      </View>
      <FavoriteButton geofence={geofence} style={favoriteIconStyle} />
    </TouchableOpacity>
  );
};
