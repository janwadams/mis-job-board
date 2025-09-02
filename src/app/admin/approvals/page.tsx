import { supabase } from '@/lib/supabaseClient';
import RoleGate from '@/components/RoleGate';
import ApprovalsClient from './ui';

export const revalidate = 0; // always fresh

export default async function ApprovalsPage() {
  const { data, error } = await supabase
    .from('postings')
    .select('id,title,company,deadline,status')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <RoleGate allow={['faculty','admin']}>
          <h1 className="mb-3 text-2xl font-semibold text-emerald-900">Pending Approvals</h1>
          <p className="mb-6 text-sm text-gray-600">
            Faculty and admins can approve or reject submissions. Approved posts become visible to students immediately.
          </p>
          <ApprovalsClient items={data ?? []} errorText={error?.message ?? null} />
        </RoleGate>
      </section>
    </main>
  );
}
