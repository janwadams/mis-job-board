'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Role = 'student'|'faculty'|'company'|'admin'|null;

export function useUserRole() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>(null);
  const [userId, setUserId] = useState<string| null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) { setRole(null); setUserId(null); setLoading(false); }
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (mounted) {
        setRole(error ? null : (data?.role ?? null));
        setUserId(user.id);
        setLoading(false);
      }
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return { loading, role, userId };
}
