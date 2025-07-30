// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isProtectedPage = req.nextUrl.pathname.startsWith("/member");

  // Chưa login mà vào /member thì đẩy về login
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Đã login mà vào /auth thì đẩy về dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/member/dashboard", req.url));
  }

  // Check token expiry
  if (token && token.expiresAt) {
    const now = Math.floor(Date.now() / 1000);
    if (token.expiresAt < now) {
      console.log("Token hết hạn, đá ra login!");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/auth/:path*"],
};
