import { createClient } from '@supabase/supabase-js';

// Aqui o site pega as chaves secretas que você guardou no .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Aqui ele cria a ponte de conexão!
export const supabase = createClient(supabaseUrl, supabaseKey);