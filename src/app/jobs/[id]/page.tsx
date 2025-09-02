// src/app/jobs/[id]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default async function JobDetails({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("postings")
    .select("id,title,company,job_type,description,responsibilities,skills,deadline,application_method,application_value,status")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !data) {
    return <main className="p-6"><p className="text-red-600">Not found.</p></main>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-emerald-900">{data.title}</h1>
        <p className="text-emerald-700">
          {data.company} • {data.job_type} • Deadline: {new Date(data.deadline).toLocaleDateString()}
        </p>
        {data.description && <p className="mt-4 text-emerald-900">{data.description}</p>}
        {data.responsibilities && <p className="mt-3 text-emerald-900"><b>Responsibilities:</b> {data.responsibilities}</p>}
        {data.skills && <p className="mt-3 text-emerald-900"><b>Skills:</b> {data.skills}</p>}

        <div className="mt-6 flex gap-2">
          {data.application_method === "email" && (
            <a href={`mailto:${data.application_value}`}>
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">Email Recruiter</Button>
            </a>
          )}
          {data.application_method === "url" && (
            <a href={data.application_value} target="_blank" rel="noreferrer">
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">Visit Careers Page</Button>
            </a>
          )}
          {data.application_method === "phone" && (
            <a href={`tel:${data.application_value}`}>
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">Call Recruiter</Button>
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
