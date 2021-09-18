import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { LocationGeofencingEventType } from 'expo-location';
import { insert } from 'expo-sqlite-query-helper';
// import { presentNotificationAsync } from './NotificationHandler';
import { useStore } from '../store';

const isWeb = Platform.OS === 'web';
export const GEOFENCING_TASK_NAME = 'background-geofencing-task';
const geofencingBounceTimeout = Platform.OS === 'android' ? 5000 : 1000;
let lastDate = new Date();
let lastTimeStamp = lastDate.getTime();

export const startGeofenceTracking = async () => {
  const setRegions = useStore.getState().setRegions;

  const location = await Location.getCurrentPositionAsync();

  lastTimeStamp = location.timestamp;
  const regions = [];

  if (location) {
    insert('bookings', [
      {
        type: 'background',
        data: JSON.stringify({ location }),
      },
    ])
      .then(({ rowAffected, lastQuery }) => {
        console.log('background-location-task success', rowAffected, lastQuery);
      })
      .catch((e) => console.log(e));

    let radius = 2 * location.coords.speed * location.coords.speed;

    if (radius < 100) radius = 100;
    if (radius > 2000) radius = 2000;

    console.log(`radius`, radius);

    regions.push({
      identifier: 'CurrentPosition',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      radius: radius,
      notifyOnEntry: false,
      notifyOnExit: true,
    });

    setRegions(regions);
    // presentNotificationAsync({ title: 'New regions', body: JSON.stringify(regions) });

    await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, regions);
  }
};

// @ts-ignore
TaskManager.defineTask(GEOFENCING_TASK_NAME, async ({ data: { eventType, region }, error }) => {
  if (error) {
    console.log('defineTask error background geofencing', error.message);
    return;
  }

  if (eventType === LocationGeofencingEventType.Exit) {
    const newDate = new Date();
    const newTimeStamp = newDate.getTime();

    if (newTimeStamp - lastTimeStamp > geofencingBounceTimeout) {
      // presentNotificationAsync({ title: 'You have left the region', body: JSON.stringify(region) });

      lastTimeStamp = newTimeStamp;
      await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
      await startGeofenceTracking();
    }
  }
});

export default function BackgroundLocationTask({ children }) {
  const [isAvailable, setIsAvailable] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [permission, setPermission] = useState({});

  useEffect(() => {
    console.log('check if TaskManager is available');

    TaskManager.isAvailableAsync().then((tmAvailable) => {
      console.log('TaskManager is available', tmAvailable);
      setIsAvailable(tmAvailable === true ? 1 : 0);
    });
  }, []);

  useEffect(() => {
    console.log('TaskManager isAvailable', isAvailable);

    if (isAvailable === 1) {
      TaskManager.isTaskRegisteredAsync(GEOFENCING_TASK_NAME).then((tmRegistered) => {
        setIsRegistered(tmRegistered);
      });
    }
  }, [isAvailable]);

  useEffect(() => {
    console.log(`Task ${GEOFENCING_TASK_NAME} isRegistered`, isRegistered);

    if (isRegistered === false) {
      const requestPermissionAndStartBackgroundLocationTask = () => {
        Location.requestBackgroundPermissionsAsync()
          .then((permission) => {
            setPermission(permission);
          })
          .catch((err) => console.log('geofencing service error', err.message));
      };

      requestPermissionAndStartBackgroundLocationTask();
    }
  }, [isRegistered]);

  useEffect(() => {
    console.log(`Task ${GEOFENCING_TASK_NAME} location permission`, permission);

    if (permission === 'granted' && !isWeb) {
      startGeofenceTracking();
    }
  }, [permission]);

  return children;
}
