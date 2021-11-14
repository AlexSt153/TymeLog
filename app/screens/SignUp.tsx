import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TextInput, HelperText, Button } from 'react-native-paper';
import { supabase, signInUser } from '../../lib/supabase';
import { useStore } from '../store';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textInput: { height: 50, width: '80%', marginVertical: 10 },
  button: { marginTop: 20 },
});

export default function SignUp() {
  const navigation = useNavigation();

  const logIn = useStore((state) => state.logIn);
  const setSession = useStore((state) => state.setSession);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorType, setPasswordErrorType] = useState('');

  useEffect(() => {
    // check if email is valid
    if (email.length < 1 || email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }

    if (password.length > 1) {
      // check if passwords match
      if (password !== password2) {
        setPasswordError(true);
        setPasswordErrorType('Passwords do not match');
      } else {
        setPasswordError(false);
      }

      // check if passwords match criteria
      if (password.length < 8) {
        setPasswordError(true);
        setPasswordErrorType('Password must be at least 8 characters');
      }
    }
  }, [email, password, password2]);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TextInput
          label="Email"
          autoCompleteType="email"
          value={email}
          onChangeText={setEmail}
          style={styles.textInput}
          error={emailError}
        />
        {emailError && (
          <HelperText type="error" visible={emailError}>
            Email address is invalid
          </HelperText>
        )}
        <TextInput
          label="Password"
          secureTextEntry
          autoCompleteType="password"
          value={password}
          onChangeText={setPassword}
          style={styles.textInput}
          error={passwordError}
        />
        <TextInput
          label="Confirm Password"
          secureTextEntry
          autoCompleteType="password"
          value={password2}
          onChangeText={setPassword2}
          style={styles.textInput}
          error={passwordError}
        />
        <HelperText type="error" visible={passwordError}>
          {passwordErrorType}
        </HelperText>
        <Button
          icon="login"
          mode="contained"
          disabled={passwordError || !email || !password || !password2}
          onPress={async () => {
            console.log('signup user');

            const { user, error } = await supabase.auth.signUp({
              email,
              password,
            });

            console.log({ user, error });

            if (!error) {
              console.log('signed up');

              signInUser(email, password)
                .then((user) => {
                  console.log(`user`, user);
                  const session = supabase.auth.session();

                  setSession(session);
                  logIn();
                })
                .catch((error) => console.log(`error`, error));
            }
          }}
          style={styles.button}
        >
          SignUp
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
}
