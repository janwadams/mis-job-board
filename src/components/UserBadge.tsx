"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface Profile {
  role: string | null;
}

export default function UserBadge() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setUser(data.session.user);

        // try to pull role from profiles table if present
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single();

        setRole(profile?.role ?? data.session.user.user_metadata.role ?? null);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setRole(session.user.user_metadata.role ?? null);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-emerald-700 text-white">
      <Link href="/" className="text-lg font-bold">
        MIS Job Board
      </Link>

      <nav className="flex items-center gap-4">
        {/* Public */}
        <Link href="/">Home</Link>

        {/* Company / Faculty / Admin can post */}
        {(role === "company" || role === "faculty" || role === "admin") && (
          <Link href="/post">Post</Link>
        )}

        {/* Faculty / Admin approvals */}
        {(role === "faculty" || role === "admin") && (
          <Link href="/admin/approvals">Approvals</Link>
        )}

        {/* Faculty / Admin jobs management */}
        {(role === "faculty" || role === "admin") && (
          <Link href="/admin/jobs">Jobs</Link>
        )}

        {/* Right side: user info + sign in/out */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-emerald-100 text-sm">
              {user.email}
            </span>
            <span className="text-xs bg-emerald-900 px-2 py-1 rounded-full">
              {role ?? "unknown"}
            </span>
            <Link href="/logout">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-emerald-600"
              >
                Sign out
              </Button>
            </Link>
          </div>
        ) : (
          <Link href="/login">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-emerald-600"
            >
              Sign in
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
