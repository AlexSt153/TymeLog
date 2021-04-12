import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textInput: { height: 50, width: '80%', marginBottom: 20 },
  button: {},
});

export default function SignUpScreen() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

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
      <TextInput
        label="repeat Password"
        secureTextEntry
        autoCompleteType="password"
        value={password2}
        onChangeText={setPassword2}
        style={styles.textInput}
      />
      <Button
        icon="login"
        mode="contained"
        onPress={() => {
          console.log('signup user');
        }}
        style={styles.button}
      >
        SignUp
      </Button>
    </View>
  );
}
