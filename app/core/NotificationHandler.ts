import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { GEOFENCING_TASK_NAME } from './BackgroundLocationTask';

export function presentNotificationAsync({ title, body }) {
  Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}

export default function NotificationHandler({ children }) {
  Notifications.getPermissionsAsync().then((settings) => {
    if (
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      //   console.log(`NotificationHandler: Permission granted`);
      // } else {
      console.log(`NotificationHandler: Permission denied`);

      Notifications.requestPermissionsAsync().then((permission) => {
        console.log(`permission`, permission);
      });
    }
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Location.hasStartedGeofencingAsync(GEOFENCING_TASK_NAME).then((geofencingIsEnabled) => {
    presentNotificationAsync({
      title: `Geofencing ${geofencingIsEnabled}`,
      body: "I'm so proud of myself!",
    });
  });

  return children;
}
