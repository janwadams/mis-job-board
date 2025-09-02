'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/**
 * RoleGate — client-side guard for pages.
 * - If NOT signed in: redirects to /login
 * - If signed in but role NOT allowed: shows "Not authorized."
 * - If allowed: renders children
 */
export default function RoleGate({
  allow,
  children,
}: {
  allow: Array<'student' | 'company' | 'faculty' | 'admin'>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!alive) return;

      if (!user) {
        // not signed in -> go to login
        router.replace('/login');
        setOk(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const role = data?.role as 'student' | 'company' | 'faculty' | 'admin' | undefined;
      setOk(role ? allow.includes(role) : false);
    })();

    return () => {
      alive = false;
    };
  }, [allow, router]);

  if (ok === null) {
    return <p className="p-6 text-sm text-gray-600">Checking access…</p>;
  }
  if (!ok) {
    return <p className="p-6 text-red-600">Not authorized.</p>;
  }
  return <>{children}</>;
}
