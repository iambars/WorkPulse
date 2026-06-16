import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import { ScheduleCalendarClient } from "@/components/ui/timesheet";
import prisma from "@/lib/prisma";

export default async function SchedulePage() {
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

  // console.log("ctx: ", ctx);
  // console.log("schedules: ", schedules);

  return (
    <ScheduleCalendarClient shifts={ctx.shifts} initialSchedules={schedules} />
  );
}
