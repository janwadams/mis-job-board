import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Star } from "lucide-react";

type Posting = {
  id: string;
  title: string;
  company: string;
  job_type: "Internship" | "Full-time" | "Contract";
  deadline: string; // ISO date
  description: string | null;
  application_method: "email" | "url" | "phone";
  application_value: string;
};

export default async function Home() {
  // fetch only approved & not expired
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("postings")
    .select(
      "id,title,company,job_type,deadline,description,application_method,application_value"
    )
    .eq("status", "approved")
    .gte("deadline", today)
    .order("created_at", { ascending: false });

  const postings = (data ?? []) as Posting[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">MIS Student Job Board</h1>
          <p className="mt-2 opacity-90">
            Browse internships & full-time roles curated for MIS students.
          </p>

          {/* Search / Filters (visual only for now) */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-80" />
              <Input
                placeholder="Search jobs…"
                className="pl-9 bg-white/95 text-emerald-900"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[160px] bg-white/95">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Full-time">Full-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px] bg-white/95">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                {/* static options just for demo; wire up later if you want */}
                <SelectItem value="ABC Tech">ABC Tech</SelectItem>
                <SelectItem value="TechNova Inc">TechNova Inc</SelectItem>
                <SelectItem value="Delta Corp">Delta Corp</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-white text-emerald-700 hover:bg-white/90">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-4 text-lg font-semibold text-emerald-900">
          {postings.length ? "Open Roles" : "No open roles yet"}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-5 text-red-700">
                {error.message}
              </CardContent>
            </Card>
          )}

          {postings.map((p) => (
            <Card
              key={p.id}
              className="rounded-2xl border-emerald-200 shadow-sm transition hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-emerald-900">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-emerald-700">
                      {p.company} • {p.job_type} • Deadline:{" "}
                      {new Date(p.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-emerald-600">
                    <Star className="h-5 w-5" />
                  </Button>
                </div>

                {p.description && (
                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                    {p.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  {/* View details could navigate to /jobs/[id] later */}
                  <Button variant="outline" className="rounded-xl">
                    View Details
                  </Button>

                  {p.application_method === "email" && (
                    <Button
                      asChild
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                    >
                      <a href={`mailto:${p.application_value}`}>Email Recruiter</a>
                    </Button>
                  )}

                  {p.application_method === "url" && (
                    <Button
                      asChild
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                    >
                      <a href={p.application_value} target="_blank">
                        Visit Careers Page
                      </a>
                    </Button>
                  )}

                  {p.application_method === "phone" && (
                    <Button variant="outline" className="rounded-xl">
                      {p.application_value}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
