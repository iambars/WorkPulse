import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import { ScheduleCalendarClient } from "@/components/ui/timesheet";

export default async function SchedulePage() {
  const ctx = await getDashboardContext();

  if (!ctx) redirect("/login");

  return (
    <ScheduleCalendarClient shifts={ctx.shifts} employeeId={ctx.employeeId} />
  );
}
