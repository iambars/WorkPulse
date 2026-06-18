import { AttendanceTable } from "@/components/ui/timesheet";
import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Attendance() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;

  const formatTime = (date: Date | null) =>
    date
      ? `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes(),
        ).padStart(2, "0")}`
      : null;

  // fetch existing schedules in the database based on employeeId
  // convert the date from 'Date' to string
  const schedules = (
    await prisma.scheduleDay.findMany({
      where: { employeeId: ctx.employeeId },
      orderBy: { date: "asc" },
    })
  ).map((schedule) => ({
    ...schedule,
    date: formatDate(schedule.date),
  }));

  const attendance = (
    await prisma.attendance.findMany({
      where: { employeeId: ctx.employeeId },
      orderBy: { date: "asc" },
    })
  ).map((record) => ({
    ...record,
    date: formatDate(record.date),
    timeIn: formatTime(record.timeIn),
    timeOut: formatTime(record.timeOut),
    remarks: record.remarks ?? undefined,
  }));

  // console.log("ctx: ", ctx);
  // console.log("schedules: ", schedules);

  return (
    <AttendanceTable
      shifts={ctx.shifts}
      initialSchedules={schedules}
      initialAttendance={attendance}
    />
  );
}
