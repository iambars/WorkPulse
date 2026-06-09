"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/prisma";
import { SignupSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export type SignupState = {
  success: boolean;
  redirect: string | null;
  errors: {
    form?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };
};

export async function signupAction(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  try {
    const result = SignupSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    });

    if (!result.success) {
      const errors: SignupState["errors"] = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupState["errors"];
        errors[field] = issue.message;
      }
      return {
        success: false,
        redirect: null,
        errors,
      };
    }

    const { email, password, firstName, lastName } = result.data;

    // Check via email if the User already exist
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        redirect: "/login",
        errors: { email: "User already exists" },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const cleanedFirstName = firstName?.trim() || null;
    const cleanedLastName = lastName?.trim() || null;

    // Adding the user in the database
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "EMPLOYEE",
        name:
          [cleanedFirstName, cleanedLastName].filter(Boolean).join(" ") || null,
        employee: {
          create: {
            firstName: cleanedFirstName,
            lastName: cleanedLastName,
          },
        },
      },
    });

    // console.log("Signup success:", email);

    // Auto Login after the signup
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

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
      errors: { form: "Something went wrong" },
    };
  }
}
