import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodSchema } from "zod";
import { ErrorCodes } from "./constants";
import { ExternalToast, toast } from "sonner";
import { ApiResponse, QueryParams } from "./definitions";
import { ForbiddenError, NotFoundError, ResponseValidationError, ServerError, UnauthorizedError } from "./errors";
import { getFileBlob } from "@/actions/files/get-file-blob.action";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformQuery(query: QueryParams | undefined) {
  const params = new URLSearchParams(query);
  const transformed = new URLSearchParams();

  const passthroughKeys = ["page", "perPage", "sort", "needle"];

  for (const [key, value] of params.entries()) {
    if (passthroughKeys.includes(key)) {
      transformed.append(key, value);
    } else {
      transformed.append(`filter[${key}]`, value);
    }
  }

  return transformed.toString();
}

export function parseNumberRange(input: string): { from: number; to: number } {
  const [from, to] = input.split(",");

  if (!from || !to) {
    return {
      from: 0,
      to: Infinity,
    };
  }

  return { from: parseInt(from), to: parseInt(to) };
}

export function parseDateRange(range: string | null | undefined): { from: Date | undefined; to: Date | undefined } {
  if (range) {
    const [from, to] = range.split(",");

    if (!from || !to) {
      return {
        from: new Date(),
        to: new Date(),
      };
    }

    return { from: new Date(from), to: new Date(to) };
  }

  return {
    from: undefined,
    to: undefined,
  };
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
      console.log("responseBody", responseBody);
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
    console.log(result.error.issues);
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

export const handleServerActionError = (error: any) => {
  console.log("Errrrorror CCOOOODE", error.code);
  console.log("Errrrorror message", error.message);
  console.log("Errrrorror message", error?.cause?.code);
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
  } else if (["ECONNREFUSED", "UND_ERR_CONNECT_TIMEOUT", "EHOSTUNREACH"].includes(error?.cause?.code)) {
    return {
      errorMessage: "Erreur de connexion : impossible de se connecter au serveur",
      errorCode: ErrorCodes.CONNECTION_ERROR,
    };
  }

  return {
    errorMessage: "Erreur inconnue",
    errorCode: ErrorCodes.UKNOWN_ERROR,
  };
};

export const loadOptions = async (endPoint: string) => {
  try {
    const result = await fetch(endPoint, {
      cache: "force-cache",
      next: { revalidate: 300 },
    }).then((res) => res.json());
    return result;
  } catch (error) {
    console.error("erroorrrrr", error);
  }
};

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
