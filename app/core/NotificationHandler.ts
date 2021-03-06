// @ts-nocheck
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useStore } from '../store';
import { isAndroid } from '../tools/deviceInfo';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function presentNotificationAsync({ title, body }) {
  Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  }).catch((error) => {
    Alert.alert('presentNotificationAsync', error.message);
  });
}

export default function NotificationHandler() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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
      });
    }
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (notification) {
      Alert.alert(notification.request.content.title, notification.request.content.body);
    }
  }, [notification]);

  return null;
}

async function registerForPushNotificationsAsync() {
  const { session } = useStore.getState();

  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    const { data, error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      push_token: token,
    });

    console.log('sendPushToken to supabase', { data, error });
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (isAndroid) {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
