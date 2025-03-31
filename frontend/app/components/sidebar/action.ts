"use server";
import { redirect } from "next/navigation";
import { removeSession, getSession } from "../../libs/cookies";

export async function deleteCookies() {
  await removeSession();
  redirect("/");
}

export async function getCookies() {
  const token: {
    accessToken: string;
    refreshToken: string;
  } = await getSession();

  return token;
}
