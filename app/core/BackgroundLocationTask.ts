import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { LocationGeofencingEventType } from 'expo-location';
import { insert } from 'expo-sqlite-query-helper';

const isWeb = Platform.OS === 'web';
const LOCATION_TASK_NAME = 'background-location-task';
const GEOFENCING_TASK_NAME = 'background-geofencing-task';
let lastDate = new Date();
let lastTimeStamp = lastDate.getTime();

const startGeofenceTracking = async () => {
  const location = await Location.getCurrentPositionAsync();

  lastTimeStamp = location.timestamp;
  const regions = [];

  if (location) {
    // console.log(`location`, location);

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

    regions.push({
      identifier: 'CurrentPosition',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      radius: location.coords.speed * 10,
      notifyOnEntry: false,
      notifyOnExit: true,
    });

    await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, regions);
  }
};

// @ts-ignore
TaskManager.defineTask(GEOFENCING_TASK_NAME, async ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === LocationGeofencingEventType.Enter) {
    // console.log("You've entered region:", region);
  } else if (eventType === LocationGeofencingEventType.Exit) {
    const newDate = new Date();
    const newTimeStamp = newDate.getTime();

    if (newTimeStamp - lastTimeStamp > 1000) {
      console.log("You've left region:", region);
      lastTimeStamp = newTimeStamp;
      await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
      await startGeofenceTracking();
    }
  }
});

export default function BackgroundLocationTask({ children }) {
  const [isAvailable, setIsAvailable] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [permission, setPermission] = useState('unknown');

  useEffect(() => {
    console.log('check if TaskManager is available');

    TaskManager.isAvailableAsync().then((tmAvailable) => {
      console.log('TaskManager is available', tmAvailable);
      setIsAvailable(tmAvailable === true ? 1 : 0);
    });

    return () => {
      console.log('Unregister all tasks from TaskManager');
      TaskManager.unregisterAllTasksAsync();
    };
  }, []);

  useEffect(() => {
    console.log('TaskManager isAvailable', isAvailable);

    if (isAvailable === 1) {
      TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then((tmRegistered) => {
        setIsRegistered(tmRegistered);
      });
    }
  }, [isAvailable]);

  useEffect(() => {
    console.log(`Task ${LOCATION_TASK_NAME} isRegistered`, isRegistered);

    if (isRegistered === false) {
      const requestPermissionAndStartBackgroundLocationTask = async () => {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        setPermission(status);
      };

      requestPermissionAndStartBackgroundLocationTask();
    }
  }, [isRegistered]);

  useEffect(() => {
    console.log(`Task ${LOCATION_TASK_NAME} location permission`, permission);

    if (permission === 'granted' && !isWeb) {
      startGeofenceTracking();
    }
  }, [permission]);

  return children;
}
