"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

type ShiftInput = {
  id?: string; // optional for new shifts
  name: string;
  startTime: string;
  endTime: string;
  color: string;
};

export async function saveShifts(shifts: ShiftInput[] = []) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const employee = await prisma.employee.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const employeeId = employee.id;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Get existing shifts
    const existing = await tx.shift.findMany({
      where: { employeeId },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((s) => s.id));
    const incomingIds = new Set(
      shifts.filter((s) => s.id).map((s) => s.id as string),
    );

    // 2. check if the shift to be deleted is in use
    const usedShifts = await tx.scheduleDay.findMany({
      where: {
        employeeId,
        shiftId: { not: null },
      },
      select: {
        shiftId: true,
      },
    });

    const usedSet = new Set(
      usedShifts.map((shift) => shift.shiftId).filter(Boolean),
    );
    const toDelete = existing.filter((s) => !incomingIds.has(s.id));
    const blocked = toDelete.find((s) => usedSet.has(s.id));

    if (blocked) {
      throw new Error(
        "Cannot delete this shift because it is in used in schedule",
      );
    }

    // 3. DELETE removed shifts
    await tx.shift.deleteMany({
      where: {
        employeeId,
        id: {
          notIn: [...incomingIds],
        },
      },
    });

    // 4. UPSERT each shift
    for (const shift of shifts) {
      await tx.shift.upsert({
        where: {
          id: shift.id ?? "",
        },
        update: {
          name: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          color: shift.color,
        },
        create: {
          employeeId,
          name: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          color: shift.color,
        },
      });
    }

    return tx.shift.findMany({
      where: { employeeId },
      orderBy: { createdAt: "asc" },
    });
  });
  return result;
}
