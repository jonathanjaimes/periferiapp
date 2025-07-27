import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoritesScreen from '../screens/FavoritesScreen';
import GeofenceDetailScreen from '../screens/GeofenceDetailScreen';

const Stack = createNativeStackNavigator();

export default function FavoritesStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="FavoritesScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="GeofenceDetail" component={GeofenceDetailScreen} />
    </Stack.Navigator>
  );
}
