import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from '@env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { localStorage: AsyncStorage });
let supabaseUserID = '';

export const signUpUser = (email, password) => {
  return new Promise(async (resolve, reject) => {
    let { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) reject(error);
    resolve(user);
  });
};

export const signInUser = (email, password) => {
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

export const getSupabaseTodos = () => {
  return new Promise(async (resolve, reject) => {
    let { data: todos, error } = await supabase.from('todos').select('*');
    // if (error) reject(error);
    resolve(todos);
  });
};

export const insertTodo = (task = '', is_complete = false) => {
  return new Promise(async (resolve, reject) => {
    console.log(`supabaseUserID`, supabaseUserID);

    const { data, error } = await supabase
      .from('todos')
      .insert([{ user_id: supabaseUserID, task, is_complete }]);
    if (error) reject(error);
    resolve(data);
  });
};
