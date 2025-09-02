// src/app/admin/jobs/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGate from "@/components/RoleGate";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type JobType = "Internship" | "Full-time" | "Contract";
type AppMethod = "email" | "url" | "phone";
type Status = "pending" | "approved" | "removed" | "withdrawn" | "archived";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    industry: "",
    job_type: "" as JobType | "",
    description: "",
    responsibilities: "",
    skills: "",
    deadline: "",
    application_method: "" as AppMethod | "",
    application_value: "",
    status: "pending" as Status,
  });

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  useEffect(() => {
    (async () => {
      setErr(null);
      const { data, error } = await supabase.from("postings").select("*").eq("id", id).maybeSingle();
      if (error || !data) { setErr(error?.message || "Not found"); setLoading(false); return; }
      setForm({
        title: data.title ?? "",
        company: data.company ?? "",
        industry: data.industry ?? "",
        job_type: data.job_type ?? "",
        description: data.description ?? "",
        responsibilities: data.responsibilities ?? "",
        skills: data.skills ?? "",
        deadline: (data.deadline ?? "").slice(0, 10),
        application_method: data.application_method ?? "",
        application_value: data.application_value ?? "",
        status: (data.status ?? "pending") as Status,
      });
      setLoading(false);
    })();
  }, [id]);

  async function save() {
    setErr(null);
    const { error } = await supabase.from("postings").update({
      title: form.title,
      company: form.company,
      industry: form.industry,
      job_type: form.job_type || null,
      description: form.description || null,
      responsibilities: form.responsibilities || null,
      skills: form.skills || null,
      deadline: form.deadline,
      application_method: form.application_method,
      application_value: form.application_value,
      status: form.status,
    }).eq("id", id);
    if (error) { setErr(error.message); return; }
    router.push("/admin/jobs");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <RoleGate allow={["faculty", "admin"]}>
          <h1 className="mb-4 text-2xl font-semibold text-emerald-900">Edit Posting</h1>
          {loading ? <p>Loading…</p> : (
            <Card className="rounded-2xl border-emerald-200">
              <CardContent className="space-y-4 p-6">
                {err && <p className="text-red-600">{err}</p>}

                <Input placeholder="Job Title" value={form.title} onChange={(e) => update("title", e.target.value)} />
                <Input placeholder="Company" value={form.company} onChange={(e) => update("company", e.target.value)} />

                <div className="grid gap-3 md:grid-cols-3">
                  <Input placeholder="Industry" value={form.industry} onChange={(e) => update("industry", e.target.value)} />
                  <Select value={form.job_type || undefined} onValueChange={(v: JobType) => update("job_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Job Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Full-time">Full-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
                </div>

                <Textarea rows={3} placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
                <Textarea rows={2} placeholder="Responsibilities" value={form.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} />
                <Textarea rows={2} placeholder="Skills" value={form.skills} onChange={(e) => update("skills", e.target.value)} />

                <div className="grid gap-3 md:grid-cols-2">
                  <Select value={form.application_method || undefined} onValueChange={(v: AppMethod) => update("application_method", v)}>
                    <SelectTrigger><SelectValue placeholder="Application Method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="url">Careers URL</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Email / URL / Phone" value={form.application_value} onChange={(e) => update("application_value", e.target.value)} />
                </div>

                <Select value={form.status} onValueChange={(v: Status) => update("status", v)}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>

                <div className="pt-2">
                  <Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
                  <Button variant="outline" className="ml-2" onClick={() => router.push("/admin/jobs")}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </RoleGate>
      </section>
    </main>
  );
}
