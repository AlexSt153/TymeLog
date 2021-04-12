import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';
import Navigation from './app/Navigation';

enableScreens();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Navigation />
    </>
  );
}
