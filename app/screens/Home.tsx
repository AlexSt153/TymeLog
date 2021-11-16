import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import moment from 'moment';
import { useStore } from '../store';
import History from '../components/History';
import { getAllBookings, insertBookings } from '../api/bookings';
import { deviceOS, isIOS } from '../tools/deviceInfo';
import BookingButtons from '../components/BookingButtons';
import { supabase } from '../../lib/supabase';

export default function Home({ navigation }) {
  const session = useStore((state) => state.session);
  const bookings = useStore((state) => state.bookings);
  const setBookings = useStore((state) => state.setBookings);

  const [refreshing, setRefreshing] = useState(false);
  const [lastBookingType, setLastBookingType] = useState('');
  const [ForegroundPermission, setForegroundPermission] = useState({ status: 'unknown' });

  const getBookings = async () => {
    setRefreshing(true);

    const { bookings, error } = await getAllBookings();

    if (error) {
      console.log(error);
    } else {
      setBookings(bookings.reverse());
      setRefreshing(false);
    }
  };

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then((status) => setForegroundPermission(status));
    const bookingChangeSubscription = supabase
      .from('bookings')
      .on('*', () => {
        getBookings();
      })
      .subscribe();

    return () => {
      bookingChangeSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      getBookings();
    });

    return unsubscribe;
  }, [navigation]);

  const addBooking = async (type: string) => {
    console.log('type', type);

    let location = null;
    if (isIOS) {
      location = await Location.getLastKnownPositionAsync();
    } else {
      location = await Location.getCurrentPositionAsync({});
    }
    console.log('location :>> ', location);

    setLastBookingType(type);

    const { data, error } = await insertBookings([
      {
        user_id: session.user.id,
        type,
        location,
        timestamp: moment().format(),
        origin: deviceOS,
      },
    ]);
    console.log('insert supabase', { data, error });

    getBookings();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <History bookings={bookings} getBookings={getBookings} refreshing={refreshing} />
      <BookingButtons addBooking={addBooking} lastBookingType={lastBookingType} />
    </SafeAreaView>
  );
}
