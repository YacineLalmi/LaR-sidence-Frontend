import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodSchema } from "zod";
import { ErrorCodes } from "./constants";
import { ExternalToast, toast } from "sonner";
import { ApiResponse } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleApiResponse = async <Data>(response: Response): Promise<ApiResponse<Data>> => {
  console.log(response);
  if (response.ok) {
    if (response.status === 204) {
      return {
        status: false,
        message: "No Content",
      };
    } else {
      return await response.json();
    }
  } else {
    const content = await response.json();
    throw new ApiResponseError(content);
  }
};

export function validateResponseData<Data>(data: any, Schema: ZodSchema): Data {
  const validatedFields = Schema.safeParse(data);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    throw new ApiResponseError({
      status: false,
      message: "Error parsing the response body", // TODO : CHANGE WITH THE i18n Multilang
      errorCode: ErrorCodes.BAD_RESPONSE_BODY,
    });
  }
  return validatedFields.data;
}

export const customToast = {
  success: (message: string, options: ExternalToast = {}) => {
    return toast.success(message, {
      ...options,
      duration: 5000,
      cancel: { label: "x", onClick: () => console.log(this) },
    });
  },
  info: (message: string, options: ExternalToast = {}) => {
    return toast.info(message, {
      ...options,
      duration: 5000,
      cancel: { label: "x", onClick: () => console.log(this) },
    });
  },
  warning: (message: string, options: ExternalToast = {}) => {
    return toast.warning(message, {
      ...options,
      duration: 5000,
      cancel: { label: "x", onClick: () => console.log(this) },
    });
  },
  error: (message: string, options: ExternalToast = {}) => {
    return toast.error(message, {
      ...options,
      duration: Infinity,
      cancel: { label: "x", onClick: () => console.log(this) },
    });
  },
};

export function hasIntersection<T>(arr1: T[], arr2: T[]): boolean {
  const set1 = new Set<T>(arr1);
  return arr2.some((item) => set1.has(item));
}

export class ApiResponseError extends Error {
  status: boolean;
  errorCode?: ErrorCodes;
  error?: string;

  constructor({ message, status, error }: ApiResponse<any>) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

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

const httpOnly: boolean = true;
const sameSite: boolean | "strict" | "lax" | "none" | undefined = "strict";
const secure: boolean = true;

export async function setCookie({
  key,
  value,
  expires = Infinity,
  maxAge = Infinity,
}: {
  key: string;
  value: string;
  expires?: number;
  maxAge?: number;
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
  const cookie = cookieStore.get(key);

  if (cookie) {
    let encryptedValue = cookie.value;
    if (encryptedValue) {
      try {
        return await decrypt(encryptedValue);
      } catch (error) {
        cookieStore.delete(key);
      }
    }
  }
  return null;
}
