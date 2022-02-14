import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Headline, Subheading, Title, Text } from 'react-native-paper';
import { useStore } from '../store';

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '80%',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  headline: {},
  title: {},
  subheading: { fontWeight: '200' },
  text: { marginBottom: 20, fontWeight: '300' },
  button: {},
});

export default function Welcome({ navigation }) {
  const userAllowedBackgroundLocation = useStore((state) => state.userAllowedBackgroundLocation);
  const userAllowedNotifications = useStore((state) => state.userAllowedNotifications);

  // TODO: Add modals to ask for permissions and then navigate to SignIn

  return (
    <View style={localStyles.container}>
      <Headline style={localStyles.headline}>Welcome</Headline>
      <Text style={localStyles.text}>
        TymeLog needs some permissions to provide the wanted functionalities
      </Text>

      <Title style={localStyles.title}>notification permission</Title>
      <Subheading style={localStyles.subheading}>
        Show notification when entering or leaving locations
      </Subheading>
      <Text style={localStyles.text}>{JSON.stringify(userAllowedNotifications)}</Text>

      <Title style={localStyles.title}>background geolocation permission</Title>
      <Subheading style={localStyles.subheading}>
        track user location when app is in background
      </Subheading>
      <Text style={localStyles.text}>{JSON.stringify(userAllowedBackgroundLocation)}</Text>

      <Button style={localStyles.button} onPress={() => navigation.navigate('SignIn')}>
        Sign In
      </Button>
    </View>
  );
}
