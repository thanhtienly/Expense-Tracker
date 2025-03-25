import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = cookieStore.get("accessToken")?.value;

  /* Both access token && refresh token expired */
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}
