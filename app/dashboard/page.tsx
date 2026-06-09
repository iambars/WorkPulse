import { auth } from "@/auth";
import SignoutButton from "@/components/ui/SignoutButton";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  console.log("session: ", session);

  if (!session) return <div>Not authenticated</div>;
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
      <SignoutButton />
    </div>
  );
}
