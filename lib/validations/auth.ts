import z from "zod";

export const SignupSchema = z.object({
  email: z.email("Invalid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().trim().max(50).optional(),
  lastName: z.string().trim().max(50).optional(),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
