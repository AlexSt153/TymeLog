import React, { useEffect } from 'react';
import { initialiseOtaManager } from 'expo-ota-manager';
import { StatusBar } from 'expo-status-bar';
import Navigation from './app/navigation';
import BackgroundTasks from './app/core/BackgroundTasks';
import NotificationHandler from './app/core/NotificationHandler';

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
