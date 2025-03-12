import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

// Access auth admin api
const adminClient = supabase.auth.admin;

export default adminClient;
