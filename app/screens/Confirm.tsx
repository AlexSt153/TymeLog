import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions, StyleSheet, AppState } from 'react-native';
import { Headline, Paragraph, Text, Button, HelperText } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useStore } from '../store';

export default function Confirm() {
  const route: RouteProp<{ params: { email: string; password: string } }, 'params'> = useRoute();
  const { email, password } = route.params;

  const logIn = useStore((state) => state.logIn);
  const setUser = useStore((state) => state.setUser);
  const setSession = useStore((state) => state.setSession);
  const setCloudSync = useStore((state) => state.setCloudSync);
  const [errorMessage, setErrorMessage] = useState('');

  const tryLogIn = async () => {
    const { user, error } = await supabase.auth.signIn({ email, password });

    if (user) {
      console.log('user', user);
      const session = supabase.auth.session();

      setSession(session);
      setUser(session?.user ?? null);
      setCloudSync(true);
      logIn();
    }

    if (error) {
      console.log('error', error);
      setErrorMessage(error.message);
    }
  };

  const handleAppStateChange = async (appState) => {
    if (appState === 'active') {
      tryLogIn();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const { height } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: height * 0.5,
      paddingVertical: height * 0.2,
      width: '80%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    confirm: {
      height: height * 0.3,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  });

  const retrySignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.confirm}>
        <Headline>Confirm your email address</Headline>
        <Paragraph>We sent a confirmation email to:</Paragraph>
        <Text>{email}</Text>
        <Paragraph>Check your email and click on the confirmation link to continue.</Paragraph>
        <HelperText type="error" visible={errorMessage.length > 1}>
          {errorMessage}
        </HelperText>
      </View>
      <Button onPress={tryLogIn}>Done</Button>
      <Button onPress={retrySignUp}>Resend email</Button>
    </View>
  );
}
