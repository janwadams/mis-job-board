'use client';

import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type PendingItem = {
  id: string;
  title: string;
  company: string;
  deadline: string; // ISO
  status?: string;
};

export default function ApprovalsClient({
  items,
  errorText,
}: {
  items: PendingItem[];
  errorText: string | null;
}) {
  async function approve(id: string) {
    const { error } = await supabase.from('postings').update({ status: 'approved' }).eq('id', id);
    alert(error ? `Error: ${error.message}` : 'Approved! Refreshing…');
    location.reload();
  }
  async function reject(id: string) {
    const { error } = await supabase.from('postings').update({ status: 'removed' }).eq('id', id);
    alert(error ? `Error: ${error.message}` : 'Removed. Refreshing…');
    location.reload();
  }

  if (errorText) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-5 text-red-700">{errorText}</CardContent>
      </Card>
    );
  }

  if (!items?.length) {
    return <p className="text-gray-600">No pending items 🎉</p>;
  }

  return (
    <div className="grid gap-4">
      {items.map((p) => (
        <Card key={p.id} className="rounded-2xl border-emerald-200">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <div className="text-lg font-semibold text-emerald-900">{p.title}</div>
              <div className="text-sm text-emerald-700">
                {p.company} • Deadline: {new Date(p.deadline).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => approve(p.id)} className="bg-emerald-600 hover:bg-emerald-700">
                Approve
              </Button>
              <Button variant="outline" onClick={() => reject(p.id)}>
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
