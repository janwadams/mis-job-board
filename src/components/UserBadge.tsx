"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "student" | "faculty" | "company" | "admin";

export default function UserBadge() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const { data: sess } = await supabase.auth.getSession();
      const user = sess.session?.user ?? null;
      if (!user) {
        if (!cancelled) {
          setEmail(null);
          setRole(null);
        }
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelled) {
        setEmail(user.email ?? null);
        setRole((data?.role as Role | undefined) ?? null);
      }
    }

    fetchUser();

    const { data: sub } = supabase.auth.onAuthStateChange(() => fetchUser());
    return () => {
      sub.subscription.unsubscribe();
      cancelled = true;
    };
  }, []);

  return (
    <header className="bg-emerald-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">MIS Job Board</Link>
          <NavLink href="/">Home</NavLink>

          {/* Show Approvals/Post/Jobs for higher roles */}
          {role && (role === "faculty" || role === "admin") && (
            <>
              <NavLink href="/admin/approvals">Approvals</NavLink>
              <NavLink href="/admin/jobs">Jobs</NavLink>
            </>
          )}
          {role && (role === "company" || role === "faculty" || role === "admin") && (
            <NavLink href="/post">Post a Job</NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {role && (
            <span className="rounded-full bg-emerald-700 px-3 py-1 text-sm">
              Role: {role}
            </span>
          )}
          {email ? (
            <>
              <span className="text-sm opacity-90">{email}</span>
              <Link
                href="/logout"
                className="bg-white text-emerald-800 rounded-lg px-3 py-1 text-sm font-medium hover:bg-emerald-50"
              >
                Sign out
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-white text-emerald-800 rounded-lg px-3 py-1 text-sm font-medium hover:bg-emerald-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-white/90 hover:text-white transition-colors text-sm"
    >
      {children}
    </Link>
  );
}
