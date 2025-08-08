import React from "react";
import SettingCard from "./_components/card";
import { BadgeCheck, BadgeEuro, Building2, Map, Shield, User2 } from "lucide-react";

export default function page() {
  return (
    <div className="grid grid-cols-4 gap-3">
      <SettingCard link="/settings/wilaya" title="Wilayas" icon={Map} />
      <SettingCard link="/settings/commune" title="Communes" icon={Map} />
      <SettingCard link="/settings/users" title="Utilisateurs" icon={User2} />
      <SettingCard link="/settings/roles" title="Roles" icon={Shield} />
      <SettingCard link="/settings/bien-types" title="Type de Bien" icon={Building2} />
      <SettingCard link="/settings/transaction-types" title="Type de transactions" icon={BadgeEuro} />
      <SettingCard link="/settings/status" title="Statut de Bien" icon={BadgeCheck} />
    </div>
  );
}
