import { search } from 'expo-sqlite-query-helper';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useStore } from '../store';

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
