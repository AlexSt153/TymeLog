import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Text, Surface, Colors } from 'react-native-paper';
import AddressLine from './AddressLine';
import { supabase } from '../../lib/supabase';
import moment from 'moment';
import * as _ from 'lodash';
import BookingIcon from './BookingIcon';

const deleteBooking = async (booking, getBookings) => {
  const { id } = booking;

  const { data, error } = await supabase.from('bookings').delete().match({ id });

  if (error) {
    console.log(error);
    return;
  }

  console.log(data);
  getBookings();
};

interface IBooking {
  item: any;
  nextItem: any;
  getBookings: () => void;
}

export default function Booking({ item, nextItem, getBookings }: IBooking) {
  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          padding: 8,
          height: 60,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
        }}
        onLongPress={() => {
          console.log('item :>> ', item);
          Alert.alert('Delete', 'Are you sure you want to delete this booking?', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                deleteBooking(item, getBookings);
              },
            },
          ]);
        }}
      >
        <BookingIcon item={item} nextItem={nextItem} />
        <View
          style={{
            width: '80%',
            flexDirection: 'column',
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text>{moment(item.timestamp).format('HH:mm:ss')}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <AddressLine address={item.address} />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
