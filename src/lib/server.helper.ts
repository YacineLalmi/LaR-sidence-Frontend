"use server";

import { authService } from "@/services/auth.service";
import { addHours, differenceInSeconds } from "date-fns";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "ThisMustBeA32ByteKey";

export async function encrypt(text: string): Promise<string> {
  const keyBytes = new Uint8Array(Buffer.from(ENCRYPTION_KEY, "hex"));
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for AES-GCM

  const encodedText = new TextEncoder().encode(text);

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedText);

  return `${Buffer.from(iv).toString("hex")}:${Buffer.from(encrypted).toString("hex")}`;
}

export async function decrypt(cipherText: string): Promise<string> {
  const [ivHex, encryptedHex] = cipherText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedBytes = Buffer.from(encryptedHex, "hex");
  const keyBytes = new Uint8Array(Buffer.from(ENCRYPTION_KEY, "hex"));
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedBytes);

  return new TextDecoder().decode(decrypted);
}

export async function setCookie({
  key,
  value,
  expires = addHours(new Date(), 1),
  maxAge = Infinity,
  httpOnly = true,
  sameSite = "strict",
  secure = true,
}: {
  key: string;
  value: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
}) {
  const cookieStore = await require("next/headers").cookies();
  const encryptedValue = await encrypt(value);
  cookieStore.set(key, encryptedValue, {
    httpOnly: httpOnly,
    sameSite: sameSite,
    secure: secure,
    maxAge: maxAge,
    expires: expires,
  });
}

export async function getCookie(key: string): Promise<string | null> {
  const cookieStore = await require("next/headers").cookies();
  const encryptedValue = cookieStore.get(key)?.value;
  if (encryptedValue) {
    return await decrypt(encryptedValue);
  }
  return null;
}

export async function removeCookie(key: string): Promise<void> {
  (await require("next/headers").cookies()).delete(key);
}

export async function clearCookies(): Promise<void> {
  const cookieStore = await require("next/headers").cookies();
  cookieStore.getAll().forEach((cookie: any) => cookieStore.delete(cookie.name));
}

export async function refreshTokens(): Promise<void> {
  // Has no access token
  const refresh_token = await getCookie("refresh_token");
  if (!refresh_token) {
    throw new Error();
  } else {
    const responseData = await authService.refresh(refresh_token);

    await setCookie({
      key: "access_token",
      value: responseData.access_token,
      expires: responseData.access_token_expires_at,
      maxAge: differenceInSeconds(responseData.access_token_expires_at, new Date()),
    });

    await setCookie({
      key: "refresh_token",
      value: responseData.refresh_token,
      expires: responseData.refresh_token_expires_at,
      maxAge: differenceInSeconds(responseData.refresh_token_expires_at, new Date()),
    });
  }
}
