import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { LocationGeofencingEventType } from 'expo-location';
import { insert } from 'expo-sqlite-query-helper';
import { presentNotificationAsync } from './NotificationHandler';
import { useStore } from '../store';

const isWeb = Platform.OS === 'web';
export const BACKGROUND_LOCATION_TASK_NAME = 'background-location-task';
export const GEOFENCING_TASK_NAME = 'background-geofencing-task';
const geofencingBounceTimeout = Platform.OS === 'android' ? 5000 : 1000;
let lastDate = new Date();
let lastTimeStamp = lastDate.getTime();
let lastLocation = null;

function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371000; // m
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function toRad(Value: number) {
  return (Value * Math.PI) / 180;
}

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

    let radius = location.coords.speed * location.coords.speed;

    if (radius < 100) radius = 100;
    if (radius > 1000) radius = 1000;

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
      // await startGeofenceTracking();
    }
  }
});

export const startBackgroundLocationTask = async () => {
  Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME, {
    pausesUpdatesAutomatically: true,
    deferredUpdatesDistance: 100,
    deferredUpdatesInterval: 60 * 1000,
  });
};

// @ts-ignore
TaskManager.defineTask(BACKGROUND_LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
  if (error) {
    console.log(`error`, error);
    return;
  }

  if (Array.isArray(locations)) {
    if (lastLocation !== null) {
      const distance = calcCrow(
        lastLocation.coords.latitude,
        lastLocation.coords.longitude,
        locations[locations.length - 1].coords.latitude,
        locations[locations.length - 1].coords.longitude
      );

      if (distance > 100) {
        lastLocation = locations[locations.length - 1];

        presentNotificationAsync({
          title: 'Received new locations',
          body: JSON.stringify(locations[locations.length - 1]),
        });

        insert('bookings', [
          {
            type: 'background',
            data: JSON.stringify({ location: locations[locations.length - 1] }),
          },
        ]);
      }
    } else {
      lastLocation = locations[locations.length - 1];
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
      // startGeofenceTracking();
      startBackgroundLocationTask();
    }
  }, [permission]);

  return children;
}
