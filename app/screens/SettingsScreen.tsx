import React, { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native';
import { Button, List, Switch } from 'react-native-paper';
import { AnimatePresence, MotiView } from 'moti';
import { useStore } from '../store';
import { dropTable } from 'expo-sqlite-query-helper';
import { createBookingsTable } from '../database';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  indicator: { height: 30, width: 30, borderRadius: 15 },
  button: {},
});

export default function SettingsScreen() {
  const { dark } = useTheme();

  const logOut = useStore((state) => state.logOut);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const lockSettings = useStore((state) => state.lockSettings);
  const setLockSettings = useStore((state) => state.setLockSettings);
  const encryption = useStore((state) => state.encryption);
  const setEncryption = useStore((state) => state.setEncryption);
  const cloudSync = useStore((state) => state.cloudSync);
  const setCloudSync = useStore((state) => state.setCloudSync);

  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState({
    granted: false,
  });
  const [hasBackgroundLocationPermission, setHasBackgroundLocationPermission] = useState({
    granted: false,
  });
  const [hasNotificationPermission, setHasNotificationPermission] = useState({ granted: false });

  useEffect(() => {
    Location.getForegroundPermissionsAsync().then((permissions) => {
      setHasForegroundLocationPermission(permissions);
    });

    Location.getBackgroundPermissionsAsync().then((permissions) => {
      setHasBackgroundLocationPermission(permissions);
    });

    Notifications.getPermissionsAsync().then((permissions) => {
      setHasNotificationPermission(permissions);
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, margin: 20 }}>
      <View style={styles.container}>
        <List.Section style={{ width: '100%' }}>
          <List.Subheader>THEME</List.Subheader>
          <List.Item
            title="Use System Light/Dark Mode"
            right={() => (
              <Switch
                value={theme === 'system'}
                onValueChange={() => {
                  switch (theme) {
                    case 'system':
                      setTheme(dark ? 'dark' : 'light');

                      break;
                    default:
                      setTheme('system');
                  }
                }}
              />
            )}
          />
          <AnimatePresence>
            {theme !== 'system' && (
              <MotiView
                from={{ height: 0 }}
                animate={{ height: 100 }}
                exit={{ height: 0 }}
                transition={{
                  type: 'timing',
                  duration: 350,
                }}
                style={{ overflow: 'hidden' }}
              >
                <List.Item
                  title="Light Theme"
                  right={() => (
                    <Switch
                      value={theme === 'light'}
                      onValueChange={(lightSwitchValue) =>
                        setTheme(lightSwitchValue ? 'light' : 'dark')
                      }
                    />
                  )}
                />
                <List.Item
                  title="Dark Theme"
                  right={() => (
                    <Switch
                      value={theme === 'dark'}
                      onValueChange={(darkSwitchValue) =>
                        setTheme(darkSwitchValue ? 'dark' : 'light')
                      }
                    />
                  )}
                />
              </MotiView>
            )}
          </AnimatePresence>
          <List.Subheader>GENERAL</List.Subheader>
          <List.Item
            title="Secure settings"
            right={() => (
              <Switch
                disabled
                value={lockSettings}
                onValueChange={() => setLockSettings(!lockSettings)}
              />
            )}
          />
          <List.Item
            title="Encryption"
            right={() => (
              <Switch
                disabled
                value={encryption}
                onValueChange={() => setEncryption(!encryption)}
              />
            )}
          />
          <List.Item
            title="Cloud Sync"
            right={() => (
              <Switch disabled value={cloudSync} onValueChange={() => setCloudSync(!cloudSync)} />
            )}
          />
          <List.Subheader>PERMISSIONS</List.Subheader>
          <List.Item
            title="Foreground Location"
            right={() => (
              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: hasForegroundLocationPermission.granted ? 'green' : 'red',
                  },
                ]}
              />
            )}
          />
          <List.Item
            title="Background Location"
            right={() => (
              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: hasBackgroundLocationPermission.granted ? 'green' : 'red',
                  },
                ]}
              />
            )}
          />
          <List.Item
            title="Notifications"
            right={() => (
              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: hasNotificationPermission.granted ? 'green' : 'red',
                  },
                ]}
              />
            )}
          />
        </List.Section>
        <View style={{ flexDirection: 'row' }}>
          <Button
            onPress={() => {
              Alert.alert(
                'Delete data',
                'Are you sure you want purge all data from the datebase?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Yes!',
                    onPress: () => {
                      dropTable('bookings');
                      createBookingsTable();
                    },
                  },
                ],
                {
                  cancelable: true,
                }
              );
            }}
            style={styles.button}
          >
            Delete data
          </Button>
          <Button
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
      </View>
    </SafeAreaView>
  );
}
