import { ApiResponse, HttpOptions, RequestOptions } from "@/lib/definitions";
import { getCookie } from "@/lib/server.helper";
import { handleApiResponse, transformQuery } from "@/lib/utils";

// New type for download options
interface DownloadOptions extends Omit<RequestOptions, 'body'> {
  filename?: string; // Optional custom filename
  onProgress?: (progress: number) => void; // Progress callback
}

class ApiService {
  private baseUrl: string;
  private defaultConfig: HttpOptions;

  constructor(baseUrl: string = "", defaultConfig = {}) {
    this.baseUrl = baseUrl;
    this.defaultConfig = defaultConfig;
  }

  private async request<Data>({ endpoint, method, query, options = {}, body }: RequestOptions) {
    const queryParams = transformQuery(query);
    const url = `${this.baseUrl}${endpoint}${queryParams ? "?" + queryParams : ""}`;

    console.log(url)
    const config: RequestInit = {
      method,
      headers: {
        ...this.defaultConfig.headers,
        ...options.headers,
      },
      cache: options.cache || this.defaultConfig.cache,
      next: { ...this.defaultConfig.next, ...options.next },
    };

    if (typeof window === "undefined") {
      const access_token = await getCookie("access_token");
      if (access_token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${access_token}` };
      }
    }

    if (body) {
      if (body instanceof FormData) {
        delete (config.headers as any)["content-type"];
        config.body = body;
      } else config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    const apiResponse = await handleApiResponse<Data>(response);

    return apiResponse;
  }

  async get<T>({ endpoint, options = {}, query }: RequestOptions) {
    return this.request<ApiResponse<T>>({
      endpoint,
      method: "GET",
      options,
      query,
    });
  }

  async post<T>({ endpoint, query, options = {}, body }: RequestOptions) {
    return this.request<T>({
      endpoint,
      method: "POST",
      options,
      query,
      body,
    });
  }

  async put<T>({ endpoint, query, options = {}, body }: RequestOptions) {
    return this.request<T>({
      endpoint,
      method: "PUT",
      options,
      query,
      body,
    });
  }

  async delete({ endpoint, query, options = {}, body }: RequestOptions) {
    return this.request({
      endpoint,
      method: "DELETE",
      options,
      query,
      body,
    });
  }

  /**
   * Download a file from the API
   * @param options - Download options including endpoint, query, filename, and progress callback
   * @returns Promise<Blob> - The downloaded file as a Blob
   */
  async downloadFile({ endpoint, query, options = {}, filename, onProgress }: DownloadOptions): Promise<Blob> {
    const queryParams = transformQuery(query);
    const url = `${this.baseUrl}${endpoint}${queryParams ? "?" + queryParams : ""}`;

    const config: RequestInit = {
      method: "GET",
      headers: {
        ...this.defaultConfig.headers,
        ...options.headers,
      },
    };

    // Add authorization token if on server side
    if (typeof window === "undefined") {
      const access_token = await getCookie("access_token");
      if (access_token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${access_token}` };
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    // Handle progress tracking if callback provided
    if (onProgress && response.body) {
      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body.getReader();
      const chunks: BlobPart[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        if (total > 0) {
          onProgress((loaded / total) * 100);
        }
      }

      return new Blob(chunks);
    }

    return await response.blob();
  }
}

const baseUrl: string = process.env.BACKEND_API_URL || "http://localhost:8000/api";
const defaultConfig: HttpOptions = {
  headers: {
    "content-type": "application/json",
    Accept: "application/json",
    Authorization: "",
  },
  cache: "no-cache",
  // next: {
  //   revalidate: 3600,
  // },
};

const ApiServiceInstance = new ApiService(baseUrl, defaultConfig);

export default ApiServiceInstance;