import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], // Providers will be added in auth.ts for full functionality
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role
        session.user.id = token.sub as string
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig
