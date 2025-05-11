import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { decode, JwtPayload } from "jsonwebtoken";

// Paths that require authentication
const protectedPaths = ["/dashboard/user", "/dashboard/admin"];

// Paths that require admin role
const adminPaths = ["/dashboard/admin"];

export function middleware(request: NextRequest) {
  console.log("mid hit");
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get("auth-token")?.value;
    console.log("token", token);

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Verify token
    const decoded = decode(token) as JwtPayload;
    console.log("decoded", decoded);

    try {
      verifyToken(token);
    } catch (err) {
      console.log("err", err);
    }
    console.log("token", token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Check if admin path requires admin role
    if (
      adminPaths.some((path) => pathname.startsWith(path)) &&
      decoded.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }
  }
  const url = request.nextUrl.clone();

  // Check for subdomain
  if (request.headers.get("host")?.startsWith("admin")) {
    console.log("host---------", request.headers.get("host"));

    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};
