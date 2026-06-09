import prisma from "@/lib/prisma";

export async function linkGoogleUser(user: {
  email: string;
  name?: string | null;
}) {
  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name ?? undefined,
    },
    create: {
      email: user.email,
      name: user.name,
      role: "EMPLOYEE",
    },
  });
}
