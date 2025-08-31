'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('student@demo.edu');
  const [password, setPassword] = useState('Password123!'); // the one you set in Supabase
  const [msg, setMsg] = useState('');

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? `Error: ${error.message}` : 'Logged in! Go back to /');
  }
  async function signOut() {
    await supabase.auth.signOut();
    setMsg('Signed out. You can close this tab or go back to /.');
  }

  return (
    <main className="p-6 max-w-md mx-auto grid gap-3">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
      <input className="border rounded px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
      <div className="flex gap-2">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded" onClick={signIn}>Sign in</button>
        <button className="border px-4 py-2 rounded" onClick={signOut}>Sign out</button>
      </div>
      <p className="text-sm text-gray-600">{msg}</p>
      <p className="text-sm text-gray-600">Test users: admin@demo.edu, faculty@demo.edu, company@demo.com, student@demo.edu</p>
    </main>
  );
}
