import { auth } from "@/auth";
import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const ctx = await getDashboardContext();

  if (!ctx) {
    redirect("/login");
  }

  const { session } = ctx;

  return (
    <div>
      <h1>Dashboard Page</h1>
      <div>{session.user?.name}</div>
      <div>{session.user?.email}</div>
      {session.user?.image && (
        <Image
          src={session.user.image}
          width={30}
          height={30}
          alt="User image"
        />
      )}
    </div>
  );
}
