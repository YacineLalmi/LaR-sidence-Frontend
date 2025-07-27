"use server";
import { ApiResponseError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { RoleService } from "@/services/role.service";
import { CreateOrUpdateRole, CreateOrUpdateRoleSchema } from "@/schemas/role.schema";

export type CreateRoleState = FormState & CreateOrUpdateRole;

export async function createRoleAction(initialState: CreateRoleState, formData: FormData): Promise<CreateRoleState> {
  const name = formData.get("name") as string;
  const display_name = formData.get("display_name") as string;
  const description = formData.get("description") as string;
  const permissions = JSON.parse(formData.get("permissions") as string) as number[];

  const validatedFields = CreateOrUpdateRoleSchema.safeParse({
    name,
    display_name,
    description,
    permissions,
  });

  if (!validatedFields.success) {
    return {
      name,
      display_name,
      description,
      permissions,
      isOk: "NOK",
      errorMessage: "Validation Error", // TODO Change with i18n
      errorCode: ErrorCodes.VALIDATION_ERROR,
      errorDetails: {
        name: validatedFields.error?.flatten().fieldErrors.name?.[0] || "",
        display_name: validatedFields.error?.flatten().fieldErrors.display_name?.[0] || "",
        description: validatedFields.error?.flatten().fieldErrors.description?.[0] || "",
        permissions: validatedFields.error?.flatten().fieldErrors.permissions?.[0] || "",
      },
    };
  }

  try {
    const response = await RoleService.create({ name, display_name, description, permissions });
    console.log("inster response", response);

    return { name, display_name, description, permissions, isOk: "OK" };
  } catch (error) {
    console.error(error);
    if (error instanceof ApiResponseError) {
      return {
        name,
        display_name,
        description,
        permissions,
        isOk: "NOK",
        errorMessage: error.error,
        errorCode: ErrorCodes.UKNOWN_ERROR,
      };
    }
    return {
      name,
      display_name,
      description,
      permissions,
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong from login",
    };
  }
}
