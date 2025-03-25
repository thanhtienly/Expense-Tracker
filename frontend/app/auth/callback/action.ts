"use server";
import { redirect } from "next/navigation";
import { createSession } from "../../libs/cookies";

export async function saveCookies(accessToken: string, refreshToken: string) {
  await createSession(accessToken, refreshToken);
  redirect("/dashboard");
}
