import { search } from 'expo-sqlite-query-helper';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import { useStore } from '../store';
import { startGeofenceTracking, GEOFENCING_TASK_NAME } from './BackgroundLocationTask';

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
      await startGeofenceTracking();
    }

    if (nextAppState === 'active' && cloudSync === true && loggedIn === true && session) {
      const unsyncedBookings = await getUnsyncedBookingsFromDB();
      console.log(`unsyncedBookings`, unsyncedBookings);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  return children;
}
