import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyudebbhowtzdrkwpgzj.supabase.co';
const supabaseKey = 'sb_publishable_zEF0b_Dov0GR5BuGmQs_iw_f5gKeLIv';

export const supabase = createClient(supabaseUrl, supabaseKey);