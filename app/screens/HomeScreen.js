import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Title>Home!</Title>
    </View>
  );
}
