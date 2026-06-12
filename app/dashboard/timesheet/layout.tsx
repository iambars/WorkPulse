import { auth } from "@/auth";
import { NavBar } from "@/components/ui/timesheet";
import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";

import { redirect } from "next/navigation";

export default async function TimeSheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getDashboardContext();
  if (!ctx) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <NavBar />

      {children}
    </div>
  );
}
