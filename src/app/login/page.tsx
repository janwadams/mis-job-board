'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('student@demo.edu');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // If already logged in, redirect immediately
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Hard redirect = most reliable in all browsers/SSR states
        window.location.href = '/';
      }
    })();

    // Fallback: react to auth changes (e.g., after sign-in)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.href = '/';
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

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
    // Hard redirect so we definitely leave /login
    window.location.href = '/';
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold text-emerald-900">Login</h1>

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
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
          <Button type="button" variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </form>

      {err && <p className="mt-3 text-red-600">{err}</p>}

      <p className="mt-6 text-sm text-gray-600">
        Test users: admin@demo.edu, faculty@demo.edu, company@demo.com, student@demo.edu
      </p>
    </main>
  );
}
