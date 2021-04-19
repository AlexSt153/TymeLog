import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native';
import { Title, Button, List, Switch, Checkbox } from 'react-native-paper';
import { useStore } from '../store';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default function SettingsScreen() {
  const { dark } = useTheme();
  const [darkMode, setDarkMode] = useState(true);

  const logOut = useStore((state) => state.logOut);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const lockSettings = useStore((state) => state.lockSettings);
  const setLockSettings = useStore((state) => state.setLockSettings);
  const encryption = useStore((state) => state.encryption);
  const setEncryption = useStore((state) => state.setEncryption);
  const cloudSync = useStore((state) => state.cloudSync);
  const setCloudSync = useStore((state) => state.setCloudSync);

  return (
    <SafeAreaView style={{ flex: 1, margin: 20 }}>
      <Title>Settings!</Title>
      <View style={styles.container}>
        <List.Section style={{ width: '100%' }}>
          <List.Subheader>THEME</List.Subheader>
          <List.Item
            title="Use System Light/Dark Mode"
            right={() => (
              <Checkbox
                status={darkMode ? 'checked' : 'unchecked'}
                onPress={() => {
                  switch (theme) {
                    case 'system':
                      setTheme(dark ? 'dark' : 'light');
                      setDarkMode(false);
                      break;
                    default:
                      setTheme('system');
                      setDarkMode(true);
                  }
                }}
              />
            )}
          />
          {theme !== 'system' && (
            <>
              <List.Item
                title="Light Theme"
                right={() => (
                  <Checkbox
                    status={theme === 'light' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setTheme('light');
                    }}
                  />
                )}
              />
              <List.Item
                title="Dark Theme"
                right={() => (
                  <Checkbox
                    status={theme === 'dark' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setTheme('dark');
                    }}
                  />
                )}
              />
            </>
          )}
          <List.Subheader>GENERAL</List.Subheader>
          <List.Item
            title="Secure settings"
            right={() => (
              <Switch value={lockSettings} onValueChange={() => setLockSettings(!lockSettings)} />
            )}
          />
          <List.Item
            title="Encryption"
            right={() => (
              <Switch value={encryption} onValueChange={() => setEncryption(!encryption)} />
            )}
          />
          <List.Item
            title="Cloud Sync"
            right={() => (
              <Switch value={cloudSync} onValueChange={() => setCloudSync(!cloudSync)} />
            )}
          />
        </List.Section>
        <Button
          mode="logout"
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Yes!',
                  onPress: () => logOut(),
                },
              ],
              {
                cancelable: true,
              }
            );
          }}
          style={styles.button}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
}
