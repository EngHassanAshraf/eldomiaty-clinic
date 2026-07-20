'use client';

import Link from 'next/link';
import { FileText, ReceiptText, Settings2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getProfileDisplayName } from '@/lib/user';

export default function ProfilePage() {
  const { isLoading, user } = useRequireAuth();

  if (isLoading || !user) {
    return null;
  }

  const displayName = getProfileDisplayName(user);

  return (
    <main className="min-h-screen bg-[#FFF8FB] px-4 py-40 text-[#2d1a1a] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E91E63]/15 text-xl font-bold text-[#E91E63]">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3A8DDE]">Profile</p>
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <p className="text-sm text-gray-500" dir="ltr">{user.email}</p>
              </div>
            </div>
            <div className="rounded-full border border-[#E91E63]/20 bg-[#FFF2F7] px-4 py-2 text-sm font-semibold text-[#E91E63]">
              {user.role === 'ADMIN' ? 'Admin' : 'Member'}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/files" className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E91E63]/10 text-[#E91E63]">
              <FileText size={20} />
            </div>
            <h2 className="text-lg font-semibold">My Files</h2>
            <p className="mt-2 text-sm text-gray-500">Browse your available medical files and documents.</p>
          </Link>

          <Link href="/payment/my-requests" className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3A8DDE]/10 text-[#3A8DDE]">
              <ReceiptText size={20} />
            </div>
            <h2 className="text-lg font-semibold">Subscriptions</h2>
            <p className="mt-2 text-sm text-gray-500">Track your orders and subscription status.</p>
          </Link>

          <Link href="/settings" className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FCE7F0] text-[#E91E63]">
              <Settings2 size={20} />
            </div>
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="mt-2 text-sm text-gray-500">Manage your account preferences and clinic settings.</p>
          </Link>
        </section>
      </div>
    </main>
  );
}
