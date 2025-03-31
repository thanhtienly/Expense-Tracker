"use server";
import { getSession } from "../../libs/cookies";

export async function getCookies() {
  return await getSession();
}
