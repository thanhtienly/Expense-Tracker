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

export async function getSession() {
  const cookieStore = await cookies();

  const accessToken: string = cookieStore.get("accessToken")?.value || "";
  const refreshToken: string = cookieStore.get("refreshToken")?.value || "";

  return {
    accessToken,
    refreshToken,
  };
}

export async function removeSession() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
