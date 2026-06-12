import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getDashboardContext() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
  });

  if (!employee) return null;

  const shifts = await prisma.shift.findMany({
    where: { employeeId: employee.id },
  });

  return {
    session,
    userId: session.user.id,
    employeeId: employee.id,
    shifts,
  };
}
