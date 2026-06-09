"use client";

import { createUserAction } from "@/actions/users/create-user.action";
import { ListItem } from "@/schemas/global.schema";
import { UserForm as UserFormType } from "@/schemas/users/user-form.schema";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import UserForm from "../../_components/user-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

interface Props {
  roles: ListItem[];
}

export default function CreateUserForm({ roles }: Props) {
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

  const initialData: UserFormType = {
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    phonenumber: "",
    role_id: "",
    is_active: false,
  };

  const submitAction = useCallback(async (values: UserFormType) => {
    const response = await createUserAction(values);
    return response;
  }, []);

  const onSuccess = useCallback(() => {
    router.push(ROUTES.SETTINGS.USERS.ROOT);
  }, [router]);

  return (
    <UserForm
      initialData={initialData}
      roles={roles}
      status={status}
      submitAction={submitAction}
      successAction={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.MESSAGES.CREATED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.MESSAGES.FAILED_CREATION}
      submitButtonText={TRANSLATIONS_KEYS_2.COMMON.BUTTONS.ADD}
    />
  );
}
