"use server";

import prisma from "@/lib/prisma";
import { LoginSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export type LoginState = {
  success: boolean;
  redirect: string | null;
  errors: {
    form?: string;
    email?: string;
    password?: string;
  };
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    const result = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const errors: LoginState["errors"] = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginState["errors"];
        errors[field] = issue.message;
      }
      return {
        success: false,
        redirect: null,
        errors,
      };
    }

    const { email, password } = result.data;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    // Handles missing password as well
    if (!user || !user.password) {
      return {
        success: false,
        redirect: null,
        errors: { form: "Invalid email or password" },
      };
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return {
        success: false,
        redirect: null,
        errors: { form: "Invalid email or password" },
      };
    }

    // Success
    return {
      success: true,
      redirect: "/dashboard",
      errors: {},
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      redirect: null,
      errors: {
        form: "Something went wrong!",
      },
    };
  }
}
