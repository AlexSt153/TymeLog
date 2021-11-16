import * as Location from 'expo-location';
import { cache } from '../cache';

interface Coords {
  latitude: number;
  longitude: number;
}

export const getCoordsResultFromCache = (coords: Coords) => {
  return new Promise(async (resolve, reject) => {
    const coordsJSON = JSON.stringify(coords);
    const coordsResult = await cache.get(coordsJSON);

    if (coordsResult !== undefined) {
      console.log('coordsResult from cache');
      resolve(JSON.parse(coordsResult));
    } else {
      console.log('coordsResult from api');
      Location.reverseGeocodeAsync(coords)
        .then((result) => {
          cache.set(coordsJSON, JSON.stringify(result[0]));
          resolve(result[0]);
        })
        .catch((error) => reject(error));
    }
  });
};
