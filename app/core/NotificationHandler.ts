import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

export function presentNotificationAsync({ title, body }) {
  Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  }).catch((error) => {
    Alert.alert('presentNotificationAsync', error.message);
  });
}

export default function NotificationHandler({ children }) {
  Notifications.getPermissionsAsync().then((settings) => {
    // console.log(`settings`, settings);

    if (settings.canAskAgain === false) {
      Alert.alert('Notifications permission denied', JSON.stringify(settings));
    }

    if (
      settings.granted === true ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: true,
          provideAppNotificationSettings: true,
          allowProvisional: true,
          allowAnnouncements: true,
        },
      }).then((permission) => {
        if (permission.granted === false) {
          Alert.alert('Notifications permission denied', JSON.stringify(permission));
        }

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      });
    }
  });

  return children;
}
