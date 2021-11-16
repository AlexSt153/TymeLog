import React, { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Button, List, Switch, Card } from 'react-native-paper';
import { AnimatePresence, MotiView } from 'moti';
import { useStore } from '../store';
import { dropTable } from 'expo-sqlite-query-helper';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import {
  BACKGROUND_LOCATION_TASK_NAME,
  GEOFENCING_TASK_NAME,
} from '../core/BackgroundLocationTask';
import { isNotWeb } from '../../App';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingBottom: 20,
  },
  indicator: { height: 25, width: 25, borderRadius: 15, alignSelf: 'center' },
  button: {},
  card: { paddingHorizontal: 10, paddingVertical: 5, marginVertical: 5 },
});

export default function Settings({ navigation }) {
  const { dark } = useTheme();

  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);

  const [hasForegroundLocationPermission, setHasForegroundLocationPermission] = useState({
    granted: false,
  });
  const [hasBackgroundLocationPermission, setHasBackgroundLocationPermission] = useState({
    granted: false,
  });
  const [hasNotificationPermission, setHasNotificationPermission] = useState({ granted: false });
  const [hasGeofencingStarted, setHasGeofencingStarted] = useState(false);
  const [hasBackgroundLocationUpdates, setHasBackgroundLocationUpdates] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Location.getForegroundPermissionsAsync().then((permissions) => {
        setHasForegroundLocationPermission(permissions);
      });

      Location.getBackgroundPermissionsAsync().then((permissions) => {
        setHasBackgroundLocationPermission(permissions);
      });

      Notifications.getPermissionsAsync().then((permissions) => {
        setHasNotificationPermission(permissions);
      });

      if (isNotWeb) {
        Location.hasStartedGeofencingAsync(GEOFENCING_TASK_NAME).then((started) => {
          setHasGeofencingStarted(started);
        });

        Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME).then((started) => {
          setHasBackgroundLocationUpdates(started);
        });
      }

      console.log('session :>> ', session);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <List.Section style={{ width: '100%' }}>
          <Card style={styles.card}>
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
          </Card>
          <Card style={styles.card}>
            <List.Subheader>LOCATION</List.Subheader>
            <List.Item
              title="Geofencing"
              right={() => (
                <View
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: hasGeofencingStarted ? 'green' : 'red',
                    },
                  ]}
                />
              )}
            />
            <List.Item
              title="Background Updates"
              right={() => (
                <View
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: hasBackgroundLocationUpdates ? 'green' : 'red',
                    },
                  ]}
                />
              )}
            />
          </Card>
          <Card style={styles.card}>
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
          </Card>
        </List.Section>
        <View style={{ flexDirection: 'row' }}>
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
                    onPress: () => {
                      setSession(null);
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
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
