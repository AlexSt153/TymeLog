import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { search } from 'expo-sqlite-query-helper';
import { useTheme } from '@react-navigation/native';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default function MapScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState(null);

  const { dark } = useTheme();

  const getBookingsFromDB = async () => {
    const result = await search('bookings');
    if (Array.isArray(result.rows._array)) {
      setBookings(result.rows._array);

      const arrayLength = result.rows._array.length;
      if (arrayLength > 0) {
        const { data } = result.rows._array[arrayLength - 1];
        const dataJSON = JSON.parse(data);

        setRegion({
          latitude: dataJSON.location?.coords?.latitude,
          latitudeDelta: 0.054351194827738425,
          longitude: dataJSON.location?.coords?.longitude,
          longitudeDelta: 0.028632897433652715,
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBookingsFromDB();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const bookingMarkers = [];

    bookings.forEach((item) => {
      const data = JSON.parse(item.data);

      bookingMarkers.push({
        latlng: data.location.coords,
        title: item.id.toString(),
        description: item.timestamp,
      });
    });

    setMarkers(bookingMarkers);
  }, [bookings]);

  return (
    <View style={styles.container}>
      <MapView
        onUserLocationChange={(event) => {
          getBookingsFromDB();
        }}
        // @ts-ignore
        userInterfaceStyle={dark ? 'dark' : 'light'}
        style={styles.map}
        showsUserLocation
        initialRegion={region}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={format(marker.description, 'DD/MM/YYYY HH:mm')}
          />
        ))}
      </MapView>
    </View>
  );
}
