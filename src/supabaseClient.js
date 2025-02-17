import { createClient } from '@supabase/supabase-js';

// Supabase URL and API Key (replace these with your own)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey);
