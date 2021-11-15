import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, useWindowDimensions } from 'react-native';
import { IconButton, Colors, Card, Text } from 'react-native-paper';
import Database, { insert } from 'expo-sqlite-query-helper';
import * as Location from 'expo-location';
import { useStore } from '../store';
import History from '../components/History';
import { createBookingsTable } from '../database';

export default function Home({ navigation }) {
  const lastBooking = useStore((state) => state.lastBooking);
  const setLastBooking = useStore((state) => state.setLastBooking);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [ForegroundPermission, setForegroundPermission] = useState({ status: 'unknown' });

  const { width, height } = useWindowDimensions();

  Database('tymelog.db');

  useEffect(() => {
    createBookingsTable();
    Location.requestForegroundPermissionsAsync().then((status) => setForegroundPermission(status));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      setRefreshHistory((prevState) => !prevState);
    });

    return unsubscribe;
  }, [navigation]);

  const insertBooking = async (type) => {
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

    insert('bookings', [
      {
        type,
        data: JSON.stringify({ location }),
      },
    ])
      .then(({ rowAffected, lastQuery }) => {
        console.log('insertBooking success', rowAffected, lastQuery);
      })
      .catch((e) => console.log(e));
    // }
    // }
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
            onPress={() => insertBooking('start')}
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
            onPress={() => insertBooking('pause')}
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
            onPress={() => insertBooking('end')}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}
