import React from 'react';
import { View } from 'react-native';
import { Surface, Text, Colors } from 'react-native-paper';
import * as _ from 'lodash';

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

export default function BookingIcon({ item, nextItem }) {
  return (
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
  );
}
