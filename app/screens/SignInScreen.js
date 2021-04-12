import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { signInUser } from '../../lib/supabase';
import { useStore } from '../store';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textInput: { height: 50, width: '80%', marginBottom: 20 },
  row: { width: '80%', flexDirection: 'row', justifyContent: 'space-between' },
  button: {},
});

export default function SignInScreen() {
  const navigation = useNavigation();
  const logIn = useStore((state) => state.logIn);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        label="User"
        autoCompleteType="email"
        value={user}
        onChangeText={setUser}
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
      <View style={styles.row}>
        <Button
          mode="text"
          onPress={() => {
            console.log('navigate to SignUpScreen');
            navigation.navigate('SignUp');
          }}
          style={styles.button}
        >
          SignUp
        </Button>
        <Button
          icon="login"
          mode="contained"
          onPress={() => {
            signInUser(user, password)
              .then((user) => {
                console.log(`user`, user);
                logIn();
              })
              .catch((error) => console.log(`error`, error));
          }}
          style={styles.button}
        >
          Login
        </Button>
      </View>
    </View>
  );
}
