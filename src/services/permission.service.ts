import ApiService from "./api.service";
import { QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import {
  GroupedPermissions,
  GroupedPermissionsSchema,
  Permission,
  PermissionSchema,
} from "@/schemas/permission.schema";
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
    console.log(response);
    const validatedResponseData = validateResponseData<GroupedPermissions>(response.data, GroupedPermissionsSchema);

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },
};
