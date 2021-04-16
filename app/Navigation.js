import React from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import merge from 'deepmerge';

import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import MapScreen from './screens/MapScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useStore } from './store';
import SignUpScreen from './screens/SignUpScreen';
import { supabase } from '../lib/supabase';

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Navigation() {
  const loggedIn = useStore((state) => state.loggedIn);
  const session = supabase.auth.session();
  const scheme = useColorScheme();

  console.log(`loggedIn`, loggedIn);
  console.log(`session`, session);

  return (
    <AppearanceProvider>
      <PaperProvider theme={scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
        <NavigationContainer theme={scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
          {loggedIn === true && session ? (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = focused ? 'time' : 'time-outline';
                  } else if (route.name === 'History') {
                    iconName = focused ? 'list' : 'list-outline';
                  } else if (route.name === 'Map') {
                    iconName = focused ? 'map' : 'map-outline';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                  }

                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
              }}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="History" component={HistoryScreen} />
              <Tab.Screen name="Map" component={MapScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </PaperProvider>
    </AppearanceProvider>
  );
}
