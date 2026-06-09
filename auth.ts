import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { LoginSchema } from "@/lib/validations/auth";
import { linkGoogleUser } from "./lib/auth/link-google-user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 10 * 60, // 10 mins
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { employee: true },
        });

        if (!user) return null;
        if (!user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        const name =
          user.employee?.firstName || user.employee?.lastName
            ? `${user.employee.firstName ?? ""} ${user.employee.lastName ?? ""}`.trim()
            : (user.name ?? null);

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await linkGoogleUser({ email: user.email!, name: user.name });
      }

      return true;
    },
  },

  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.role = user.role;
  //     }
  //     return token;
  //   },

  //   async session({ session, token }) {
  //     if (session.user) {
  //       session.user.id = token.id as string;
  //       session.user.role = token.role as string;
  //     }
  //     return session;
  //   },
  // },
});
