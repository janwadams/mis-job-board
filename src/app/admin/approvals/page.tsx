"use client";

import { useEffect, useState } from "react";
import RoleGate from "@/components/RoleGate";
import { supabase } from "@/lib/supabaseClient";

type PendingItem = {
  id: string;
  title: string;
  company: string;
  deadline: string;
  status: "pending" | "approved" | "removed" | "withdrawn" | "archived";
};

export default function ApprovalsPage() {
  const [rows, setRows] = useState<PendingItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr(null);
    setLoading(true);
    const { data, error } = await supabase
      .from("postings")
      .select("id,title,company,deadline,status")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) setErr(error.message);
    setRows((data ?? []) as PendingItem[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    setBusyId(id);
    const { error } = await supabase
      .from("postings")
      .update({ status: "approved" })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      setErr(error.message);
      return;
    }
    load();
  }

  async function reject(id: string) {
    setBusyId(id);
    const { error } = await supabase
      .from("postings")
      .update({ status: "removed" })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      setErr(error.message);
      return;
    }
    load();
  }

  return (
    <RoleGate allow={["faculty", "admin"]}>
      <main className="min-h-screen bg-uga-cream">
        {/* Banner */}
        <section className="bg-uga-red text-white">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="text-2xl font-bold">Pending Approvals</h1>
            <p className="mt-1 text-white/90">
              Review company/faculty submissions. Approve to publish, or reject to remove.
            </p>
          </div>
        </section>

        {/* List */}
        <section className="mx-auto max-w-6xl px-6 py-8">
          {err && (
            <div className="mb-4 rounded-lg border border-red-200 bg-white p-4 text-red-700">
              {err}
            </div>
          )}

          {loading ? (
            <p className="text-gray-600">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-gray-600">No pending postings.</p>
          ) : (
            <div className="grid gap-4">
              {rows.map((p) => (
                <article
                  key={p.id}
                  className="card flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-lg font-semibold text-uga-black">{p.title}</div>
                    <div className="text-sm text-gray-600">
                      {p.company} • Deadline: {new Date(p.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(p.id)}
                      disabled={busyId === p.id}
                      className="btn-primary"
                    >
                      {busyId === p.id ? "Working…" : "Approve"}
                    </button>
                    <button
                      onClick={() => reject(p.id)}
                      disabled={busyId === p.id}
                      className="btn-secondary"
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </RoleGate>
  );
}
