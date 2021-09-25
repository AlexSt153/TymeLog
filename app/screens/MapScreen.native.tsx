import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import MapView, { Marker, Circle } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { search, executeSql } from 'expo-sqlite-query-helper';
import { useTheme } from '@react-navigation/native';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { useStore } from '../store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default function MapScreen({ navigation }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const [startDateText, setStartDateText] = useState(format(new Date(), 'yyyy-MM-dd 00:00:00'));
  const [endDateText, setEndDateText] = useState(format(new Date(), 'yyyy-MM-dd 23:59:59'));

  const [bookings, setBookings] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState(null);
  const regions = useStore((state) => state.regions);

  // console.log('regions', regions);

  const { dark } = useTheme();
  const { colors } = usePaperTheme();

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '90%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getBookingsFromDB = async () => {
    // const result = await search('bookings', { timestamp: { $gt: 0 } });

    const result = await executeSql(
      `SELECT * FROM bookings WHERE timestamp BETWEEN '${startDateText}' AND '${endDateText}'`
    );

    console.log('result :>> ', result);

    if (Array.isArray(result.rows._array)) {
      setBookings(result.rows._array);

      const arrayLength = result.rows._array.length;
      if (arrayLength > 0) {
        const { data } = result.rows._array[arrayLength - 1];
        const dataJSON = JSON.parse(data);

        setRegion({
          latitude: dataJSON.location?.coords?.latitude,
          latitudeDelta: 0.054351194827738425,
          longitude: dataJSON.location?.coords?.longitude,
          longitudeDelta: 0.028632897433652715,
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBookingsFromDB();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const bookingMarkers = [];

    bookings.forEach((item) => {
      const data = JSON.parse(item.data);

      bookingMarkers.push({
        latlng: data.location.coords,
        title: item.id.toString(),
        description: item.timestamp,
      });
    });

    setMarkers(bookingMarkers);
  }, [bookings]);

  useEffect(() => {
    if (date) {
      setStartDateText(format(date, 'yyyy-MM-dd 00:00:00'));
      setEndDateText(format(date, 'yyyy-MM-dd 23:59:59'));
    }
  }, [date]);

  return (
    <View style={styles.container}>
      <MapView
        onUserLocationChange={(event) => {
          getBookingsFromDB();
        }}
        // @ts-ignore
        userInterfaceStyle={dark ? 'dark' : 'light'}
        style={styles.map}
        showsUserLocation
        initialRegion={region}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
        {regions.map((region, index) => (
          <Circle
            key={index}
            center={{ latitude: region.latitude, longitude: region.longitude }}
            radius={region.radius}
            strokeColor="rgba(0,0,255,0.5)"
            fillColor="rgba(0,0,255,0.5)"
          />
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{
          backgroundColor: colors.text,
        }}
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <View style={styles.contentContainer}>
          <Text onPress={() => setOpen(true)}>{startDateText}</Text>
          <Text onPress={() => setOpen(true)}>{endDateText}</Text>
          <DatePickerModal
            mode="single"
            visible={open}
            onDismiss={onDismissSingle}
            date={date}
            onConfirm={onConfirmSingle}
          />
        </View>
      </BottomSheet>
    </View>
  );
}
