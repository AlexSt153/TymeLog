import { supabase } from '../../lib/supabase';

export const getAllBookings = async () => {
  const { data: bookings, error } = await supabase.from('bookings').select('*');
  return { bookings, error };
};

interface InsertBookingProps {
  user_id: string;
  location: any;
  encrypted?: boolean;
  address?: string;
  timestamp: string;
  data?: any;
  origin?: string;
  type: string;
}

export const insertBookings = async (bookings: InsertBookingProps[]) => {
  const { data, error } = await supabase.from('bookings').insert(bookings);
  return { data, error };
};
