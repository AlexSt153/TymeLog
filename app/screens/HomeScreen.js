import React, { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Surface, Title, Headline, IconButton, Colors } from 'react-native-paper';
import Database, { createTable, insert } from 'expo-sqlite-query-helper';
import * as Location from 'expo-location';
import { addSeconds, differenceInSeconds } from 'date-fns';
import distanceInWordsStrict from 'date-fns/formatDistanceStrict';
import { de } from 'date-fns/locale';
import BackgroundLocationTask from '../BackgroundLocationTask';
import { useStore } from '../store';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-evenly', alignItems: 'center' },
  surface: {
    padding: 8,
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default function HomeScreen() {
  const { dark } = useTheme();
  const lastBooking = useStore((state) => state.lastBooking);
  const setLastBooking = useStore((state) => state.setLastBooking);

  const [ForegroundPermission, setForegroundPermission] = useState('');
  const [lastBookingTimePassed, setLastBookingTimePassed] = useState(null);

  Database('tymelog.db');

  useEffect(() => {
    createTable('bookings', {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      origin: 'TEXT',
      type: 'TEXT',
      timestamp: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
      data: 'TEXT',
      encrypted: 'TEXT DEFAULT "false" NOT NULL',
      synced: 'TEXT DEFAULT "false" NOT NULL',
    }).then(({ row, rowAffected, insertID, lastQuery }) =>
      console.log('success', row, rowAffected, insertID, lastQuery)
    );

    Location.requestForegroundPermissionsAsync().then((status) => setForegroundPermission(status));
  }, []);

  useEffect(() => {
    console.log(`lastBooking`, lastBooking);

    if (lastBooking.type === 'start') {
      const timePassedInterval = setInterval(() => {
        const seconds = differenceInSeconds(new Date(), lastBooking.timestamp);
        const helperDate = addSeconds(new Date(0), seconds);
        console.log(`helperDate`, helperDate);
        setLastBookingTimePassed(distanceInWordsStrict(new Date(), helperDate, de));
      }, 1000);

      return () => {
        clearInterval(timePassedInterval);
      };
    }
  }, [lastBooking]);

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
    <SafeAreaView style={{ flex: 1, margin: 20 }}>
      <Title>Home!</Title>
      <View style={styles.container}>
        <Surface style={styles.surface}>
          {lastBooking !== null && lastBookingTimePassed !== null && (
            <Headline>{lastBookingTimePassed}</Headline>
          )}
        </Surface>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
          <Surface
            style={{
              backgroundColor: dark ? Colors.green200 : Colors.green600,
              borderColor: dark ? Colors.green600 : Colors.green200,
              borderRadius: 100,
              borderWidth: 1,
            }}
          >
            <IconButton
              icon="play-circle-outline"
              size={30}
              color={dark ? Colors.green600 : Colors.green200}
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
              icon="pause-circle-outline"
              size={30}
              color={dark ? Colors.blue600 : Colors.blue200}
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
              icon="stop-circle-outline"
              size={30}
              color={dark ? Colors.red600 : Colors.red200}
              onPress={() => insertBooking('end')}
            />
          </Surface>
        </View>
      </View>
      <BackgroundLocationTask />
    </SafeAreaView>
  );
}
