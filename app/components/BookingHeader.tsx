import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, useTheme as usePaperTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';
import moment from 'moment';

interface Props {
  date: string;
  dayBookings: any[];
  backgroundBookingCount: number;
}

export const calculateMinutesWorked = (dayBookings: any[]): number => {
  let minutesWorked = 0;

  try {
    dayBookings.reverse().forEach((booking, index) => {
      switch (booking.type) {
        case 'start':
          minutesWorked += moment(dayBookings[index + 1].timestamp).diff(
            moment(booking.timestamp),
            'minutes'
          );
          break;
        case 'pause':
          break;
        case 'end':
          break;
        default:
          break;
      }
    });
  } catch (error) {
    console.log(error);
  }

  return minutesWorked;
};

export default function BookingHeader({ date, dayBookings, backgroundBookingCount }: Props) {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const { colors } = usePaperTheme();
  const formatedDate = moment(date).format('LL');

  if (formatedDate === 'Invalid date') return null;
  const workedMinutes = calculateMinutesWorked(dayBookings?.reverse());
  const workedHours = (workedMinutes / 60).toFixed(2).split('.')[0];
  const remainingMinutes = workedMinutes % 60;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: dark ? '#000' : '#ddd',
        margin: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      }}
    >
      <Text>{formatedDate}</Text>
      {dayBookings && (
        <Text>
          {workedHours}h {remainingMinutes}m
        </Text>
      )}
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          navigation.navigate('Map', { date });
        }}
      >
        <Ionicons name={'map'} size={20} color={colors.text} />
        {backgroundBookingCount > 0 && (
          <Text style={{ marginLeft: 5 }}>{backgroundBookingCount}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
