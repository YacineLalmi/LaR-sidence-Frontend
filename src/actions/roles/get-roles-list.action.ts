// app/actions/formData.ts
'use server'

import { RoleService } from "@/services/role.service";

export async function getRolesList() {
    const response = await RoleService.list();
    return response
  
}