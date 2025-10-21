"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { RoleForm } from "@/schemas/roles/role-form.schema";
import { RoleService } from "@/services/role.service";

export async function updateRoleAction(id: string, data: RoleForm): Promise<FormState> {
  try {
    await RoleService.update(id, data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
