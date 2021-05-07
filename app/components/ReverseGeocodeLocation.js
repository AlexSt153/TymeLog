import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Text } from 'react-native-paper';
import { cache } from '../cache';

export default function ReverseGeocodeLocation({ coords }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getCoordsResultFromCache = async () => {
      const coordsResult = await cache.get(coords);
      // console.log(`coordsResult`, coordsResult);

      if (coordsResult !== undefined) {
        setLocation(coordsResult);
      } else {
        Location.reverseGeocodeAsync(coords).then((result) => {
          cache.set(coords, result[0]);
          setLocation(result[0]);
        });
      }
    };

    getCoordsResultFromCache();
  }, []);

  useEffect(() => {
    // console.log(`location`, location);
  }, [location]);

  if (location === null) return null;

  return (
    <Text>
      {location.name}, {location.city}, {location.country}
    </Text>
  );
}
