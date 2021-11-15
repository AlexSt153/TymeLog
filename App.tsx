import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { initialiseOtaManager } from 'expo-ota-manager';
import { StatusBar } from 'expo-status-bar';
import Navigation from './app/navigation';
import BackgroundTasks from './app/core/BackgroundTasks';
import BackgroundLocationTask from './app/core/BackgroundLocationTask';
import NotificationHandler from './app/core/NotificationHandler';
import * as Sentry from 'sentry-expo';
// @ts-ignore
import { SENTRY_DSN } from '@env';

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true,
});

export const isNotWeb = Platform.OS !== 'web';

export default function App() {
  useEffect(() => {
    if (!__DEV__) initialiseOtaManager({});
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      {isNotWeb && <BackgroundTasks />}
      {isNotWeb && <BackgroundLocationTask />}
      {isNotWeb && <NotificationHandler />}
      <Navigation />
    </>
  );
}
