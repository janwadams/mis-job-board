// src/components/RoleGate.tsx
"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "student" | "company" | "faculty" | "admin";

export default function RoleGate({
  allow,
  children,
}: PropsWithChildren<{ allow: Role[] }>) {
  const [ok, setOk] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    let alive = true;

    async function check() {
      // get user
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!alive) return;

      if (!userId) {
        setOk(false);
        return;
      }

      // read role
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", userId)
        .maybeSingle();

      if (!alive) return;

      if (error || !data) {
        setOk(false);
        return;
      }

      const role = (data.role ?? null) as Role | null;
      setOk(role !== null && allow.includes(role));
    }

    setOk(null); // show "Checking access…" quickly
    check();

    return () => {
      alive = false;
    };
  }, [allow]);

  if (ok === null) {
    return (
      <div className="py-10 text-center text-gray-600">Checking access…</div>
    );
  }
  if (!ok) {
    return (
      <div className="py-10 text-center text-red-600">
        You don’t have permission to view this page.
      </div>
    );
  }

  return <>{children}</>;
}
