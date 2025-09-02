// src/components/RoleGate.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Role = "student" | "faculty" | "company" | "admin";

export default function RoleGate({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;

    async function check() {
      setOk(null);
      const { data: { user } } = await supabase.auth.getUser();

      if (!alive) return;

      // Not signed in → go to login
      if (!user) {
        setOk(false);
        router.replace("/login");
        return;
      }

      // Look up role
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!alive) return;

      if (error || !data?.role) {
        setOk(false);
        return;
      }

      const role = data.role as Role;
      setOk(allow.includes(role));
    }

    check();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      if (!alive) return;
      check();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [allow, router]);

  if (ok === null) return <p className="p-6 text-sm text-gray-600">Checking access…</p>;
  if (!ok) return <p className="p-6 text-red-600">Not authorized.</p>;

  return <>{children}</>;
}
