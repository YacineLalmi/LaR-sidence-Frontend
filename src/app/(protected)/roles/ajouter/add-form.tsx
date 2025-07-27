"use client";
import { createRoleAction, CreateRoleState } from "@/actions/roles/create.action";
import CustomInput from "@/components/custom-input/custom-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { customToast } from "@/lib/utils";
import { GroupedPermissions, Permission } from "@/schemas/permission.schema";
import React, { useActionState, useCallback, useEffect, useState } from "react";

interface Props {
  formId: string;
  permissions: GroupedPermissions;
}

export default function AddRoleForm({ formId, permissions }: Props) {
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);

  const initalState: CreateRoleState = {
    isOk: "UNDEFINED",
    name: "",
    display_name: "",
    description: "",
    permissions: [],
  };
  const [state, formAction, isPending] = useActionState(createRoleAction, initalState);

  const hasPermission = useCallback(
    (id: number) => {
      return rolePermissions.includes(id);
    },
    [rolePermissions]
  );

  useEffect(() => {
    if (state.isOk === "NOK") {
      customToast.error(state.errorMessage || "");
    } else if (state.isOk === "OK") {
      customToast.success("Role successfully added");
    }
  }, [state]);

  const togglePermission = useCallback((id: number) => {
    setRolePermissions((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item != id);
      }
      return [...prev, id];
    });
  }, []);

  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardHeader>
        <h2>Ajouter un Rôle</h2>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-2 gap-5" action={formAction} id={formId}>
          <CustomInput
            label="Code"
            id="name"
            value={state.name}
            name="name"
            placeholder="Code de rôle"
            disabled={isPending}
            required
            error={state.errorDetails && state.errorDetails.name}
          />
          <CustomInput
            label="Nom"
            id="display_name"
            value={state.display_name}
            name="display_name"
            placeholder="Nom de rôle"
            disabled={isPending}
            required
            error={state.errorDetails && state.errorDetails.display_name}
          />
          <CustomInput
            label="Description"
            id="description"
            name="description"
            value={state.description}
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
            value={JSON.stringify(rolePermissions)}
            type="hidden"
            error={state.errorDetails && state.errorDetails.permissions}
          />
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
