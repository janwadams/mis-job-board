// src/components/UserBadge.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Role = "student" | "faculty" | "company" | "admin" | null;

export default function UserBadge() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;

      const u = data.user ?? null;
      setUser(u);

      if (u) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", u.id)
          .maybeSingle();

        setRole((prof?.role as Role) ?? null);
      } else {
        setRole(null);
      }
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      if (!mounted) return;
      await load();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
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
              {user.email ?? ""}
            </span>
            <span className="text-xs bg-emerald-900 px-2 py-1 rounded-full">
              {role ?? "unknown"}
            </span>
            {/* Use the dedicated /logout route */}
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
