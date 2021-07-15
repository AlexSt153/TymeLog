import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Surface, IconButton, Colors } from 'react-native-paper';
import Database, { insert } from 'expo-sqlite-query-helper';
import * as Location from 'expo-location';
import BackgroundLocationTask from '../BackgroundLocationTask';
import { useStore } from '../store';
import History from '../components/History';
import { createBookingsTable } from '../database';

export default function HomeScreen({ navigation }) {
  const lastBooking = useStore((state) => state.lastBooking);
  const setLastBooking = useStore((state) => state.setLastBooking);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [ForegroundPermission, setForegroundPermission] = useState('');

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
          .then(({ row, rowAffected, insertID, lastQuery }) => {
            console.log('success', row, rowAffected, insertID, lastQuery);
          })
          .catch((e) => console.log(e));
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
      <BackgroundLocationTask />
    </View>
  );
}
