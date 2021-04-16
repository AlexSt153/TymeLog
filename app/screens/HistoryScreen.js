import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, FlatList } from 'react-native';
import { Surface, Title, Text } from 'react-native-paper';
import { select } from 'easy-db-react-native';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default function HistoryScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    select('bookings').then((data) => {
      const arrayOfObj = Object.entries(data).map((e) => ({ [e[0]]: e[1] }));

      setBookings(arrayOfObj.reverse());
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
      <Title>History!</Title>
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1, width: '100%' }}
          data={bookings}
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
