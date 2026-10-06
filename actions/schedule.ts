"use server";

import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import prisma from "@/lib/prisma";
import { DaySchedule } from "@/types/schedule";

export async function saveSchedule(days: DaySchedule[]) {
  const ctx = await getDashboardContext();
  if (!ctx) throw new Error("Unauthorized");

  const employeeId = ctx.employeeId;

  const normalizedDays = days.map((day) => ({
    ...day,
    shiftId: day.workDay ? day.shiftId : null,
  }));

  // console.log("normalizedDays: ", normalizedDays);

  await prisma.$transaction(
    normalizedDays.map((day) =>
      prisma.scheduleDay.upsert({
        where: {
          employeeId_date: {
            employeeId,
            date: new Date(day.date),
          },
        },
        update: {
          workDay: day.workDay,
          shiftId: day.shiftId,
        },
        create: {
          employeeId,
          date: new Date(day.date),
          workDay: day.workDay,
          shiftId: day.shiftId,
        },
      }),
    ),
    { timeout: 10000 },
  );
}
