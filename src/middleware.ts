import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextRequest, NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req: any) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const role = (req.auth?.user as any)?.role

  // Protecting /admin routes
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  // Protecting /owner routes
  if (nextUrl.pathname.startsWith("/owner")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (role !== "OWNER") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
