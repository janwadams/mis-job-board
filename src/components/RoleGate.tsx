// src/components/RoleGate.tsx
"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "student" | "company" | "faculty" | "admin";

interface ProfilesRow {
  id: string;
  role: Role;
}

export default function RoleGate({
  allow,
  children,
}: PropsWithChildren<{ allow: Role[] }>) {
  const [ok, setOk] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!alive) return;

      if (!userId) {
        setOk(false);
        return;
      }

      const { data: prof, error } = await supabase
        .from<ProfilesRow>("profiles")
        .select("id, role")
        .eq("id", userId)
        .maybeSingle();

      if (!alive) return;

      if (error || !prof) {
        setOk(false);
        return;
      }

      setOk(allow.includes(prof.role));
    })();

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
