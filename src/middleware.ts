import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_COOKIE_KEY } from "./lib/models/User";

export function middleware(req: NextRequest) {
  const cookieData = req.cookies.get(USER_COOKIE_KEY)?.value;

  const adminRoutes = ["/dashboard", "/departments", "/courses"];
  const studentRoutes = ["/student", "/register-courses"];

  const pathname = req.nextUrl.pathname;

  // Redirect if not logged in
  if (
    !cookieData &&
    (pathname == "/" ||
      adminRoutes.includes(pathname) ||
      studentRoutes.includes(pathname))
  ) {
    return NextResponse.redirect(new URL("auth/login", req.url));
  }

  if (
    (cookieData && pathname.startsWith("/auth")) ||
    pathname == "/student" ||
    pathname == "/dashboard"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (cookieData && pathname == "/") {
    const { role } = JSON.parse(cookieData);
    const nextValidRoute = role === "admin" ? "/dashboard" : "/student";
    return NextResponse.rewrite(new URL(nextValidRoute, req.url));
  }
  // Later, we can also fetch user role here for role-based redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/student/:path*",
    "/register-courses",
  ],
};
