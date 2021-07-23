import { Cache } from 'react-native-cache';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const cache = new Cache({
  namespace: 'TymeLog',
  policy: {
    maxEntries: 50000, // if unspecified, it can have unlimited entries
  },
  backend: AsyncStorage,
});
