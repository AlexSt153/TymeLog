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
      initialRegion: {},
      setInitialRegion: (region) => set(() => ({ region })),
      regions: [],
      setRegions: (regions) => set(() => ({ regions })),
    }),
    {
      name: 'main-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
