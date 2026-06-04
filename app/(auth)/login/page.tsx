export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="border-card w-full max-w-md space-y-6 rounded-xl border p-6 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-primary text-2xl font-bold">
            Sign in to WorkPulse
          </h1>
          <p className="text-secondary mt-1 text-sm">
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="text-primary text-sm font-medium">
              Email address
            </label>
            <input
              type="email"
              className="border-border mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-primary text-sm font-medium">Password</label>
            <input
              type="password"
              className="border-border mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="border-border w-full rounded-md border bg-black/75 py-2 text-white transition hover:bg-gray-800"
          >
            Sign in
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="border-secondary space-y-2 border-t pt-4">
          <h2 className="text-primary text-sm font-semibold">Demo Accounts</h2>
          <p className="text-secondary text-sm">
            You can use the following accounts to test the app:
          </p>

          <div className="text-secondary space-y-3 text-xs">
            <div>
              <p>
                Admin Email:{" "}
                <span className="font-mono">admin@workpulse.com</span>
              </p>
              <p>
                Password: <span className="font-mono">Admin123!</span>
              </p>
            </div>
            <div>
              <p>
                User Email:{" "}
                <span className="font-mono">user@workpulse.com</span>
              </p>
              <p>
                Password: <span className="font-mono">User123!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-500">
          Passwords are securely hashed using{" "}
          <span className="font-semibold">bcrypt</span>.
        </p>
      </div>
    </div>
  );
}
