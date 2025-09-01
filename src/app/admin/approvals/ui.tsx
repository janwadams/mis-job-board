'use client';
import { supabase } from '@/lib/supabaseClient';

type PendingItem = {
  id: string;
  title: string;
  company: string;
  deadline: string; // ISO date
  status?: string;
};

export default function ApprovalsClient({ items }: { items: PendingItem[] }) {
  async function approve(id: string) {
    const { error } = await supabase.from('postings').update({ status: 'approved' }).eq('id', id);
    alert(error ? `Error: ${error.message}` : 'Approved! Refresh page.');
  }
  async function remove(id: string) {
    const { error } = await supabase.from('postings').update({ status: 'removed' }).eq('id', id);
    alert(error ? `Error: ${error.message}` : 'Removed. Refresh page.');
  }

  if (!items?.length) return <p className="mt-3">No pending items 🎉</p>;

  return (
    <ul className="grid gap-3 mt-4">
      {items.map((p) => (
        <li key={p.id} className="border rounded p-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">{p.company} • {p.deadline}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => approve(p.id)} className="bg-emerald-600 text-white px-3 py-1 rounded">Approve</button>
            <button onClick={() => remove(p.id)} className="border px-3 py-1 rounded">Reject</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
