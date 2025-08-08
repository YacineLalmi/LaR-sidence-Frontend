import { ErrorCodes } from "./constants";

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    totalPages: number;
    perPage: number;
    totalRecords: number;
  };
  error?: string;
  errorCode?: ErrorCodes;
}

export interface HttpOptions {
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

export interface FormState {
  isOk: "OK" | "NOK" | "UNDEFINED";
  errorMessage?: string;
  errorCode?: ErrorCodes;
  errorDetails?: Record<string, string[] | undefined>;
}

export interface RequestOptions<Body = any> {
  endpoint: string;
  query?: Record<string, string>;
  body?: Body;
  options?: HttpOptions;
  method?: string;
}

export enum Role {
  SUPER_ADMINISTRATOR = "super_administrator",
  ADMINISTRATOR = "administrator",
  SUPERVISOR = "supervisor",
  CALL_CENTER_AGENT = "call_center_agent",
  CDS_AGENT = "cds_agent",
}

export interface ResponseMetaData {
  page: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

export type QueryParams = Record<string, string>;
