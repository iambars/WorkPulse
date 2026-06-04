import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background flex flex-1 flex-col items-center justify-center font-sans">
      <main className="bg-background flex min-h-screen w-full max-w-3xl flex-1 flex-col items-center justify-center px-16 py-32 sm:items-start">
        <div className="flex w-full flex-col justify-center">
          <h1 className="text-5xl font-bold tracking-tight">WorkPulse</h1>
          <p className="text-secondary mt-6 max-w-2xl text-lg">
            A workfore management system designed to help organizations track
            employee attendance, manage shifts, and monitor hours from a
            centralized dashboard.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="bg-foreground text-background hover:bg-foreground/80 flex h-12 items-center justify-center rounded-full px-8 transition-colors"
            >
              Sign up
            </Link>

            <Link
              href="/login"
              className="border-border hover:bg-foreground/10 flex h-12 items-center justify-center rounded-full border px-8 transition-colors"
            >
              Sign in
            </Link>
          </div>
          <div className="border-border mt-16 w-full rounded-2xl border p-6 text-left">
            <h2 className="text-lg font-semibold">Demo Accounts</h2>

            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-medium">Administrator</h3>

                <p className="text-secondary mt-2">
                  Email: admin@workpulse.com
                </p>

                <p className="text-secondary">Password: Admin123!</p>
              </div>

              <div>
                <h3 className="font-medium">Employee</h3>

                <p className="text-secondary mt-2">Email: user@workpulse.com</p>

                <p className="text-secondary">Password: User123!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
