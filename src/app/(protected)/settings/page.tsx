import React from "react";
import SettingCard from "./_components/card";
import { BadgeCheck, BadgeEuro, Building2, Map, Shield, User2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function page() {
  const t = await getTranslations();
  return (
    <div className="grid grid-cols-3 gap-3">
      <SettingCard link="/settings/wilayas" title={t('settings.userManagement')} icon={User2} />
      <SettingCard link="/settings/communes" title="Communes" icon={Map} />
      <SettingCard link="/settings/users" title="Utilisateurs" icon={User2} />
      <SettingCard link="/settings/roles" title="Roles" icon={Shield} />
      <SettingCard link="/settings/biens/types" title="Type de Bien" icon={Building2} />
      <SettingCard link="/settings/biens/status" title="Statut de Bien" icon={BadgeCheck} />
      <SettingCard link="/settings/biens/additional-characteristics" title="Caractéristiques Additionnelles de Bien" icon={BadgeCheck} />
      <SettingCard link="/settings/transactions/types" title="Type de transactions" icon={BadgeEuro} />
      <SettingCard link="/settings/profile" title="Profile" icon={BadgeCheck} />
      <SettingCard link="/settings/colors" title="Colors" icon={BadgeCheck} />
      <SettingCard link="/settings/clients/status" title="Status des clients" icon={BadgeCheck} />
      <SettingCard link="/settings/clients/sources" title="Sources des clients" icon={BadgeCheck} />
      <SettingCard link="/settings/clients/types" title="Types des clients" icon={BadgeCheck} />
      <SettingCard link="/settings/offers/types" title="Types des offers" icon={BadgeCheck} />
      <SettingCard link="/settings/offers/status" title="Status des offers" icon={BadgeCheck} />
    </div>
  );
}
