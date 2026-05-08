import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const hasGoogleOAuth =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

console.log("[Auth][Config] Google OAuth enabled:", hasGoogleOAuth);
if (!hasGoogleOAuth) {
  console.log("[Auth][Config] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { 
    strategy: "jwt",
    maxAge: 5 * 60 * 60, // 5 Hours (Hard Limit)
    updateAge: 0,        // Ensure logout occurs exactly after time limit
  },
  trustHost: true,
  debug: true,
  secret: process.env.AUTH_SECRET || "neonglass-default-secret",
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    ...(hasGoogleOAuth
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[Auth][Authorize] Attempting credentials login for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth][Authorize] Missing email or password");
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("[Auth][Authorize] User not found:", credentials.email);
            return null;
          }

          if (!user.password) {
            console.log("[Auth][Authorize] User has no password (likely OAuth user):", credentials.email);
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!passwordMatch) {
            console.log("[Auth][Authorize] Password mismatch for:", credentials.email);
            return null;
          }

          console.log("[Auth][Authorize] Login successful for:", credentials.email);
          return user;
        } catch (error) {
          console.error("[Auth][Authorize] Database error during login:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[Auth][Callback] signIn:", { 
        userEmail: user.email, 
        provider: account?.provider,
        type: account?.type 
      });
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        console.log("[Auth][Callback] jwt: initial sign-in with", account.provider);
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async signIn(message) { console.log("[Auth][Event] Successful sign-in:", message.user.email); },
    async createUser(message) { console.log("[Auth][Event] User created:", message.user.email); },
    async linkAccount(message) { console.log("[Auth][Event] Account linked:", message.account.provider); },
    async session(message) { /* session active */ },
  }
});
