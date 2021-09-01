import React, { useEffect } from 'react';
import { initialiseOtaManager } from 'expo-ota-manager';
import { StatusBar } from 'expo-status-bar';
import Navigation from './app/navigation';
import BackgroundTasks from './app/core/BackgroundTasks';
import NotificationHandler from './app/core/NotificationHandler';
import * as Sentry from 'sentry-expo';
// @ts-ignore
import { SENTRY_DSN } from '@env';

Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  useEffect(() => {
    initialiseOtaManager({});
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <BackgroundTasks>
        <NotificationHandler>
          <Navigation />
        </NotificationHandler>
      </BackgroundTasks>
    </>
  );
}
