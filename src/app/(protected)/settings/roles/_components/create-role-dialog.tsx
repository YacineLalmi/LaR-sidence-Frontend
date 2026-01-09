"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { RoleForm, RoleFormSchema } from "@/schemas/roles/role-form.schema";
import { createRoleAction } from "@/actions/roles/create-role.action";
import { PermissionCategory } from "@/schemas/permissions/permission-category.schema";

interface Props {
  permissions: PermissionCategory[];
}
// // Replace this with your API call to fetch permissions
// const fetchPermissions = async () => {
//   // const response = await fetch('/api/permissions');
//   // const data = await response.json();
//   // return data.data;

//   // Mock data for now
//   return [
//     {
//       name: "users",
//       permissions: [
//         { id: 1, display_name: "Créer utilisateur" },
//         { id: 2, display_name: "Mettre à jour utilisateur" },
//         { id: 3, display_name: "Supprimer utilisateur" },
//         { id: 4, display_name: "Voir utilisateur" },
//         { id: 5, display_name: "Voir utilisateurs" },
//       ],
//     },
//     {
//       name: "roles",
//       permissions: [
//         { id: 6, display_name: "Créer rôle" },
//         { id: 7, display_name: "Mettre à jour rôle" },
//         { id: 8, display_name: "Supprimer rôle" },
//         { id: 9, display_name: "Voir rôle" },
//         { id: 10, display_name: "Voir rôles" },
//       ],
//     },
//     {
//       name: "biens",
//       permissions: [
//         { id: 11, display_name: "Créer bien" },
//         { id: 12, display_name: "Mettre à jour bien" },
//         { id: 13, display_name: "Supprimer bien" },
//         { id: 14, display_name: "Voir bien" },
//         { id: 15, display_name: "Voir biens" },
//       ],
//     },
//     {
//       name: "clients",
//       permissions: [
//         { id: 16, display_name: "Créer client" },
//         { id: 17, display_name: "Mettre à jour client" },
//         { id: 18, display_name: "Supprimer client" },
//         { id: 19, display_name: "Voir client" },
//         { id: 20, display_name: "Voir clients" },
//       ],
//     },
//   ];
// };

export default function CreateRoleDialog({ permissions }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [permissionsData, setPermissionsData] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<RoleForm>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: {
      display_name: "",
      description: "",
      permissions: [],
    },
  });

  // useEffect(() => {
  //   if (isOpen) {
  //     fetchPermissions().then(setPermissionsData);
  //   }
  // }, [isOpen]);

  const selectedPermissions = form.watch("permissions") || [];

  const toggleGroup = (groupName: string) => {
    if (expandedGroups.has(groupName)) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set([groupName]));
    }
  };

  const togglePermission = (permissionId: number) => {
    const current = [...selectedPermissions];
    const index = current.indexOf(permissionId);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(permissionId);
    }

    form.setValue("permissions", current);
  };

  const toggleGroupPermissions = (group: any) => {
    const groupPermissionIds = group.permissions.map((p: any) => p.id);
    const allSelected = groupPermissionIds.every((id: number) => selectedPermissions.includes(id));

    let newSelected = [...selectedPermissions];
    if (allSelected) {
      newSelected = newSelected.filter((id) => !groupPermissionIds.includes(id));
    } else {
      groupPermissionIds.forEach((id: number) => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
    }

    form.setValue("permissions", newSelected);
  };

  const isGroupFullySelected = (group: any) => {
    return group.permissions.every((p: any) => selectedPermissions.includes(p.id));
  };

  const isGroupPartiallySelected = (group: any) => {
    const selected = group.permissions.filter((p: any) => selectedPermissions.includes(p.id));
    return selected.length > 0 && selected.length < group.permissions.length;
  };

  const formatGroupName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " ");
  };

  async function onSubmit(values: RoleForm) {
    console.log(values);
    setIsPending(true);
    try {
      const response = await createRoleAction(values);
      setIsPending(false);
      if (response.isOk) {
        setIsOpen(false);
        form.reset();
        setExpandedGroups(new Set());
        router.refresh();
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    }
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  const handleDialogOpen = useCallback(
    (isOpen: boolean) => {
      setIsOpen(isOpen);
      if (!isOpen) {
        form.reset();
        setExpandedGroups(new Set());
      }
    },
    [form]
  );

  return (
    <FormDialog
      formId="create-role-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.ADD)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.FORM.TITLE)}
      trigger={<CustomButton text={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.CREATE_ROLE)} Icon={Plus} />}
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form id="create-role-form" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="grid gap-[12px]">
          <InputTextField
            control={form.control}
            name="display_name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.FORM.LABEL.DISPLAY_NAME)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.FORM.PLACEHOLDER.DISPLAY_NAME)}
          />
          <InputTextArea
            control={form.control}
            name="description"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.FORM.LABEL.DESCRIPTION)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.FORM.PLACEHOLDER.DESCRIPTION)}
          />

          {/* Permissions Section */}
          <div>
            <label className="mb-3 text-[16px]">
              {translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.FORM.LABEL.PERMISSIONS)}
            </label>
            <div className="border bg-transparent border-gray-200 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
              {permissions.map((group: any, index: number) => (
                <div key={group.name} className={index !== 0 ? "border-t border-gray-200" : ""}>
                  {/* Group Header */}
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isGroupFullySelected(group)}
                        ref={(el) => {
                          if (el) el.indeterminate = isGroupPartiallySelected(group);
                        }}
                        onChange={() => toggleGroupPermissions(group)}
                        disabled={isPending}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer disabled:opacity-50"
                      />
                      <span className="font-medium text-gray-900">{formatGroupName(group.name)}</span>
                      <span className="text-sm text-gray-500">
                        ({group.permissions.filter((p: any) => selectedPermissions.includes(p.id)).length}/
                        {group.permissions.length})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.name)}
                      disabled={isPending}
                      className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                      {expandedGroups.has(group.name) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </div>

                  {/* Permissions List */}
                  {expandedGroups.has(group.name) && (
                    <div className="px-4 py-2">
                      {group.permissions.map((permission: any) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-3 py-2 hover:bg-amber-100 px-2 rounded cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            disabled={isPending}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer disabled:opacity-50"
                          />
                          <span className="text-sm text-gray-700">{permission.display_name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </Form>
    </FormDialog>
  );
}
