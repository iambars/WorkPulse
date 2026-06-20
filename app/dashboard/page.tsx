import { auth } from "@/auth";
import { getDashboardContext } from "@/lib/dashboard/getDashboardContext";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // const ctx = await getDashboardContext();

  // if (!ctx) {
  //   redirect("/login");
  // }

  // const { session } = ctx;
  // console.log("session: ", session);

  return (
    <div className="border-secondary/20 m-8 flex h-[40vh] items-center justify-center rounded-2xl border shadow-md">
      <div className="space-y-3 text-center">
        <h1 className="text-primary/95 text-xl font-semibold">Dashboard</h1>

        <p className="text-gray-500">
          This section is under development.
          <br />
          Changes will be available soon.
        </p>
      </div>
    </div>
  );
}
