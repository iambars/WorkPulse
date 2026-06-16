"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma/client";

type ShiftInput = {
  id?: string; // optional for new shifts
  name: string;
  startTime: string;
  endTime: string;
  color: string;
};

export async function saveShifts(shifts: ShiftInput[] = []) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "You are not logged in.",
      };
    }

    const userId = session.user.id;

    const employee = await prisma.employee.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!employee) {
      return {
        ok: false,
        errror: "EMPLOYEE_NOT_FOUND",
        message: "Employee not found.",
      };
    }

    const employeeId = employee.id;

    // Client side duplicate check
    const nameSet = new Set<string>();
    for (const shift of shifts) {
      const key = shift.name.trim().toLowerCase();

      if (nameSet.has(key)) {
        return {
          ok: false,
          error: "DUPLICATE_SHIFT_NAME",
          message: `Duplicate shift name in input: "${shift.name}"`,
        };
      }

      nameSet.add(key);
    }

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

      // 4. Update or create
      for (const shift of shifts) {
        if (shift.id) {
          await tx.shift.update({
            where: {
              id: shift.id,
            },

            data: {
              name: shift.name,
              startTime: shift.startTime,
              endTime: shift.endTime,
              color: shift.color,
            },
          });
        } else {
          await tx.shift.create({
            data: {
              employeeId,
              name: shift.name,
              startTime: shift.startTime,
              endTime: shift.endTime,
              color: shift.color,
            },
          });
        }
      }

      return tx.shift.findMany({
        where: { employeeId },
        orderBy: { createdAt: "asc" },
      });
    });
    return { ok: true, data: result };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        error: "DUPLICATE_SHIFT_NAME",
        message: "Shift name already exists. Replace it with unique name.",
      };
    }

    return {
      ok: false,
      error: "UNKNOWN_ERROR",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the shifts.",
    };
  }
}
