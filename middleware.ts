import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { decode, type JwtPayload } from "jsonwebtoken";

const adminPaths = ["/dashboard/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (adminPaths.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    const decoded = decode(token) as JwtPayload;
    try {
      verifyToken(token);
    } catch (err) {
      console.log("err", err);
    }
    if (!decoded) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (decoded.role !== "admin" && decoded.role !== "sub-admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
