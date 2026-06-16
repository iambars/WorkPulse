"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma/client";

type ShiftInput = {
  id?: string;
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

    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!employee) {
      return {
        ok: false,
        error: "EMPLOYEE_NOT_FOUND",
        message: "Employee not found.",
      };
    }

    const employeeId = employee.id;

    // ✅ duplicate name check
    const nameSet = new Set<string>();

    for (const shift of shifts) {
      const key = shift.name.trim().toLowerCase();

      if (nameSet.has(key)) {
        return {
          ok: false,
          error: "DUPLICATE_SHIFT_NAME",
          message: `Duplicate shift name: "${shift.name}"`,
        };
      }

      nameSet.add(key);
    }

    const result = await prisma.$transaction(async (tx) => {
      const saved = [];

      for (const shift of shifts) {
        // ignore temp IDs safely
        const isValidId = shift.id && !shift.id.startsWith("temp");

        if (isValidId) {
          // ✅ safe upsert behavior
          const updated = await tx.shift.upsert({
            where: { id: shift.id },
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

          saved.push(updated);
        } else {
          const created = await tx.shift.create({
            data: {
              employeeId,
              name: shift.name,
              startTime: shift.startTime,
              endTime: shift.endTime,
              color: shift.color,
            },
          });

          saved.push(created);
        }
      }

      return saved;
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
        message: "Shift name already exists.",
      };
    }

    return {
      ok: false,
      error: "UNKNOWN_ERROR",
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}
