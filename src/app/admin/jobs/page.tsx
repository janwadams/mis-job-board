'use client';

import { useCallback, useEffect, useState } from 'react';
import RoleGate from '@/components/RoleGate';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

type Row = {
  id: string;
  title: string;
  company: string;
  job_type: 'Internship'|'Full-time'|'Contract';
  status: 'pending'|'approved'|'removed'|'withdrawn'|'archived';
  deadline: string;
  created_at: string;
};

export default function AdminJobs() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | Row['status']>('all');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    let qy = supabase
      .from('postings')
      .select('id,title,company,job_type,status,deadline,created_at')
      .order('created_at', { ascending: false });

    if (status !== 'all') qy = qy.eq('status', status);
    if (q) qy = qy.or(`title.ilike.%${q}%,company.ilike.%${q}%`);

    const { data, error } = await qy;
    if (error) setErr(error.message);
    setRows((data ?? []) as Row[]);
  }, [q, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, next: Row['status']) {
    setBusy(id);
    const { error } = await supabase.from('postings').update({ status: next }).eq('id', id);
    setBusy(null);
    if (error) { alert(error.message); return; }
    load();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <RoleGate allow={['faculty','admin']}>
          <h1 className="mb-4 text-2xl font-semibold text-emerald-900">All Job Postings</h1>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Input placeholder="Search title/company…" value={q} onChange={(e) => setQ(e.target.value)} className="w-[240px]" />
            <Select value={status} onValueChange={(v: 'all' | Row['status']) => setStatus(v)}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/admin/approvals">
              <Button variant="outline">Go to Approvals</Button>
            </Link>
          </div>

          {err && (
            <Card className="mb-4 border-red-200 bg-red-50">
              <CardContent className="p-4 text-red-700">{err}</CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {rows.map((r) => (
              <Card key={r.id} className="rounded-2xl border-emerald-200">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <div className="text-lg font-semibold text-emerald-900">{r.title}</div>
                    <div className="text-sm text-emerald-700">
                      {r.company} • {r.job_type} • Due {new Date(r.deadline).toLocaleDateString()} • Status: <b>{r.status}</b>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/jobs/${r.id}/edit`}><Button variant="outline">Edit</Button></Link>
                    {r.status !== 'approved' && <Button disabled={busy===r.id} onClick={() => act(r.id, 'approved')}>Approve</Button>}
                    {r.status !== 'archived' && <Button variant="outline" disabled={busy===r.id} onClick={() => act(r.id, 'archived')}>Archive</Button>}
                    {r.status !== 'removed' && <Button variant="destructive" disabled={busy===r.id} onClick={() => act(r.id, 'removed')}>Remove</Button>}
                  </div>
                </CardContent>
              </Card>
            ))}
            {!rows.length && <p className="text-gray-600">No postings match.</p>}
          </div>
        </RoleGate>
      </section>
    </main>
  );
}
