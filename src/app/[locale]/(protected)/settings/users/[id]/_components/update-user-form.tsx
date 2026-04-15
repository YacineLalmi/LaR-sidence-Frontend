"use client";

import { ListItem } from "@/schemas/global.schema";
import { UserForm as UserFormType } from "@/schemas/users/user-form.schema";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import UserForm from "../../_components/user-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { User } from "@/schemas/users/user.schema";
import { updateUserAction } from "@/actions/users/update-user.action";
import { ROUTES } from "@/constants/routes";

interface Props {
  roles: ListItem[];
  user: User;
}

export default function UpdateUserForm({ roles, user }: Props) {
  const router = useRouter();

  const status: ListItem[] = [
    {
      id: "1",
      name: "active",
    },
    {
      id: "0",
      name: "inactive",
    },
  ];

  const submitAction = useCallback(async (values: UserFormType) => {
    const response = await updateUserAction(values, user.id);
    return response;
  }, []);

  const onSuccess = useCallback(() => {
    router.push(ROUTES.SETTINGS.USERS.ROOT);
  }, [router]);

  return (
    <UserForm
      initialData={user}
      roles={roles}
      status={status}
      submitAction={submitAction}
      successAction={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.MESSAGES.CREATED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.MESSAGES.FAILED_CREATION}
    />
  );
}
