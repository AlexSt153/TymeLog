import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, FlatList } from 'react-native';
import { Divider, Title, Text, FAB } from 'react-native-paper';
import { search, deleteData } from 'expo-sqlite-query-helper';
import ReverseGeocodeLocation from '../components/ReverseGeocodeLocation';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fab: {
    position: 'absolute',
    margin: 30,
    right: 0,
    bottom: 0,
  },
});

export default function HistoryScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);

  const getBookingsFromDB = async () => {
    setRefreshing(true);
    const result = await search('bookings', null, { timestamp: 'DESC' });
    if (Array.isArray(result.rows._array)) {
      setBookings(result.rows._array);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBookingsFromDB();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setRefreshing(false);
  }, [bookings]);

  return (
    <SafeAreaView style={{ flex: 1, marginLeft: 20 }}>
      <Title>History!</Title>
      <View style={styles.container}>
        {bookings.length > 0 ? (
          <FlatList
            style={{ flex: 1, width: '100%', paddingRight: 20 }}
            data={bookings}
            refreshing={refreshing}
            onRefresh={() => getBookingsFromDB()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              // console.log(`item`, item);
              const data = JSON.parse(item.data);

              return (
                <View
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
                  <Text>{item.type}</Text>
                  <Text>{item.timestamp}</Text>
                  <ReverseGeocodeLocation coords={data.location.coords} />
                </View>
              );
            }}
            ItemSeparatorComponent={() => <Divider />}
          />
        ) : (
          <Text style={{ paddingRight: 20 }}>No data</Text>
        )}
        <FAB
          style={styles.fab}
          small
          icon="delete"
          onPress={async () => {
            await deleteData('bookings');
            getBookingsFromDB();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
