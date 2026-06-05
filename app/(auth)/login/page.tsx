"use client";

import { ErrorText, GoogleButton, HomeButton } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginAction, LoginState } from "./action";

const initialState: LoginState = {
  success: false,
  redirect: null,
  errors: {},
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);
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
        <form action={formAction} className="space-y-4">
          <div>
            <label className="text-primary text-sm font-medium">
              Email address
            </label>
            <input
              name="email"
              type="email"
              className="border-border mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-600/80 focus:ring-0 focus:outline-none"
              placeholder="you@example.com"
            />
            {state.errors?.email && <ErrorText message={state.errors?.email} />}
          </div>

          <div>
            <label className="text-primary text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              className="border-border mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-600/80 focus:ring-0 focus:outline-none"
              placeholder="••••••••"
            />
            {state.errors?.password && (
              <ErrorText message={state.errors?.password} />
            )}
          </div>

          {state.errors?.form && <ErrorText message={state.errors?.form} />}

          <button
            type="submit"
            className="border-border w-full rounded-md border bg-black/75 py-2 text-white transition hover:bg-gray-800"
          >
            {pending ? "Signing in" : "Sign in"}
          </button>

          {/* Divider  */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-secondary px-2">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleButton />
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

        <HomeButton />
      </div>
    </div>
  );
}
