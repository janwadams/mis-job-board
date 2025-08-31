import { supabase } from '@/lib/supabaseClient';

export default async function Home() {
  // Fetch postings from Supabase
  const { data, error } = await supabase
    .from('postings')
    .select('title, company, status, deadline')
    .order('created_at', { ascending: false });

  if (error) {
    return <pre>Error: {error.message}</pre>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Job Postings</h1>
      <ul>
        {data?.map((p) => (
          <li key={p.title}>
            {p.title} — {p.company} — {p.status} — {p.deadline}
          </li>
        ))}
      </ul>
    </main>
  );
}
