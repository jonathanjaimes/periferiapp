import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './index';
import { NavigatorScreenParams } from '@react-navigation/native';

export type FeedStackParamList = {
  GeofenceList: undefined;
  GeofenceDetail: { geofenceId: number };
};

export type FavoritesStackParamList = {
  FavoritesScreen: undefined;
};

export type RootTabParamList = {
  Feed: NavigatorScreenParams<FeedStackParamList>;
  Favorites: NavigatorScreenParams<FavoritesStackParamList>;
  Profile: undefined;
  Location: undefined;
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
