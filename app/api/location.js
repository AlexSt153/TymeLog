import * as Location from 'expo-location';
import { cache } from '../cache';

export const getCoordsResultFromCache = ({ coords }) => {
  return new Promise(async (resolve, reject) => {
    const coordsResult = await cache.get(coords);

    if (coordsResult !== undefined) {
      resolve(coordsResult);
    } else {
      Location.reverseGeocodeAsync(coords)
        .then((result) => {
          cache.set(coords, result[0]);
          resolve(result[0]);
        })
        .catch((error) => reject(error));
    }
  });
};
