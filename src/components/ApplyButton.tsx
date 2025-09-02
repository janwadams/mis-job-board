'use client';

import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

type Props = {
  postingId: string;
  href: string;           // "mailto:hr@..." or "https://..."
  label: string;          // "Email Recruiter" / "Visit Careers Page" / phone #
  newTab?: boolean;       // for external URLs
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | null | undefined;
  className?: string;
};

export default function ApplyButton({ postingId, href, label, newTab, variant, className }: Props) {
  async function handleClick() {
    // best-effort; we don't block the user if this fails
    try {
      await supabase.rpc('increment_apply', { p_posting: postingId });
    } catch (e) {
      // ignore
    }

    if (newTab) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  }

  return (
    <Button onClick={handleClick} variant={variant} className={className}>
      {label}
    </Button>
  );
}
