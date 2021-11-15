import { insert } from 'expo-sqlite-query-helper';
import { supabase } from '../../lib/supabase';
import { useStore } from '../store';

export const getAllBookings = () => {
  return new Promise(async (resolve, reject) => {
    const { data: bookings, error } = await supabase.from('bookings').select('*');
    if (error) reject(error);

    resolve(bookings);
  });
};

interface InsertBookingProps {
  type: string;
  location: any;
}

export const insertBooking = ({ type, location }: InsertBookingProps) => {
  return new Promise(async (resolve, reject) => {
    const { user } = useStore.getState();

    try {
      await insert('bookings', [
        {
          type,
          data: JSON.stringify({ location }),
        },
      ]);

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user!.id,
          bookingData: JSON.stringify(location),
        })
        .single();

      console.log('insertBooking supabase', data, error);

      if (error) reject(error);

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
