"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { DaySchedule, ScheduleDayInput } from "@/types/schedule";

export async function saveSchedule(days: DaySchedule[]) {
  const session = await auth();
  // console.log("session: ", session);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const employee = await prisma.employee.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const employeeId = employee.id;
  const normalizedDays = days.map((day) => ({
    ...day,
    shiftId: day.workDay ? day.shiftId : null,
  }));

  console.log("normalizedDays: ", normalizedDays);

  // await prisma.scheduleDay.createMany({
  //   data: normalizedDays.map((day) => ({
  //     employeeId,
  //     date: day.date,
  //     workDay: day.workDay,
  //     shiftId: day.shiftId,
  //   })),
  // });

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
  );
}
