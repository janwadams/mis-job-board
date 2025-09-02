import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Star } from "lucide-react";
import ApplyButton from "@/components/ApplyButton";

type Posting = {
  id: string;
  title: string;
  company: string;
  job_type: "Internship" | "Full-time" | "Contract";
  deadline: string;
  description: string | null;
  application_method: "email" | "url" | "phone";
  application_value: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; type?: Posting["job_type"]; company?: string };
}) {
  const q = searchParams.q?.trim();
  const jobType = searchParams.type as Posting["job_type"] | undefined;
  const company = searchParams.company?.trim();

  const today = new Date().toISOString().slice(0, 10);

  let query = supabase
    .from("postings")
    .select(
      "id,title,company,job_type,deadline,description,application_method,application_value"
    )
    .eq("status", "approved")
    .gte("deadline", today)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%`);
  }
  if
