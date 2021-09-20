import { search } from 'expo-sqlite-query-helper';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
// import * as TaskManager from 'expo-task-manager';

import { useStore } from '../store';
import {
  // startGeofenceTracking,
  startBackgroundLocationTask,
  BACKGROUND_LOCATION_TASK_NAME,
  GEOFENCING_TASK_NAME,
} from './BackgroundLocationTask';

export default function BackgroundTasks({ children }) {
  const cloudSync = useStore((state) => state.cloudSync);
  const loggedIn = useStore((state) => state.loggedIn);
  const session = useStore((state) => state.session);

  const getUnsyncedBookingsFromDB = async () => {
    const result = await search('bookings', { synced: 'false' });
    if (Array.isArray(result.rows._array)) {
      return result.rows._array;
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    const geofencingIsEnabled = await Location.hasStartedGeofencingAsync(GEOFENCING_TASK_NAME);
    console.log(`geofencingIsEnabled`, geofencingIsEnabled);
    if (geofencingIsEnabled === false) {
      // await startGeofenceTracking();
    }

    const backgroundLocationTaskIsEnabled = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK_NAME
    );
    console.log(`backgroundLocationTaskIsEnabled`, backgroundLocationTaskIsEnabled);
    if (backgroundLocationTaskIsEnabled === false) {
      await startBackgroundLocationTask();
    }

    if (nextAppState === 'active' && cloudSync === true && loggedIn === true && session) {
      const unsyncedBookings = await getUnsyncedBookingsFromDB();
      console.log(`unsyncedBookings`, unsyncedBookings);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    // TaskManager.unregisterAllTasksAsync();

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return children;
}
