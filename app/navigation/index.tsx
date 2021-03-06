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
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);

  const theme = useStore((state) => state.theme);
  const scheme = useColorScheme();

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`);
      setSession(session);
    });

    return () => {
      authListener!.unsubscribe();
    };
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

  const statusBarStyle = () => {
    switch (theme) {
      case 'system':
        return scheme === 'dark' ? 'light' : 'dark';
      case 'dark':
        return 'light';
      case 'light':
        return 'dark';
      default:
        return scheme === 'dark' ? 'light' : 'dark';
    }
  };

  const AuthAppStack = () => {
    if (session) {
      return <AppStack />;
    }

    return <AuthStack />;
  };

  return (
    <AppearanceProvider>
      <PaperProvider theme={preferredTheme()}>
        <NavigationContainer theme={preferredTheme()}>
          <StatusBar style={statusBarStyle()} />
          <AuthAppStack />
        </NavigationContainer>
      </PaperProvider>
    </AppearanceProvider>
  );
}
