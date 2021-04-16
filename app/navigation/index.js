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
import merge from 'deepmerge';

import { useStore } from '../store';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { supabase } from '../../lib/supabase';

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export default function Navigation() {
  const loggedIn = useStore((state) => state.loggedIn);
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);

  const scheme = useColorScheme();

  useEffect(() => {
    const refreshSession = async () => {
      const { data, error } = await supabase.auth.refreshSession();
      console.log(`refreshSession`, data, error);
      setSession(data);
    };

    refreshSession();
  }, []);

  return (
    <AppearanceProvider>
      <PaperProvider theme={scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
        <NavigationContainer theme={scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
          {loggedIn === true && session ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </PaperProvider>
    </AppearanceProvider>
  );
}
