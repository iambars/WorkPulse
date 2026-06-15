"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabs } from "@/types/timesheet";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className="border-secondary/20 bg-background sticky top-0 z-10 flex w-full border-b pt-6 text-sm font-medium md:pt-8">
      {tabs.map((tab) => {
        const href = `/dashboard/timesheet/${tab.toLowerCase()}`;

        const isActive = pathname === href;

        return (
          <Link
            key={tab}
            href={href}
            className={`px-4 py-2 ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </Link>
        );
      })}
    </div>
  );
}
