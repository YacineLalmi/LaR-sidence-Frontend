import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import { Permission, PermissionSchema } from "@/schemas/permission.schema";
import { CreateOrUpdateRole, Role, RoleSchema } from "@/schemas/role.schema";
import z from "zod";

const END_POINTS = {
  findAll: "/permissions",
};

export const PermissionService = {
  findAll: async () => {
    const response = await ApiService.get<Permission[]>({
      endpoint: END_POINTS.findAll,
    });

    const validatedResponseData = validateResponseData<Permission[]>(response.data, z.array(PermissionSchema));

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },
};
