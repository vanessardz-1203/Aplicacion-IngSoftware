import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://fstwmwnwdvwyekuwwizu.supabase.co'; 
const supabaseKey = 'sb_publishable_Inh10DhBQ2blRr80KFwH5Q_aTPGafVc'; 

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})