import { AttendanceTable } from "@/components/ui/timesheet";
import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Attendance() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");

  // fetch existing schedules in the database based on employeeId
  // convert the date from 'Date' to string
  const schedules = (
    await prisma.scheduleDay.findMany({
      where: { employeeId: ctx.employeeId },
      orderBy: { date: "asc" },
    })
  ).map((schedule) => ({
    ...schedule,
    date:
      `${schedule.date.getFullYear()}-` +
      `${String(schedule.date.getMonth() + 1).padStart(2, "0")}-` +
      `${String(schedule.date.getDate()).padStart(2, "0")}`,
  }));

  return <AttendanceTable shifts={ctx.shifts} initialSchedules={schedules} />;
}
