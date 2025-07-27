import PushNotification from 'react-native-push-notification';

export async function triggerGeofenceNotification(
  title: string,
  message: string,
) {
  PushNotification.localNotification({
    channelId: 'geofence-channel',
    title,
    message,
    playSound: true,
    soundName: 'default',
    vibrate: true,
  });
}
