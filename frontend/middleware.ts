import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createSession, getSession, removeSession } from "./app/libs/cookies";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/"];

async function renewAccessToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  return await fetch("http://localhost:8000/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  }).then((res) => res.json());
}

async function logUserOut() {
  const token = await getSession();
  const accessToken = token["accessToken"];

  fetch("http://localhost:8000/auth/log-out", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());
  return;
}

export default async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  var isUserLogin = false;
  const accessToken = cookieStore.get("accessToken")?.value;

  /* Currently, user don't sign in */
  if (!accessToken) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
  }

  /* Check is valid access token or not */
  await fetch("http://localhost:8000/auth/validate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then(async (response: { error?: number; message: string }) => {
      console.log(`Response code: ${response?.error || 200}`);
      if (!response?.error) {
        isUserLogin = true;
        return;
      }
      /* Access token expired */
      if (response?.error == 401) {
        const data: {
          error?: number;
          message: string;
          data?: {
            accessToken: string;
            refreshToken: string;
          };
        } = await renewAccessToken();

        console.log(data);

        /* Renew Access Token failed */
        if (!data?.data) {
          await logUserOut();
          await removeSession();
        } else {
          await createSession(data.data.accessToken, data.data.refreshToken);
          isUserLogin = true;
        }
      }

      if (response?.error == 400) {
        await removeSession();
      }
    });

  /* Currently, user not sign in */
  if (isProtectedRoute && !isUserLogin) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && isUserLogin) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}
