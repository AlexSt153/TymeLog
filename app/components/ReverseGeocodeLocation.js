import React, { useState, useEffect } from 'react';
import { Caption } from 'react-native-paper';
import { getCoordsResultFromCache } from '../api/location';

export default function ReverseGeocodeLocation({ coords }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getCoordsResultFromCache({ coords }).then((result) => setLocation(result));
  }, []);

  if (location === null) return null;

  return (
    <Caption>
      {location.name}, {location.city}, {location.country}
    </Caption>
  );
}
