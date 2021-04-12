import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { useStore } from '../store';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default function SettingsScreen() {
  const logOut = useStore((state) => state.logOut);

  return (
    <View style={styles.container}>
      <Title>Settings!</Title>
      <Button
        mode="logout"
        onPress={() => {
          logOut();
        }}
        style={styles.button}
      >
        Logout
      </Button>
    </View>
  );
}
