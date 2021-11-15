import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useStore } from '../store';

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  textInput: { height: 50, width: '80%', marginBottom: 20 },
  row: { width: '80%', flexDirection: 'row', justifyContent: 'space-between' },
  button: {},
});

export default function SignIn() {
  const navigation = useNavigation();

  const logIn = useStore((state) => state.logIn);
  const setUser = useStore((state) => state.setUser);
  const setSession = useStore((state) => state.setSession);
  const setCloudSync = useStore((state) => state.setCloudSync);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signIn({ email, password });

    if (error) {
      console.log(error);
      setErrorMessage(error.message);
    }

    if (user) {
      console.log(`user`, user);
      const session = supabase.auth.session();

      setSession(session);
      setUser(session?.user ?? null);
      setCloudSync(true);
      logIn();
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TextInput
          label="Email"
          autoCompleteType="email"
          value={email}
          onChangeText={setEmail}
          style={styles.textInput}
        />
        <TextInput
          label="Password"
          secureTextEntry
          autoCompleteType="password"
          value={password}
          onChangeText={setPassword}
          style={styles.textInput}
        />
        <HelperText type="error" visible={errorMessage.length > 1}>
          {errorMessage}
        </HelperText>
        <View style={styles.row}>
          <Button
            mode="text"
            onPress={() => {
              console.log('navigate to SignUpScreen');
              navigation.navigate('SignUp', {
                email,
                password,
              });
            }}
            style={styles.button}
          >
            SignUp
          </Button>
          <Button icon="login" mode="contained" onPress={() => handleLogin()} style={styles.button}>
            Login
          </Button>
        </View>
      </KeyboardAvoidingView>
      <View
        style={[styles.container, { marginTop: 25, height: 100, justifyContent: 'space-evenly' }]}
      >
        <Text>OR</Text>
        <Button
          onPress={() => {
            setCloudSync(false);
            logIn();
          }}
        >
          use App in offline mode
        </Button>
      </View>
    </View>
  );
}
