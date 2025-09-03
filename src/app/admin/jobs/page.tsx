// src/app/admin/jobs/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import RoleGate from "@/components/RoleGate";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  company: string;
  deadline: string; // ISO
  status: "pending" | "approved" | "removed" | "withdrawn" | "archived";
};

function JobsInner() {
  const [rows, setRows] = useState<Job[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    const { data, error } = await supabase
      .from("postings")
      .select("id,title,company,deadline,status")
      .order("created_at", { ascending: false });

    if (error) {
      setErr(error.message);
      setRows([]);
      return;
    }
    setRows((data as Job[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function archive(id: string) {
    setBusyId(id);
    const { error } = await supabase
      .from("postings")
      .update({ status: "archived" })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      alert(error.message);
      return;
    }
    void load();
  }

  async function remove(id: string) {
    setBusyId(id);
    const { error } = await supabase
      .from("postings")
      .update({ status: "removed" })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      alert(error.message);
      return;
    }
    void load();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-900">
              Manage Jobs
            </h1>
            <p className="text-sm text-gray-600">
              Faculty and admins can archive or remove postings.
            </p>
          </div>
          {/* Link to edit page (optional per job) – leaving here as a hint */}
          {/* <Link href="/admin/jobs/new" className="text-sm underline">New Job</Link> */}
        </div>

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
                  <div className="text-lg font-semibold text-emerald-900">
                    {p.title}
                  </div>
                  <div className="text-sm text-emerald-700">
                    {p.company} • Due{" "}
                    {new Date(p.deadline).toLocaleDateString()} •{" "}
                    <span className="uppercase">{p.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/jobs/${p.id}`}
                    className="text-sm underline text-emerald-700 hover:text-emerald-900"
                  >
                    View
                  </Link>
                  {p.status !== "archived" && (
                    <Button
                      variant="outline"
                      onClick={() => archive(p.id)}
                      disabled={busyId === p.id}
                    >
                      {busyId === p.id ? "Working…" : "Archive"}
                    </Button>
                  )}
                  {p.status !== "removed" && (
                    <Button
                      variant="outline"
                      onClick={() => remove(p.id)}
                      disabled={busyId === p.id}
                      className="text-red-600 hover:bg-red-50"
                    >
                      {busyId === p.id ? "Working…" : "Remove"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {!rows.length && !err && (
            <p className="text-gray-600">No job postings found.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default function JobsAdminPage() {
  return (
    <RoleGate allow={["faculty", "admin"]}>
      <JobsInner />
    </RoleGate>
  );
}
