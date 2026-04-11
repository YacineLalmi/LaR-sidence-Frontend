"use server";

import { addYears } from "date-fns";
import { setCookie } from "@/lib/server.helper";

const SUPPORTED = new Set(["fr", "en"]);

export async function setLocaleAction(locale: string): Promise<void> {
  const next = SUPPORTED.has(locale) ? locale : "fr";
  await setCookie({
    key: "lang",
    value: next,
    expires: addYears(new Date(), 10),
    maxAge: 60 * 60 * 24 * 365 * 10,
    httpOnly: true,
    sameSite: "lax",
  });
}
