"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavbarMenuItem } from "@/components/navbar-menu";

interface AccountDropdownProps {
  displayName: string;
  role?: string;
  items: NavbarMenuItem[];
  locale: 'ar' | 'en';
  initialOpen?: boolean;
  onAction?: (item: NavbarMenuItem) => void | Promise<void>;
}

export function AccountDropdown({
  displayName,
  role,
  items,
  locale,
  initialOpen = false,
  onAction,
}: AccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const navItems    = items.filter((i) => i.action !== 'logout');
  const logoutItem  = items.find((i) => i.action === 'logout');

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-[#3A8DDE]/30 hover:shadow-md"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E91E63]/15 text-sm font-bold text-[#E91E63]">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[140px] truncate">{displayName}</span>
        <ChevronDown size={10} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_12px_36px_rgba(0,0,0,0.14)]">

          {/* Header */}
          <div className="rounded-xl border border-[#F6DCE7] bg-[#FFF7FA] px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3A8DDE]">
              {locale === 'ar' ? 'الحساب' : 'Account'}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">{displayName}</p>
            {role && (
              <p className="mt-0.5 text-xs text-gray-500">{role}</p>
            )}
          </div>

          {/* Navigation items */}
          {navItems.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href!}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-[#FDE8EF] hover:text-[#E91E63]"
                >
                  <span>{item.label[locale]}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Logout footer */}
          {logoutItem && (
            <>
              <div className="my-2 h-px bg-gray-100" />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAction?.(logoutItem);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-[#FDE8EF] hover:text-[#E91E63]"
              >
                <span>{logoutItem.label[locale]}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
