import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { UserCookieHandler } from "./lib/utils/UserCookie";

export async function middleware(req: NextRequest) {
  const cookieData = await UserCookieHandler.get(req).then((data) => data.data);

  const adminRoutes = ["/dashboard", "/departments", "/courses"];
  const studentRoutes = [
    "/student",
    "/register-course",
    "/carry-overs",
    "/spill-overs",
  ];

  const pathname = req.nextUrl.pathname;

  // Redirect if not logged in
  if (
    !cookieData &&
    (pathname == "/" ||
      adminRoutes.includes(pathname) ||
      studentRoutes.includes(pathname))
  ) {
    return NextResponse.redirect(new URL("auth/", req.url));
  }

  if (
    (cookieData && pathname.startsWith("/auth")) ||
    pathname == "/student" ||
    pathname == "/dashboard"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (cookieData && pathname == "/") {
    const { userType } = cookieData;
    const nextValidRoute = userType === "admin" ? "/dashboard" : "/student";
    return NextResponse.rewrite(new URL(nextValidRoute, req.url));
  }
  // Later, we can also fetch user role here for role-based redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/register-course",
    "/auth/:path*",
    "/dashboard/:path*",
    "/student/:path*",
  ],
};
