import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || "imprint-default-secret",
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60, // 5 Hours
    updateAge: 0,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    // Credentials provider will be added in the full auth.ts 
    // because it uses Node-specific libraries (bcrypt/prisma)
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role;
      
      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/auth");

      // 1. Admin Protection: Redirect non-admins away from /admin
      if (isAdminRoute) {
        if (!isLoggedIn) return false; // Redirect to signin
        if (role !== "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // 2. Dashboard Protection
      if (isProtectedRoute && !isLoggedIn) {
        return false; // Redirect to signin
      }

      // 3. Authenticated Public Redirect
      if (isPublicRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // Propagate role from database/authorize
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role; // Expose role to the client
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
