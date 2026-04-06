import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ExternalToast, toast } from "sonner";
import { ApiResponse, QueryParams } from "./definitions";
import { ForbiddenError, NotFoundError, ResponseValidationError, ServerError, UnauthorizedError } from "./errors";
import { getFileBlob } from "@/actions/files/get-file-blob.action";
import { ZodSchema } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformQuery(query: QueryParams | undefined) {
  const params = new URLSearchParams(query);
  const transformed = new URLSearchParams();

  const passthroughKeys = ["page", "perPage", "sort", "needle", "refresh_token", "include", "startDate", "endDate"];

  for (const [key, value] of params.entries()) {
    if (passthroughKeys.includes(key)) {
      transformed.append(key, value);
    } else {
      transformed.append(`filter[${key}]`, value);
    }
  }

  return transformed.toString();
}

export const handleApiResponse = async <Data>(response: Response): Promise<ApiResponse<Data>> => {
  if (response.ok) {
    if (response.status === 204) {
      return {
        status: false,
        message: "No Content",
      };
    } else {
      const responseBody = await response.json();
      return responseBody;
    }
  } else {
    const content = await response.json();
    switch (response.status) {
      case 401:
        throw new UnauthorizedError();
      case 403:
        throw new ForbiddenError();
      case 404:
        throw new NotFoundError();
      case 400:
        throw new ResponseValidationError(content.message);

      default:
        throw new ServerError();
    }
  }
};

export function validateResponseData<ParsedBody>(data: any, Schema: ZodSchema): ParsedBody {
  const result = Schema.safeParse(data);
  if (!result.success) {
    console.error(result.error.issues);
    const errorMessage = result.error.issues[0].message;
    let firstErrorMsg = errorMessage;
    throw new ResponseValidationError(firstErrorMsg);
  }
  return result.data as ParsedBody;
}

export const customToast = {
  success: (message: string, options: ExternalToast = {}) => {
    return toast.success(message, {
      ...options,
      duration: 3000,
      cancel: { label: "x", onClick: () => console.log(this) },
    });
  },
  info: (message: string, options: ExternalToast = {}) => {
    return toast.info(message, {
      ...options,
      duration: 3000,
      cancel: { label: "x", onClick: () => console.log(this) },
    });
  },
  warning: (message: string, options: ExternalToast = {}) => {
    return toast.warning(message, {
      ...options,
      duration: 3000,
      cancel: { label: "x", onClick: () => console.log(this) },
    });
  },
  error: (message: string, options: ExternalToast = {}) => {
    return toast.error(message, {
      ...options,
      duration: 5000,
      cancel: { label: "x", onClick: () => console.log(this) },
    });
  },
};

export function arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
  const set1 = new Set<T>(arr1);
  return arr2.some((item) => set1.has(item));
}

// Helper function to convert base64 to File object
export async function base64ToFile(base64: string, filename: string, mimeType: string): Promise<File> {
  const res = await fetch(`data:${mimeType};base64,${base64}`);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType, lastModified: Date.now() });
}

// Helper function to fetch file as File object
export async function fetchFileAsFileObject(fileId: string, filename: string, mimeType: string): Promise<File | null> {
  try {
    const response = await getFileBlob(fileId);

    if (response) {
      return await base64ToFile(response, filename, mimeType);
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch file ${fileId}:`, error);
    return null;
  }
}

/**
 * Format number to Algerian Dinar (DZD) format
 * @param amount - The amount to format
 * @param showDecimals - Whether to show decimal places
 * @returns Formatted string with DA suffix
 */
export function formatMoney(amount: number | null | undefined, showDecimals: boolean = false): string {
  if (!amount) return "N/A";

  const formatted = amount.toLocaleString('fr-DZ', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return `${formatted} DA`;
}

export function formatId(id: string | undefined) { if (!id) return; else return String(id).padStart(6, "0") }


export function onInvalid(values: any) {
  const [field, error] = Object.entries(values)[0] as [string, { message: string }];
  customToast.error(`${field}: ${error.message}`);
}