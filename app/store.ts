import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { Region } from 'react-native-maps';

type lastBooking = {
  type: string;
  timestamp: number;
  data: string;
};

type MainState = {
  session: Session | null;
  setSession: (session: Session | object) => void;
  theme: string;
  setTheme: (theme: string) => void;
  bookings: any;
  setBookings: (bookings: any) => void;
  lastBooking: lastBooking;
  setLastBooking: (lastBooking: lastBooking) => void;
  initialRegion: Region;
  setInitialRegion: (initialRegion: Region) => void;
  regions: Array<object>;
  setRegions: (regions: Array<object>) => void;
  userAllowedForegroundLocation: boolean;
  setUserAllowedForegroundLocation: (userAllowedForegroundLocation: boolean) => void;
  userAllowedBackgroundLocation: boolean;
  setUserAllowedBackgroundLocation: (userAllowedBackgroundLocation: boolean) => void;
  userAllowedNotifications: boolean;
  setUserAllowedNotifications: (userAllowedNotifications: boolean) => void;
};

export const useStore = create<MainState>(
  persist(
    (set) => ({
      session: null,
      setSession: (session: Session) => set(() => ({ session })),
      theme: 'system',
      setTheme: (theme) => set(() => ({ theme })),
      bookings: [],
      setBookings: (bookings) => set(() => ({ bookings })),
      lastBooking: { type: '', timestamp: 0, data: '' },
      setLastBooking: (lastBooking) => set(() => ({ lastBooking })),
      initialRegion: { latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0 },
      setInitialRegion: (region) => set(() => ({ region })),
      regions: [],
      setRegions: (regions) => set(() => ({ regions })),
      userAllowedForegroundLocation: false,
      setUserAllowedForegroundLocation: (userAllowedForegroundLocation) =>
        set(() => ({ userAllowedForegroundLocation })),
      userAllowedBackgroundLocation: false,
      setUserAllowedBackgroundLocation: (userAllowedBackgroundLocation) =>
        set(() => ({ userAllowedBackgroundLocation })),
      userAllowedNotifications: false,
      setUserAllowedNotifications: (userAllowedNotifications) =>
        set(() => ({ userAllowedNotifications })),
    }),
    {
      name: 'main-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
