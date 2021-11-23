import React, { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import * as Location from 'expo-location';
import moment from 'moment';
import { useStore } from '../store';
import History from '../components/History';
import { insertBookings } from '../api/bookings';
import { deviceOS, isIOS } from '../tools/deviceInfo';
import BookingButtons from '../components/BookingButtons';
import { supabase } from '../../lib/supabase';

export default function Home({ navigation }) {
  const { colors } = useTheme();

  const session = useStore((state) => state.session);
  const bookings = useStore((state) => state.bookings);
  const setBookings = useStore((state) => state.setBookings);

  const [refreshing, setRefreshing] = useState(false);
  const [lastBookingType, setLastBookingType] = useState('');
  const [ForegroundPermission, setForegroundPermission] = useState({ status: 'unknown' });

  const getBookings = async () => {
    setRefreshing(true);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .range(0, 100)
      .neq('type', 'background')
      .order('timestamp', { ascending: true });

    if (error) {
      console.log(error);
    } else {
      setBookings(data);
      setRefreshing(false);
    }
  };

  const getNextBookings = async (offset: number) => {
    setRefreshing(true);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .range(1 + offset, 100 + offset)
      .neq('type', 'background')
      .order('timestamp', { ascending: true });

    if (error) {
      console.log(error);
    } else {
      setBookings(bookings.concat(data));
      setRefreshing(false);
    }
  };

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then((status) => setForegroundPermission(status));
    getBookings();
  }, []);

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15 }}>
        <Ionicons
          name={'settings'}
          size={25}
          color={colors.text}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
        <Ionicons
          name={'refresh'}
          size={25}
          color={colors.text}
          onPress={() => {
            getBookings();
          }}
        />
      </View>
      <History bookings={bookings} getNextBookings={getNextBookings} refreshing={refreshing} />
      <BookingButtons addBooking={addBooking} lastBookingType={lastBookingType} />
    </SafeAreaView>
  );
}
