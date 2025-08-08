import { GroupedPermissions, GroupedPermissionsSchema, Permission } from "@/schemas/Permission.schema";
import ApiService from "./api.service";
import { validateResponseData } from "@/lib/utils";

const END_POINTS = {
  findAll: "/configurations/users/permissions",
};

export const PermissionService = {
  findAll: async () => {
    const response = await ApiService.get<Permission[]>({
      endpoint: END_POINTS.findAll,
    });
    const validatedResponseData = validateResponseData<GroupedPermissions>(response.data, GroupedPermissionsSchema);

    return {
      items: validatedResponseData,
      meta: response.meta,
    };
  },
};
