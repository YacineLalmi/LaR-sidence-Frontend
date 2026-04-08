import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateBienForm from "./_components/create-bien-form";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function BienStatusAddPage() {
  const translation = await getTranslations();

  return (
    <Card className="bg-transparent shadow-none border-none p-0">
      <CardHeader className="flex items-center gap-2">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.BUTTONS.CREATE)}
          backLink={ROUTES.BIENS.ROOT}
        />
      </CardHeader>
      <CardContent>
        <CreateBienForm />
      </CardContent>
    </Card>
  );
}
