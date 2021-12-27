import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Surface, Colors, Card } from 'react-native-paper';
import moment from 'moment';
import AddressLine from './AddressLine';
import BookingHeader from './BookingHeader';
import WebFlatListWrapper from '../tools/WebFlatListWrapper';
import { isWeb } from '../tools/deviceInfo';
import { supabase } from '../../lib/supabase';

const _ = require('lodash');

const backgroundColor = (type) => {
  switch (type) {
    case 'start':
      return Colors.green600;
    case 'pause':
      return Colors.blue600;
    case 'end':
      return Colors.red600;
    default:
      return null;
  }
};

const textColor = (type) => {
  switch (type) {
    case 'start':
      return Colors.green100;
    case 'pause':
      return Colors.blue100;
    case 'end':
      return Colors.red100;
    default:
      return null;
  }
};

const borderColor = (type) => {
  switch (type) {
    case 'start':
      return Colors.green600;
    case 'pause':
      return Colors.blue600;
    case 'end':
      return Colors.red600;
    default:
      return null;
  }
};

const lineColor = (type) => {
  switch (type) {
    case 'start':
      return Colors.green600;
    case 'pause':
      return Colors.blue600;
    case 'end':
      return Colors.red600;
    default:
      return null;
  }
};

const connectNextItem = (nextItem) => {
  if (nextItem.type === 'end') return null;

  return (
    <Surface
      style={{
        position: 'absolute',
        left: 12.5,
        bottom: -42,
        height: 40,
        width: 2,
        elevation: 4,
        backgroundColor: lineColor(nextItem.type),
      }}
    >
      <View />
    </Surface>
  );
};

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
              let header = null;

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
                <>
                  {header}
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
                    <Surface
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        marginRight: 10,
                        backgroundColor: backgroundColor(item.type),
                        borderColor: borderColor(item.type),
                        borderWidth: 1,
                      }}
                    >
                      {_.has(nextItem, 'type') && connectNextItem(nextItem)}
                      <Text
                        style={{
                          fontSize: 20,
                          paddingTop: 2,
                          color: textColor(item.type),
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}
                      >
                        {item.type[0].toUpperCase()}
                      </Text>
                    </Surface>
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
