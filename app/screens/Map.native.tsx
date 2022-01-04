import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Circle } from 'react-native-maps';
import { LocationRegion } from 'expo-location';
import BottomSheet from '@gorhom/bottom-sheet';
import { useTheme, useRoute } from '@react-navigation/native';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { useStore } from '../store';
import moment from 'moment';
import { supabase } from '../../lib/supabase';
import { FlatList } from 'react-native-gesture-handler';
import BackgroundItem from '../components/BackgroundItem';

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

// TODO: Add props to launch in geofencingAdd mode -> select point on map or search for address, show old/all geofences on map

export default function Map({ navigation }) {
  const route = useRoute();
  // @ts-ignore
  const { date: paramDate } = route.params;

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date(paramDate));
  const [dateText, setdateText] = useState(format(new Date(), 'yyyy-MM-dd 00:00:00'));

  const [bookings, setBookings] = useState([]);
  const [markers, setMarkers] = useState([]);

  const initialRegion = useStore((state) => state.initialRegion);
  const setInitialRegion = useStore((state) => state.setInitialRegion);
  const regions = useStore((state) => state.regions);

  const { dark } = useTheme();
  const { colors } = usePaperTheme();

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['14%', '90%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getBookingsFromDB = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('type', 'background')
      .like('timestamp', `${moment(date).format('YYYY-MM-DD%')}`);
    if (error) {
      console.log(error);
    } else {
      setBookings(data);
    }
  };

  useEffect(() => {
    // get bookings or geofences from DB depending on mode
    const unsubscribe = navigation.addListener('focus', () => {
      getBookingsFromDB();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const bookingMarkers = [];

    bookings.forEach((booking) => {
      try {
        const { location } = booking;

        if (location) {
          bookingMarkers.push({
            latlng: location.coords,
            title: booking.id.toString(),
            description: booking.timestamp,
          });
        }
      } catch (error) {
        console.warn(error);
      }
    });

    setMarkers(bookingMarkers);
  }, [bookings]);

  useEffect(() => {
    if (markers.length > 0) {
      const coords = markers.map((marker) => marker.latlng);

      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 100, right: 100, bottom: 150, left: 100 },
        animated: true,
      });
    }
  }, [markers]);

  useEffect(() => {
    if (date) {
      setdateText(format(date, 'yyyy-MM-dd 00:00:00'));
      getBookingsFromDB();
    }
  }, [date]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        // onUserLocationChange={(event) => {
        //   getBookingsFromDB();
        // }}
        onRegionChangeComplete={(region) => {
          setInitialRegion(region);
        }}
        // @ts-ignore
        userInterfaceStyle={dark ? 'dark' : 'light'}
        style={styles.map}
        showsUserLocation
        initialRegion={initialRegion}
        minZoomLevel={8}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
        {regions.map((region: LocationRegion, index) => (
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
          <Card
            style={{
              width: '90%',
            }}
          >
            <View
              style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color={colors.text}
                onPress={() => {
                  setDate(new Date(moment(date).subtract(1, 'day').format()));
                }}
              />
              <Text onPress={() => setOpen(true)}>{moment(dateText).format('YYYY-MM-DD')}</Text>
              <Ionicons
                name="ios-arrow-forward"
                size={24}
                color={colors.text}
                onPress={() => {
                  setDate(new Date(moment(date).add(1, 'day').format()));
                }}
              />
            </View>
          </Card>
          <FlatList
            style={{
              width: '100%',
              marginTop: 20,
              marginBottom: 20,
            }}
            data={bookings}
            renderItem={({ item }) => <BackgroundItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
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
