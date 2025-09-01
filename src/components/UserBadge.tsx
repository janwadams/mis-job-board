'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

type Profile = { role: 'student'|'faculty'|'company'|'admin' };

export default function UserBadge() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Profile['role'] | 'anonymous'>('anonymous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      setEmail(user?.email ?? null);

      if (user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        if (p?.role) setRole(p.role);
      } else {
        setRole('anonymous');
      }
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/');
    router.refresh();
  }

  const LinkBtn = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm ${
        pathname === href ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-emerald-50'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <Link href="/" className="mr-2 font-semibold text-emerald-800">MIS Job Board</Link>
          <nav className="flex items-center gap-1">
            <LinkBtn href="/" label="Home" />
            <LinkBtn href="/admin/approvals" label="Approvals" />
            <LinkBtn href="/post" label="Post a Job" />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            Role: {loading ? '…' : role}
          </span>
          {email ? (
            <>
              <span className="hidden text-sm text-gray-600 md:block">{email}</span>
              <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
