import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '@supabase/supabase-js';

type lastBooking = {
  type: string;
  timestamp: number;
  data: string;
};

type MainState = {
  loggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
  user: User | null;
  setUser: (user: User | object) => void;
  session: Session | null;
  setSession: (session: Session | object) => void;
  theme: string;
  setTheme: (theme: string) => void;
  lockSettings: boolean;
  setLockSettings: (lockSettings: boolean) => void;
  encryption: boolean;
  setEncryption: (encryption: boolean) => void;
  masterpwd: string;
  setMasterpwd: (masterpwd: string) => void;
  cloudSync: boolean;
  setCloudSync: (cloudSync: boolean) => void;
  lastBooking: lastBooking;
  setLastBooking: (lastBooking: lastBooking) => void;
  regions: Array<object>;
  setRegions: (regions: Array<object>) => void;
};

export const useStore = create<MainState>(
  persist(
    (set) => ({
      loggedIn: false,
      logIn: () => set(() => ({ loggedIn: true })),
      logOut: () => set(() => ({ loggedIn: false })),
      user: null,
      setUser: (user: User) => set(() => ({ user })),
      session: null,
      setSession: (session: Session) => set(() => ({ session })),
      theme: 'system',
      setTheme: (theme) => set(() => ({ theme })),
      lockSettings: false,
      setLockSettings: (lockSettings) => set(() => ({ lockSettings })),
      encryption: false,
      setEncryption: (encryption) => set(() => ({ encryption })),
      masterpwd: '',
      setMasterpwd: (masterpwd) => set(() => ({ masterpwd })),
      cloudSync: true,
      setCloudSync: (cloudSync) => set(() => ({ cloudSync })),
      lastBooking: { type: '', timestamp: 0, data: '' },
      setLastBooking: (lastBooking) => set(() => ({ lastBooking })),
      regions: [],
      setRegions: (regions) => set(() => ({ regions })),
    }),
    {
      name: 'main-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
