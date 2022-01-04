import React, { useEffect } from 'react';
import { initialiseOtaManager } from 'expo-ota-manager';
import { StatusBar } from 'expo-status-bar';
import Navigation from './app/navigation';
import BackgroundTasks from './app/core/BackgroundTasks';
import BackgroundLocationTask from './app/core/BackgroundLocationTask';
import NotificationHandler from './app/core/NotificationHandler';
import * as Sentry from 'sentry-expo';
import * as Location from 'expo-location';
// @ts-ignore
import { SENTRY_DSN, WEB_GOOGLE_MAPS_API_KEY } from '@env';
import { isWeb, isNotWeb } from './app/tools/deviceInfo';
import { useStore } from './app/store';

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true,
});

if (isWeb) {
  Location.setGoogleApiKey(WEB_GOOGLE_MAPS_API_KEY);
}

export default function App() {
  const userAllowedBackgroundLocation = useStore((state) => state.userAllowedBackgroundLocation);
  const userAllowedNotifications = useStore((state) => state.userAllowedNotifications);

  useEffect(() => {
    if (!__DEV__) initialiseOtaManager({});
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      {isNotWeb && <BackgroundTasks />}
      {isNotWeb && userAllowedBackgroundLocation && <BackgroundLocationTask />}
      {isNotWeb && userAllowedNotifications && <NotificationHandler />}
      <Navigation />
    </>
  );
}
