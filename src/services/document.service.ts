import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { ListItem, ListItemSchema } from "@/schemas/global.schema";
import { LibraryFile, LibraryFileSchema, LibraryFolder, LibraryFolderSchema } from "@/schemas/documents/library-file.schema";
import z from "zod";

const END_POINTS = {
  library: "/document-library",
  folders: "/folders",
  download: (id: string) => `/files/download/${id}`,
  delete: (id: string) => `/files/${id}`,
};

export const DocumentService = {
  findMany: async (queryParams: QueryParams): Promise<PaginatedResponse<LibraryFile>> => {
    const response = await ApiService.get<LibraryFile[]>({
      endpoint: END_POINTS.library,
      query: queryParams,
    });

    const validated = validateResponseData<LibraryFile[]>(response.data, z.array(LibraryFileSchema));

    return {
      data: validated,
      meta: response.meta,
    };
  },

  listFolders: async (): Promise<LibraryFolder[]> => {
    const response = await ApiService.get<LibraryFolder[]>({
      endpoint: END_POINTS.folders,
    });

    return validateResponseData<LibraryFolder[]>(response.data, z.array(LibraryFolderSchema));
  },

  /** Distinct users who uploaded at least one visible library file (for filters). */
  listLibraryUploaders: async (): Promise<ListItem[]> => {
    const response = await ApiService.get<ListItem[]>({
      endpoint: `${END_POINTS.library}/uploaders`,
    });

    return validateResponseData<ListItem[]>(response.data, z.array(ListItemSchema));
  },
};
