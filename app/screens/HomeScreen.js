import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Surface, Title, Text, FAB } from 'react-native-paper';
import Database, { createTable, insert } from 'expo-sqlite-query-helper';
import * as Location from 'expo-location';
import format from 'date-fns/format';
import BackgroundLocationTask from '../BackgroundLocationTask';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  surface: {
    padding: 8,
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 0,
    bottom: 0,
  },
});

export default function HomeScreen() {
  Database('tymelog.db');

  useEffect(() => {
    createTable('bookings', {
      id: 'INTEGER PRIMARY KEY',
      origin: 'TEXT',
      type: 'TEXT',
      timestamp: 'TEXT',
      data: 'TEXT',
      encrypted: 'TEXT',
      synced: 'TEXT',
    }).then(({ row, rowAffected, insertID, lastQuery }) =>
      console.log('success', row, rowAffected, insertID, lastQuery)
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, margin: 20 }}>
      <Title>Home!</Title>
      <View style={styles.container}>
        <Surface style={styles.surface}>
          <Text>Placeholder!</Text>
        </Surface>
        <FAB
          style={styles.fab}
          small
          icon="plus"
          onPress={async () => {
            console.log('Pressed');
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const location = await Location.getLastKnownPositionAsync();
              if (location !== null) {
                console.log('location :>> ', location);

                insert('bookings', [
                  {
                    timestamp: format(new Date(location.timestamp), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
                    data: JSON.stringify({ location }),
                    encrypted: 'false',
                  },
                ])
                  .then(({ row, rowAffected, insertID, lastQuery }) => {
                    console.log('success', row, rowAffected, insertID, lastQuery);
                  })
                  .catch((e) => console.log(e));
              }
            }
          }}
        />
      </View>
      <BackgroundLocationTask />
    </SafeAreaView>
  );
}
