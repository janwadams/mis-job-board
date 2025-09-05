"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Posting = {
  id: string;
  title: string;
  company: string;
  status: string;
  deadline: string;
  description?: string;
};

export default function HomePage() {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from("postings")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPostings(data);
    }
  }

  const filtered = postings.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-uga-dark text-white py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-3xl font-bold">MIS Student Job Board</h1>
          <p className="mt-2 text-gray-200">
            Browse internships & full-time roles curated for MIS students.
          </p>
          <div className="mt-6 flex gap-2">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md px-4 py-2 text-black"
            />
            <Button className="btn-primary">Search</Button>
          </div>
        </div>
      </section>

      {/* Job cards */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="mb-6 text-xl font-semibold text-uga-dark">Open Roles</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-uga-dark">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.company} • Deadline:{" "}
                  {new Date(job.deadline).toLocaleDateString()}
                </p>
                {job.description && (
                  <p className="mt-2 text-sm text-gray-700">{job.description}</p>
                )}

                <div className="mt-4 flex gap-3">
                  <Link href={`/jobs/${job.id}`}>
                    <Button className="btn-secondary">View Details</Button>
                  </Link>
                  <a
                    href="#"
                    onClick={() =>
                      window.open("mailto:recruiter@" + job.company.toLowerCase() + ".com")
                    }
                  >
                    <Button className="btn-primary">Apply</Button>
                  </a>
                </div>
              </div>
            </div>
          ))}

          {!filtered.length && (
            <p className="text-gray-500">No roles match your search.</p>
          )}
        </div>
      </section>
    </main>
  );
}
