'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import RoleGate from '@/components/RoleGate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

type JobType = 'Internship' | 'Full-time' | 'Contract';
type AppMethod = 'email' | 'url' | 'phone';

export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    company: '',
    industry: '',
    job_type: '' as JobType | '',
    description: '',
    responsibilities: '',
    skills: '',
    deadline: '',
    application_method: '' as AppMethod | '',
    application_value: '',
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit() {
    setErr(null); setMsg(null);
    if (
      !form.title ||
      !form.company ||
      !form.job_type ||
      !form.deadline ||
      !form.application_method ||
      !form.application_value
    ) {
      setErr('Please complete required fields.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('postings').insert({
      title: form.title,
      company: form.company,
      industry: form.industry,
      job_type: form.job_type,
      description: form.description,
      responsibilities: form.responsibilities,
      skills: form.skills,
      deadline: form.deadline,
      application_method: form.application_method,
      application_value: form.application_value,
      status: 'pending',
    });
    setLoading(false);

    if (error) { setErr(error.message); return; }
    setMsg('Submitted! A faculty/admin will review it shortly.');
    setForm({
      title: '', company: '', industry: '', job_type: '', description: '',
      responsibilities: '', skills: '', deadline: '', application_method: '', application_value: ''
    });
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <RoleGate allow={['company','faculty','admin']}>
          <h1 className="mb-4 text-2xl font-semibold text-emerald-900">Post a Job</h1>
          <p className="mb-6 text-sm text-gray-600">
            Company reps, faculty, and admins can submit postings. Submissions start as <strong>pending</strong> and require approval.
          </p>

          <Card className="rounded-2xl border-emerald-200">
            <CardContent className="space-y-4 p-6">
              <Input placeholder="Job Title *" value={form.title} onChange={(e) => update('title', e.target.value)} />
              <Input placeholder="Company Name *" value={form.company} onChange={(e) => update('company', e.target.value)} />
              <div className="grid gap-3 md:grid-cols-3">
                <Input placeholder="Industry" value={form.industry} onChange={(e) => update('industry', e.target.value)} />

                <Select onValueChange={(v: JobType) => update('job_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Job Type *" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Full-time">Full-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>

                <Input type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
              </div>

              <Textarea rows={3} placeholder="Job Description" value={form.description} onChange={(e) => update('description', e.target.value)} />
              <Textarea rows={2} placeholder="Key Responsibilities" value={form.responsibilities} onChange={(e) => update('responsibilities', e.target.value)} />
              <Textarea rows={2} placeholder="Required Skills" value={form.skills} onChange={(e) => update('skills', e.target.value)} />

              <div className="grid gap-3 md:grid-cols-2">
                <Select onValueChange={(v: AppMethod) => update('application_method', v)}>
                  <SelectTrigger><SelectValue placeholder="Application Method *" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="url">Careers URL</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Email / URL / Phone *"
                  value={form.application_value}
                  onChange={(e) => update('application_value', e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button onClick={submit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? 'Submitting…' : 'Submit Posting'}
                </Button>
              </div>

              {err && <p className="text-red-600">{err}</p>}
              {msg && <p className="text-emerald-700">{msg}</p>}
            </CardContent>
          </Card>
        </RoleGate>
      </section>
    </main>
  );
}
