import ApiService from "./api.service";
import { validateResponseData } from "@/lib/utils";
import { PermissionCategory, PermissionCategorySchema } from "@/schemas/permissions/permission-category.schema";
import z from "zod";

const END_POINTS = {
  findAll: "/configurations/permissions",
};

export const PermissionService = {
  findAll: async () => {
    const response = await ApiService.get<PermissionCategory[]>({
      endpoint: END_POINTS.findAll,
    });
    const validatedResponseData = validateResponseData<PermissionCategory[]>(
      response.data,
      z.array(PermissionCategorySchema)
    );

    return validatedResponseData;
  },
};
