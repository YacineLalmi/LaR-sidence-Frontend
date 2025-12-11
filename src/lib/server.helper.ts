"use server";

import { authService } from "@/services/auth.service";
import { addHours, differenceInSeconds } from "date-fns";

// Get encryption key and ensure it's 32 bytes (256 bits) for AES-256-GCM
function getEncryptionKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY;
  
  if (envKey) {
    // Try to parse as hex first
    try {
      const hexKey = Buffer.from(envKey, "hex");
      if (hexKey.length === 32) {
        return hexKey;
      }
      // If hex key is valid but not 32 bytes, pad it with zeros
      if (hexKey.length > 0 && hexKey.length < 32) {
        const key32 = Buffer.alloc(32);
        hexKey.copy(key32, 0, 0, hexKey.length);
        // Fill the rest with zeros (or repeat the key pattern)
        return key32;
      }
      // If hex key is too long, truncate it
      if (hexKey.length > 32) {
        return hexKey.slice(0, 32);
      }
    } catch {
      // Not valid hex, treat as string
    }
    
    // Treat as string and pad/truncate to 32 bytes
    const keyBuffer = Buffer.from(envKey, "utf-8");
    const key32 = Buffer.alloc(32);
    keyBuffer.copy(key32, 0, 0, Math.min(32, keyBuffer.length));
    // If the string is shorter, pad with zeros
    return key32;
  }
  
  // Default key: Must be exactly 32 bytes (256 bits) for AES-256-GCM
  // Using a 32-character string that equals 32 bytes in UTF-8
  const defaultKey = "ThisMustBeA32ByteKeyForAES256!!"; // Exactly 32 bytes
  const keyBuffer = Buffer.from(defaultKey, "utf-8");
  // Ensure it's exactly 32 bytes (pad with zeros if needed, truncate if too long)
  const key32 = Buffer.alloc(32);
  keyBuffer.copy(key32, 0, 0, Math.min(32, keyBuffer.length));
  return key32;
}

const ENCRYPTION_KEY_BYTES = getEncryptionKey();

export async function encrypt(text: string): Promise<string> {
  try {
    // Convert Buffer to Uint8Array for crypto.subtle
    const keyBytes = new Uint8Array(ENCRYPTION_KEY_BYTES);
    
    // Verify key length is 32 bytes (256 bits) for AES-256-GCM
    if (keyBytes.length !== 32) {
      throw new Error(`Invalid encryption key length: expected 32 bytes, got ${keyBytes.length}`);
    }
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for AES-GCM

    const encodedText = new TextEncoder().encode(text);

    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedText);

    return `${Buffer.from(iv).toString("hex")}:${Buffer.from(encrypted).toString("hex")}`;
  } catch (error: any) {
    console.error("Encryption error:", error);
    throw new Error(`Encryption failed: ${error?.message || "Unknown error"}`);
  }
}

export async function decrypt(cipherText: string): Promise<string> {
  try {
    const [ivHex, encryptedHex] = cipherText.split(":");
    const iv = new Uint8Array(Buffer.from(ivHex, "hex"));
    const encryptedBytes = new Uint8Array(Buffer.from(encryptedHex, "hex"));
    
    // Convert Buffer to Uint8Array for crypto.subtle
    const keyBytes = new Uint8Array(ENCRYPTION_KEY_BYTES);
    
    // Verify key length is 32 bytes (256 bits) for AES-256-GCM
    if (keyBytes.length !== 32) {
      throw new Error(`Invalid decryption key length: expected 32 bytes, got ${keyBytes.length}`);
    }
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedBytes);

    return new TextDecoder().decode(decrypted);
  } catch (error: any) {
    console.error("Decryption error:", error);
    throw new Error(`Decryption failed: ${error?.message || "Unknown error"}`);
  }
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
