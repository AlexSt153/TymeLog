import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import Map from '../screens/Map';
import Settings from '../screens/Settings';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
