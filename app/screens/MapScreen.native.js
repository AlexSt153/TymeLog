import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Title } from 'react-native-paper';
import MapView from 'react-native-maps';

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
});

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Title>Map!</Title>
      <MapView style={styles.map} showsUserLocation />
    </View>
  );
}
