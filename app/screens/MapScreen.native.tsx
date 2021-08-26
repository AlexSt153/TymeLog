import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Title } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { search } from 'expo-sqlite-query-helper';
import { useTheme } from '@react-navigation/native';

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

  const { dark } = useTheme();

  const getBookingsFromDB = async () => {
    const result = await search('bookings');
    if (Array.isArray(result.rows._array)) {
      setBookings(result.rows._array);
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
      <Title>Map!</Title>
      <MapView
        onUserLocationChange={() => {
          getBookingsFromDB();
        }}
        userInterfaceStyle={dark ? 'dark' : 'light'}
        style={styles.map}
        showsUserLocation
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
}
