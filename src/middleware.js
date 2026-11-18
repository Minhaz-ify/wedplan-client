import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Cheap first gate for private routes; real authorization happens on the Express server.
export function middleware(req) {
  if (!getSessionCookie(req)) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/services/:id", "/payment/:path*"] };
