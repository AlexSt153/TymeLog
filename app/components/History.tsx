import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { Divider, Text, Surface, Colors, Card } from 'react-native-paper';
import { executeSql, search } from 'expo-sqlite-query-helper';
import ReverseGeocodeLocation from './ReverseGeocodeLocation';
import { format } from 'date-fns';

const _ = require('lodash');

export default function History({ lastBooking, refreshHistory }) {
  // let listViewRef;
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);

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

  const getBookingsFromDB = async () => {
    setRefreshing(true);
    const result = await executeSql(
      'SELECT * FROM bookings WHERE type != "background" ORDER BY timestamp DESC'
    );
    // const result = await search('bookings', { type: 'background' }, { timestamp: 'DESC' });

    if (Array.isArray(result.rows._array)) {
      setBookings(result.rows._array);
    }
  };

  useEffect(() => {
    getBookingsFromDB();
  }, [lastBooking, refreshHistory]);

  useEffect(() => {
    // console.log(`bookings`, bookings);
    setRefreshing(false);
    // if (listViewRef) listViewRef.scrollToEnd({ animated: true });
  }, [bookings]);

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

  const connectLastItem = (item) => {
    if (item.type === 'end') return null;

    return (
      <Surface
        style={{
          position: 'absolute',
          left: 12.5,
          bottom: -42,
          height: 40,
          width: 2,
          elevation: 4,
          backgroundColor: lineColor(item.type),
        }}
      >
        <View />
      </Surface>
    );
  };

  return (
    <Card style={styles.container}>
      {bookings.length > 0 ? (
        <FlatList
          // ref={(ref) => {
          //   listViewRef = ref;
          // }}
          style={{ flex: 1, width: '100%' }}
          inverted
          data={bookings}
          refreshing={refreshing}
          onRefresh={() => getBookingsFromDB()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(listItem) => {
            const { item } = listItem;
            const data = JSON.parse(item.data);
            // console.log(`data`, data);

            if (item.type === 'background') return null;

            const lastItem = bookings[listItem.index - 1];

            if (!data.location) return null;

            return (
              <View
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
                  {_.has(lastItem, 'type') && connectLastItem(item)}
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
                    flexWrap: 'wrap',
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{format(data.location.timestamp, 'HH:mm:ss')}</Text>
                    <Text>{format(data.location.timestamp, 'dd.MM.yy')}</Text>
                  </View>
                  <ReverseGeocodeLocation coords={data.location.coords} />
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={(props) => {
            if (props.leadingItem.type === 'background') return null;

            return <Divider />;
          }}
          // ListHeaderComponent={() => <View style={{ height: 80 }} />}
          // ListFooterComponent={() => <View style={{ height: 50 }} />}
        />
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
