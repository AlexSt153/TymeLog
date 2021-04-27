import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create(
  persist(
    (set) => ({
      loggedIn: false,
      logIn: () => set(() => ({ loggedIn: true })),
      logOut: () => set(() => ({ loggedIn: false })),
      session: {},
      setSession: (session) => set(() => ({ session })),
      theme: 'system',
      setTheme: (theme) => set(() => ({ theme })),
      lockSettings: false,
      setLockSettings: (lockSettings) => set(() => ({ lockSettings })),
      encryption: false,
      setEncryption: (encryption) => set(() => ({ encryption })),
      masterpwd: '',
      setMasterpwd: (masterpwd) => set(() => ({ masterpwd })),
      cloudSync: false,
      setCloudSync: (cloudSync) => set(() => ({ cloudSync })),
      lastBooking: '',
      setLastBooking: (lastBooking) => set(() => ({ lastBooking })),
    }),
    {
      name: 'main-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
