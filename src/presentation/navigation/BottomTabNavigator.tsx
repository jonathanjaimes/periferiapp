import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedStackNavigator } from './index';
import FavoritesStackNavigator from './FavoritesStackNavigator';
import { ProfileScreen, GeofenceScreen } from '../screens';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from './navigationTypes';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './navigationTypes';

const Tab = createBottomTabNavigator<RootTabParamList>();

function handleTabPress(
  e: any,
  navigation: any,
  tabKey: string,
  stackScreen: string,
) {
  const state = navigation.getState();
  const bottomTabRoute = state?.routes.find(
    (route: any) => (route.name = 'BottomTab'),
  );

  const tabState = bottomTabRoute?.state;
  const tabName = tabState?.routes.find((route: any) => route.name === tabKey);

  if (tabName?.state?.index !== undefined && tabName?.state.index > 0) {
    e.preventDefault();
    navigation.navigate('BottomTab', {
      screen: tabKey,
      params: { screen: stackScreen },
    });
  }
}

export default function BottomTabNavigator() {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          if (route.name === 'Feed') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Location') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Profile') {
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
      <Tab.Screen
        name="Feed"
        component={FeedStackNavigator}
        listeners={{
          tabPress: e => handleTabPress(e, navigation, 'Feed', 'GeofenceList'),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStackNavigator}
        listeners={{
          tabPress: e =>
            handleTabPress(e, navigation, 'Favorites', 'FavoritesScreen'),
        }}
      />
      <Tab.Screen name="Location" component={GeofenceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
