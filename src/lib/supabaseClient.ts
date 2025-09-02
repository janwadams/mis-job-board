/**import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
*/


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser client with explicit auth options.
 * - persistSession: stores session in localStorage (sb-*-auth-token)
 * - autoRefreshToken: keeps access token fresh while logged in
 * - detectSessionInUrl: supports PKCE flow if you add OAuth later
 * - storage: explicitly binds to window.localStorage in the browser
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce", // harmless for email+password; helpful if you add OAuth later
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
  // (optional) tiny header so requests are easy to recognize in logs
  global: { headers: { "x-application-name": "mis-job-board" } },
});
