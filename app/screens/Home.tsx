import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, useWindowDimensions } from 'react-native';
import { IconButton, Colors, Card, Text } from 'react-native-paper';
import Database from 'expo-sqlite-query-helper';
import * as Location from 'expo-location';
import { useStore } from '../store';
import History from '../components/History';
import { createBookingsTable } from '../database';
import { isNotWeb } from '../../App';
import { insertBooking } from '../api/bookings';

export default function Home({ navigation }) {
  const lastBooking = useStore((state) => state.lastBooking);
  const setLastBooking = useStore((state) => state.setLastBooking);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [ForegroundPermission, setForegroundPermission] = useState({ status: 'unknown' });

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (isNotWeb) {
      Database('tymelog.db');
      createBookingsTable();
    }
    Location.requestForegroundPermissionsAsync().then((status) => setForegroundPermission(status));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      setRefreshHistory((prevState) => !prevState);
    });

    return unsubscribe;
  }, [navigation]);

  const addBooking = async (type: string) => {
    console.log('type', type);

    // if (ForegroundPermission.status === 'granted') {
    const location = await Location.getLastKnownPositionAsync();
    // if (location !== null) {
    console.log('location :>> ', location);

    setLastBooking({
      type,
      timestamp: Date.now(),
      data: JSON.stringify({ location }),
    });

    try {
      const result = await insertBooking({ type, location });
      console.log('insert result', result);
    } catch (error) {
      console.log('insert error', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Card
        style={{
          height: height * 0.2,
          marginTop: 10,
          marginHorizontal: 10,
          padding: height * 0.08,
          alignItems: 'center',
        }}
      >
        <Text>Charts maybe?</Text>
      </Card> */}
      <History lastBooking={lastBooking} refreshHistory={refreshHistory} />
      <View
        style={{
          // position: 'absolute',
          marginBottom: 10,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
        }}
      >
        <Card
          style={{
            backgroundColor: Colors.green600,
            flex: 0.3,
            alignItems: 'center',
            // borderRadius: 100,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'start'}
            icon="play-circle-outline"
            size={30}
            color={Colors.green100}
            onPress={() => addBooking('start')}
          />
        </Card>
        <Card
          style={{
            backgroundColor: Colors.blue600,
            flex: 0.3,
            alignItems: 'center',
            // borderRadius: 100,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'pause' || lastBooking.type === 'end'}
            icon="pause-circle-outline"
            size={30}
            color={Colors.blue100}
            onPress={() => addBooking('pause')}
          />
        </Card>
        <Card
          style={{
            backgroundColor: Colors.red600,
            flex: 0.3,
            alignItems: 'center',
            // borderRadius: 100,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'pause' || lastBooking.type === 'end'}
            icon="stop-circle-outline"
            size={30}
            color={Colors.red100}
            onPress={() => addBooking('end')}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}
