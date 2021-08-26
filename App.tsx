import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './app/navigation';
import BackgroundTasks from './app/core/BackgroundTasks';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <BackgroundTasks>
        <Navigation />
      </BackgroundTasks>
    </>
  );
}
