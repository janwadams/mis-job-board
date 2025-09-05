"use client";

import { useEffect, useMemo, useState } from "react";
import RoleGate from "@/components/RoleGate";
import { supabase } from "@/lib/supabaseClient";

type Status = "pending" | "approved" | "removed" | "withdrawn" | "archived";

type JobRow = {
  id: string;
  title: string;
  company: string;
  status: Status;
  deadline: string;
  job_type: "Internship" | "Full-time" | "Contract";
};

export default function JobsAdminPage() {
  const [rows, setRows] = useState<JobRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "all">("all");

  async function load() {
    setErr(null);
    setLoading(true);
    const { data, error } = await supabase
      .from("postings")
      .select("id,title,company,status,deadline,job_type")
      .order("created_at", { ascending: false });

    if (error) setErr(error.message);
    setRows((data ?? []) as JobRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  async function setStatus(id: string, status: Status) {
    setBusyId(id);
    const { error } = await supabase.from("postings").update({ status }).eq("id", id);
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
            <h1 className="text-2xl font-bold">Manage Jobs</h1>
            <p className="mt-1 text-white/90">
              View and manage all postings. Filter by status; approve, remove, or restore.
            </p>
          </div>
        </section>

        {/* Controls */}
        <section className="mx-auto max-w-6xl px-6 py-6">
          {err && (
            <div className="mb-4 rounded-lg border border-red-200 bg-white p-4 text-red-700">
              {err}
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-uga-black">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Status | "all")}
              className="rounded-md border px-3 py-2"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="removed">Removed</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="archived">Archived</option>
            </select>

            <button onClick={load} className="btn-secondary">
              Refresh
            </button>
          </div>

          {/* List */}
          {loading ? (
            <p className="text-gray-600">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="text-gray-600">No postings for this filter.</p>
          ) : (
            <div className="grid gap-4">
              {visible.map((p) => (
                <article
                  key={p.id}
                  className="card flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-lg font-semibold text-uga-black">{p.title}</div>
                    <div className="text-sm text-gray-600">
                      {p.company} • {p.job_type} • Deadline:{" "}
                      {new Date(p.deadline).toLocaleDateString()}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                      Status: {p.status}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {p.status !== "approved" && (
                      <button
                        onClick={() => setStatus(p.id, "approved")}
                        disabled={busyId === p.id}
                        className="btn-primary"
                      >
                        {busyId === p.id ? "Working…" : "Approve"}
                      </button>
                    )}
                    {p.status !== "removed" && (
                      <button
                        onClick={() => setStatus(p.id, "removed")}
                        disabled={busyId === p.id}
                        className="btn-secondary"
                      >
                        Remove
                      </button>
                    )}
                    {p.status === "removed" && (
                      <button
                        onClick={() => setStatus(p.id, "pending")}
                        disabled={busyId === p.id}
                        className="btn-secondary"
                      >
                        Restore to Pending
                      </button>
                    )}
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
