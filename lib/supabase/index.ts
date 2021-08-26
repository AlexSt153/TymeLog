import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from '@env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { localStorage: AsyncStorage });
let supabaseUserID = '';

export const signUpUser = (email: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    let { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) reject(error);
    resolve(user);
  });
};

export const signInUser = (email: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    let { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) reject(error);
    supabaseUserID = user.id;
    resolve(user);
  });
};
