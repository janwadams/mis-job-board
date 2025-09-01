'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('student@demo.edu');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }

    // ✅ auth succeeded – go home and refresh UI
    setMsg('Logged in!');
    router.replace('/');       // navigate
    router.refresh();          // re-render server components if any
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/');
    router.refresh();
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      <form onSubmit={signIn} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="password"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white rounded px-4 py-2"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={signOut}
          className="ml-2 border rounded px-4 py-2"
        >
          Sign out
        </button>
      </form>

      {err && <p className="text-red-600 mt-3">{err}</p>}
      {msg && <p className="text-emerald-700 mt-3">{msg}</p>}

      <p className="text-sm text-gray-600 mt-6">
        Test users: admin@demo.edu, faculty@demo.edu, company@demo.com, student@demo.edu
      </p>
    </main>
  );
}
