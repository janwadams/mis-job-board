"use client";

import { useEffect, useState } from "react";
import RoleGate from "@/components/RoleGate";
import { supabase } from "@/lib/supabaseClient";

type JobType = "Internship" | "Full-time" | "Contract";
type AppMethod = "email" | "url" | "phone";

export default function PostJobPage() {
  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobType, setJobType] = useState<JobType>("Internship");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [skills, setSkills] = useState("");
  const [deadline, setDeadline] = useState("");
  const [appMethod, setAppMethod] = useState<AppMethod>("email");
  const [appValue, setAppValue] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Prefill company from last time (optional nicety)
  useEffect(() => {
    const cached = localStorage.getItem("post-company");
    if (cached) setCompany(cached);
  }, []);
  useEffect(() => {
    if (company) localStorage.setItem("post-company", company);
  }, [company]);

  async function submit() {
    setErr(null);
    setMsg(null);

    // simple validation
    if (!title || !company || !industry || !deadline || !appValue) {
      setErr("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    // current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const ownerId = user?.id ?? null;

    const { error } = await supabase.from("postings").insert({
      title,
      company,
      industry,
      job_type: jobType,
      description,
      responsibilities,
      skills,
      deadline,
      application_method: appMethod,
      application_value: appValue,
      status: "pending", // new posts await approval
      owner_id: ownerId,
    });

    setSubmitting(false);

    if (error) {
      setErr(error.message);
      return;
    }
    setMsg("Submitted! Your posting is now pending approval.");
    // Optional: clear some fields
    setTitle("");
    setDescription("");
    setResponsibilities("");
    setSkills("");
    setAppValue("");
  }

  return (
    <RoleGate allow={["company", "faculty", "admin"]}>
      <main className="min-h-screen bg-uga-cream">
        {/* Banner */}
        <section className="bg-uga-red text-white">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="text-2xl font-bold">Post a Job</h1>
            <p className="mt-1 text-white/90">
              Fill in the details below. Submissions are reviewed by faculty/admin.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          {err && (
            <div className="mb-4 rounded-lg border border-red-200 bg-white p-4 text-red-700">
              {err}
            </div>
          )}
          {msg && (
            <div className="mb-4 rounded-lg border border-green-200 bg-white p-4 text-green-700">
              {msg}
            </div>
          )}

          <div className="card space-y-4">
            <div>
              <label>Job Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="e.g., Data Analyst Intern"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label>Company *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  placeholder="e.g., ABC Tech"
                />
              </div>
              <div>
                <label>Industry *</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  placeholder="e.g., Software"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label>Job Type *</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobType)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label>Application Method *</label>
                <select
                  value={appMethod}
                  onChange={(e) => setAppMethod(e.target.value as AppMethod)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                >
                  <option value="email">Email</option>
                  <option value="url">URL</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
            </div>

            <div>
              <label>Application Value (Email / URL / Phone) *</label>
              <input
                type="text"
                value={appValue}
                onChange={(e) => setAppValue(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="e.g., careers@abctech.com or https://abctech.com/jobs/123"
              />
            </div>

            <div>
              <label>Application Deadline *</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                rows={4}
                placeholder="What is this role about?"
              />
            </div>

            <div>
              <label>Key Responsibilities</label>
              <textarea
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                rows={3}
                placeholder="What will the student do?"
              />
            </div>

            <div>
              <label>Required Skills</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                rows={3}
                placeholder="What skills are required?"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={submit}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? "Submitting…" : "Submit for Approval"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </RoleGate>
  );
}
