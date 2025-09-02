// src/app/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type SearchParams = {
  q?: string;
  job?: "Internship" | "Full-time" | "Contract" | "all";
  company?: string;
};

// Server component
export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = (searchParams?.q ?? "").trim();
  const job = (searchParams?.job ?? "all") as SearchParams["job"];
  const company = (searchParams?.company ?? "").trim();

  // Base query: only approved and not past deadline
  let query = supabase
    .from("postings")
    .select(
      "id,title,company,job_type,description,deadline,application_method,application_value"
    )
    .eq("status", "approved")
    .gte("deadline", new Date().toISOString().slice(0, 10))
    .order("created_at", { ascending: false });

  if (q) {
    // search title OR company
    query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%`);
  }
  if (job && job !== "all") {
    query = query.eq("job_type", job);
  }
  if (company) {
    query = query.ilike("company", `%${company}%`);
  }

  const { data: rows, error } = await query;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero / search bar */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-emerald-800 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">MIS Student Job Board</h1>
          <p className="mt-2 text-emerald-100">
            Browse internships & full-time roles curated for MIS students.
          </p>

          {/* Search form (GET) */}
          <form className="mt-6 grid gap-3 md:grid-cols-[1fr_200px_240px_120px]">
            <Input
              name="q"
              placeholder="Search jobs…"
              defaultValue={q}
              className="bg-white/95 text-emerald-900"
            />
            <Select name="job" defaultValue={job ?? "all"}>
              <SelectTrigger className="bg-white/95 text-emerald-900">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Full-time">Full-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="company"
              placeholder="Company"
              defaultValue={company}
              className="bg-white/95 text-emerald-900"
            />
            <Button type="submit" className="bg-white text-emerald-900 hover:bg-emerald-100">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-4 text-xl font-semibold text-emerald-900">Open Roles</h2>

        {error && (
          <p className="mb-4 text-red-600">
            Error loading jobs: {error.message}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {(rows ?? []).map((r) => (
            <Card key={r.id} className="rounded-2xl border-emerald-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-emerald-900">
                  {r.title}
                </h3>
                <p className="text-emerald-700">
                  {r.company} • {r.job_type} • Deadline:{" "}
                  {new Date(r.deadline).toLocaleDateString()}
                </p>

                {r.description && (
                  <p className="mt-2 text-sm text-emerald-800 line-clamp-3">
                    {r.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/jobs/${r.id}`}>
                    <Button variant="outline" className="rounded-xl">
                      View Details
                    </Button>
                  </Link>

                  {/* Basic apply behavior (no tracking here to keep build clean) */}
                  {r.application_method === "email" && (
                    <a href={`mailto:${r.application_value}`}>
                      <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                        Email Recruiter
                      </Button>
                    </a>
                  )}
                  {r.application_method === "url" && (
                    <a href={r.application_value} target="_blank" rel="noreferrer">
                      <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                        Visit Careers Page
                      </Button>
                    </a>
                  )}
                  {r.application_method === "phone" && (
                    <a href={`tel:${r.application_value}`}>
                      <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                        Call Recruiter
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!error && (!rows || rows.length === 0) && (
          <p className="text-emerald-700">No jobs match your filters.</p>
        )}
      </section>
    </main>
  );
}
