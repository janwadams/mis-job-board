import { supabase } from '@/lib/supabaseClient';
import ApprovalsClient from './ui';
//import { cookies } from 'next/headers'; //I commented out  line after the deplohyment failed.  // implicit SSR – but we'll fetch on the server with anon key
// NOTE: This page fetches data server-side using your anon key; RLS still applies.

export default async function ApprovalsPage() {
  // Pull pending posts; RLS will only return rows if the viewer is faculty/admin when updating.
  const { data, error } = await supabase
    .from('postings')
    .select('id, title, company, status, deadline')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Pending Approvals</h1>
      {error ? <pre className="text-red-600">{error.message}</pre> : <ApprovalsClient items={data ?? []} />}
      <p className="text-sm text-gray-600 mt-4">Tip: sign in as faculty@demo.edu or admin@demo.edu.</p>
    </main>
  );
}
