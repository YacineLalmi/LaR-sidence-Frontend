import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Clipboard,
  DollarSign,
  FolderOpen,
  Home,
  Mails,
  Settings,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Image from "next/image";
import logo from "@/assests/images/logo-black.png";
import Link from "next/link";
import Logout from "./_components/logout";
import { ROUTES } from "@/constants/routes";
import { use, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export function SideBar() {
  const translation = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const items = useMemo(
    () => [
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.DASHBOARD),
        url: ROUTES.DASHBOARD,
        icon: Home,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.STATISTICS),
        url: ROUTES.STATISTICS.SECTION("biens"),
        icon: BarChart3,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.PROPERTIES),
        url: ROUTES.BIENS.ROOT,
        icon: Building2,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.CALENDAR),
        url: ROUTES.EVENTS.ROOT,
        icon: CalendarDays,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.OFFERS),
        url: ROUTES.OFFERS.ROOT,
        icon: Clipboard,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.CLIENTS),
        url: ROUTES.CLIENTS.ROOT,
        icon: User2,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.BILLS),
        url: ROUTES.BILLS.ROOT,
        icon: DollarSign,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.DEMANDS),
        url: ROUTES.DEMANDS.ROOT,
        icon: Mails,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.DOCUMENTS),
        url: ROUTES.DOCUMENTS.ROOT,
        icon: FolderOpen,
      },
      {
        title: translation(TRANSLATIONS_KEYS_2.SIDEMENU.NOTIFICATIONS),
        url: ROUTES.NOTIFICATIONS.ROOT,
        icon: Bell,
      },
    ],
    [translation],
  );
  return (
    <Sidebar className="items-center" collapsible="icon" side={isRTL ? "right" : "left"}>
      <SidebarTrigger
        className={`absolute top-1/5 ${isRTL ? "-left-2" : "-right-2"} transform -translate-y-1/2 px-4 py- rounded`}
        style={{ background: "#C8AB68" }}
      />
      <SidebarHeader className="py-[3rem]">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton>
            <Image src={logo} alt="Logo" width={15} />
            La Résidence
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon size={25} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="py-7">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <Link href={ROUTES.SETTINGS.ROOT}>
              <Settings />
              <span>{translation(TRANSLATIONS_KEYS_2.SIDEMENU.SETTINGS)}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem className="list-none">
          <SidebarMenuButton asChild>
            <Logout />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
