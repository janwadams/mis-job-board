// src/components/UserBadge.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Role = "student" | "company" | "faculty" | "admin";

export default function UserBadge() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);

      // 1) current auth user
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user ?? null;
      if (!alive) return;

      setEmail(user?.email ?? null);

      // 2) read role from profiles (no generics, cast after)
      if (user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .maybeSingle();

        if (!alive) return;

        if (!error && data && (data as any).role) {
          setRole(((data as any).role as Role) ?? null);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    }

    load();

    // also refresh when auth state changes (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  function handleSignOut() {
    // Use a server route to sign out and redirect (avoids client hanging)
    window.location.href = "/logout";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#BA0C2F] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        {/* Brand + left nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            MIS Job Board
          </Link>

          <nav className="hidden items-center gap-4 sm:flex">
            <Link href="/" className="text-white/90 hover:text-white">
              Home
            </Link>

            {(role === "faculty" || role === "admin") && (
              <>
                <Link
                  href="/admin/approvals"
                  className="text-white/90 hover:text-white"
                >
                  Approvals
                </Link>
                <Link
                  href="/admin/jobs"
                  className="text-white/90 hover:text-white"
                >
                  Jobs
                </Link>
              </>
            )}

            {(role === "company" || role === "faculty" || role === "admin") && (
              <Link href="/post" className="text-white/90 hover:text-white">
                Post a Job
              </Link>
            )}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!loading && role && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm">
              Role: <span className="font-medium">{role}</span>
            </span>
          )}
          {!loading && email && (
            <span className="hidden text-sm sm:inline-block">{email}</span>
          )}

          {email ? (
            <Button
              onClick={handleSignOut}
              variant="secondary"
              className="bg-white text-[#BA0C2F] hover:bg-white/90"
            >
              Sign out
            </Button>
          ) : (
            <Link href="/login">
              <Button
                variant="secondary"
                className="bg-white text-[#BA0C2F] hover:bg-white/90"
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
