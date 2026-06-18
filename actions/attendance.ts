"use server";

import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type SaveAttendanceInput = {
  records: {
    date: string;
    timeIn: string;
    timeOut: string;
    remarks?: string;
  }[];
};

export async function saveAttendance({ records }: SaveAttendanceInput) {
  const ctx = await getDashboardContext();
  if (!ctx) throw new Error("Unauthorized");

  const employeeId = ctx.employeeId;

  await prisma.$transaction(
    records.map((record) => {
      const attendanceDate = new Date(record.date);

      const timeIn = record.timeIn
        ? new Date(`${record.date}T${record.timeIn}:00`)
        : null;

      const timeOut = record.timeOut
        ? new Date(`${record.date}T${record.timeOut}:00`)
        : null;

      return prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId,
            date: attendanceDate,
          },
        },

        create: {
          employeeId,
          date: attendanceDate,
          timeIn,
          timeOut,
          remarks: record.remarks,
        },

        update: {
          timeIn,
          timeOut,
          remarks: record.remarks,
        },
      });
    }),
  );

  revalidatePath("/attendance");
}
