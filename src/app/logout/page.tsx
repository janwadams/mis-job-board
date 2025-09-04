// src/app/logout/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default async function LogoutPage() {
  // Use service via public env (anon) is OK for signOut
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase.auth.signOut();

  // Clear any client-side cached state on load (extra safety):
  // We can't run client JS here; the UserBadge listens to auth state anyway.

  redirect("/login");
}
