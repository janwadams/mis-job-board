// src/app/logout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function clearLocalAuth() {
  try {
    // Remove Supabase auth tokens from localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        localStorage.removeItem(key);
      }
    }
  } catch {}
  try {
    // Expire Supabase auth cookies
    document.cookie = "sb-access-token=; Max-Age=0; path=/";
    document.cookie = "sb-refresh-token=; Max-Age=0; path=/";
  } catch {}
}

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch (err) {
        console.error("Supabase signOut error:", err);
      }

      // Force cleanup just in case
      clearLocalAuth();

      // Redirect back home
      router.replace("/");
    })();
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-emerald-50">
      <p className="text-emerald-800 font-medium">Signing you out…</p>
    </main>
  );
}
