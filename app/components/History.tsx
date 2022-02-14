import React from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import moment from 'moment';
import * as _ from 'lodash';
import BookingHeader from './BookingHeader';
import WebFlatListWrapper from '../tools/WebFlatListWrapper';
import Booking from './Booking';

export default function History({ bookings, getBookings, getNextBookings, refreshing }) {
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 10,
      width: width - 20,
    },
    fab: {
      position: 'absolute',
      margin: 10,
      right: 0,
      top: 0,
    },
  });

  const ITEM_HEIGHT = 80;

  return (
    <Card style={styles.container}>
      {Object.keys(bookings).length > 0 ? (
        <WebFlatListWrapper>
          <FlatList
            style={{ flex: 1, width: '100%' }}
            data={Object.keys(bookings).sort((a, b) => moment(b).diff(a))}
            renderItem={({ item }) => {
              const backgroundBookings: any[] = bookings[item]['background'];
              let dayBookings: any[] = bookings[item]['dayBookings'];
              dayBookings = _.orderBy(dayBookings, ['timestamp'], ['asc']);

              return (
                <>
                  <BookingHeader
                    date={item}
                    dayBookings={dayBookings?.length > 0 ? dayBookings : null}
                    backgroundBookingCount={backgroundBookings?.length}
                  />
                  {dayBookings?.map((booking, index) => (
                    <Booking
                      item={booking}
                      nextItem={dayBookings[index + 1]}
                      getBookings={getBookings}
                    />
                  ))}
                </>
              );
            }}
          />
        </WebFlatListWrapper>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>No data</Text>
        </View>
      )}
    </Card>
  );
}
