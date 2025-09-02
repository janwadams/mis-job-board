'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

export default function UserBadge() {
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? null);

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      setRole(data?.role ?? null);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <header className="flex items-center justify-between bg-emerald-800 px-6 py-4 text-white">
      <Link href="/" className="text-lg font-bold hover:text-emerald-200">
        MIS Job Board
      </Link>

      <nav className="flex items-center gap-4">
        <Link href="/" className="hover:text-emerald-200">Home</Link>

        {(role === 'company' || role === 'faculty' || role === 'admin') && (
          <Link href="/post" className="hover:text-emerald-200">Post a Job</Link>
        )}

        {(role === 'faculty' || role === 'admin') && (
          <Link href="/admin/approvals" className="hover:text-emerald-200">Approvals</Link>
        )}

        {(role === 'faculty' || role === 'admin') && (
          <Link href="/admin/jobs" className="hover:text-emerald-200">Jobs</Link>
        )}

        {email && <span className="ml-2 text-sm text-emerald-100">Role: {role ?? '...'}</span>}
        {email && <span className="ml-2 text-sm text-emerald-100">{email}</span>}
        {email && (
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="border-emerald-300 text-emerald-900 hover:bg-emerald-200"
          >
            Sign out
          </Button>
        )}
      </nav>
    </header>
  );
}
