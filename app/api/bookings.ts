import { supabase } from '../../lib/supabase';
import { getCoordsResultFromCache } from './location';
import { LocationObject } from 'expo-location';

interface InsertBookingProps {
  user_id: string;
  location: LocationObject;
  encrypted?: boolean;
  address?: string;
  timestamp: string;
  data?: any;
  origin: string;
  type: string;
}

export const insertBookings = async (bookings: InsertBookingProps[]) => {
  // for each booking reverse geocode to get address
  const bookingsWithAddress = await Promise.all(
    bookings.map(async (booking) => {
      const { location } = booking;
      const address = await getCoordsResultFromCache(location.coords);
      booking.address = `${address.name}, ${address.city}, ${address.country}`;
      return booking;
    })
  );

  const { data, error } = await supabase.from('bookings').insert(bookingsWithAddress);
  return { data, error };
};
