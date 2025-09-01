'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

export default function UserBadge() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string>('anonymous');

  // Load session & role once on mount
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setEmail(session.user.email ?? null);

        // Pull role from profiles table
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (data?.role) {
          setRole(data.role);
        }
      }
    })();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setEmail(session.user.email ?? null);

        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.role) setRole(data.role);
          });
      } else {
        setEmail(null);
        setRole('anonymous');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setEmail(null);
    setRole('anonymous');
    // Hard redirect so the UI resets correctly everywhere
    window.location.href = '/';
  }

  if (!email) {
    return (
      <span className="text-sm text-gray-500">
        Not signed in
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">
        <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">
          Role: {role}
        </span>
      </span>
      <span className="text-sm text-gray-600">{email}</span>
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="text-sm rounded-md"
      >
        Sign out
      </Button>
    </div>
  );
}
