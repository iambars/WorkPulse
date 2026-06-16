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

    // Duplicate name check
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
      const saved = [];

      for (const shift of shifts) {
        const existing = await tx.shift.findUnique({
          where: { id: shift.id },
        });

        if (existing) {
          // update existing shift
          saved.push(
            await tx.shift.update({
              where: { id: shift.id },
              data: {
                name: shift.name,
                startTime: shift.startTime,
                endTime: shift.endTime,
                color: shift.color,
              },
            }),
          );
        } else {
          saved.push(
            await tx.shift.create({
              data: {
                id: shift.id, // IMPORTANT: persist client UUID
                employeeId,
                name: shift.name,
                startTime: shift.startTime,
                endTime: shift.endTime,
                color: shift.color,
              },
            }),
          );
        }
      }

      return saved;

      // await Promise.all(
      //   shifts.map((shift) => {
      //     if (shift.id) {
      //       return tx.shift.update({
      //         where: { id: shift.id },
      //         data: {
      //           name: shift.name,
      //           startTime: shift.startTime,
      //           endTime: shift.endTime,
      //           color: shift.color,
      //         },
      //       });
      //     }

      //     return tx.shift.create({
      //       data: {
      //         employeeId,
      //         name: shift.name,
      //         startTime: shift.startTime,
      //         endTime: shift.endTime,
      //         color: shift.color,
      //       },
      //     });
      //   }),
      // );
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
