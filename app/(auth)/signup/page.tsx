"use client";

import { ErrorText, GoogleButton, HomeButton } from "@/components/ui";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { signupAction, SignupState } from "./actions";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const initialState: SignupState = {
  success: false,
  redirect: null,
  errors: {},
};

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState,
  );

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

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
            Create your account
          </h1>
          <p className="text-secondary mt-1 text-sm">
            Sign up to access WorkPulse
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-primary text-sm font-medium">
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                placeholder="John"
                className="border-border mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-600/80 focus:ring-0 focus:outline-none"
              />
              {state.errors?.firstName && (
                <ErrorText message={state.errors?.firstName} />
              )}
            </div>

            <div>
              <label className="text-primary text-sm font-medium">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Doe"
                className="border-border mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-600/80 focus:ring-0 focus:outline-none"
              />
              {state.errors?.lastName && (
                <ErrorText message={state.errors?.lastName} />
              )}
            </div>
          </div>

          <div>
            <label className="text-primary text-sm font-medium">
              Email address{" "}
              <span className="text-red-500 dark:text-orange-500/85">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="border-border mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-600/80 focus:ring-0 focus:outline-none"
            />
            {state.errors?.email && <ErrorText message={state.errors?.email} />}
          </div>

          <div>
            <label className="text-primary text-sm font-medium">
              Password{" "}
              <span className="text-red-500 dark:text-orange-500/85">*</span>
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="border-border mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-600/80 focus:ring-0 focus:outline-none"
            />
            {state.errors?.password && (
              <ErrorText message={state.errors?.password} />
            )}
          </div>

          <button
            type="submit"
            className="border-border w-full rounded-md border bg-black/75 py-2 text-white/90 transition hover:bg-gray-800"
          >
            {pending ? "Signing up" : "Create Account"}
          </button>

          {/* Divider */}
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
          <GoogleButton action={handleGoogleSignIn} />
        </form>

        {/* Login redirect */}
        <div className="text-center text-sm">
          <p className="text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Trial Accounts */}
        <div className="border-secondary space-y-2 border-t pt-4">
          <h2 className="text-primary text-sm font-semibold">
            Try the app instantly
          </h2>
          <p className="text-secondary text-sm">
            You can use demo accounts from the login page to explore WorkPulse
            without signing up.
          </p>
          <Link
            href="/login"
            className="text-primary text-sm font-medium hover:underline"
          >
            View Demo Accounts
          </Link>
        </div>

        {/* Back Button */}
        <HomeButton />
      </div>
    </div>
  );
}
