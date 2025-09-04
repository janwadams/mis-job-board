"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  role: "student" | "faculty" | "admin" | "company";
  email: string;
};

export default function UserBadge() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // fetch role from profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile({
          role: data.role as Profile["role"],
          email: data.email,
        });
      } else {
        setProfile({ role: "student", email: user.email ?? "" });
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login"); // redirect after logout
  }

  return (
    <header className="navbar">
      {/* Left: Site title */}
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold text-[var(--uga-red)]">
          MIS Job Board
        </span>
        <nav className="flex space-x-4">
          <a href="/">Home</a>
          {(profile?.role === "faculty" || profile?.role === "admin") && (
            <a href="/admin/approvals">Approvals</a>
          )}
          {(profile?.role === "faculty" || profile?.role === "admin") && (
            <a href="/admin/jobs">Jobs</a>
          )}
          {(profile?.role === "company" || profile?.role === "faculty" || profile?.role === "admin") && (
            <a href="/post">Post a Job</a>
          )}
        </nav>
      </div>

      {/* Right: User info */}
      <div className="flex items-center space-x-3">
        {!loading && profile && (
          <>
            <span className="px-2 py-1 rounded-md bg-[var(--uga-red)] text-[var(--uga-white)] text-xs font-medium">
              Role: {profile.role}
            </span>
            <span className="text-sm">{profile.email}</span>
            <button
              onClick={handleSignOut}
              className="btn-outline"
            >
              Sign out
            </button>
          </>
        )}
        {!loading && !profile && (
          <a href="/login" className="btn">
            Sign in
          </a>
        )}
      </div>
    </header>
  );
}
