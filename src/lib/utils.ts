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

  const passthroughKeys = [
    "page",
    "perPage",
    "sort",
    "needle",
    "range",
    "refresh_token",
    "include",
    "startDate",
    "endDate",
    "date_from",
    "date_to",
    "granularity",
    "breakdown",
    "agent_ids",
    "bien_type_ids",
    "bien_status_ids",
    "wilaya_ids",
    "commune_ids",
    "offer_status_ids",
    "demand_status_ids",
    "payment_status_ids",
    "client_source_ids",
    "demand_source_ids",
    "groupBy",
    "wilaya_id",
    "commune_id",
    "bien_type_id",
    "period"
  ];

  for (const [key, value] of params.entries()) {
    if (passthroughKeys.includes(key)) {
      transformed.append(key, value);
    } else {
      transformed.append(`filter[${key}]`, value);
    }
  }

  return transformed.toString();
}

/** Laravel often returns 422 + { message } or { errors: { field: string[] } }. */
function getApiErrorMessage(content: unknown): string {
  const c = content as { message?: unknown; errors?: Record<string, string[]> };
  if (typeof c?.message === "string" && c.message.length > 0) return c.message;
  const errors = c?.errors;
  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const first = firstKey != null ? errors[firstKey] : undefined;
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  }
  return "La requête a échoué.";
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
    let content: unknown;
    try {
      content = await response.json();
    } catch {
      content = {};
    }
    const msg = getApiErrorMessage(content);
    switch (response.status) {
      case 401:
        throw new UnauthorizedError(typeof (content as { message?: string }).message === "string" ? (content as { message: string }).message : undefined);
      case 403:
        throw new ForbiddenError();
      case 404:
        throw new NotFoundError();
      case 400:
      case 422:
        throw new ResponseValidationError(msg);

      default:
        throw new ServerError(msg);
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
      cancel: { label: "x", onClick: () => { return } },
    });
  },
  info: (message: string, options: ExternalToast = {}) => {
    return toast.info(message, {
      ...options,
      duration: 3000,
      cancel: { label: "x", onClick: () => { return } },
    });
  },
  warning: (message: string, options: ExternalToast = {}) => {
    return toast.warning(message, {
      ...options,
      duration: 3000,
      cancel: { label: "x", onClick: () => { return } },
    });
  },
  error: (message: string, options: ExternalToast = {}) => {
    return toast.error(message, {
      ...options,
      duration: 5000,
      cancel: { label: "x", onClick: () => { return } },
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