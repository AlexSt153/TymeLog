import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { insert } from 'expo-sqlite-query-helper';

const isWeb = Platform.OS === 'web';
const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(`error`, error);
    return BackgroundFetch.Result.Failed;
  }
  if (data) {
    // @ts-ignore
    const { locations } = data;
    // do something with the locations captured in the background
    console.log(`locations`, locations);

    if (Array.isArray(locations)) {
      insert('bookings', [
        {
          type: 'background',
          data: JSON.stringify({ location: locations[0] }),
        },
      ])
        .then(({ rowAffected, lastQuery }) => {
          console.log('background-location-task success', rowAffected, lastQuery);
        })
        .catch((e) => console.log(e));
    }

    return locations ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
  }
});

export default function BackgroundLocationTask() {
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
      const startLocationTracking = async () => {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
        });
      };

      startLocationTracking();

      BackgroundFetch.registerTaskAsync(LOCATION_TASK_NAME, {
        minimumInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  }, [permission]);

  return null;
}
