import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { Divider, Text, Surface, Colors, Card } from 'react-native-paper';
import moment from 'moment';
import AddressLine from './AddressLine';

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

export default function History({ bookings, getBookings, refreshing }) {
  const flatListRef = useRef(null);
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

  useEffect(() => {
    try {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.log(error);
    }
  }, [bookings]);

  const ITEM_HEIGHT = 80;

  return (
    <Card style={styles.container}>
      {bookings.length > 0 ? (
        <FlatList
          ref={flatListRef}
          style={{ flex: 1, width: '100%' }}
          data={bookings}
          initialScrollIndex={bookings.length - 1}
          getItemLayout={(data, index) => {
            return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
          }}
          refreshing={refreshing}
          onRefresh={() => getBookings()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(listItem) => {
            try {
              const { item } = listItem;
              const { location } = item;

              const nextItem = bookings[listItem.index + 1];

              if (!location) return null;

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
                    {_.has(nextItem, 'type') && connectLastItem(item)}
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text>{moment(item.timestamp).format('HH:mm:ss')}</Text>
                      <Text>{moment(item.timestamp).format('DD.MM.YY')}</Text>
                    </View>
                    <AddressLine address={item.address} />
                  </View>
                </View>
              );
            } catch (error) {
              console.log(error);
              return null;
            }
          }}
          ItemSeparatorComponent={(props) => {
            if (props.leadingItem.type === 'background') return null;

            return <Divider />;
          }}
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
