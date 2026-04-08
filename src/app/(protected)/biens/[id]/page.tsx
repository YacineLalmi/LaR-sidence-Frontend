import { UserService } from "@/services/user.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WilayaService } from "@/services/wilaya.service";
import UpdateBienForm from "./_components/update-bien-form";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { BienService } from "@/services/bien.service";
import { ClientService } from "@/services/client.service";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default async function UpdateBienPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const bien = await BienService.findOne(id);

  const translation = await getTranslations();
  return (
    <Card className="bg-transparent shadow-none border-none p-0">
      <CardHeader className="flex items-center gap-2">
        <NavigationButton title={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.UPDATE)} backLink="/biens" />
      </CardHeader>
      <CardContent>
        <UpdateBienForm bien={bien} />
      </CardContent>
    </Card>
  );
}
