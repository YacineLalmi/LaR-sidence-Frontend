"use client";
import { createRoleAction, CreateRoleState } from "@/actions/roles/create.action";
import { updateRoleAction, updateRoleState } from "@/actions/roles/update.action";
import CustomInput from "@/components/custom-input/custom-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { customToast } from "@/lib/utils";
import { GroupedPermissions, Permission } from "@/schemas/permission.schema";
import { Role } from "@/schemas/role.schema";
import React, { useActionState, useCallback, useEffect, useState } from "react";

interface Props {
  formId: string;
  role: Role;
  permissions: GroupedPermissions;
}

export default function UpdateRoleForm({ formId, role, permissions }: Props) {
  const [updatedRole, setUpdatedRole] = useState<Role>(role);
  const [rolePermissions, setRolePermissions] = useState<number[]>(role.permissions || []);

  const initalState: updateRoleState = {
    isOk: "UNDEFINED",
    name: role.name,
    display_name: role.display_name.fr,
    description: role.description.fr,
    permissions: role.permissions || [],
  };
  const [state, formAction, isPending] = useActionState(updateRoleAction, initalState);

  const hasPermission = useCallback(
    (id: number) => {
      return rolePermissions.includes(id);
    },
    [rolePermissions]
  );

  const togglePermission = useCallback((id: number) => {
    setRolePermissions((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item != id);
      }
      return [...prev, id];
    });
  }, []);

  useEffect(() => {
    if (state.isOk === "NOK") {
      customToast.error(state.errorMessage || "");
    } else if (state.isOk === "OK") {
      customToast.success("Role successfully updated");
    }
  }, [state]);
  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardHeader>
        <h2>Modifier un Rôle</h2>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-2 gap-5" action={formAction} id={formId}>
          <CustomInput
            label="Code"
            value={updatedRole.name}
            id="name"
            name="name"
            placeholder="Code de rôle"
            disabled={isPending}
            required
            error={state.errorDetails && state.errorDetails.name}
          />
          <CustomInput
            label="Nom"
            value={updatedRole.display_name.fr}
            id="display_name"
            name="display_name"
            placeholder="Nom de rôle"
            disabled={isPending}
            required
            error={state.errorDetails && state.errorDetails.display_name}
          />
          <CustomInput
            label="Description"
            id="description"
            value={updatedRole.description.fr}
            name="description"
            type="textarea"
            containerClassName="col-span-2"
            placeholder="Description de rôle"
            disabled={isPending}
            required
            error={state.errorDetails && state.errorDetails.description}
          />
          <CustomInput
            id="permissions"
            name="permissions"
            value={JSON.stringify(state.permissions)}
            type="hidden"
            error={state.errorDetails && state.errorDetails.permissions}
          />
          <CustomInput id="id" name="id" value={role.id} type="hidden" />
          <div className="flex- flex-col gap-2 col-span-2">
            <h1 className="font-bold text-xl">Permissions Management</h1>
            {Object.entries(permissions).map(([category, categoryPermissions]) => (
              <div key={category} className="flex w-full mt-2">
                <div className="w-1/4">{category}</div>
                <div className="flex gap-2 justify-start">
                  {categoryPermissions.map((permission) => (
                    <Toggle
                      key={permission.id}
                      pressed={hasPermission(permission.id)}
                      onPressedChange={() => togglePermission(permission.id)}
                      aria-label={`Toggle ${permission.display_name.fr}`}
                      className="w-44 border-1 bg-none border-black text-black data-[state=on]:bg-amber-100 data-[state=on]:border-amber-700  hover:bg-amber-100 transition-all duration-200"
                    >
                      {permission.display_name.fr}
                    </Toggle>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="w-full justify-end">
        <Button className="border-1 cursor-pointer w-52 p-5" type="submit" form={formId}>
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
  );
}
