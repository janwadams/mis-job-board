// src/app/admin/approvals/page.tsx
"use client";

import { useEffect, useState } from "react";
import RoleGate from "@/components/RoleGate";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PendingItem = {
  id: string;
  title: string;
  company: string;
  deadline: string;
  status?: string;
};

export default function ApprovalsPage() {
  const [rows, setRows] = useState<PendingItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const { data, error } = await supabase
      .from("postings")
      .select("id,title,company,deadline,status")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) setErr(error.message);
    setRows((data ?? []) as PendingItem[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    setBusy(id);
    const { error } = await supabase.from("postings").update({ status: "approved" }).eq("id", id);
    setBusy(null);
    if (error) { alert(error.message); return; }
    load();
  }

  async function reject(id: string) {
    setBusy(id);
    const { error } = await supabase.from("postings").update({ status: "removed" }).eq("id", id);
    setBusy(null);
    if (error) { alert(error.message); return; }
    load();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <RoleGate allow={["faculty", "admin"]}>
          <h1 className="mb-3 text-2xl font-semibold text-emerald-900">Pending Approvals</h1>
          <p className="mb-6 text-sm text-gray-600">
            Faculty and admins can approve or reject submissions. Approved posts become visible to students immediately.
          </p>

          {err && (
            <Card className="mb-4 border-red-200 bg-red-50">
              <CardContent className="p-4 text-red-700">{err}</CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {rows.map((p) => (
              <Card key={p.id} className="rounded-2xl border-emerald-200">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <div className="text-lg font-semibold text-emerald-900">{p.title}</div>
                    <div className="text-sm text-emerald-700">
                      {p.company} • Due {new Date(p.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => approve(p.id)} disabled={busy === p.id} className="bg-emerald-600 hover:bg-emerald-700">
                      Approve
                    </Button>
                    <Button variant="outline" onClick={() => reject(p.id)} disabled={busy === p.id}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!rows.length && <p className="text-gray-600">No pending postings.</p>}
          </div>
        </RoleGate>
      </section>
    </main>
  );
}
