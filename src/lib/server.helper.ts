"use server";

import { ErrorCodes } from "@/constants/error-codes";
import { AuthService } from "@/services/auth.service";
import { addHours, differenceInSeconds } from "date-fns";
import { ForbiddenError, NotFoundError, ResponseValidationError, ServerError, UnauthorizedError } from "./errors";
import { refreshTokenAction } from "@/actions/authentication/refresh.action";

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

    const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);

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

    const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);

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
  sameSite = "lax",
  secure,
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

  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set(key, encryptedValue, {
    httpOnly,
    sameSite,
    secure: secure ?? isProd,
    maxAge,
    expires,
    path: "/",
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
  cookieStore.getAll().forEach(async (cookie: any) => await cookieStore.delete(cookie.name));
}

// export async function refreshTokens(): Promise<boolean> {
//   // Has no access token
//   const refresh_token = await getCookie("refresh_token");
//   if (!refresh_token) {
//     return false;
//   } else {
//     await refreshTokenAction(refresh_token);
//     return true;
//   }
// }

/** Node/undici often put syscall codes on `cause`; some builds use `code` or a generic "fetch failed" message. */
function isBackendUnreachableError(error: unknown): boolean {
  const codes = new Set([
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_SOCKET",
    "EHOSTUNREACH",
    "ENOTFOUND",
  ]);
  const e = error as { cause?: { code?: string }; code?: string; message?: string };
  if (e?.cause?.code && codes.has(e.cause.code)) return true;
  if (e?.code && codes.has(e.code)) return true;
  const msg = typeof e?.message === "string" ? e.message : "";
  if (/fetch failed|ECONNREFUSED|connect ECONNREFUSED/i.test(msg)) return true;
  return false;
}

export const handleServerActionError = async (error: any) => {
  if (error instanceof ResponseValidationError) {
    return {
      errorMessage: error.message,
      errorCode: ErrorCodes.RESPONSE_VALIDATION_ERROR,
    };
  } else if (error instanceof UnauthorizedError) {
    return {
      errorMessage: error.message,
      errorCode: ErrorCodes.UNAUTHORIZED,
    };
  } else if (error instanceof ForbiddenError) {
    return {
      errorMessage: error.message,
      errorCode: ErrorCodes.FORBIDDEN,
    };
  } else if (error instanceof NotFoundError) {
    return {
      errorMessage: error.message,
      errorCode: ErrorCodes.RESOURCE_NOT_FOUND,
    };
  } else if (error instanceof ServerError) {
    return {
      errorMessage: error.message,
      errorCode: ErrorCodes.SERVER_ERROR,
    };
  } else if (isBackendUnreachableError(error)) {
    return {
      errorMessage: "Erreur de connexion : impossible de se connecter au serveur",
      errorCode: ErrorCodes.CONNECTION_ERROR,
    };
  }

  const fallback =
    typeof error?.message === "string" && error.message.length > 0 ? error.message : "Erreur inconnue";
  return {
    errorMessage: fallback,
    errorCode: ErrorCodes.UKNOWN_ERROR,
  };
};
