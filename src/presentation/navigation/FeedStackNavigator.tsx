import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GeofenceListScreen, GeofenceDetailScreen } from '../screens';
import { FeedStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<FeedStackParamList>();

export default function FeedStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="GeofenceList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="GeofenceList" component={GeofenceListScreen} />
      <Stack.Screen name="GeofenceDetail" component={GeofenceDetailScreen} />
    </Stack.Navigator>
  );
}
