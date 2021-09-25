import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, useWindowDimensions } from 'react-native';
import { Surface, IconButton, Colors, Card, Text } from 'react-native-paper';
import Database, { insert } from 'expo-sqlite-query-helper';
import * as Location from 'expo-location';
import { useStore } from '../store';
import History from '../components/History';
import { createBookingsTable } from '../database';
import { he } from 'date-fns/locale';

export default function HomeScreen({ navigation }) {
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

    if (ForegroundPermission.status === 'granted') {
      const location = await Location.getLastKnownPositionAsync();
      if (location !== null) {
        console.log('location :>> ', location);

        setLastBooking({ type, timestamp: location.timestamp, data: JSON.stringify({ location }) });

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
      }
    }
  };

  console.log('HomeScreen');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card
        style={{
          height: height * 0.2,
          marginTop: 15,
          marginHorizontal: 15,
          padding: height * 0.08,
          alignItems: 'center',
        }}
      >
        <Text>Charts maybe?</Text>
      </Card>
      <History lastBooking={lastBooking} refreshHistory={refreshHistory} />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
        }}
      >
        <Surface
          style={{
            backgroundColor: Colors.green600,
            borderRadius: 100,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'start'}
            icon="play-circle-outline"
            size={30}
            color={Colors.green100}
            onPress={() => insertBooking('start')}
          />
        </Surface>
        <Surface
          style={{
            backgroundColor: Colors.blue600,
            borderRadius: 100,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'pause' || lastBooking.type === 'end'}
            icon="pause-circle-outline"
            size={30}
            color={Colors.blue100}
            onPress={() => insertBooking('pause')}
          />
        </Surface>
        <Surface
          style={{
            backgroundColor: Colors.red600,
            borderRadius: 100,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'pause' || lastBooking.type === 'end'}
            icon="stop-circle-outline"
            size={30}
            color={Colors.red100}
            onPress={() => insertBooking('end')}
          />
        </Surface>
      </View>
    </SafeAreaView>
  );
}
