"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { RoleService } from "@/services/role.service";

export async function deleteRolesAction(ids: string[]): Promise<FormState> {
  try {
    await RoleService.deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
