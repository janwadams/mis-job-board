'use client';
import { useUserRole } from '@/lib/useUserRole';
import Link from 'next/link';

export default function UserBadge() {
  const { loading, role } = useUserRole();
  return (
    <div className="p-3 text-sm flex gap-3 items-center">
      <Link className="underline" href="/">Home</Link>
      <Link className="underline" href="/login">Login</Link>
      <span className="text-gray-600">Role: {loading ? '…' : (role ?? 'anonymous')}</span>
      <Link className="underline" href="/admin/approvals">Approvals</Link>
      <Link className="underline" href="/post">Post a Job</Link>
    </div>
  );
}
