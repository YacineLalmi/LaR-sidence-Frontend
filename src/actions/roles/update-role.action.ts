"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { RoleForm } from "@/schemas/roles/role-form.schema";
import { RoleService } from "@/services/role.service";

export async function updateRoleAction(data: RoleForm, id: number): Promise<FormState> {
  try {
    await RoleService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
