// src/app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@demo.edu");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, go home
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.replace("/");
    })();
  }, [router]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="mx-auto max-w-md px-6 py-10">
        <h1 className="mb-4 text-2xl font-semibold text-emerald-900">Sign in</h1>
        <form onSubmit={signIn} className="space-y-3">
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-red-600">{err}</p>}
          <Button type="submit" disabled={loading} className="bg-emerald-700 hover:bg-emerald-800">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}
