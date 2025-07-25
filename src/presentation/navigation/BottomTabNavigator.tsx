import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedStackNavigator } from './index';
import FavoritesStackNavigator from './FavoritesStackNavigator';
import { ProfileScreen, GeofenceScreen } from '../screens';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          if (route.name === 'Feed') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Favoritos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Mi posición') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Usuario') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#cd3422',
        tabBarInactiveTintColor: '#aaa',
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          height: 60,
          paddingTop: 4,
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedStackNavigator} />
      <Tab.Screen name="Favoritos" component={FavoritesStackNavigator} />
      <Tab.Screen name="Mi posición" component={GeofenceScreen} />
      <Tab.Screen name="Usuario" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
