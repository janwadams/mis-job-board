"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "student" | "faculty" | "company" | "admin";
type Props = {
  allow: Role[];
  children: React.ReactNode;
};

export default function RoleGate({ allow, children }: Props) {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErr(null);

        // 1) getSession first (SSR-safe on client)
        const { data: sessData, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) throw sessErr;

        const user = sessData.session?.user;
        if (!user) {
          setRole(null);
          return;
        }

        // 2) read the role from profiles (RLS must allow)
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        const r = (data?.role ?? null) as Role | null;
        setRole(r);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to fetch role");
        setRole(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="px-4 py-2 text-sm text-gray-500">Checking access…</p>;
  if (err) return <p className="px-4 py-2 text-sm text-red-600">Access error: {err}</p>;
  if (!role || !allow.includes(role)) {
    return <p className="px-4 py-2 text-sm text-gray-600">Access denied.</p>;
  }

  return <>{children}</>;
}
