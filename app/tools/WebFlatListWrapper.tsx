import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { isWeb } from './deviceInfo';

export default function WebFlatListWrapper({ children }) {
  const { height } = useWindowDimensions();

  if (isWeb) return <ScrollView style={{ height: height - 200 }}>{children}</ScrollView>;

  return children;
}
