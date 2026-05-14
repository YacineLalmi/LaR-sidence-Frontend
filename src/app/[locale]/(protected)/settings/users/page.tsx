import { UserService } from "@/services/user.service";
import UsersTable from "./_components/users-table";
import { getTranslations } from "next-intl/server";
import CustomButton from "@/components/ui/custom-button";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import UsersHeader from "./_components/users-header";
import SettingsView from "@/views/settings.view";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";
import { PaginatedResponse } from "@/lib/definitions";
import { User } from "@/schemas/users/user.schema";

export default async function Utilisateurs({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  let result: PaginatedResponse<User> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await UserService.findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      searchField={<UsersHeader />}
      createComponent={
        <Link href={ROUTES.SETTINGS.USERS.CREATE}>
          <CustomButton text={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.BUTTONS.CREATE)} Icon={Plus} />
        </Link>
      }
      error={responseError}
      backLink={ROUTES.SETTINGS.ROOT}
    >
      <UsersTable data={result} />
    </SettingsView>
  );
}
