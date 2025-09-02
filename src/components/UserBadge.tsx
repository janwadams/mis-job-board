"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function UserBadge() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        setRole(data.session.user.user_metadata.role || null);
      }
    });

    // Listen for changes (sign in / sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setRole(session.user.user_metadata.role || null);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    window.location.href = "/"; // Redirect to home after sign out
  }

  async function handleSignIn() {
    window.location.href = "/login"; // Redirect to your login page
  }

  return (
    <div className="flex items-center justify-end gap-4 p-4 border-b bg-white">
      {user ? (
        <>
          <span className="text-sm px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Role: {role ?? "unknown"}
          </span>
          <span className="text-gray-600 text-sm">{user.email}</span>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </>
      ) : (
        <Button onClick={handleSignIn} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Sign in
        </Button>
      )}
    </div>
  );
}
