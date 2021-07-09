import React, { useEffect } from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import merge from 'deepmerge';

import { useStore } from '../store';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { supabase } from '../../lib/supabase';

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export default function Navigation() {
  const cloudSync = useStore((state) => state.cloudSync);
  const loggedIn = useStore((state) => state.loggedIn);
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);

  const theme = useStore((state) => state.theme);
  const scheme = useColorScheme();

  useEffect(() => {
    if (cloudSync === true) {
      const refreshSession = async () => {
        const { data, error } = await supabase.auth.refreshSession();
        console.log(`refreshSession`, data, error);
        setSession(data);
      };

      refreshSession();
    }
  }, []);

  const preferredTheme = () => {
    switch (theme) {
      case 'system':
        return scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
      case 'dark':
        return CombinedDarkTheme;
      case 'light':
        return CombinedDefaultTheme;
      default:
        return scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
    }
  };

  const AuthAppStack = () => {
    // console.log(`cloudSync`, cloudSync);
    // console.log(`loggedIn`, loggedIn);
    // console.log(`session`, session);

    if (cloudSync === true && loggedIn === false) {
      return <AuthStack />;
    }

    if (cloudSync === true && loggedIn === true && session) {
      return <AppStack />;
    }

    if (cloudSync === false && loggedIn === false) {
      return <AuthStack />;
    }

    if (cloudSync === false && loggedIn === true) {
      return <AppStack />;
    }

    return null;
  };

  return (
    <AppearanceProvider>
      <PaperProvider theme={preferredTheme()}>
        <NavigationContainer theme={preferredTheme()}>
          <StatusBar style={!theme} />
          <AuthAppStack />
        </NavigationContainer>
      </PaperProvider>
    </AppearanceProvider>
  );
}
