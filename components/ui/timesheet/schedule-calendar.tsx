import ScheduleCalendarClient from "./schedule-table";
import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import { redirect } from "next/navigation";

export default async function ScheduleCalendar() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  const { shifts, employeeId } = ctx;

  return <ScheduleCalendarClient shifts={shifts} employeeId={employeeId} />;
}
