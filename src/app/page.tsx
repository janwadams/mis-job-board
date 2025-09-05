"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Posting = {
  id: string;
  title: string;
  company: string;
  deadline: string | null;
  summary?: string | null;      // optional short description
  apply_url?: string | null;    // optional external link
};

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Posting[]>([]);
  const [q, setQ] = useState("");

  // 1) Redirect to /login if not signed in
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }
      // If signed in, load the approved postings
      await loadApproved();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadApproved() {
    const { data, error } = await supabase
      .from("postings")
      .select("id,title,company,deadline,summary,apply_url,status")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error && data) setRows(data as Posting[]);
  }

  // simple client-side filter (since search isn’t wired to DB yet)
  const filtered = rows.filter((p) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      p.title.toLowerCase().includes(needle) ||
      p.company.toLowerCase().includes(needle)
    );
  });

  function onApply(p: Posting) {
    if (p.apply_url) {
      window.open(p.apply_url, "_blank");
    } else {
      alert("No application URL provided for this posting.");
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <p>Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        {/* Hero / search header */}
        <section className="hero">
          <h1 className="h1">MIS Student Job Board</h1>
          <p className="muted">
            Browse internships &amp; full-time roles curated for MIS students.
          </p>

          <form
            className="search-row"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              className="input"
              placeholder="Search jobs…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn-primary" type="submit">
              Search
            </button>
          </form>
        </section>

        <h2 className="h2 mt-xl">Open Roles</h2>

        {/* Cards list */}
        <div className="cards">
          {filtered.map((p) => (
            <article key={p.id} className="card">
              <div className="card-body">
                <h3 className="card-title">{p.title}</h3>
                <div className="muted">
                  {p.company}
                  {p.deadline ? ` • Deadline: ${new Date(p.deadline).toLocaleDateString()}` : ""}
                </div>

                {p.summary && <p className="mt-sm">{p.summary}</p>}

                <div className="actions">
                  {/* If you later add /jobs/[id], link to it here */}
                  <a className="btn-outline" href="#" onClick={(e) => e.preventDefault()}>
                    View details
                  </a>
                  <button className="btn-primary" onClick={() => onApply(p)}>
                    Apply
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!filtered.length && (
            <p className="muted mt-lg">No jobs match your search.</p>
          )}
        </div>
      </div>
    </main>
  );
}
