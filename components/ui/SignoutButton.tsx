"use client";

import { signOut } from "next-auth/react";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SignoutButton() {
  return (
    <div className="mb-6 flex justify-end">
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600 active:scale-[0.98]"
      >
        <ChevronLeft size={18} />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
