import "server-only";
import { cookies } from "next/headers";

export async function createSession(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
}
