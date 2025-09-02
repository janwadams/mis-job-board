// src/components/ApplyButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type ApplyButtonProps = {
  postingId: string;
  href: string;
  label: string;
  newTab?: boolean;
};

export default function ApplyButton({
  postingId,
  href,
  label,
  newTab,
}: ApplyButtonProps) {
  async function clickAndGo() {
    try {
      // best-effort tracking; ignore failure
      await supabase.rpc("increment_apply", { p_posting: postingId });
    } catch {
      /* noop */
    }

    if (newTab) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  }

  return (
    <Button
      onClick={clickAndGo}
      className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
    >
      {label}
    </Button>
  );
}
