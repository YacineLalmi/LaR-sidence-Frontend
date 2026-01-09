"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { RoleService } from "@/services/role.service";

export async function deleteRoleAction(id: number): Promise<FormState> {
  try {
    await RoleService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
