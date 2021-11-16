import React, { useState, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { IconButton, Colors, Card } from 'react-native-paper';
import * as Location from 'expo-location';
import { useStore } from '../store';
import History from '../components/History';
import { insertBookings } from '../api/bookings';
import { format } from 'date-fns';
import { isNotWeb } from '../../App';

export default function Home({ navigation }) {
  const session = useStore((state) => state.session);
  const lastBooking = useStore((state) => state.lastBooking);
  const setLastBooking = useStore((state) => state.setLastBooking);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [ForegroundPermission, setForegroundPermission] = useState({ status: 'unknown' });

  useEffect(() => {
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

    let location = null;
    if (isNotWeb) {
      location = await Location.getLastKnownPositionAsync();
    } else {
      location = await Location.getCurrentPositionAsync({});
    }
    console.log('location :>> ', location);

    setLastBooking({
      type,
      timestamp: Date.now(),
      data: JSON.stringify({ location }),
    });

    try {
      const result = await insertBookings([
        {
          user_id: session.user.id,
          type,
          location,
          timestamp: format(new Date(), 'dd.mm.yyyy HH:mm:ss'),
        },
      ]);
      console.log('insert result', result);
    } catch (error) {
      console.log('insert error', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <History lastBooking={lastBooking} refreshHistory={refreshHistory} />
      <View
        style={{
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
