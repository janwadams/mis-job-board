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

      const currentUser = data.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle();

        setRole((prof?.role as Role) ?? null);
      } else {
        setRole(null);
      }
    }

    load();

    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      if (!mounted) return;
      await load();
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // Surface the error in dev, but don’t block the UX.
        console.error("Supabase signOut error:", error.message);
      }
    } finally {
      // Clear local UI state immediately
      setUser(null);
      setRole(null);
      // Navigate home and refresh header
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <header className="flex items-center justify-between bg-emerald-800 px-6 py-4 text-white">
      <nav className="flex items-center gap-4">
        <Link href="/" className="text-lg font-bold hover:text-emerald-200">
          MIS Job Board
        </Link>

        <Link href="/" className="hover:text-emerald-200">
          Home
        </Link>

        {(role === "company" || role === "faculty" || role === "admin") && (
          <Link href="/post" className="hover:text-emerald-200">
            Post a Job
          </Link>
        )}

        {(role === "faculty" || role === "admin") && (
          <Link href="/admin/approvals" className="hover:text-emerald-200">
            Approvals
          </Link>
        )}

        {(role === "faculty" || role === "admin") && (
          <Link href="/admin/jobs" className="hover:text-emerald-200">
            Jobs
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-3">
        {role && (
          <span className="rounded-full bg-emerald-700 px-3 py-1 text-sm">
            Role: {role}
          </span>
        )}

        {user ? (
          <>
            <span className="hidden sm:inline text-emerald-100">
              {user.email ?? ""}
            </span>
            <Button
              type="button"                 // <-- important
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-emerald-300 text-emerald-900 hover:bg-emerald-200"
            >
              Sign out
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button
              type="button"                 // <-- important
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-900 hover:bg-emerald-200"
            >
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
