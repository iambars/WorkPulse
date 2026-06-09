"use client";

import { signOut } from "next-auth/react";
import clsx from "clsx";
import { PowerIcon } from "lucide-react";

type Props = { collapsed?: boolean };

export default function SignoutButton({ collapsed }: Props) {
  return (
    <div className="mb-5 p-2">
      <button
        type="button"
        aria-label="Sign Out"
        onClick={() => signOut({ callbackUrl: "/" })}
        className={clsx(
          "group relative flex h-12 w-full items-center rounded-lg text-sm font-medium transition-colors",
          "text-secondary hover:bg-secondary/10 hover:text-blue-600",
          collapsed ? "justify-center p-0" : "gap-2 px-3 py-2 md:justify-start",
        )}
      >
        <PowerIcon className="h-4 w-4 shrink-0" />

        {!collapsed && <span className="hidden md:block">Sign Out</span>}

        {collapsed && (
          <span className="bg-secondary/10 text-primary/80 pointer-events-none absolute top-1/2 left-full ml-4 -translate-y-1/2 rounded-lg px-3 py-2 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
            Sign Out
          </span>
        )}
      </button>
    </div>
  );
}
