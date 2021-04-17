import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, FlatList } from 'react-native';
import { Surface, Title, Text } from 'react-native-paper';
import { select } from 'easy-db-react-native';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default function HistoryScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);

  const getBookingsFromDB = () => {
    setRefreshing(true);
    select('bookings').then((data) => {
      const arrayOfObj = Object.entries(data).map((e) => ({ [e[0]]: e[1] }));

      setBookings(arrayOfObj.reverse());                                  
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      getBookingsFromDB();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setRefreshing(false);
  }, [bookings]);

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
      <Title>History!</Title>
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1, width: '100%' }}
          data={bookings}
          refreshing={refreshing}
          onRefresh={() => getBookingsFromDB()}
          renderItem={({ item }) => (
            <Surface
              style={{
                marginBottom: 10,
                padding: 8,
                height: 100,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4,
              }}
            >
              <Text>{JSON.stringify(item)}</Text>
            </Surface>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
