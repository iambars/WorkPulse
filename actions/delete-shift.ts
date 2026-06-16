"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function deleteShiftAction(shiftId: string) {
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
        error: "EMPLOYEE_NOT_FOUND",
        message: "Employee not found.",
      };
    }

    // delete shift (scoped to user)
    await prisma.shift.deleteMany({
      where: {
        id: shiftId,
        employeeId: employee.id,
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "DELETE_FAILED",
      message: "Failed to delete shift",
    };
  }
}
