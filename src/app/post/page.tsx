'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUserRole } from '@/lib/useUserRole';

export default function PostJobPage() {
  const { role } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    title: '', company: '', industry: 'Technology',
    job_type: 'Internship', description: '', responsibilities: '',
    skills: '', deadline: '', application_method: 'email', application_value: ''
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setLoading(true); setMsg('');
    const { error } = await supabase.from('postings').insert({
      title: form.title,
      company: form.company,
      industry: form.industry,
      job_type: form.job_type,
      description: form.description,
      responsibilities: form.responsibilities,
      skills: form.skills,
      deadline: form.deadline, // 'YYYY-MM-DD'
      application_method: form.application_method,
      application_value: form.application_value,
      // owner_id will be set automatically by trigger set_post_owner()
      // status defaults to 'pending' (faculty/admin can change to approved)
    });
    setLoading(false);
    setMsg(error ? `Error: ${error.message}` : 'Submitted! It will appear after approval.');
  }

  // simple guard
  if (role === null) return <main className="p-6">Please <a className="underline" href="/login">login</a> to post.</main>;
  if (!['faculty','company','admin'].includes(role))
    return <main className="p-6">Only faculty, company reps, or admins can post.</main>;

  return (
    <main className="p-6 max-w-3xl mx-auto grid gap-3">
      <h1 className="text-2xl font-bold">Post a Job</h1>

      <input className="border rounded px-3 py-2" placeholder="Job Title" value={form.title} onChange={e=>update('title',e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Company" value={form.company} onChange={e=>update('company',e.target.value)} />

      <div className="grid grid-cols-2 gap-3">
        <select className="border rounded px-3 py-2" value={form.industry} onChange={e=>update('industry',e.target.value)}>
          <option>Technology</option><option>Consulting</option><option>Finance</option>
        </select>
        <select className="border rounded px-3 py-2" value={form.job_type} onChange={e=>update('job_type',e.target.value)}>
          <option>Internship</option><option>Full-time</option><option>Contract</option>
        </select>
      </div>

      <textarea className="border rounded px-3 py-2" rows={3} placeholder="Description" value={form.description} onChange={e=>update('description',e.target.value)} />
      <textarea className="border rounded px-3 py-2" rows={2} placeholder="Responsibilities" value={form.responsibilities} onChange={e=>update('responsibilities',e.target.value)} />
      <textarea className="border rounded px-3 py-2" rows={2} placeholder="Required skills" value={form.skills} onChange={e=>update('skills',e.target.value)} />

      <div className="grid grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2" type="date" value={form.deadline} onChange={e=>update('deadline',e.target.value)} />
        <select className="border rounded px-3 py-2" value={form.application_method} onChange={e=>update('application_method',e.target.value)}>
          <option value="email">Email</option>
          <option value="url">URL</option>
          <option value="phone">Phone</option>
        </select>
      </div>

      <input className="border rounded px-3 py-2" placeholder="Application value (email/url/phone)" value={form.application_value} onChange={e=>update('application_value',e.target.value)} />

      <button disabled={loading} onClick={submit} className="bg-emerald-600 text-white px-4 py-2 rounded">
        {loading ? 'Submitting…' : 'Submit Posting'}
      </button>

      <p className="text-sm text-gray-600">{msg}</p>
    </main>
  );
}
