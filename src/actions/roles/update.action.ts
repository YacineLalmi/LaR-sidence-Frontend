"use server";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { RoleForm, RoleFormSchema } from "@/schemas/role.schema";
import { RoleService } from "@/services/role.service";

export interface UpdateRoleState {
  data: Partial<RoleForm>;
  form: FormState;
}

export async function updateRoleAction(initialState: UpdateRoleState, formData: FormData): Promise<UpdateRoleState> {
  const id = parseInt(formData.get("id") as string);
  const data: RoleForm = {
    name: formData.get("name") as string,
    display_name: formData.get("display_name") as string,
    description: formData.get("description") as string,
    permissions: JSON.parse(formData.get("permissions") as string) as number[],
  };

  let form = { ...initialState.form };

  const validatedFields = RoleFormSchema.safeParse(data);

  if (!validatedFields.success) {
    form = {
      isOk: "NOK",
      errorMessage: "Validation Error", // TODO Change with i18n
      errorCode: ErrorCodes.VALIDATION_ERROR,
      errorDetails: validatedFields.error?.flatten().fieldErrors,
    };
    return {
      data,
      form,
    };
  }

  try {
    const response = await RoleService.update(data, id);
    console.log("inster response", response);
    form.isOk = "OK";
    return {
      data,
      form,
    };
  } catch (error) {
    console.log(error);
    form.isOk = "NOK";
    form.errorMessage = "Something went wrong from login";
    form.errorCode = ErrorCodes.UKNOWN_ERROR;
    return {
      data,
      form,
    };
  }
}
