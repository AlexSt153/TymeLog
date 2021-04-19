import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Surface, Title, Text, FAB } from 'react-native-paper';
import * as Location from 'expo-location';
import { insert } from 'easy-db-react-native';
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
                const idOfRow = await insert('bookings', { location });
                console.log(`idOfRow`, idOfRow);
              }
            }
          }}
        />
      </View>
      <BackgroundLocationTask />
    </SafeAreaView>
  );
}
