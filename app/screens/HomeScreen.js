import React, { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { View, SafeAreaView } from 'react-native';
import { Surface, Title, IconButton, Colors } from 'react-native-paper';
import Database, { insert } from 'expo-sqlite-query-helper';
import * as Location from 'expo-location';
import BackgroundLocationTask from '../BackgroundLocationTask';
import { useStore } from '../store';
import History from '../components/History';
import { createBookingsTable } from '../database';

export default function HomeScreen({ navigation }) {
  const { dark } = useTheme();
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
    <SafeAreaView style={{ flex: 1 }}>
      <Title style={{ marginLeft: 20 }}>Home!</Title>
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
            backgroundColor: dark ? Colors.green200 : Colors.green600,
            borderColor: dark ? Colors.green600 : Colors.green200,
            borderRadius: 100,
            borderWidth: 1,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'start'}
            icon="play-circle-outline"
            size={30}
            color={dark ? Colors.green700 : Colors.green100}
            onPress={() => insertBooking('start')}
          />
        </Surface>
        <Surface
          style={{
            backgroundColor: dark ? Colors.blue200 : Colors.blue600,
            borderColor: dark ? Colors.blue600 : Colors.blue200,
            borderRadius: 100,
            borderWidth: 1,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'pause' || lastBooking.type === 'end'}
            icon="pause-circle-outline"
            size={30}
            color={dark ? Colors.blue700 : Colors.blue100}
            onPress={() => insertBooking('pause')}
          />
        </Surface>
        <Surface
          style={{
            backgroundColor: dark ? Colors.red200 : Colors.red600,
            borderColor: dark ? Colors.red600 : Colors.red200,
            borderRadius: 100,
            borderWidth: 1,
          }}
        >
          <IconButton
            disabled={lastBooking.type === 'pause' || lastBooking.type === 'end'}
            icon="stop-circle-outline"
            size={30}
            color={dark ? Colors.red700 : Colors.red100}
            onPress={() => insertBooking('end')}
          />
        </Surface>
      </View>
      <BackgroundLocationTask />
    </SafeAreaView>
  );
}
