/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

import { enableScreens } from 'react-native-screens';
enableScreens();

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/presentation/navigation/AppNavigator';

import PushNotification from 'react-native-push-notification';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const queryClient = React.useRef(new QueryClient()).current;

  React.useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'geofence-channel',
        channelName: 'Geofence Notifications',
        importance: 4,
        vibrate: true,
      },
      (created: boolean) => console.log(`createChannel returned '${created}'`),
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {/* Aquí irá la navegación o la pantalla principal */}
        <AppNavigator />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
