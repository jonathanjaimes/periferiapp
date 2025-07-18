import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoritesScreen from '../screens/FavoritesScreen';
import UserDetailScreen from '../screens/UserDetailScreen';

const Stack = createNativeStackNavigator();

export default function FavoritesStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="FavoritesScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
    </Stack.Navigator>
  );
}
