import { useEffect } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';

import {
  // startGeofenceTracking,
  startBackgroundLocationTask,
  BACKGROUND_LOCATION_TASK_NAME,
  GEOFENCING_TASK_NAME,
} from './BackgroundLocationTask';

export default function BackgroundTasks() {
  const handleAppStateChange = async (nextAppState) => {
    console.log(`nextAppState`, nextAppState);

    const geofencingIsEnabled = await Location.hasStartedGeofencingAsync(GEOFENCING_TASK_NAME);
    console.log(`geofencingIsEnabled`, geofencingIsEnabled);
    if (geofencingIsEnabled === false) {
      // TODO: uncomment startGeofenceTracking() when geofencion feature is ready
      // await startGeofenceTracking();
    }

    const backgroundLocationTaskIsEnabled = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK_NAME
    );
    console.log(`backgroundLocationTaskIsEnabled`, backgroundLocationTaskIsEnabled);
    if (backgroundLocationTaskIsEnabled === false) {
      await startBackgroundLocationTask();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    // TaskManager.unregisterAllTasksAsync();

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return null;
}
