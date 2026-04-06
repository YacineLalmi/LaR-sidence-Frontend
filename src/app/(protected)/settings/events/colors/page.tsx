import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { ColorService } from "@/services/colors.service";
import { PaginatedResponse } from "@/lib/definitions";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { UserService } from "@/services/user.service";
import { User } from "@/schemas/users/user.schema";
import { Color } from "@/schemas/colors/color.schema";
import { ROUTES } from "@/constants/routes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import EventUserColorTable from "./_components/event-user-color-table";
import { ListItem } from "@/schemas/global.schema";

export default async function EventType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  let colors: ListItem[] = [];
  let result: PaginatedResponse<User> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await UserService.findMany({ ...queryParams, include: "color" });
    colors = await ColorService.list();
  } catch (error: any) {
    responseError = error;
  }

  console.log(result);
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col gap-4">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TITLE)}
          backLink={ROUTES.SETTINGS.ROOT}
        />

        <div className="flex w-full justify-between gap-2 items-center">
          <SearchField />
        </div>
        <CardContent className="px-0 w-full">
          <EventUserColorTable data={result} colors={colors} />
        </CardContent>
      </CardHeader>
    </Card>
  );
}
