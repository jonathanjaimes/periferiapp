import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserListScreen, UserDetailScreen } from '../screens';

const Stack = createNativeStackNavigator();

export default function FeedStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="UserList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserList" component={UserListScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
    </Stack.Navigator>
  );
}
