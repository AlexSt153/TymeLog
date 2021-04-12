import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create(
  persist(
    (set) => ({
      loggedIn: false,
      logIn: () => set((state) => ({ loggedIn: true })),
      logOut: () => set((state) => ({ loggedIn: false })),
      supabaseUserID: '',
      setSupabaseUserID: (supabaseUserID) => set((state) => ({ supabaseUserID })),
    }),
    {
      name: 'main-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
