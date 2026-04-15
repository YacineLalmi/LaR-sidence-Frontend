"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown, ChevronRight } from "lucide-react";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { RoleForm as RoleFormTpe, RoleFormSchema } from "@/schemas/roles/role-form.schema";
import { PermissionCategory } from "@/schemas/permissions/permission-category.schema";
import { FormState } from "@/lib/definitions";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  permissions: PermissionCategory[];
  initialData: RoleFormTpe;
  submitAction: (values: RoleFormTpe) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: () => void;
}
export default function RoleForm({
  permissions,
  initialData,
  submitAction,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED,
  formId,
  successAction,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const form = useForm<RoleFormTpe>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: RoleFormTpe) {
    setIsPending(true);
    try {
      const response = await submitAction(values);
      setIsPending(false);
      if (response.isOk) {
        successAction ? successAction() : router.refresh();
        customToast.success(translation(successMessage));
      } else customToast.error(response.errorMessage || translation(errorMessage));
    } catch (error) {
      customToast.error(translation(errorMessage));
    }
  }

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

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-[12px]">
        <InputTextField
          control={form.control}
          name="display_name"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.LABELS.DISPLAY_NAME)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.PLACEHOLDERS.DISPLAY_NAME)}
        />
        <InputTextArea
          control={form.control}
          name="description"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.LABELS.DESCRIPTION)}
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.PLACEHOLDERS.DESCRIPTION)}
        />

        {/* Permissions Section */}
        <div>
          <label className="mb-3 text-[16px]">
            {translation(TRANSLATIONS_KEYS_2.SETTINGS.ROLES.FORM.LABELS.PERMISSIONS)}
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
  );
}
