import ApiService from "./api.service";
import { validateResponseData } from "@/lib/utils";
import { FileBlob, FileBlobSchema } from "@/schemas/file/file-blob.schema";

const END_POINTS = {
  getFileBlob: (id: string) => `/files/blob/${id}`,
};

export const FileService = {
  findOne: async (id: string) => {
    const response = await ApiService.get<FileBlob>({
      endpoint: END_POINTS.getFileBlob(id),
    });

    const validatedResponseData = validateResponseData<FileBlob>(response.data, FileBlobSchema);
    return validatedResponseData;
  },
};
