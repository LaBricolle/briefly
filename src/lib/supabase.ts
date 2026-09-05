import { createClient } from '@supabase/supabase-js';

// Client "admin" (clé service role) : utilisé uniquement côté serveur
// (routes API), jamais exposé au navigateur.
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false } }
  );
}
