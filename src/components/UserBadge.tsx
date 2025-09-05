"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  role: string | null;
};

export default function UserBadge() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email);

        const { data: prof } = await supabase
          .from<Profile>("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        setRole(prof?.role ?? null);
      }
    }
    load();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login"; // redirect to login
  }

  return (
    <header className="bg-uga-red text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left: Site title + nav links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg text-white">
            MIS Job Board
          </Link>
          <nav className="flex gap-4">
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
            {(role === "faculty" || role === "admin") && (
              <Link href="/admin/approvals" className="text-white hover:underline">
                Approvals
              </Link>
            )}
            {(role === "company" || role === "faculty" || role === "admin") && (
              <Link href="/post" className="text-white hover:underline">
                Post a Job
              </Link>
            )}
            {(role === "faculty" || role === "admin") && (
              <Link href="/admin/jobs" className="text-white hover:underline">
                Jobs
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Role + email + sign out */}
        <div className="flex items-center gap-4">
          {role && (
            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-uga-red">
              Role: {role}
            </span>
          )}
          {email && <span className="text-sm">{email}</span>}
          {email && (
            <button onClick={signOut} className="btn-primary">
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
