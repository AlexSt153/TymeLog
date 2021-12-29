import React from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import moment from 'moment';
import * as _ from 'lodash';
import BookingHeader from './BookingHeader';
import WebFlatListWrapper from '../tools/WebFlatListWrapper';
import { isWeb } from '../tools/deviceInfo';
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
      {bookings.length > 0 ? (
        <WebFlatListWrapper>
          <FlatList
            style={{ flex: 1, width: '100%' }}
            data={bookings}
            getItemLayout={(data, index) => {
              if (isWeb) return null;
              return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
            }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(listItem) => {
              const { item } = listItem;
              let lastItem = null;
              let nextItem = null;
              let header: React.ReactNode | null = null;

              try {
                lastItem = bookings[listItem.index - 1];
              } catch (error) {
                console.log('error create lastItem', error);
              }

              try {
                nextItem = bookings[listItem.index + 1];
              } catch (error) {
                console.log('error create nextItem', error);
              }

              try {
                if (lastItem === undefined) {
                  const dayBookings = _.filter(bookings, (booking) => {
                    return moment(booking.timestamp).isSame(
                      moment(item.timestamp).format('YYYY-MM-DD'),
                      'day'
                    );
                  });

                  header = <BookingHeader date={item.timestamp} dayBookings={dayBookings} />;
                }

                if (
                  lastItem.type === 'start' &&
                  !moment(lastItem.timestamp).isSame(item.timestamp, 'day')
                ) {
                  const dayBookings = _.filter(bookings, (booking) => {
                    return moment(booking.timestamp).isSame(
                      moment(item.timestamp).format('YYYY-MM-DD'),
                      'day'
                    );
                  });

                  header = <BookingHeader date={item.timestamp} dayBookings={dayBookings} />;
                }
              } catch (error) {
                console.log(error);
              }

              return (
                <Booking
                  header={header}
                  item={item}
                  nextItem={nextItem}
                  getBookings={getBookings}
                />
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
