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
    }),
    {
      name: 'main-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
