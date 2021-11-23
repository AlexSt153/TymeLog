import { Platform } from 'react-native';

export const deviceOS = Platform.OS;

export const isWeb = Platform.OS === 'web';
export const isNotWeb = Platform.OS !== 'web';

export const isIOS = Platform.OS === 'ios';
export const isNotIOS = Platform.OS !== 'ios';

export const isAndroid = Platform.OS === 'android';
export const isNotAndroid = Platform.OS !== 'android';
