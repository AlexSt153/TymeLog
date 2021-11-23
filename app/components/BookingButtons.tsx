import React from 'react';
import { View } from 'react-native';
import { IconButton, Colors, Card } from 'react-native-paper';

export default function BookingButtons({ addBooking, lastBookingType }) {
  return (
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
          disabled={lastBookingType === 'start'}
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
          disabled={lastBookingType === 'pause' || lastBookingType === 'end'}
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
          disabled={lastBookingType === 'pause' || lastBookingType === 'end'}
          icon="stop-circle-outline"
          size={30}
          color={Colors.red100}
          onPress={() => addBooking('end')}
        />
      </Card>
    </View>
  );
}
