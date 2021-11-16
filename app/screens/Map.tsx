import React from 'react';
import { View, StyleSheet } from 'react-native';
import GoogleMapReact from 'google-map-react';
import { WEB_GOOGLE_MAPS_API_KEY } from '@env';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default function Map() {
  return (
    <View style={styles.container}>
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: WEB_GOOGLE_MAPS_API_KEY }}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
          defaultZoom={8}
        ></GoogleMapReact>
      </div>
    </View>
  );
}
